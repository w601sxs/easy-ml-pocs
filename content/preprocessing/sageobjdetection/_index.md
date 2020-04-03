---
title: "SageMaker Object Detection preprocessing"
date: 2020-03-27T18:01:14-04:00
draft: false
---

The Amazon SageMaker Object Detection algorithm detects and classifies objects in images using a single deep neural network. It is a supervised learning algorithm that takes images as input and identifies all instances of objects within the image scene.

If you are looking to classify images or scenes, check out [SageMaker Image Classification preprocessing](../sagescenes)

### Upload data to S3

To make the process easy, split your dataset to be used for training and testing/validation. Generally, the split proportion would be 80% training data and 20% testing/validation data. You can upload and organize these images in a two separate folders in S3 (one for training and other for testing/validation).

### Create a dataset

We will make use of SageMaker Ground Truth for labeling jobs to build training datasets.

> Navigate to SageMaker on the console and click "Labeling jobs" under Ground Truth:

![](/images/groundtruth-page.png)

> Click on "Create labeling jobs"

![](/images/gt-create-labeling-job.png)

> Put in details such as job name, input dataset location, output dataset location, and IAM Role

![](/images/gt-job-details-1.png)

> If you do not already have a manifest file for your input dataset, click on "Create manifest file" under Input dataset location

![](/images/input-dataset-manifest-file.png)

> Enter the S3 location for input dataset and click "Create"

![](/images/input-dataset-manifest-file-1.png)

> Once the manifest file is created, click on "Use this manifest"

![](/images/input-dataset-manifest-file-2.png)

> Continuing on the same page, select "Image" under Task category and select "Bounding box" under Task selection. Click Next.

![](/images/gt-job-details-2.png)

> Ground Truth allows multiple worker types (mechanical turk, private, vendor managed). In this example, we will use "Private" workers. Fill in the appropriate details.

![](/images/gt-worker-config.png)

> Scrolling down, you need to add brief description for workers to understand the job as well as labels. Click on "Create".

![](/images/gt-worker-config-1.png)

> Labeling job will be created for Task Type "Bounding Box"

![](/images/labeling-job.png)

> The workers will receive email to perform the labeling

![](/images/worker-email.png)

> The first time they log in the portal using the credentials provided in the email, they will be asked to change the password. Once they log in the portal, they will be presented with the job. Click on "Start working".

![](/images/worker-portal.png)

> The worker will be presented with images they need to label and draw bounding box.

![](/images/draw-bounding-box-1.png)

>The worker needs to select the label first and draw bounding box around the object.

![](/images/draw-bounding-box-2.png)

> If the image has multiple object, the worker needs to select labels and draw bounding box around all the objects.

![](/images/draw-bounding-box-multiple.png)

> Once all the images are labeled, worker can log out of the portal.

![](/images/worker-portal-job-done.png)

> The labeling job on SageMaker console will show status as "Complete"

![](/images/labeling-job-done.png)
![](/images/labeling-job-summary.png)
