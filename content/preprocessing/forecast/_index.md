---
title: "Forecast"
date: 2020-02-07T00:15:27-05:00
draft: false
---

### Prepare Forecast data

While there are many ways to use personalize, this is the least resistance path. Let's assume you have a dataset with three columns: a timestamp column, a target column (this is the value you want to forecast), and a category column.

```html
2020-01-01 01:00:00, 1.0, CATEGORY_0
2020-01-01 02:00:00, 1.2, CATEGORY_0
2020-01-01 01:00:00, 0.5, CATEGORY_1
2020-01-01 02:00:00, 0.6, CATEGORY_1
```

The category column is useful when you have multiple related time series. For example, timestamps and target values from multiple product categories, or clients. Replace "CATEGORY_0" with something appropriate to your use case, for example, "CUSTOMER_0" or "product_0"

> What do you do when you have no categories? or only 2 columns, one with a timestamp and another with a value?

... Add a third (dummy) column and have the same category in each row (named 'CATEGORY_0') like this:

```html
2020-01-01 01:00:00, 1.0, CATEGORY_0
2020-01-01 02:00:00, 1.2, CATEGORY_0
2020-01-01 03:00:00, 1.5, CATEGORY_0
2020-01-01 04:00:00, 1.2, CATEGORY_0
```

Upload this data to S3, to a location similar to "s3://bucketname/dataset.csv"

### Schema definition
Copy this schema definition for future use **as is** ...

```python
{
  "Attributes":[
    {
       "AttributeName": "timestamp",
       "AttributeType": "timestamp"
    },
    {
       "AttributeName": "target_value",
       "AttributeType": "float"
    },
    {
       "AttributeName": "item_id",
       "AttributeType": "string"
    }
  ]
}
```

### Create dataset using the console or CLI or Python


### CLI
[Click here](https://docs.aws.amazon.com/forecast/latest/dg/gs-cli.html)

#### Create dataset
```html
aws forecast create-dataset \
--dataset-name mydataset \
--domain CUSTOM \
--dataset-type TARGET_TIME_SERIES \
--data-frequency H \
--schema '{
  "Attributes": [
    {
      "AttributeName": "timestamp",
      "AttributeType": "timestamp"
    },
    {
      "AttributeName": "target_value",
      "AttributeType": "float"
    },
    {
      "AttributeName": "item_id",
      "AttributeType": "string"
    }
  ]
}'
```

#### Create dataset group
```html
aws forecast create-dataset-group \
--dataset-group-name mydatasetgroup \
--dataset-arns arn:aws:forecast:<region>:acct-id:ds/mydataset \
--domain CUSTOM
```

#### Create data import job
```html
aws forecast create-dataset-import-job \
--dataset-arn arn:aws:forecast:<region>:acct-id:dataset/mydataset \
--dataset-import-job-name myimportjob \
--data-source '{
    "S3Config": {
      "Path": "s3://bucketname/dataset.csv",
      "RoleArn": "arn:aws:iam::acct-id:role/Role"
    }
  }'
``` 

### Console
[Click here](https://docs.aws.amazon.com/forecast/latest/dg/gs-console.html)

### Python
[Click here](https://docs.aws.amazon.com/forecast/latest/dg/getting-started-python.html)
