---
title: "Xgboost"
date: 2020-02-07T00:15:15-05:00
draft: false
---


# Using python

## Make some necessary imports

{{< highlight python  >}}
from sklearn import model_selection
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import pandas as pd
import numpy as np
{{< / highlight >}}

## Choose the column you want to predict

{{< highlight python  >}}
predictor_column_name = 'column-name'
{{< / highlight >}}

## Clean up the data

{{< highlight python  >}}
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
{{< / highlight >}}

## Split and write the data

{{< highlight python  >}}
train_data, validation_data, test_data = np.split(alldata, [int(0.7 * len(alldata)), int(0.9 * len(alldata))])

np.savetxt('train.csv', train_data, delimiter=',')
np.savetxt('validation.csv', validation_data, delimiter=',')
np.savetxt('test.csv', test_data, delimiter=',')
{{< / highlight >}}
