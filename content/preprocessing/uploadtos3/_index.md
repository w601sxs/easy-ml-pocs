---
title: "Upload to s3"
date: 2020-02-07T01:00:21-05:00
draft: false
algo: [prep]
---

## Using Sagemaker session:

{{< highlight python  >}}
import sagemaker
sess = sagemaker.Session()
trainpath = sess.upload_data(
	path='train.csv', bucket='mybucket',
    key_prefix='sagemaker/input')
{{< / highlight >}}


## Using CLI:

{{< highlight html >}}
aws s3 cp ./train.csv s3://mybucket/sagemaker/input
{{< /highlight >}}
