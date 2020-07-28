---
title: "Autogluon training"
date: 2020-02-26T11:20:21-05:00
draft: False
algo: [autopilot, rekscene, sagescene, rekobj, sageobj,blazingtext, comprehend]
---

[AutoGluon](https://autogluon.mxnet.io/index.html) enables easy-to-use and easy-to-extend AutoML with a focus on deep learning and real-world applications.

As of today, Autogluon supports input data in tabular format, image classification, object detection, text classification and neural architecture search.

### Common import statement for all task types
```python
import autogluon as ag
```

### Tabular Prediction
```python
from autogluon import TabularPrediction as task

train_data = task.Dataset(file_path='path-to-your-csv-file')

label_column = 'class'

dir = 'agModels-predictClass' # specifies folder where to store trained models
predictor = task.fit(train_data=train_data, label=label_column, output_directory=dir)
```


### Image Classification
```python
from autogluon import ImageClassification as task
```

Make sure your image folders are organized as follows:


```html
./data/train/class_A/1.jpg
./data/train/class_A/2.jpg
./data/train/class_A/3.jpg
./data/train/class_B/4.jpg
./data/train/class_B/5.jpg
./data/train/class_B/6.jpg
./data/test/class_A/100.jpg
./data/test/class_A/1024.jpg
./data/test/class_B/65535.jpg
./data/test/class_B/0.jpg
...
```

```python
dataset = task.Dataset('data/train')
if ag.get_gpu_count() == 0:
    dataset = task.Dataset(name='mydataset')
    test_dataset = task.Dataset(name='mydataset', train=False)
    
classifier = task.fit(dataset,
                      epochs=5,
                      ngpus_per_trial=1,
                      verbose=False)
 ```
 
 ### Object detection
 
 Note, try this if you already have annotations. Otherwise, go to Rekognition custom object detection.
 
 Annotations are xml documents that look like...
 
 ```html
 <annotation>
	<folder>VOC2007</folder>
	<filename>007305.jpg</filename>
	<source>
		<database>The VOC2007 Database</database>
		<annotation>PASCAL VOC2007</annotation>
		<image>flickr</image>
		<flickrid>321620436</flickrid>
	</source>
	<owner>
		<flickrid>dirfoto</flickrid>
		<name>jun saitoh</name>
	</owner>
	<size>
		<width>500</width>
		<height>331</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>
	<object>
		<name>motorbike</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>343</xmin>
			<ymin>113</ymin>
			<xmax>463</xmax>
			<ymax>181</ymax>
		</bndbox>
	</object>
.
.
.
.
.
 
 ```
 
 
 ```python
 from autogluon import ObjectDetection as task
 
import os
data_root = os.path.join(root, filename)
dataset_train = task.Dataset(data_root, classes=('motorbike',))

time_limits = 5*60*60  # 5 hours
epochs = 30
detector = task.fit(dataset_train,
                    num_trials=2,
                    epochs=epochs,
                    lr=ag.Categorical(5e-4, 1e-4),
                    ngpus_per_trial=1,
                    time_limits=time_limits)
 ```
 
 
 ### Text Classification
 
 ```python
 from autogluon import TextClassification as task
 ```
 Explore this toy dataset and use a similar format:
 
 ```python
 dataset = task.Dataset(name='ToySST')
 predictor = task.fit(dataset, epochs=1, time_limits=30)
 ```
 
                   
    

