# easy-ml-pocs
Site for organizing and searching for reusable code samples related to building ML PoCs on AWS.
 
# General instructions:
- The only thing you will have to touch, really, is the content folder. Add/ clone/ modify existing folders and .md markdown files.

- To test locally, go to the root folder and do a 'hugo serve' and then head to localhost (link will be printed out in the output. 

- Commit and push once you are ready and the website will be built.

- Do a PR for major changes, push directly for minor ones.


## Add useful examples and organize within chapters
Then, create content pages inside the previously created chapter. Here are two ways to create content in a chapter with this hugo template:

> hugo new chapter/first-content.md

> hugo new chapter/second-content/_index.md

*So how do you use this to contribute examples?*

## If you want to contribute code:

1. Ask for access and clone repo
2. Select between preprocessing, training and inference
3. based on your selection above, create a new index file under this chapter and edit away. For example, to create a new preprocessing sub-chapter for personalize, do:

`hugo new preprocessing/personalize/_index.md'

4. Push update and wait for build

## Syntax-highlighting code blocks 

Insert code samples in a `{{< highlight >}}' block as shown below:

`{{< highlight python >}}
# INSERT CODE HERE
{{< /highlight >}}''

<br>
This gives you some more control like highlighting lines within an included code block.

Alternatively, use the simple git syntax

```python
# INSERT CODE HERE
``` 

## Remember to remove draft mode
On the page you edited, mark draft: false (will be true by default)
