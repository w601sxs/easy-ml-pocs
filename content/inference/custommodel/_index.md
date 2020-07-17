---
title: "Custom SageMaker model Inference"
date: 2020-02-07T00:15:15-05:00
draft: false
---

[Ezsmdeploy python SDK](https://pypi.org/project/ezsmdeploy/) helps you easily deploy Machine learning models and provides a rich set of features such as passing one or more model files (yes, through multi-model deployments), automatically choosing an instance based on model size or based on a budget, and load testing endpoints using an intuitive API. Ezsmdeploy uses the SageMaker Python SDK, which is an open source library for training and deploying machine learning models on Amazon SageMaker.

### Installing the Ezsmdeploy Python SDK

```html
pip install ezsmdeploy
```

### Key Features

At minimum, ezsmdeploy requires you to provide:

one or more model files
a python script with two functions: 
1. load_model(modelpath) - loads a model from a modelpath and returns a model object, and 
1. predict(model,input) - performs inference based on a model object and input data
a list of requirements or a requirements.txt file

For example, you can do this to deploy a pytorch model:


```python
import ezsmdeploy

ezonsm = ezsmdeploy.Deploy(model = 'model.pth',
              script = 'modelscript_pytorch.py',
              requirements = ['numpy','torch','joblib'])
```



Read more about the ezsmdeploy SDK [here](https://pypi.org/project/ezsmdeploy/), and find sample notebooks for Scikit-learn, Pytorch, Tensorflow and MXnet deployments [here](https://github.com/aws-samples/easy-amazon-sagemaker-deployments/tree/master/notebooks)
