---
title: "Personalize training"
date: 2020-03-04T13:19:02-05:00
draft: false
algo: [personalize]
---

Make sure you saw [this link](../../preprocessing/personalize) for preprocessing first

Training and deploying model with Personalize involves following steps:
1. Creating solution: The solution contains the configurations to train a model.
2. Creating solution version: The solution version is a trained model with the configuration you selected.
3. Creating campaign: A campaign is an endpoint used to host a solution version and make recommendations to users.

### Create the configuration for training a model
When you have your dataset group with data in it, the next step is to create a solution. A solution covers two areas—selecting the model (recipe) and then using your data to train it. You have recipes and a popularity baseline from which to choose. Alternatively, you can use AutoML, which runs your data against each of the available recipes and Amazon Personalize then judges the best recipe based on the accuracy results produced.

#### Python
```python
import boto3

personalize = boto3.client('personalize')

print ('Creating solution')
response = personalize.create_solution(
    name = "my-personalize-solution",
    datasetGroupArn = "DATASET_GROUP_ARN",
    performAutoML = True)

# Get the solution ARN.
solution_arn = response['solutionArn']
```

#### CLI
```html
aws personalize create-solution --name my-personalize-solution \
--minTPS 10 --perform-auto-ml \
--dataset-group-arn $DATASET_GROUP_ARN
```


### Train the model
#### Python
```python
# Use the solution ARN to create a solution version.
print ('Creating solution version')
response = personalize.create_solution_version(solutionArn = solution_arn)
solution_version_arn = response['solutionVersionArn']
```

#### CLI
```html
aws personalize create-solution-version \
  --solution-arn $SOLUTION_ARN
```

This will take a little while as the optimal recipe is selected, trained and tuned. Once the solution version is ACTIVE, [evaluate](https://docs.aws.amazon.com/personalize/latest/dg/working-with-training-metrics.html) its performance before proceeding.
