---
title: "Comprehend custom inference"
date: 2020-03-11T14:54:49-04:00
draft: false
---

Make sure you saw [this link](../../training/comprehend) for training first

After training your model, your custom classifier is ready and can be used to categorize unlabeled documents asynchronously. 

## Data prep for inference

All documents must be in UTF-8-formatted text files and you can only train your custom classification model using the one document per line format, you can submit your documents in that format or as one document per file

The format of the input file should be as follows:

### One document per line

```html
Text of document 1 \n
Text of document 2 \n
Text of document 3 \n
Text of document 4 \n
```

After preparing the documents file, place that file in the S3 bucket that you're using for input data.

### One document per file

Use the URI S3://bucketName/prefix, if the prefix is a single file, Amazon Comprehend uses that file as input. If more than one file begins with the prefix, Amazon Comprehend uses all of them as input. 

## Prediction

In order to launch a new job, execute the following replacing with your bucket locations and classifier arns

```html
aws comprehend start-document-classification-job --document-classifier-arn <<your-comprehendclassifier-arn>> --input-data-config S3Uri=<<YOUR_S3_INPUTBUCKET>>,InputFormat=ONE_DOC_PER_LINE --output-data-config S3Uri=<<YOUR_S3_OUTPUTBUCKET>> --data-access-role-arn <<YOUR_IAM_ROLE_ARN>>
```

You should see something like this:

```html
{
    "DocumentClassificationJobProperties": {
        "JobId": "4*********************8aab",
        "JobStatus": "IN_PROGRESS",
        "SubmitTime": 1561679679.036,
        "DocumentClassifierArn": "YourClassifierArn",
        "InputDataConfig": {
            "S3Uri": "YourS3Uri",
            "InputFormat": "ONE_DOC_PER_LINE"
        },
        "OutputDataConfig": {
            "S3Uri": "S3OutputLocation"
        },
        "DataAccessRoleArn": "YourAccessRole"
    }
}
```

To check the newly launched job:

```html
aws comprehend describe-document-classification-job --job-id <<PROVIDE_YOUR_JOB_ID>>
```

Then you can download the results using OutputDataConfig.S3Uri 

To implement it using console, see [this link](https://docs.aws.amazon.com/comprehend/latest/dg/how-class-run.html)

To create a model-specific endpoint for synchronous inference for a previously trained custom model using Python:

```python
response = client.create_endpoint(
    EndpointName='string',
    ModelArn='string',
    DesiredInferenceUnits=123,
    ClientRequestToken='string',
    Tags=[
        {
            'Key': 'string',
            'Value': 'string'
        },
    ]
)
```
