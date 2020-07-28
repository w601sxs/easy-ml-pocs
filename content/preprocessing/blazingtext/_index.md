---
title: "Blazingtext preprocessing"
date: 2020-02-07T00:15:04-05:00
draft: false
algo: [blazingtext]
---

From the Sagemaker example [here](https://github.com/awslabs/amazon-sagemaker-examples/blob/master/introduction_to_amazon_algorithms/blazingtext_text_classification_dbpedia/blazingtext_text_classification_dbpedia.ipynb)...

> BlazingText expects a preprocessed text files in S3 with space separated tokens and each line of the file should contain a single sentence and the corresponding label(s) prefixed by "__label__".

## What does this mean?
Let's say you have a CSV file with 2 columns,

```html
CATEGORY,Text of document 1
CATEGORY,Text of document 2
CATEGORY,Text of document 3
```

A "document" here can be a sentence, a paragraph or several paragraphs.

> Our recommendation is that you provide nothing more than a paragraph. If you have anything more than these two columns, drop them.


Read the file using ```pandas``` like this:

```python
import pandas as pd

data = pd.read_csv('documents.txt', names = {'category','text'})
```

Modify the category column and write out a preprocessed file:

```python
data.category  = '__' + data.category + '__'

import nltk
nltk.download('punkt')
data.text.apply(lambda x: ' '.join(nltk.word_tokenize(str.lower(x))))

# Don't include headers or indices
data.to_csv('out.csv',index=False,header=False)
```

Your CSV file that is ready for blazing text will now look like...

```html
__CATEGORY__,Text of document 1
__CATEGORY__,Text of document 2
__CATEGORY__,Text of document 3
```

*Note* : Repeat this for all files that is part of your dataset.

Upload ```out.csv``` to an S3 localtion that looks like ```s3://bucketname/train/out.csv```

Also see [this link](../splittesttrain) for information on how to split this output file into two files, for training and testing. 
