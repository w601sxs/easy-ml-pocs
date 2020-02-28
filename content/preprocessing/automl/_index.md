---
title: "Autopilot Preprocessing"
date: 2020-02-26T11:20:21-05:00
draft: False
---

SageMaker Autopilot first inspects your data set, and runs a number of candidates to figure out the optimal combination of data preprocessing steps, machine learning algorithms and hyperparameters.

As of today, SageMaker Autopilot supports input data in tabular format, with automatic data cleaning and preprocessing.

So all you need to do is provide a CSV file with headers! To make sure there are no missing headers/badly formatted CSVs, we recommend that you read and write the CSV with no changes as follows:

### Read data using pandas
```python
import pandas as pd
data = pd.read_csv('file.csv')

# Don't include indices
data.to_csv('automl-train.csv', index=False, header=True)
```
If you have to select or drop any columns, please refer to [this documentation](../selecting)

Upload this [data to S3](../uploadtos3), to a location similar to ```s3://bucket/prefix/automl-train.csv```

