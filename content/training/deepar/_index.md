---
title: "DeepAR training"
date: 2020-03-02T18:04:32-05:00
draft: false
---

Make sure you saw [this link](../../preprocessing/deepar) for preprocessing first.


At the end of the preprocessing for DeepAR page, you uploaded your JSON-lines data to S3, to a location similar to ```s3://bucketname/train/train-data.jsonl``` and ```s3://bucketname/test/test-data.jsonl```


Initialize the estimator:

```python
import sagemaker

session = sagemaker.Session()

region = session.boto_region_name

estimator = sagemaker.estimator.Estimator(
    sagemaker_session=session,
    image_name=sagemaker.amazon.amazon_estimator.get_image_uri(region, "forecasting-deepar", "latest"),
    role=sagemaker.get_execution_role(),
    train_instance_count=1,
    train_instance_type='ml.c4.2xlarge',
    base_job_name='deepar-poc',
    output_path='s3://bucket-name/path/to/output')
```

Assume you have timestamps that are 1 hour apart, and you want to use 10 values in the past to predict 1 value in the future; set [hyperparameters](https://docs.aws.amazon.com/sagemaker/latest/dg/deepar_hyperparameters.html) as follows:

```python 
hyperparameters = {
    "time_freq": '1H',
    "epochs": "400",
    "early_stopping_patience": "40",
    "mini_batch_size": "64",
    "learning_rate": "5E-4",
    "context_length": '10',
    "prediction_length": '1'
}

estimator.set_hyperparameters(**hyperparameters)
```

Change the '1H' to '6H' for 6 hours, and '1D' for 1 day if your data points are 6 hours or one day apart, for example. Learn more about hyperparameters [here](https://docs.aws.amazon.com/sagemaker/latest/dg/deepar_hyperparameters.html)

Next, train your DeepAR model using the Sagemaker Python SDK:

```python
data_channels = {
    "train": "s3://bucketname/train/",
    "test": "s3://bucketname/test/"
}

estimator.fit(inputs=data_channels, wait=True)
```

When adding the path to the file for input data, go up to the folder and not the actual .jsonl file. This is set up so that a train folder for example, may contain multiple .jsonl files.