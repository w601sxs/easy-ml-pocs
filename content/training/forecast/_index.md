---
title: "Forecast training"
date: 2020-03-11T14:26:40-04:00
draft: false
algo: [forecast]
---

Make sure you saw [this link](../../preprocessing/forecast) for preprocessing first

Once your target time series dataset has been imported into Amazon Forecast, you can train a predictor (trained model). You can choose a particular algorithm or can choose AutoML to have Amazon Forecast process your data and choose an algorithm to best suit your dataset group.

Predictor Details:
Forecast frequency – Frequency at which the forecast is generated. This setting must be consistent with the input time series data.
Forecast horizon – Choose how far into the future to make predictions. This number multiplied by the data entry frequency (hourly). For example, set the number to 36, to provide predictions for 36 hours.

#### CLI
```html
aws forecast create-predictor \
--predictor-name mypredictor \
--perform-auto-ml true \
--input-data-config DatasetGroupArn="arn:aws:forecast:<region>:<acct-id>:dsgroup/mydatasetgroup" \
--forecast-horizon 36 \
--featurization-config '{
    "ForecastFrequency": "H"
  }'
```

Model training takes time. Don't proceed until training has completed and the status of the predictor is ACTIVE. To check the status:

#### CLI
```html
aws forecast describe-predictor \
--predictor-arn arn:aws:forecast:<region>:<acct-id>:predictor/mypredictor
```

Once the predictor is ACTIVE, you can view metrics to see how well the model performed and to decide whether to use the predictor to generate a forecast. To view the metrics:

#### CLI
```html
aws forecast get-accuracy-metrics \
--predictor-arn arn:aws:forecast:<region>:<acct-id>:predictor/mypredictor
```
