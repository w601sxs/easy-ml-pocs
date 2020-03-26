---
title: "Pneumonia detection from Chest X-ray images using SageMaker"
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

### Jupyter Notebook

[Download this notebook (ipynb file)](/images/pneumoniasagenotebook.ipynb)

[View this Notebook (html)](/images/pneumoniasagenotebook.html)
