---
title: "Kmeans"
date: 2020-03-02T18:04:32-05:00
draft: false
---

Make sure you saw [this link](../../preprocessing/kmeans) for preprocessing first.


If your data is in a CSV, load it into a dataframe first:

```python
import pandas as pd
train_data = pd.read_csv('train_data.csv')
```

If you still have your dataframe in memory, replace ```train_data``` with your own dataframe. Next, initialize the Sagemaker KMeans estimator.

```python
from sagemaker import KMeans
from sagemaker import get_execution_role
role = get_execution_role()

num_clusters = 5
kmeans = KMeans(role=role,
                train_instance_count=1,
                train_instance_type='ml.c4.xlarge',
                output_path='s3://'+ bucket +'/output/',              
                k=num_clusters)

```

Ask a subject matter expert what number of groupings/buckets/clusters he/she expects this dataset to have and change the value of the variable ```num_clusters```.

Next, train your Kmeans model using the Sagemaker Python SDK:

```python
kmeans.fit(kmeans.record_set(train_data))
```

The ```record_set``` function in the Amazon SageMaker PCA model converts a numpy array into a record set format that is the required format for the input data to be trained. This is a requirement for all Amazon SageMaker built-in models. The use of this data type is one of the reasons that allows training of models within Amazon SageMaker to perform faster, for larger data sets compared with other implementations of the same models, such as the sklearn implementation.


It is possible that you have a large number of columns in your training dataset; it is common practice to then use Principle Component Analysis to reduce the number of columns while retaining most of the information. See [KMeans Preprocessing](../../preprocessing/kmeans) for more information on this.
