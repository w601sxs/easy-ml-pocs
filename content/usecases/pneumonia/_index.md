---
title: "Pneumonia detection from Chest X-ray images using Rekognition Custom Labels"
date: 2020-02-07T00:15:15-05:00
draft: false
---

### Introduction

Chest X-ray images (anterior-posterior) were selected from retrospective cohorts of pediatric patients of one to five years old from Guangzhou Women and Children’s Medical Center, Guangzhou. All chest X-ray imaging was performed as part of patients’ routine clinical care.

For the analysis of chest x-ray images, all chest radiographs were initially screened for quality control by removing all low quality or unreadable scans. The diagnoses for the images were then graded by two expert physicians before being cleared for training the AI system. In order to account for any grading errors, the evaluation set was also checked by a third expert.

#### Acknowledgements

- Data: https://data.mendeley.com/datasets/rscbjbr9sj/2

- License: CC BY 4.0

- Citation: http://www.cell.com/cell/fulltext/S0092-8674(18)30154-5


This data was obtained from Kaggle [here](https://www.kaggle.com/paultimothymooney/chest-xray-pneumonia) 

For folks who want to repeat this use case, the data is stored as a direct download [here](s3://easy-ml-pocs/pneumonia-image-data/)

Here is what a normal chest X-ray looks like:

![](/images/normalchest.jpeg)


... and here is what a pneumonia patient's chest X-ray looks like:

![](/images/viruschest.jpeg)



### Assumptions

For this PoC, we will simplify the dataset by using only a subset of images. We will take the training data available on Kaggle, and use about 1000 images in each class (```Normal``` and ```Pneumonia```). While this is is 1/5th of the images available in the actual dataset, it is sufficient for us to showcase art of the possible. We followed steps outlined in Rekognition custom classification [preprocessing](../../preprocessing/rekogscenes) and [training](../../training/rekogscenes) for this PoC.

### Step 1 - Preprocessing

#### Step 1.1 - Download Chest X-ray  data
> Click download after logging in (also consider using the Kaggle download API):
![](/images/downloadchestdata.png)


#### Step 1.2 - Create folders on S3 named "Normal" and "Pneumonia"
![](/images/createfolderchest.png)

#### Step 1.3 - Upload data to created folders
![](/images/uploaddatachest.png)

#### Step 1.4 - Navigate to Rekognition and Create a dataset
![](/images/createdatasetchest.png)

### Step 2 - Training

> From [this link](../../training/rekogscenes) on training with Rekognition custom classification, verify your images and click "Train Model"

![](/images/modelchest.png)

> Click "Split training dataset" and then click "Train":

![](/images/clicktrainchest.png)

> You should then be taken to the next screen with shows that training is in progress:

![](/images/traininginprogress.png)


### Step 3 - Deploy model

> The final F1 score for our model is 98.5%. That's pretty good!
![](/images/finalaccuracychest.png)

> Some more details for our trained model:
![](/images/moremodeldetailschest.png)

From [this link](../../inference/rekogscenes) on deploying a model trained with Rekognition, do

> Navigate to the project you trained your model under, wait for the **status** to show ```TRAINING_COMPLETE``` and then click the on the model **Name**  of the trained model. Review model performance details, and scroll down to the **Use model** section. Expand the section and copy code to create an API for your custom model and use the model for new predictions

#### Start model
```
aws rekognition start-project-version \
  --project-version-arn "arn:aws:rekognition:us-east-1:<account-number>:project/pneumonia/version/pneumonia.2020-03-23T14.09.57/1584986997214" \
  --min-inference-units 1 \
  --region us-east-1
```

####  Analyze image
```
aws rekognition detect-custom-labels  --project-version-arn "arn:aws:rekognition:us-east-1:<account-number>:project/pneumonia/version/pneumonia.2020-03-23T14.09.57/1584986997214"  --image '{"S3Object": {"Bucket": "easy-ml-pocs", "Name": "pneumonia-image-data/pneumonia/person1023_virus_1714.jpeg"}}' --region us-east-1
{
    "CustomLabels": [
        {
            "Confidence": 99.46600341796875, 
            "Name": "pneumonia"
        }
    ]
} 
```

> The model says that this X-ray image is of a person with Pneumonia with a 99.46% confidence.

#### Stop model
```
aws rekognition start-project-version \
  --project-version-arn "arn:aws:rekognition:us-east-1:<account-number>:project/pneumonia/version/pneumonia.2020-03-23T14.09.57/1584986997214" \
  --min-inference-units 1 \
  --region us-east-1
```

### Done!










