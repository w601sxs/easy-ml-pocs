---
title: "DeepAR preprocessing"
date: 2020-02-26T10:52:58-05:00
draft: false
algo: [deepar]
---

### Prepare data

The first step is to collect and format historical data on the processes you want to forecast. DeepAR supports two types of data files: JSON Lines (one JSON object per line) and Parquet. We thing that creating JSONlines is the least  resistance path to building a PoC with DeepAR, so let's go!

When specifying the paths for the training and test data, you can specify a single file or a directory that contains multiple files, which can be stored in subdirectories. By default, the DeepAR model determines the input format from the file extension (.json, .json.gz, or .parquet) in the specified input path. If the path does not end in one of these extensions, you must explicitly specify the format in the SDK for Python.

The records in your input files should contain the following fields:

```start``` — A string with the format YYYY-MM-DD HH:MM:SS. The start timestamp can't contain time zone information.

```target``` — An array of floating-point values or integers that represent the time series. You can encode missing values as null literals, or as "NaN" strings in JSON, or as nan floating-point values in Parquet.

```dynamic_feat``` (optional) — An array of arrays of floating-point values or integers that represents the vector of custom feature time series (dynamic features).

```cat``` (optional) — An array of categorical features that can be used to encode the groups that the record belongs to. Categorical features must be encoded as a 0-based sequence of positive integers. For example, the categorical domain {R, G, B} can be encoded as {0, 1, 2}. All values from each categorical domain must be represented in the training dataset. That's because the DeepAR algorithm can forecast only for categories that have been observed during training.


### Data formatting

Let's say your data is currently in train-data.csv file and looks like below:

```html
timestamp,target,cat1,cat2 
2014-01-01 01:00:00,38.34991708126038,client_12, blue
2014-01-01 02:00:00,33.5820895522388,client_12, blue
2014-01-01 03:00:00,34.41127694859037,client_12, red
2014-01-01 04:00:00,39.800995024875625,client_12, blue
2014-01-01 05:00:00,41.044776119402975,client_12, red
```

Make sure there are no spaces after or before commas. Spaces within the field are okay.

As mentioned before, you would have to convert the csv data into JSONLines. You can use below python code snippet to do so. 

Change the values of the target_column and the group_column below. For example, this could be sales as the target column and store_id as the group_column; or number_of_clicks as the target_column and customer_id as the group_column. If you don't have a group_column, you could either add a dummy column with the same group number, or modify the code below:

```python
import pandas as pd
import jsonlines
from sklearn import preprocessing
le = preprocessing.LabelEncoder()


series = pd.read_csv('test.csv', parse_dates=[0], index_col=0)
series.sort_index(inplace=True)

target_column = 'target'
group_column = 'cat1'

for col in series.columns:
    if col !=target_column:
        series[col] = le.fit_transform(series[col])

if series[group_column].nunique()==1:
    a = [series]
else:
    a = [v for k, v in series.groupby(group_column)]

out = []

for i in range(len(a)):
    dynamic_feat = []
    cat = []
    for col in a[0].columns:
        if col == target_column:
            target = a[0][col].values.tolist()
            start = str(a[0].index[0])

        else:
            if a[0][col].nunique()>=2: #if 2 or more values, add as dynamic feature
                dynamic_feat.append(a[0][col].values.astype(float).tolist())
            elif a[0][col].nunique()==1: #if 1 value, add as category
                cat.append(int(a[0][col][0]))
    out.append({'start':start, 'target':target, 'cat':cat, 'dynamic_feat':dynamic_feat})
    
with jsonlines.open('train-data.jsonl', mode='w') as writer:
    writer.write_all(out)
```

If you don't have jsonlines installed, do ```pip install jsonlines```

Each line of your converted data now should look like below:
```html
{"start": "2014-01-01 01:00:00", "target": [38.34991708126038, 33.582089552238806, 34.41127694859037, 39.800995024875625, 41.044776119402975], "cat": [0], "dynamic_feat": [[0.0, 0.0, 1.0, 0.0, 1.0]]}
```

### Upload data

DeepAR supports two data channels. The required train channel describes the training dataset. The optional test channel describes a dataset that the algorithm uses to evaluate model accuracy after training. Note that if a “test” channel is not specified, DeepAR will not validate model performance on a hold-out dataset.

Upload this [data to S3](../uploadtos3), to a location similar to ```s3://bucketname/train/train-data.jsonl``` and ```s3://bucketname/test/test-data.jsonl```

You may upload many train and test JSON-line files to the corresponding prefixes above, namely ```s3://bucketname/train``` and ```s3://bucketname/test```
