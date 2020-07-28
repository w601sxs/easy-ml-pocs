---
title: "Xgboost Training"
date: 2020-02-28T10:25:21-06:00
draft: false
algo: [xgboost]
---

Make sure you saw [this link](../../preprocessing/xgboost) for preprocessing first.

On a sagemaker notebook, initialize the estimator.

```python
from sagemaker.amazon.amazon_estimator import get_image_uri
container = get_image_uri(boto3.Session().region_name, 'xgboost')
```

As we are training with the CSV file format, we'll create s3_inputs that our training function can be used as a pointer to the files in S3.

```python
s3_input_train = sagemaker.s3_input(s3_data='s3://{}/{}/train'.format(bucket, prefix), content_type='csv')
s3_input_validation = sagemaker.s3_input(s3_data='s3://{}/{}/validation/'.format(bucket, prefix), content_type='csv')
```

Now, we can specify a few parameters like what type of training instances we'd like to use and how many, as well as our XGBoost hyper parameters. A few key hyper parameters are:

* max_depth controls how deep each tree within the algorithm can be built. Deeper trees can lead to better fit, but are more computationally expensive and can lead to overfitting. There is typically some trade-off in model performance that needs to be explored between a large number of shallow trees and a smaller number of deeper trees.
* subsample controls sampling of the training data. This technique can help reduce overfitting, but setting it too low can also starve the model of data.
* num_round controls the number of boosting rounds. This is essentially the subsequent models that are trained using the residuals of previous iterations. Again, more rounds should produce a better fit on the training data, but can be computationally expensive or lead to overfitting.
* eta controls how aggressive each round of boosting is. Larger values lead to more conservative boosting.
* gamma controls how aggressively trees are grown. Larger values lead to more conservative models.

More detail on XGBoost's hyper parameters can be found on their GitHub _page_ (https://github.com/dmlc/xgboost/blob/master/doc/parameter.md%22%20%5Ct%20%22_blank).

```python
sess = sagemaker.Session()

xgb = sagemaker.estimator.Estimator(container,
 role, 
 train_instance_count=1, 
 train_instance_type='ml.m4.xlarge',
 output_path='s3://{}/{}/output'.format(bucket, prefix),
 sagemaker_session=sess)

xgb.set_hyperparameters(max_depth=6,
 eta=0.2,
 gamma=5,
 min_child_weight=6,
 subsample=0.9,
 silent=0,
 objective='reg:linear',
 num_round=60)

xgb.fit({'train': s3_input_train, 'validation': s3_input_validation})
```

Done!
