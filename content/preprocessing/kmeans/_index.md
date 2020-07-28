---
title: "Kmeans preprocessing"
date: 2020-03-02T17:46:34-05:00
draft: false
algo: [kmeans]
---

Per the [documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/k-means.html#km-inputoutput), "For training, the k-means algorithm expects data to be provided in the train channel (recommended S3DataDistributionType=ShardedByS3Key), with an optional test channel (recommended S3DataDistributionType=FullyReplicated) to score the data on. Both recordIO-wrapped-protobuf and CSV formats are supported for training. You can use either File mode or Pipe mode to train models on data that is formatted as recordIO-wrapped-protobuf or as CSV."

Using the python SDK for Sagemaker, there is a far simpler way to use KMeans (yes, even simpler than a CSV)

Assume you start with a CSV that looks like the following (this is sample data from s3://aws-ml-blog-sagemaker-census-segmentation)

```html
CensusId	State	County	TotalPop	Men		Women	Hispanic	White	Black	Native ...
0	1001	Alabama	Autauga	55221		26745	28476	2.6			75.8	18.5	0.4	...
1	1003	Alabama	Baldwin	195121		95314	99807	4.5			83.1	9.5		0.6	...
2	1005	Alabama	Barbour	26932		14497	12435	4.6			46.2	46.7	0.2 ...	
3	1007	Alabama	Bibb	22604		12073	10531	2.2			74.5	21.4	0.4	...
4	1009	Alabama	Blount	57710		28512	29198	8.6			87.9	1.5		0.3	...
```	


Read the CSV file

```python
import pandas as pd
data = pd.read_csv('data.csv', header=0, delimiter=",", low_memory=False)
```

Drop any column that has items that are NaN (Not a Number)

```python
data.dropna(inplace=True)
```

Consider doing one-hot-encoding or any other data preprocessing, but use this as  template for the minimal data preprocessing that you will need to do. (Optional) For example, you can use SKlearn to do some standard preprocessing like scaling:

```python
from sklearn.preprocessing import MinMaxScaler
scaler=MinMaxScaler()
data_scaled=pd.DataFrame(scaler.fit_transform(data))
data_scaled.columns=data.columns
data_scaled.index=data.index
```

Make sure your numerical values in the dataframe are Float values:

```python
train_data = data_scaled.values.astype('float32')
```

**Note** - Consider using the dataframe as is, since the next [training](../../training/kmeans) step will become easier. If you really need to convert to CSV, do:

```python
train_data.to_csv(index=False)
```

### Optional 

It is possible that you have a large number of columns in your training dataset; it is common practice to then use Principle Component Analysis to reduce the number of columns while retaining most of the information. We can use the Sagemaker built in PCA algorithm to achieve this. 

Using the train_data dataframe, you can do:

```python
from sagemaker import PCA
from sagemaker import get_execution_role
role = get_execution_role()
num_components=20

pca_SM = PCA(role=role,
             train_instance_count=1,
             train_instance_type='ml.c4.xlarge',
             output_path='s3://'+ bucket +'/counties/',
             num_components=num_components)
```

... and then train a PCA model:

```python
train_data = train_data.values.astype('float32')
pca_SM.fit(pca_SM.record_set(train_data))
```

This reduces the number of columns you have in your original dataset to ```num_components=20```

Once you are done training, store the new "components" in a new dataset, which will be your training dataset for Kmeans.

To do this, first deploy your model to Sagemaker, and then do a prediction:

```python
pca_predictor = pca_SM.deploy(initial_instance_count=1, instance_type='ml.t2.medium')
result = pca_predictor.predict(train_data)
```

Then recover your train dataset to be used with kmeans

```python
data_transformed=pd.DataFrame()
last_n = 5

for a in result:
    b=a.label['projection'].float32_tensor.values
    data_transformed=data_transformed.append([list(b)])
data_transformed.index=data_scaled.index #Note that this uses indexes from a dataframe we used in previous steps
data_transformed=data_transformed.iloc[:,-last_n:]
data_transformed.columns=PCA_list
```

The variable ```last_n``` controls the number of columns you want to use (here, we are using the last 5 columns of data). You can also use all columns of ```data_transformed``` as it is already a dataset with only 20 columns, whereas your original dataset for Kmeans may have been 100's or 1000's of columns.