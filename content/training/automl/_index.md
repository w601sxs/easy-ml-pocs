---
title: "Autopilot Training"
date: 2020-02-28T10:25:21-06:00
draft: false
algo: [autopilot]
---

Make sure you saw [this link](../../preprocessing/automl) for preprocessing first

## Create AutoML job using the console or CLI or Python

### Using Python
[Click here](https://github.com/awslabs/amazon-sagemaker-examples/blob/master/autopilot/sagemaker_autopilot_direct_marketing.ipynb)

#### Configure data for AutoML job

- Set the location of the data set,
- Select the target attribute that I want the model to predict: in this case, it’s the ‘y’ column showing if a customer accepted the offer or not,
- Set the location of training artifacts.

```python
input_data_config = [{
      'DataSource': {
        'S3DataSource': {
          'S3DataType': 'S3Prefix',
          'S3Uri': 's3://{}/{}/input'.format(bucket,prefix)
        }
      },
      'TargetAttributeName': 'y'
    }
  ]

output_data_config = {
    'S3OutputPath': 's3://{}/{}/output'.format(bucket,prefix)
  }
```

#### Create AutoML job
```python
auto_ml_job_name = 'automl-dm-' + timestamp_suffix

import boto3
sm = boto3.client('sagemaker')
sm.create_auto_ml_job(AutoMLJobName=auto_ml_job_name,
                      InputDataConfig=input_data_config,
                      OutputDataConfig=output_data_config,
                      RoleArn=role)

```

### Using CLI
[Click here](https://docs.aws.amazon.com/cli/latest/reference/sagemaker/create-auto-ml-job.html)

#### Set data config and create AutoML job
```html
aws sagemaker create-auto-ml-job \
--auto-ml-job-name my-automl-job \
--input-data-config '[
        {
            "DataSource": {
                "S3DataSource": {
                    "S3DataType": "S3Prefix",
                    "S3Uri": "s3://<bucket>/<prefix>/input"
                }
            },
            "CompressionType": "None",
            "TargetAttributeName": "y"
        }
    ]'
--output-data-config '{
        "KmsKeyId": "",
        "S3OutputPath": "s3://<bucket>/<prefix>/output"
    }'
--role-arn "arn:aws:iam::<account-id>:role/<role-name-with-path>"

```

### Using Console
[Click here](https://docs.aws.amazon.com/sagemaker/latest/dg/autopilot-automate-model-development-create-experiment.html)
