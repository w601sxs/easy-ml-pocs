---
title: "BlazingText Inference"
date: 2020-02-07T00:15:15-05:00
draft: false
algo: [blazingtext]
---

### Create Endpoint

If you followed the python instructions in [this link](../../training/blazingtext) to  train your BlazingText model, deploying your model is as simple as doing:

```python
text_classifier = bt_model.deploy(initial_instance_count = 1,instance_type = 'ml.m4.xlarge')
```

Otherwise, you can create a model and deploy it as an endpoint using the console as seen in the DeepAR example [here](../deepar)

### Predict 

You can pass in multiple set's of sentences to BlazingText to do a prediction, which requires the following JSON format to do a predict on the model you trained:

> From the docs, BlazingText supports application/json as the content-type for inference. The payload should contain a list of sentences with the key as "instances" while being passed to the endpoint.

```python
#Sample list of sentences ...
sentences = ["Convair was an american aircraft manufacturing company which later expanded into rockets and spacecraft.",
            "Berwick secondary college is situated in the outer melbourne metropolitan suburb of berwick ."]

# using the same nltk tokenizer that we used during data preparation for training
tokenized_sentences = [' '.join(nltk.word_tokenize(sent)) for sent in sentences]

payload = {"instances" : tokenized_sentences}

response = text_classifier.predict(json.dumps(payload))

predictions = json.loads(response)
print(json.dumps(predictions, indent=2))
```


By default, the model will return only one prediction, the one with the highest probability. For retrieving the top k predictions, you can set k in the configuration as shown below:

```python

payload = {"instances" : tokenized_sentences,
          "configuration": {"k": 2}}

response = text_classifier.predict(json.dumps(payload))

predictions = json.loads(response)
print(json.dumps(predictions, indent=2))
```
