---
title: "Rossman store sales forecast"
date: 2020-02-07T00:15:15-05:00
draft: false
algo: deepar
---

### Introduction

Dirk Rossmann GmbH is Germany's second-largest drug store chain (after dm-drogerie markt), with over 4000 stores in Europe.

You are provided with historical sales data for 1,115 Rossmann stores. The task is to forecast the "Sales" column for the test set. Note that some stores in the dataset were temporarily closed for refurbishment.

This data was obtained from Kaggle [here](https://www.kaggle.com/c/rossmann-store-sales/data) 

For folks who want to repeat this use case, the data is stored as a direct download [here](s3://easy-ml-pocs/rossman-sales-data/rossman-sales.csv)

The first few rows of the raw csv data looks like this:

```html
"Store","DayOfWeek","Date","Sales","Customers","Open","Promo","StateHoliday","SchoolHoliday"
1,5,2015-07-31,5263,555,1,1,"0","1"
2,5,2015-07-31,6064,625,1,1,"0","1"
3,5,2015-07-31,8314,821,1,1,"0","1"
4,5,2015-07-31,13995,1498,1,1,"0","1"
5,5,2015-07-31,4822,559,1,1,"0","1"
6,5,2015-07-31,5651,589,1,1,"0","1"
7,5,2015-07-31,15344,1414,1,1,"0","1"
8,5,2015-07-31,8492,833,1,1,"0","1"
9,5,2015-07-31,8565,687,1,1,"0","1"
```

### Assumptions

For this PoC, we will simplify the dataset by dropping a few columns. Many of the following assumptions may be inaccurate, but this is a PoC, and we want to exercise the provided code samples end-to-end. Let us try to forecast the ```Sales``` column for each store by ```Store``` ID, and ```Promo```. We will first and drop:

- ```DayOfWeek``` assuming most of the days have similar sales until the weekend
- ```Customers``` assuming this is number of customers, and we will not have access to this value until after the day
- ```Open``` assuming it the stores are open except during holidays, and we have a column that takes care of that
- ```SchoolHoliday```, since to prove this out, we will be considering other columns with dynamic values, like ```Promo```
- ```StateHoliday```, since the unique values in the column are [0,a,b,c]

### Step 1 - Preprocessing

#### Step 1.1 - Drop and rearrange columns
From the code on this page on [Select, drop or extract Columns](../../preprocessing/selecting), copy the following line:

```html
awk -F "|" '{ print $1 $3 $5 }' Folder/in*csv > outfile.csv
``` 
and adapt it for our use case:

```html
awk -F"," '{ {gsub(/\"/,"")}; print $3","$1","$4","$7}' rossman-sales.csv > outfile.csv
```

Now, the data in outfile.csv looks like this:


```html
Date,Store,Sales,Promo
2015-07-31,1,5263,1
2015-07-31,2,6064,1
2015-07-31,3,8314,1
2015-07-31,4,13995,1
2015-07-31,5,4822,1
2015-07-31,6,5651,1
2015-07-31,7,15344,1
2015-07-31,8,8492,1
2015-07-31,9,8565,1
```

Note that we also used the find-and-replace from the same [link](../../preprocessing/selecting) using ```awk``` to replace all the double-quotes (") by an empty string (basically remove all double-quotes)


#### Step 1.2 - Prepare data for DeepAR

From [this link](../../preprocessing/deepar/), you can create a new python file with the following contents:

```python
import pandas as pd
import jsonlines
from sklearn import preprocessing
le = preprocessing.LabelEncoder()


series = pd.read_csv('outfile.csv', parse_dates=[0], index_col=0)
series.sort_index(inplace=True)

target_column = 'Sales'
group_column = 'Store'

for col in series.columns:
    if col !=target_column:
        series[col] = le.fit_transform(series[col])

if series[group_column].nunique()==1:
    a = [series]
else:
    a = [v for k, v in series.groupby(group_column)]

out = []

for i in range(len(a)):
    dynamic_feat = []
    cat = []
    for col in a[0].columns:
        if col == target_column:
            target = a[0][col].values.tolist()
            start = str(a[0].index[0])

        else:
            if a[0][col].nunique()>=2: #if 2 or more values, add as dynamic feature
                dynamic_feat.append(a[0][col].values.astype(float).tolist())
            elif a[0][col].nunique()==1: #if 1 value, add as category
                cat.append(int(a[0][col][0]))
    out.append({'start':start, 'target':target, 'cat':cat, 'dynamic_feat':dynamic_feat})
    
with jsonlines.open('train-data.jsonl', mode='w') as writer:
    writer.write_all(out)
```

> The only things we changed are the name of the input file ('outfile.csv'), the name of the target column and group column.

Save it as ```dataprep.py```, and run ```python dataprep.py```

After running this file, you should get an output file called ```train-data.jsonl``` which looks like:

```html
{"start": "2013-01-01 00:00:00", "target": [0, 5530, 4327, 4486, 4997, 0, 7176, 5580, 5471, 4892, 4881, 4952, 0, 4717, 3900, 4008, 4044, 4127, 5182, 0, 5394, 5720, 5578, 5195, 5586, 5598, 0, 4055, 3725, 4601, 4709, 5633, 5970, 0, 7032, 6049, 6140, 5499, 5681, 5370, 0, 4409, 4015, 4252, 4241, 4809, 6154, 0, 6407, 5386, 5660, 5261, 5000, 5237, 0, 4038, 3794, 4558, 4676, 4611, 5350, 0, 7675, 6300, 5973, 5637, 5853, 5578, 0, 4949, 3853, 4341, 5108, 4925, 5003, 0, 7072, 6563, 5598, 5179, 5506, 5603, 0, 6729, 6686, 6660, 7285, 0, 7132, 0, 0, 5484, 4625, 4293, 4390, 5075, 0, 6046, 5514, 4903, 4366, .......
```

### Step 2 - Training

From [this link](../../training/deepar) on training with DeepAR, we first upload our ```train-data.jsonl``` file to S3, and make a note of this ```path```. You can also click the file on the S3 console, and hit the ```Copy  Path``` button.

![](/images/copypath.png)

Since this is daily data, change the '1H' frequency in the hyperparameters to '1D'.

Again from [this link](../../training/deepar) on training with DeepAR, copy all the code cells in a python file, or use a local jupyter notebook (make sure you have the right permissions and have run ```aws configure```); you can also run the following cells in a SageMaker notebook.

In this example, we use a SageMaker notebook and add these cells:

![](/images/startrosstraining.png)

At the end of training, you will see the following output:

```html
.
.
.
2020-03-12 21:42:57 Uploading - Uploading generated training model
2020-03-12 21:42:57 Completed - Training job completed
Training seconds: 156
Billable seconds: 156
```

### Step 3 - Deploy model

From [this link](../../inference/deepar) on deploying a model trained with DeepAR, do

```python
predictor = estimator.deploy(initial_instance_count=1,instance_type='ml.m4.xlarge')
```

To forecast, follow instructions in the same [link](../../inference/deepar):

![](/images/predictrossdeepar.png)

### Done!










