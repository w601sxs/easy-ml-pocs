---
title: "Split dataset to Train and Test"
date: 2020-02-11T23:23:17-05:00
draft: false
algo: [prep]
---

### Files are in a folder, and I like linux commands

The easiest way to do this is using the linux ```awk``` command. Suppose you have a file called ```in.csv``` or a directory of files that look like 

```text
Folder
├── in1.csv
├── in2.csv
├── .
├── .
└── in2000.csv
```

... and assuming the delimiter used is a comma (,), and you want to select the first three columns, do


```html
!awk '{if( rand() <= 0.2){ print $0 > "test_data.csv"} else {print $0 > "train_data.csv"}}' Folder/in*csv
```

That's it!


To count the number of lines in the resulting csv files, do:

```html
wc -l <filename>
```


### How about in Python?
```python
from numpy.random import RandomState
import pandas as pd

df = pd.read_csv('C:/Dataset.csv')
rng = RandomState()

#For a 70-30 split
train = df.sample(frac=0.7, random_state=rng)
test = df.loc[~df.index.isin(train.index)]

train.to_csv('train.csv',index=False,header=False)
test.to_csv('test.csv',index=False,header=False)
```
