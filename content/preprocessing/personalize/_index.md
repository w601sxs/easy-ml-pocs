---
title: "Personalize"
date: 2020-02-26T00:12:50-05:00
draft: false
---

### Import data

Amazon Personalize imports data only from files that are in the comma-separated values (CSV) format. Amazon Personalize requires the first row of your CSV file to contain column headers. The column headers in your CSV file need to map to the schema to create the dataset. Don't enclose headers in quotation marks ("). Upload your file into an Amazon Simple Storage Service (Amazon S3) bucket that [Amazon Personalize can access](https://docs.aws.amazon.com/personalize/latest/dg/data-prep-upload-s3.html)

Let's assume your dataset contains file named "ratings.csv" with following data.

```html
userId,movieId,rating,timestamp
1,2,3.5,1112486027
1,29,3.5,1112484676
1,32,3.5,1112484819
1,47,3.5,1112484727
1,50,3.5,1112484580
```
It reads like this: user 1 gave movie 2 a 3.5 rating. Same for movies 29, 32, 47, 50 and so on!

Before you add a dataset to Amazon Personalize, you must define a schema for that dataset. Name the file as "my-personalize-schema.json"
```JSON
{"type": "record",
"name": "Interactions",
"namespace": "com.amazonaws.personalize.schema",
"fields":[
    {"name": "ITEM_ID", "type": "string"},
    {"name": "USER_ID", "type": "string"},
    {"name": "TIMESTAMP", "type": "long"}
],
"version": "1.0"}
```

### Prepare dataset
Essentially, what the following python code does:

- Shuffle reviews.
- Keep only movies rated 4 and above, and drop the ratings columns: Purpose for this is to recommend movies that users should really like.
- Rename columns to the names used in the schema.
- Keep only 100,000 interactions to minimize training time

```python
import pandas, boto3
from sklearn.utils import shuffle
ratings = pandas.read_csv('ratings.csv')
ratings = shuffle(ratings)
ratings = ratings[ratings['rating']>4]
ratings = ratings.drop(columns='rating')
ratings.columns = ['USER_ID','ITEM_ID','TIMESTAMP']
ratings = ratings[:100000]
ratings.to_csv('ratings.processed.csv',index=False)
s3 = boto3.client('s3')
s3.upload_file('ratings.processed.csv','my-personalize-bucket','ratings.processed.csv')
```

### Create dataset group, create dataset and create import job - using Python, CLI and Console

#### Python
[Click here](https://docs.aws.amazon.com/personalize/latest/dg/getting-started-python.html)

```python
import boto3

personalize = boto3.client('personalize')

dsg_response = personalize.create_dataset_group(name = 'my-personalize-dataset-group')
dsg_arn = dsg_response['datasetGroupArn']

with open('my-personalize-schema.json') as f:
    createSchemaResponse = personalize.create_schema(
        name = 'MyPersonalizeSchema',
        schema = f.read()
    )
schema_arn = createSchemaResponse['schemaArn']


ds_response = personalize.create_dataset(
    name = 'MyPersonalizeDataset',
    schemaArn = schema_arn,
    datasetGroupArn = dsg_arn,
    datasetType = 'Interactions')

ds_arn = ds_response['datasetArn']


dsij_response = personalize.create_dataset_import_job(
    jobName = 'YourImportJob',
    datasetArn = ds_arn,
    dataSource = {'dataLocation':'s3://my-personalize-bucket/ratings.processed.csv'},
    roleArn = 'role_arn')

dsij_arn = dsij_response['datasetImportJobArn']
```

#### CLI
[Click here](https://docs.aws.amazon.com/personalize/latest/dg/getting-started-cli.html)

```html
aws personalize create-dataset-group --name my-personalize-dataset-group

aws personalize create-schema --name my-personalize-schema \
--schema file://my-personalize-schema.json

aws personalize create-dataset --schema-arn $SCHEMA_ARN \
--dataset-group-arn $DATASET_GROUP_ARN \
--dataset-type INTERACTIONS

aws personalize create-dataset-import-job --job-name my-personalize-import-job \
--role-arn $ROLE_ARN
--dataset-arn $DATASET_ARN \
--data-source dataLocation=s3://my-personalize-bucket/ratings.processed.csv
```

### Console
[Click here](https://docs.aws.amazon.com/personalize/latest/dg/getting-started-console.html)
