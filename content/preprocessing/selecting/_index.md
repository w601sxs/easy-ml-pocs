---
title: "Select, drop or extract Columns"
date: 2020-02-11T23:23:17-05:00
draft: false
---

# I am using a SQL database

Use SQL select before dumping out files for your ML project

```SQL
SELECT column1, column2 ,column3 INTO OUTFILE '/tmp/out.csv'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM my_table;
```

Or, use [Athena](https://docs.aws.amazon.com/athena/latest/ug/querying.html)


# Files are in a folder, and I like linux commands

The easiest way to do this is using the linux cut command. Suppose you have a file called ```in.csv``` or a directory of files that look like 

Folder
├── in1.csv
├── in2.csv
├── .
├── .
├── .
├── .
└── in2000.csv

... and assuming the delimiter used is a comma (,), and you want to select the first three columns, do

```html
cut -d "," -f1-3 Folder/in*.csv > outfile.csv
```

If you need a specific list of columns, do:

```html
cut -d "," -f1-10,20-25,30-33 Folder/in*.csv > outfile.csv
```

# How about in Python?
```python
import pandas as pd
df = pd.read_csv('in.csv')

#Select columns named column1 and column2
df[['column1', 'column2']].to_csv('out.csv')

#Or select using column number
df.iloc[:, 0:2].to_csv('out.csv')
```
