---
title: "Comprehend custom training"
date: 2020-03-02T17:38:26-05:00
draft: false
algo: [comprehend]
---

Make sure you saw [this link](../../preprocessing/comprehend) for preprocessing first

Custom classification is a two step process:

1. Identify labels and create and train a custom classifier to recognize those labels. 
2. Once amazon Comprehend trains the classifier, send unlabeled documents to be classified using that classifier. 

## Training a Custom Classifier

### Using the AWS SDK for Python:

Instantiate Boto3 SDK:
```python
import boto3
client = boto3.client('comprehend', region_name='region')
```

To create a Classifier:
```python
create_response = client.create_document_classifier( InputDataConfig={ 'S3Uri': 's3://S3Bucket/docclass/file name' }, DataAccessRoleArn='arn:aws:iam::account number:role/resource name', DocumentClassifierName='SampleCodeClassifier1', LanguageCode='en')
```


To run a custom classifier job:
```python
start_response = client.start_document_classification_job( InputDataConfig={ 'S3Uri': 's3://S3Bucket/docclass/file name', 'InputFormat': 'ONE_DOC_PER_LINE' }, OutputDataConfig={ 'S3Uri': 's3://S3Bucket/output' }, DataAccessRoleArn='arn:aws:iam::account number:role/resource name',
DocumentClassifierArn= 'arn:aws:comprehend:region:account number:document-classifier/SampleCodeClassifier1')

```


### Some other notes
- To train a custom classifier, identify the classes you want to use for classification. For each class, for more accurate training, we recommend at least 50 documents or more for each class.

- When training your classifier, the data must be in a single .csv file. The format of the data will depend onwhich classifier mode you choose.

- After you train the custom classifier, you can analyze documents in either asynchronous (batch) or synchronous operations (real time)

- Multi-class mode supports up to 1 million examples containing up to 1000 unique classes.

- Multi-label mode supports up to 1 million examples containing up to 100 unique classes.
