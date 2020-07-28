---
title: "Xgboost preprocessing"
date: 2020-02-07T00:15:15-05:00
draft: false
algo: [xgboost]
---


### Pre-reqs
Make sure you have a CSV file with the column you want to predict along with other data columns or features, call it 'file.csv'

### Make some necessary imports

```python
from sklearn import model_selection
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import pandas as pd
import numpy as np
```

### Read data using pandas
```python
data = pd.read_csv('file.csv')
```

### Choose the column you want to predict

```python
predictor_column_name = 'column-name'
```

### Clean up the data

```python
# split data into X (features) and y (column you want to predict)
X = data.drop(predictor_column_name,axis=1)
Y = data[predictor_column_name]

# convert text labels (Y) into numbers
label_encoder = LabelEncoder()
label_encoder = label_encoder.fit(Y)
label_encoded_y = label_encoder.transform(Y)

# Convert features (X) to numbers
features = pd.get_dummies(X).values
alldata = np.vstack((label_encoded_y.T, features.T)).T

# Replace anything that is not a number with zero and infinity with large finite numbers
alldata = np.nan_to_num(alldata)
```

### Split and write the data

```python
train_data, validation_data, test_data = np.split(alldata, [int(0.7 * len(alldata)), int(0.9 * len(alldata))])

np.savetxt('train.csv', train_data, delimiter=',')
np.savetxt('validation.csv', validation_data, delimiter=',')
np.savetxt('test.csv', test_data, delimiter=',')
```

Upload these three files to three folders / prefixes on S3 using [this link](../uploadtos3/)