---
title: "BlazingText training"
date: 2020-03-02T18:04:32-05:00
draft: false
algo: [blazingtext]
---

Make sure you saw [this link](../../preprocessing/blazingtext) for preprocessing first.


At the end of the preprocessing for BlazingText page, you converted your CSV file into a format that BlazingText accepts, and uploaded the file to ```s3://bucketname/train/out.csv```. 

On a SageMaker notebook, initialize the estimator:

```python
import sagemaker

session = sagemaker.Session()

region = session.boto_region_name

estimator = sagemaker.estimator.Estimator(
    sagemaker_session=session,
    image_name=sagemaker.amazon.amazon_estimator.get_image_uri(region, "blazingtext", "latest"),
    role=sagemaker.get_execution_role(),
    train_instance_count=1,
    train_instance_type='ml.c4.2xlarge',
    base_job_name='blazingtext-poc',
    train_volume_size = 30,
    train_max_run = 360000,
    input_mode= 'File',
    output_path='s3://bucket-name/path/to/output')
```

Assume you have timestamps that are 1 hour apart, and you want to use 10 values in the past to predict 1 value in the future; set [hyperparameters](https://docs.aws.amazon.com/sagemaker/latest/dg/deepar_hyperparameters.html) as follows:

```python 
estimator.set_hyperparameters(mode="supervised",
                            epochs=10,
                            min_count=2,
                            learning_rate=0.05,
                            vector_dim=10,
                            early_stopping=True,
                            patience=4,
                            min_epochs=5,
                            word_ngrams=2)
```

Learn more about hyperparameters [here](https://docs.aws.amazon.com/sagemaker/latest/dg/blazingtext_hyperparameters.html)

Next, train your BlazingText model using the Sagemaker Python SDK:

Here, we assume that you have a folder with (one or more) train files and test files. Make sure you saw [this link](../splittraintest) to help you split the input files.

```python
data_channels = {
    "train": "s3://bucketname/train/",
    "validation": "s3://bucketname/test/"
}

estimator.fit(inputs=data_channels, wait=True, logs=True)
```

When adding the path to the file for input data, go up to the folder and not the actual .csv file. This is set up so that a train folder for example, may contain multiple .csv files.