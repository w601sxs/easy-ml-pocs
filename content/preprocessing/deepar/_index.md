---
title: "DeepAR preprocessing"
date: 2020-02-26T10:52:58-05:00
draft: false
---

### Prepare data

The first step is to collect and format historical data on the processes you want to forecast. DeepAR supports two types of data files: JSON Lines (one JSON object per line) and Parquet

When specifying the paths for the training and test data, you can specify a single file or a directory that contains multiple files, which can be stored in subdirectories. By default, the DeepAR model determines the input format from the file extension (.json, .json.gz, or .parquet) in the specified input path. If the path does not end in one of these extensions, you must explicitly specify the format in the SDK for Python.


### Data formatting
The records in your input files should contain the following fields:

```start``` — A string with the format YYYY-MM-DD HH:MM:SS. The start timestamp can't contain time zone information.

```target``` — An array of floating-point values or integers that represent the time series. You can encode missing values as null literals, or as "NaN" strings in JSON, or as nan floating-point values in Parquet.

```dynamic_feat``` (optional) — An array of arrays of floating-point values or integers that represents the vector of custom feature time series (dynamic features).

```cat``` (optional) — An array of categorical features that can be used to encode the groups that the record belongs to. Categorical features must be encoded as a 0-based sequence of positive integers. For example, the categorical domain {R, G, B} can be encoded as {0, 1, 2}. All values from each categorical domain must be represented in the training dataset. That's because the DeepAR algorithm can forecast only for categories that have been observed during training.

```html
{"start": "2009-11-01 00:00:00", "target": [4.3, "NaN", 5.1, ...], "cat": [0, 1], "dynamic_feat": [[1.1, 1.2, 0.5, ...]]}
{"start": "2012-01-30 00:00:00", "target": [1.0, -5.0, ...], "cat": [2, 3], "dynamic_feat": [[1.1, 2.05, ...]]}
{"start": "1999-01-30 00:00:00", "target": [2.0, 1.0], "cat": [1, 4], "dynamic_feat": [[1.3, 0.4]]}
```

- The start time and length of the time series can differ. For example, in marketing, products often enter a retail catalog at different dates, so their start dates naturally differ. But all series must have the same frequency, number of categorical features, and number of dynamic features.
- Shuffle the training file with respect to the position of the time series in the file. In other words, the time series should occur in random order in the file.
- Make sure to set the start field correctly. The algorithm uses the start timestamp to derive the internal features.
- If you use categorical features (cat), all time series must have the same number of categorical features. If the dataset contains the cat field, the algorithm uses it and extracts the cardinality of the groups from the dataset. By default, cardinality is "auto". If the dataset contains the cat field, but you don't want to use it, you can disable it by setting cardinality to "". If a model was trained using a cat feature, you must include it for inference.
- If your dataset contains the dynamic_feat field, the algorithm uses it automatically. All time series have to have the same number of feature time series. The time points in each of the feature time series correspond one-to-one to the time points in the target. In addition, the entry in the dynamic_feat field should have the same length as the target. If the dataset contains the dynamic_feat field, but you don't want to use it, disable it by setting(num_dynamic_feat to ""). If the model was trained with the dynamic_feat field, you must provide this field for inference. In addition, each of the features has to have the length of the provided target plus the prediction_length. In other words, you must provide the feature value in the future.

### Upload data

DeepAR supports two data channels. The required train channel describes the training dataset. The optional test channel describes a dataset that the algorithm uses to evaluate model accuracy after training. Note that if a “test” channel is not specified, DeepAR will not validate model performance on a hold-out dataset.

For example, a JSON file containing data to train on could look as follows:

```html
 {"start": "2016-01-16", "cat": 1, "target": [4.962, 5.195, 5.157, 5.129, 5.035, ...]}
 {"start": "2016-01-01", "cat": 1, "target": [3.041, 3.190, 3.462, 3.655, 4.114, ...]}
 {"start": "2016-02-03", "cat": 2, "target": [4.133, 4.222, 4.332, 4.216, 4.256, ...]}
```

Each object could represent daily sales (in thousands) of a particular type of shoes, with "cat": 1 indicating sneakers and "cat": 2 indicating snow boots. Note that each time series has its own starting point in time; the data does not need to be aligned in this sense.

Upload this [data to S3](/../uploadtos3), to a location similar to ```s3://bucketname/train-dataset.json``` and ```s3://bucketname/test-dataset.json```
