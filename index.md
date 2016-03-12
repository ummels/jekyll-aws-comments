---
layout: default
---

# Jekyll AWS Comments

Static comments for Jekyll with AWS Lambda and GitHub.

## Why?

Static web frameworks like [Jekyll](https://www.jekyllrb.com) offer many benefits compared to dynamic ones, such as faster response times and tightened security. However, some features are inherently difficult to realize using only static server code, such as giving users the opportunity to comment on articles or other content. While many publishers choose to circumvent this problem by embedding a [third](https://developers.facebook.com/products/social-plugins/comments/)-[party](https://disqus.com) [service](https://www.discourse.org) into their website, such services usually either require a monthly subscription or operate on the basis of advertisement and user tracking. Moreover, it is not clear whether and in what form it is possible to migrate user comments in the event such a service shuts down or decides to change its terms of use. Instead, given that many blogs are hosted on [GitHub](https://www.github.com), why not store comments together with the rest of the content in the repository? For us as the consumer of the comment, this is ideal because the comment is stored in the same format as the corresponding article and we can use regular Jekyll to generate the HTML output. However, this leaves open the question how the casual commenter can put her comment in the repository. If the commenter is familiar with Jekyll, she could certainly clone the repository and make a pull request. However, not everybody has a GitHub account, and the effort of cloning a repository and opening a pull request just to leave a comment on an article is way too high.

## What?

Using [AWS Lambda](https://aws.amazon.com/lambda/) and [Amazon API Gateway](https://aws.amazon.com/api-gateway/), we can automate the process of taking the raw comment as input by the user in a regular web form, converting it into the right format and opening a pull request on the source repository. If you as the site owner decide to merge the pull request, the comment is stored with your content in the repository and you are free to edit it afterwards with the rest of your content. Since Amazon only charges for calls to your API (and lambda function), you also only need to pay for each comment that is received and processed. In fact, if you only receive a moderate number of comments per month, the costs will be barely noticeable (and most likely be covered by the free tier during the first year).

## How?

[Setup](setup/).
