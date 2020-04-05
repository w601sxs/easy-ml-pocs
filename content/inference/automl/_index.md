---
title: "Autopilot Inference"
date: 2020-02-28T10:25:21-06:00
draft: false
---

Make sure you saw [this link](../../training/automl) for preprocessing first

### Get the best Candidate job

```python
best_candidate = sm.describe_auto_ml_job(AutoMLJobName=auto_ml_job_name)['BestCandidate']
best_candidate_name = best_candidate['CandidateName']
```

where ```auto_ml_job_name``` is the name of the AutoML job that you used for training.

### Create a model for hosting

```python
model_arn = sm.create_model(Containers=best_candidate['InferenceContainers'],
                            ModelName='your-model-name',
                            ExecutionRoleArn=role)
```

### Create endpoint configuration and endpoint

```python

ep_config = sm.create_endpoint_config(EndpointConfigName = 'your-endpoint-config-name',
                                      ProductionVariants=[{'InstanceType': 'ml.m5.2xlarge',
                                                           'InitialInstanceCount': 1,
                                                           'ModelName': 'your-model-name',
                                                           'VariantName': 'main'}])

create_endpoint_response = sm.create_endpoint(EndpointName='your-endpoint-name',
                                              EndpointConfigName='your-endpoint-config-name')
```

### Obtain predictions from endpoint

Assuming you have a pandas dataframe called ```test_data```, you can do:

```python
prediction = predictor.predict(test_data.to_csv(sep=',', header=False, index=False)).decode('utf-8')
```


