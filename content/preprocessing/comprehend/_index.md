---
title: "Comprehend preprocessing"
date: 2020-02-07T00:14:57-05:00
draft: false
---

From Comprehend [Custom Classifier](https://docs.aws.amazon.com/comprehend/latest/dg/how-document-classification-training.html), it supports two modes: multi-class and multi-label

In multi-class classification, each document can have one and only one class assigned to it. The individual classes are mutually exclusive.

In multi-label classification, individual classes represent different categories, but these categories are somehow related and are not mutually exclusive.

>Comprehend custom classifier expects training data with exactly two columns in each row. Column one is one of the possible labels, Column two is the content of the document itself.

### What does it mean?

Let's say you have a CSV file with 2 columns,


### Multi-Class Mode:

```html
Sample label 1,Text of document 1
Sample label2,Text of document 2
samplelabel3,Text of document 3
```

A "document" here can be a sentence, a paragraph or several paragraphs.

> Our recommendation is that you provide nothing more than a paragraph. If you have anything more than these two columns, drop them or join them into a single column.

For training dataset, the file format must conform to the following requirements:

  File has exactly two columns in each row. Column one is one of the possible labels, Column two is the content of the document itself.
  No header
  Format UTF-8, carriage return “\n”.

Labels must be uppercase, can be multi-token, have white space, consist of multiple words connected by underscores or hyphens, or may even contain a comma, as long as it is correctly escaped.


Read the file using ```pandas``` like this:

```python
import pandas as pd

data = pd.read_csv('file.csv', names = {'label','text'})

```

Modify the label column and write out a preprocessed file:

```python
data.label = data.label.upper()
data.label = data.label.replace (" ", "_")

# Don't include headers or indices
data.to_csv('out.csv',header=False,index=False,escapechar='\\',doublequote=False,quotechar='"')

```

Your CSV file that is ready for comprehend custom classifier training will now look like...

```html
SAMPLE_LABEL_1,Text of document 1
SAMPLE_LABEL2,Text of document 2
SAMPLELABEL3,Text of document 3
```


### Multi-Label Mode:

```html
Sample label 1|Sample label2,Text of document 1
Sample label2,Text of document 2
Sample label 1|Sample label2|samplelabel3,Text of document 3
```

A "document" here can be a sentence, a paragraph or several paragraphs.

> Our recommendation is that you provide nothing more than a paragraph. If you have anything more than these two columns, drop them or join them into a single column.

For training dataset, the file format must conform to the following requirements:

  File has exactly two columns in each row. Column one is one, many, or all of the possible labels, each separated by a delimiter chosen from the available options. The default delimiter is bar (|). Column two is the content of the document itself.
  No header
  Format UTF-8, carriage return “\n”.

Labels must be uppercase, can be multi-token, have white space, consist of multiple words connected by underscores or hyphens, or may even contain a comma, as long as it is correctly escaped.


Read the file using ```pandas``` like this:

```python
import pandas as pd

data = pd.read_csv('file.csv', names = {'label','text'})

```

Modify the label column and write out a preprocessed file:

```python
data.label = data.label.upper()
data.label = data.label.replace (" ", "_")

# Don't include headers or indices
data.to_csv('out.csv',header=False,index=False,escapechar='\\',doublequote=False,quotechar='"')

```

Your CSV file that is ready for comprehend custom classifier training will now look like...

```html
SAMPLE_LABEL_1|SAMPLE_LABEL2,Text of document 1
SAMPLE_LABEL2,Text of document 2
SAMPLE_LABEL_1|SAMPLE_LABEL2|SAMPLELABEL3,Text of document 3
```

*Note* : Repeat this for all files that is part of your dataset
