---
title: "SageMaker Kmeans inference"
date: 2020-02-07T00:15:15-05:00
draft: false
---

Make sure you read [this](../training/kmeans) on training a model with Kmeans before deploying your model to an endpoint.

Deploying your Kmeans model is as simple as:

```python 
kmeans_predictor = kmeans.deploy(initial_instance_count=1, 
                                 instance_type='ml.t2.medium')
```

Once the endpoint is deployed, you can use your train data and determine which cluster each training row belongs to:

```python
result=kmeans_predictor.predict(train_data)
```
