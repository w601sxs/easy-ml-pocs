---
title: "SageMaker Object Detection training"
date: 2020-03-27T18:00:48-04:00
draft: False
algo: [sageobj]
---

Make sure you've seen [this](../../preprocessing/sageobjdetection) if you need help creating a dataset first! If you already have a usable dataset, follow along here to train a model:

### Create a training job

> Navigate to SageMaker console and click on "Training jobs". Once there, click on "Create training job".

![](/images/create-training-job.png)

> In the job details, add the job name, create a new IAM role or use an existing role which has necessary permission. Select "Object Detection" algorithm from the drop down and use "Pipe" as the Input mode.

![](/images/training-job-details.png)

> Continuing on training job details, put appropriate instance type and maximum runtime.

![](/images/training-job-details-1.png)

> In the hyperparameter selection section, make sure to put correct number of training samples.

![](/images/training-job-hyperparameters.png)

> Edit input data configuration section and make sure to put S3 location for the output.manifest file that was created from Ground Truth labeling job.

![](/images/training-job-input-data-conf-train.png)

>  Create another channel named "validation" and fill in similar details as test channel.

![](/images/training-job-input-data-conf-validation.png)

> At last, specify the S3 path to save output model artifacts. Click on "Create training job"

![](/images/training-job-output-conf.png)

> You will see the training job in progress on your SageMaker console.

![](/images/training-job-in-progress.png)

> Once the training job is finished successfully, you will see the status as "Completed". We will use the output artifacts to create a deployable model, click on "Create model".

![](/images/training-job-complete.png)

> In the create model section, add model name and verify the auto-populated details. Click on "Create model".

![](/images/create-model-settings.png)
![](/images/create-model-container-def.png)
![](/images/create-model.png)

> Once the model is created, you can click on "Models" from SageMaker console and see its summary

![](/images/model-summary.png)
