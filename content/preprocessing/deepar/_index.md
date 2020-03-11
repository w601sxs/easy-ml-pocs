---
title: "DeepAR preprocessing"
date: 2020-02-26T10:52:58-05:00
draft: false
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
timestamp, target, cat
2014-01-01 01:00:00,38.34991708126038,client_12
2014-01-01 02:00:00,33.5820895522388,client_12
2014-01-01 03:00:00,34.41127694859037,client_12
2014-01-01 04:00:00,39.800995024875625,client_12
2014-01-01 05:00:00,41.044776119402975,client_12
```

As mentioned before, you would have to convert the csv data into JSONLines. You can use below python code snippet to do so.

```python
import csv
import jsonlines


with open('train-data.csv', newline='') as csvfile:
	reader = csv.DictReader(csvfile)
	with jsonlines.open('train-data.jsonl', mode='w') as writer:
		writer.write_all(reader)
```

Your converted data now should look like below:
```html
{"timestamp": "2014-01-01 01:00:00", "target": "38.34991708126038", "cat": "client_12"}
{"timestamp": "2014-01-01 02:00:00", "target": "33.5820895522388", "cat": "client_12"}
{"timestamp": "2014-01-01 03:00:00", "target": "34.41127694859037", "cat": "client_12"}
{"timestamp": "2014-01-01 04:00:00", "target": "39.800995024875625", "cat": "client_12"}
{"timestamp": "2014-01-01 05:00:00", "target": "41.044776119402975", "cat": "client_12"}
```

### Upload data

DeepAR supports two data channels. The required train channel describes the training dataset. The optional test channel describes a dataset that the algorithm uses to evaluate model accuracy after training. Note that if a “test” channel is not specified, DeepAR will not validate model performance on a hold-out dataset.

Upload this [data to S3](../uploadtos3), to a location similar to ```s3://bucketname/train/train-data.jsonl``` and ```s3://bucketname/test/test-data.jsonl```

You may upload many train and test JSON-line files to the corresponding prefixes above, namely ```s3://bucketname/train``` and ```s3://bucketname/test```
