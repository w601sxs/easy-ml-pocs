---
title: "Rekognition Classification training"
date: 2020-02-07T00:15:15-05:00
draft: false
---

Make sure you've seen [this](../../preprocessing/rekogscenes) if you need help creating a dataset first! If you already have a usable dataset, follow along here to train a custom model:

Once you have a dataset, you can start by creating a project.

### Create a project

> Navigate to Rekognition on the console and click "Amazon Rekognition":

![](/images/navigatetorekognition.png)

> Click **Use Custom Labels**

![](/images/clickcustomlabels.png)

> On the left sidebar / menu, click **projects**

![](/images/clickdatasetsmenu.png)

On the projects page click ```Create project```

> Provide a project name and click the **Create project** button

![](/images/createrekproject.png)

> Click **Train new model**

![](/images/trainnewmodel.png)

> Choose a training dataset in the dropdown, click **Split training dataset**, and click ```Train```

![](/images/splittrainingdatasets.png)

> Review your dataset, verify all folders have been imported as classes, and click ```Train model```

![](/images/verifyclassesandtrain.png)
