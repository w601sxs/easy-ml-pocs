---
title: "SageMaker Image Classification preprocessing"
date: 2020-02-07T00:15:15-05:00
draft: false
algo: [sagescene]
---

The Amazon SageMaker image classification algorithm is a supervised learning algorithm that supports multi-label classification. It takes an image as input and outputs one or more labels assigned to that image. It uses a convolutional neural network (ResNet) that can be trained from scratch or trained using transfer learning when a large number of training images are not available.

The recommended input format for the Amazon SageMaker image classification algorithms is Apache MXNet RecordIO. However, you can also use raw images in .jpg or .png format. Refer to [this discussion](https://mxnet.apache.org/api/architecture/note_data_loading) for a broad overview of efficient data preparation and loading for machine learning systems.

We think that training with the RecordIO format is the easiest way to get started with your image classification PoC on SageMaker. For full details on the input-output interface, see [this](https://docs.aws.amazon.com/sagemaker/latest/dg/image-classification.html#IC-inputoutput).

### Prepare your dataset in ImageRecord format

[Reference](https://gluon-cv.mxnet.io/build/examples_datasets/recordio.html)

Raw images are natural data format for computer vision tasks. However, when loading data from image files for training, disk IO might be a bottleneck. For instance, when training a ResNet50 model with ImageNet on an AWS p3.16xlarge instance, The parallel training on 8 GPUs makes it so fast, with which even reading images from ramdisk can’t catch up. To boost the performance on top-configured platform, we suggest users to train with MXNet’s ImageRecord format.

It is as simple as a few lines of code to create ImageRecord file for your own images.

Assuming we have a folder ./example, in which images are places in different subfolders representing classes:

```html
./example/class_A/1.jpg
./example/class_A/2.jpg
./example/class_A/3.jpg
./example/class_B/4.jpg
./example/class_B/5.jpg
./example/class_B/6.jpg
./example/class_C/100.jpg
./example/class_C/1024.jpg
./example/class_D/65535.jpg
./example/class_D/0.jpg
...
```

### Download prerequisite packages

```
wget https://raw.githubusercontent.com/apache/incubator-mxnet/master/tools/im2rec.py ./
pip install mxnet
```

Generate a .lst file, i.e. a list of these images containing label and filename information.

```html
python im2rec.py ./example_rec ./example/ --recursive --list --num-thread 8 --test-ratio=0.3 --train-ratio=0.7
```

Then create the .rec files for training and validation

```html
python im2rec.py ./example_rec ./example/ --recursive --pass-through --pack-label --num-thread 8
```

It gives you two more files: example_rec.idx and example_rec.rec. Now, you can use them to train!

Then use [this link](../uploadtos3) to upload your .rec files to s3!

For example, do:

```python
import sagemaker
sess = sagemaker.Session()

trainpath = sess.upload_data(
    path='example_rec_train.rec', bucket='mybucketname',
    key_prefix='sagemaker/input')

testpath = sess.upload_data(
    path='example_rec_test.rec', bucket='mybucketname',
    key_prefix='sagemaker/input')
``
