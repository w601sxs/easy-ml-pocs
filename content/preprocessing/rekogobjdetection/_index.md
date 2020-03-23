---
title: "Rekognition Object Detection preprocessing"
date: 2020-03-22T16:41:13-04:00
draft: false
---
Rekognition Object Detection deals with finding objects within an image. To train your model, Amazon Rekognition Custom Labels require bounding boxes to be drawn around objects and the objects should be labeled in your images.

If your image has an object, such as a machine part or an animated character, the image needs a bounding box around an object and an object-identifying label. You can have multiple objects within an image. In this step, you add object-level labels and bounding boxes to an image.

If you are looking to classify images or scenes, check out [Rekognition Classification preprocessing](../rekogscenes)

### Upload data to S3

To make the process easy, you can upload and organize your data in a single folder in S3 (for example, in a bucket called ```rekognitioncustomlabels```) especially if you have multiple objects within a single image.

Supported file formats are PNG and JPEG. Maximum number of bounding boxes in an image is 50. The maximum number of images per dataset is 250,000. Make sure that the minimum image dimension of each image file 64 pixels x 64 pixels, and the maximum is 4096 pixels x 4096 pixels.

Other limits are specified [here](https://docs.aws.amazon.com/rekognition/latest/customlabels-dg/limits.html)

### Create a dataset

> Navigate to Rekognition on the console and click "Amazon Rekognition":

![](/images/navigatetorekognition.png)

> Click **Use Custom Labels**

![](/images/clickcustomlabels.png)

> On the left sidebar / menu, click **datasets**

![](/images/clickdatasetsmenu.png)

> Provide a dataset name and choose **Import images from S3**

![](/images/importimagesfroms3.png)

> **Switch to the S3 console**, copy and paste the bucket  permissions into the bucket that contains your data:

![](/images/pastebucketconfiguration.png)

> **Switch back to the Rekognition console**, enter the S3 path, and leave **Automatic labeling** unchecked, and click **Submit**

![](/images/enters3pathwithoutautomaticlabeling.png)
