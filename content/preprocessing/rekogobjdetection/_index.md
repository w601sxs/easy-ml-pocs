---
title: "Rekognition Object Detection preprocessing"
date: 2020-03-22T16:41:13-04:00
draft: false
algo: [rekobj]
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

> On Rekognition console, click on **Edit** next to "Filter by labels".

![](/images/add-label-1.png)

>Type the label name and click **Add label**. Once you add all your labels, click **Save**.

![](/images/add-label-2.png)

>Now, as you have labels created, you need to draw bounding boxes and tag the labels to the images. You will click on "Start Labeling" on the right top corner.

![](/images/start-labeling.png)

>Once you're in labeling mode, you will select the images and click on "Draw bounding box"

![](/images/start-draw-bounding-box.png)

>You will be presented a preview of the image and labels on the right.

![](/images/bounding-box-before.png)

>You will select or click on a label (for example, I will select "Frank") and draw bounding box around the object.

![](/images/bounding-box-after.png)

>If you have multiple objects in an image, you will follow the same process of selecting the label and drawing bounding box around it.

![](/images/labeled-bounding-box-image.png)

>Similarly you will go through entire set of images to draw bounding box around the object and label them. Once you're done, you will click on "Save changes" on the right top corner to come out of labeling mode and saving the changes you made. Your dataset should look similar to below:

![](/images/labeled-bounding-box-finished.png)
