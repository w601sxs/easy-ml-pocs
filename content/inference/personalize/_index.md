---
title: "Personalize inference"
date: 2020-03-11T14:54:49-04:00
draft: false
---

Make sure you saw [this link](../../training/personalize) for training first

### Create a Campaign
If you’re happy with the model you created, you can create a campaign in order to deploy it. A campaign is used to make recommendations for your users. You create a campaign by deploying a solution version.

#### python
```python
response = personalize.create_campaign(
    name = 'my-personalize-campaign',
    solutionVersionArn = 'solution_version_arn',
    minProvisionedTPS = 10)

campaign_arn = response['campaignArn']
```

#### CLI
```html
aws personalize create-campaign --name my-personalize-campaign \
--solution-arn $SOLUTION_ARN --update-mode AUTO
```

After you have created your campaign, use it to make recommendations.
