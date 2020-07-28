---
title: "SageMaker Image Classification training"
date: 2020-02-07T00:15:15-05:00
draft: false
algo: [sagescene]
---

Make sure you've seen [this](../../preprocessing/sagescenes) if you need help creating a dataset first! If you already have a usable dataset, follow along here to train a custom model:

### On the console

> On the SageMaker console in AWS, click create training job

![](/images/sagescene-create-training.png)

> Give the training job a name, create or select a role, and select "Image Classification" algorithm from the dropdown under "Choose your algorithm"

![](/images/sagescene-training-details-1.png)

> In the hyperparameter selection section, edit the number of classes (categories) and the number of training samples

![](/images/sagescene-training-details-2.png)

> Add two channels (a train channel will be created by default; create a validation channel)

![](/images/sagescene-training-details-3-channels.png)

> Add the S3 path to your train and validation ".rec" RecordIO files in the details under each channel name

![](/images/sagescene-training-details-4-channels.png)

> Add an output path and click start training

![](/images/sagescene-training-details-5-output.png)


### Using the boto3 Python SDK

Assume you have two varilables ```trainpath``` and ```testpath``` that point to the locations of train and test recordio files. 

Set the required hyperparameters:

```python
# The algorithm supports multiple network depth (number of layers). They are 18, 34, 50, 101, 152 and 200
# For this training, we will use 18 layers
num_layers = "18" 
# we need to specify the input image shape for the training data
image_shape = "3,1000,1000"
# we also need to specify the number of training samples in the training set
# for caltech it is 15420
num_training_samples = "1358"
# specify the number of output classes
num_classes = "2"
# batch size for training
mini_batch_size =  "64"
# number of epochs
epochs = "2"
# learning rate
learning_rate = "0.01"
```

> Note: to get the number of training samples, look at the generated ".lst" file in [this](../../preprocessing/sagescenes).

To do this, run the following linux command:

```html
wc -l data_rec_train.lst
```

### Set up training
```python
import time
import boto3
from time import gmtime, strftime
from sagemaker.amazon.amazon_estimator import get_image_uri
from sagemaker import get_execution_role

role = get_execution_role()

bucket='easy-ml-pocs' # customize to your bucket

training_image = get_image_uri(boto3.Session().region_name, 'image-classification')

s3 = boto3.client('s3')
# create unique job name 
job_name = 'DEMO-imageclassification-' + time.strftime('-%Y-%m-%d-%H-%M-%S', time.gmtime())
training_params = \
{
    # specify the training docker image
    "AlgorithmSpecification": {
        "TrainingImage": training_image,
        "TrainingInputMode": "File"
    },
    "RoleArn": role,
    "OutputDataConfig": {
        "S3OutputPath": 's3://{}/sagemaker/{}/output'.format(bucket, 'DEMO-imageclassification-')
    },
    "ResourceConfig": {
        "InstanceCount": 1,
        "InstanceType": "ml.p3.16xlarge",
        "VolumeSizeInGB": 50
    },
    "TrainingJobName": job_name,
    "HyperParameters": {
        "image_shape": image_shape,
        "num_layers": str(num_layers),
        "num_training_samples": str(num_training_samples),
        "num_classes": str(num_classes),
        "mini_batch_size": str(mini_batch_size),
        "epochs": str(epochs),
        "learning_rate": str(learning_rate)
    },
    "StoppingCondition": {
        "MaxRuntimeInSeconds": 360000
    },
#Training data should be inside a subdirectory called "train"
#Validation data should be inside a subdirectory called "validation"
#The algorithm currently only supports fullyreplicated model (where data is copied onto each machine)
    "InputDataConfig": [
        {
            "ChannelName": "train",
            "DataSource": {
                "S3DataSource": {
                    "S3DataType": "S3Prefix",
                    "S3Uri": trainpath,
                    "S3DataDistributionType": "FullyReplicated"
                }
            },
            "ContentType": "application/x-recordio",
            "CompressionType": "None"
        },
        {
            "ChannelName": "validation",
            "DataSource": {
                "S3DataSource": {
                    "S3DataType": "S3Prefix",
                    "S3Uri": testpath,
                    "S3DataDistributionType": "FullyReplicated"
                }
            },
            "ContentType": "application/x-recordio",
            "CompressionType": "None"
        }
    ]
}
print('Training job name: {}'.format(job_name))
print('\nInput Data Location: {}'.format(training_params['InputDataConfig'][0]['DataSource']['S3DataSource']))
```

### Create SageMaker Training job
```python
# create the Amazon SageMaker training job
sagemaker = boto3.client(service_name='sagemaker')
sagemaker.create_training_job(**training_params)

# confirm that the training job has started
status = sagemaker.describe_training_job(TrainingJobName=job_name)['TrainingJobStatus']
print('Training job current status: {}'.format(status))

try:
    # wait for the job to finish and report the ending status
    sagemaker.get_waiter('training_job_completed_or_stopped').wait(TrainingJobName=job_name)
    training_info = sagemaker.describe_training_job(TrainingJobName=job_name)
    status = training_info['TrainingJobStatus']
    print("Training job ended with status: " + status)
except:
    print('Training failed to start')
     # if exception is raised, that means it has failed
    message = sagemaker.describe_training_job(TrainingJobName=job_name)['FailureReason']
    print('Training failed with the following error: {}'.format(message))
```

### Create a Model for deployment
```python
import boto3
from time import gmtime, strftime

sage = boto3.Session().client(service_name='sagemaker') 

model_name="DEMO--classification-model" + time.strftime('-%Y-%m-%d-%H-%M-%S', time.gmtime())
print(model_name)
info = sage.describe_training_job(TrainingJobName=job_name)
model_data = info['ModelArtifacts']['S3ModelArtifacts']
print(model_data)

hosting_image = get_image_uri(boto3.Session().region_name, 'image-classification')

primary_container = {
    'Image': hosting_image,
    'ModelDataUrl': model_data,
}

create_model_response = sage.create_model(
    ModelName = model_name,
    ExecutionRoleArn = role,
    PrimaryContainer = primary_container)

print(create_model_response['ModelArn'])
```

