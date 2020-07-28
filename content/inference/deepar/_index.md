---
title: "DeepAR Inference"
date: 2020-02-07T00:15:15-05:00
draft: false
algo: [deepar]
---

### Create Endpoint

If you followed the python instructions in [this link](../../training/deepar) to  train your DeepAR model, deploying your model is as simple as doing:

```python
predictor = estimator.deploy(initial_instance_count=1,instance_type='ml.m4.xlarge')
```

Otherwise, you can create a model and deploy it as an endpoint using the console.

First go to your training job, and click create model:

![](/images/createdeeparmodel.png)

Then create an endpoint:

![](/images/createdeeparendpoint.png)

### Predict 

DeepAR requires the following set up to do a predict:

First, copy existing data from a test file and add any dynamic features:

```python
instance = [{"start": "2013-01-01 00:00:00", "target": [0, 5530, .....], ....}]
```

Replace the python dict above with your own dict from a test file you generated, or use a line from the train file for demonstration purposes.

Next, Prepare HTTP request data that DeepAR likes:

```python
configuration = {
            "num_samples": 100,
            "output_types": ["quantiles"],
            "quantiles": ['0.25','0.5','0.75']
        }

http_request_data = {
            "instances": instance,
            "configuration": configuration
        }

req = json.dumps(http_request_data).encode('utf-8')
```

Finally do a predict!

```python
predictor.predict(req)
```

Learn more about inference formats [here](https://docs.aws.amazon.com/sagemaker/latest/dg/deepar-in-formats.html). 


