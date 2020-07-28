---
title: "Object detection using Pascal VOC dataset with SageMaker"
date: 2020-04-02T11:17:32-04:00
draft: False
algo: sageobj
---

The Amazon SageMaker Object Detection algorithm detects and classifies objects in images using a single deep neural network. It is a supervised learning algorithm that takes images as input and identifies all instances of objects within the image scene. The object is categorized into one of the classes in a specified collection with a confidence score that it belongs to the class. Its location and scale in the image are indicated by a rectangular bounding box. It uses the Single Shot multibox Detector (SSD) framework and supports two base networks: VGG and ResNet. The network can be trained from scratch, or trained with models that have been pre-trained on the ImageNet dataset.

The recommended input format for the Amazon SageMaker object detection algorithms is Apache MXNet RecordIO. However, you can also use raw images in .jpg or .png format.

We think that training with the RecordIO format is the easiest way to get started with your image classification PoC on SageMaker. For full details on the input-output interface, see [this](https://docs.aws.amazon.com/sagemaker/latest/dg/object-detection.html#object-detection-inputoutput)

#### Prepare your dataset in ImageRecord format
[Reference](https://gluon-cv.mxnet.io/build/examples_datasets/recordio.html)

Raw images are natural data format for computer vision tasks. However, when loading data from image files for training, disk IO might be a bottleneck. For instance, when training a ResNet50 model with ImageNet on an AWS p3.16xlarge instance, The parallel training on 8 GPUs makes it so fast, with which even reading images from ramdisk can’t catch up. To boost the performance on top-configured platform, we suggest users to train with MXNet’s ImageRecord format.

We will use Pascal VOC, a popular computer vision challenge, [dataset](http://host.robots.ox.ac.uk/pascal/VOC/). We will use the data sets from 2007 and 2012, named as VOC07 and VOC12 respectively the latest one comprises of more than 20,000 images containing about 50,000 annotated objects. These annotated objects are grouped into 20 categories.

#### Download prerequisite packages
```
wget https://raw.githubusercontent.com/awslabs/amazon-sagemaker-examples/master/introduction_to_amazon_algorithms/object_detection_pascalvoc_coco/tools/im2rec.py ./
wget https://raw.githubusercontent.com/awslabs/amazon-sagemaker-examples/master/introduction_to_amazon_algorithms/object_detection_pascalvoc_coco/tools/prepare_dataset.py ./
wget https://raw.githubusercontent.com/awslabs/amazon-sagemaker-examples/master/introduction_to_amazon_algorithms/object_detection_pascalvoc_coco/tools/concat_db.py ./
wget https://raw.githubusercontent.com/awslabs/amazon-sagemaker-examples/master/introduction_to_amazon_algorithms/object_detection_pascalvoc_coco/tools/imdb.py ./
wget https://raw.githubusercontent.com/awslabs/amazon-sagemaker-examples/master/introduction_to_amazon_algorithms/object_detection_pascalvoc_coco/tools/pascal_voc.names ./
wget https://raw.githubusercontent.com/awslabs/amazon-sagemaker-examples/master/introduction_to_amazon_algorithms/object_detection_pascalvoc_coco/tools/pascal_voc.py ./
pip install mxnet
pip install opencv-python
```

Download Pascal VOC data sets
```
wget -P /tmp http://host.robots.ox.ac.uk/pascal/VOC/voc2012/VOCtrainval_11-May-2012.tar
wget -P /tmp http://host.robots.ox.ac.uk/pascal/VOC/voc2007/VOCtrainval_06-Nov-2007.tar
wget -P /tmp http://host.robots.ox.ac.uk/pascal/VOC/voc2007/VOCtest_06-Nov-2007.tar
```

Extract the data
```
tar -xf /tmp/VOCtrainval_11-May-2012.tar && rm /tmp/VOCtrainval_11-May-2012.tar
tar -xf /tmp/VOCtrainval_06-Nov-2007.tar && rm /tmp/VOCtrainval_06-Nov-2007.tar
tar -xf /tmp/VOCtest_06-Nov-2007.tar && rm /tmp/VOCtest_06-Nov-2007.tar
```

Now, we will combine the training and validation sets from both 2007 and 2012 as the training data set, and use the test set from 2007 as our validation set.

```
python prepare_dataset.py --dataset pascal --year 2007,2012 --root VOCdevkit --set trainval --target VOCdevkit/train.lst
rm -rf VOCdevkit/VOC2012
python prepare_dataset.py --dataset pascal --year 2007 --root VOCdevkit --set test --target VOCdevkit/val.lst --no-shuffle
rm -rf VOCdevkit/VOC2007
```

It gives you two sets of files, one with "train" and other with "val": Such as train.idx, train.lst and train.rec. Now, you can use them to train!

Then use [this link](../uploadtos3) to upload your .rec files to s3!

For example, do:

```python
import sagemaker
sess = sagemaker.Session()

trainpath = sess.upload_data(
    path='train.rec', bucket='mybucketname',
    key_prefix='sagemaker/input')

testpath = sess.upload_data(
    path='val.rec', bucket='mybucketname',
    key_prefix='sagemaker/input')
```

#### Training the model
Once we have a usable dataset, we are ready to train the model.

```python
import sagemaker
from sagemaker import get_execution_role
from sagemaker.amazon.amazon_estimator import get_image_uri

role = get_execution_role()
sess = sagemaker.Session()
training_image = get_image_uri(sess.boto_region_name, 'object-detection', repo_version="latest")

#the estimator will launch the training job
od_model = sagemaker.estimator.Estimator(training_image,
                                         role,
                                         train_instance_count=1,
                                         train_instance_type='ml.p3.2xlarge',
                                         train_volume_size = 50,
                                         train_max_run = 360000,
                                         input_mode= 'File',
                                         output_path=s3_output_location,
                                         sagemaker_session=sess)
#setup the hyperparameters
od_model.set_hyperparameters(base_network='resnet-50',
                            use_pretrained_model=1,
                            num_classes=20,
                            mini_batch_size=16,
                            epochs=240,
                            learning_rate=0.005,
                            lr_scheduler_step='3,6',
                            lr_scheduler_factor=0.1,
                            optimizer='sgd',
                            momentum=0.9,
                            weight_decay=0.0005,
                            overlap_threshold=0.5,
                            nms_threshold=0.45,
                            image_shape=512,
                            label_width=350,
                            num_training_samples=16551)
#setup data channels
train_data = sagemaker.session.s3_input(trainpath, distribution='FullyReplicated',
                        content_type='application/x-recordio', s3_data_type='S3Prefix')
validation_data = sagemaker.session.s3_input(testpath, distribution='FullyReplicated',
                             content_type='application/x-recordio', s3_data_type='S3Prefix')
data_channels = {'train': train_data, 'validation': validation_data}

#train the model
od_model.fit(inputs=data_channels, logs=True)
```

#### Create Endpoint
Once the training is done, you can deploy the trained model as an endpoint.

```python
object_detector = od_model.deploy(initial_instance_count = 1,
                                 instance_type = 'ml.m4.xlarge')
```


#### Perform inference
Now, as the model is deployed, we can use it to derive inference.

Let's download a sample image.
```html
wget -O test.jpg https://images.pexels.com/photos/980382/pexels-photo-980382.jpeg
```

```python
import json

file_name = 'test.jpg'

with open(file_name, 'rb') as image:
    f = image.read()
    b = bytearray(f)

#deriving inference
#inference will be a JSON object
object_detector.content_type = 'image/jpeg'
results = object_detector.predict(b)
detections = json.loads(results)
print (detections)
```
