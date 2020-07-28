---
title: "Forecast inference"
date: 2020-03-27T12:04:32-04:00
draft: False
algo: [forecast]
---

Make sure you saw [this link](../training/forecast) for training first.

Once the training is complete or predictor is in "ACTIVE" state, and you are satisfied by its metrics, you can use it to create a forecast.

#### CLI
```html
aws forecast create-forecast \
--forecast-name myforecast \
--predictor-arn arn:aws:forecast:<region>:<acct-id>:predictor/mypredictor
```

When the forecast is "ACTIVE", you can query it to get predictions. You can export the whole forecast as a CSV file, or query for specific lookups.

#### CLI
```html
aws forecastquery query-forecast \
--forecast-arn arn:aws:forecast:<region>:<acct-id>:forecast/myforecast \
--start-date <YYYY-MM-DDTHH:MM:SS> \
--end-date   <YYYY-MM-DDTHH:MM:SS> \
--filters '{"item_id":"<value>"}'
```

To export the whole forecast as a CSV file to your S3 bucket:

#### CLI
```html
aws forecast create-forecast-export-job \
--forecast-export-job-name myforecast_exportjob \
--forecast-arn arn:aws:forecast:<region>:<acct-id>:forecast/myforecast \
--destination S3Config="{Path='s3://<bucket>',RoleArn='arn:aws:iam::<acct-id>:role/<Role>'}"
```
> Make sure sure the IAM role you provide has permission to write data to your S3 bucket
