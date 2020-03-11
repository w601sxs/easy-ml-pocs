---
title: "Rekognition Classification preprocessing"
date: 2020-02-07T00:15:15-05:00
draft: false
---

Rekognition classification deals with learning image-level tags. To train your model, Amazon Rekognition Custom Labels requires the images in a dataset to be labeled with information about the scenes or concepts in your images.

If your image represents a scene or concept, such as a wedding or sport, the image as a whole needs an identifying image-level label. An image needs at least one label. You can add others so that the model can detect different classes of information—for example, countryside or sky. In this step, you add image-level labels to an image.

If you are looking to identify objects within images, check out [Rekognition object detection preprocessing](../rekogobjects)

### Upload data to S3

To make sure the training step is easy, organize the different classes of your data in different folders (prefixes) in S3. Suppose you have two classes of image-level labels (this could be rivers vs. oceans, outdoor vs. indoor, kitchen vs. living room etc.), upload these classes of images into two different folders. Names of these folders can match the class of images that it contains. Here, we just use ```class-1``` and ```class-2``` as sample names for the folders, inside a bucket called ```rekognitioncustomlabels```. The ```class-1``` folder only  contains images that fall into the first class etc. 

![Data in S3](/images/datains3.png)

You can have up to 250 different folders (we suggest you start with 2 - 3) or image-level labels, with at least one image per label (we suggest you have at least 100 examples in each folder). The maximum number of images per dataset is 250,000. Make sure that the minimum image dimension of each image file 64 pixels x 64 pixels, and the maximum is 4096 pixels x 4096 pixels.

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

> **Switch back to the Rekognition console**, enter the S3 path, and select **Automatic labeling**, and click **Submit**

![](/images/enters3path.png)

