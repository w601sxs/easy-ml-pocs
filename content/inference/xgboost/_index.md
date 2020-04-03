---
title: "Xgboost Inference"
date: 2020-02-07T00:15:15-05:00
draft: false
---

### Create Endpoint

If you followed the python instructions in [this link](../../training/xgboost) to  train your DeepAR model, deploying your model is as simple as doing:

Once the model is trained, create a model and deploy it to a hosted endpoint.

```python
xgb_predictor = xgb.deploy(initial_instance_count = 1, instance_type = 'ml.m4.xlarge')
```

Now that there is a hosted endpoint running, we can make real-time predictions from our model very easily, simply by making an http POST request. But first, we'll need to setup serializers and deserializers for passing our test_data NumPy arrays to the model behind the endpoint.

### Predict based on input data
```python
xgb_predictor.content_type = 'text/csv'
xgb_predictor.serializer = csv_serializer
xgb_predictor.deserializer = None
```

```python
prediction = xgb_predictor.predict(test_data.values[0,1:])
