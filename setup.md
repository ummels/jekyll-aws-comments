---
layout: page
title: Setup
permalink: /setup/
---

Please go through the following steps to include Jekyll AWS Comments on your Jekyll site.

1.  [Download](https://github.com/ummels/jekyll-aws-comments/archive/master.zip) the sources and unzip them to a directory of your choice.

2.  If not already installed, install [Node.js](https://nodejs.org/en/download/). Then, from the directory into you have unzipped the sources, run `npm install` to install all dependencies and `npm install --global gulp-cli` to install the [Gulp](https://github.com/gulpjs/gulp) command-line interface.

3.  Rename the file `example_config.json` to `config.json` and edit it to match your site details:
    - `owner` is your GitHub username,
    - `repo` is the repository where you host the source code for your site,
    - `base` is the base (master) branch of your repository,
    - `credentials` can either be a combination of username and password or an OAuth token in the format:

    ```
    "credentials": {
      "token": "TOKEN" 
    }
    ```

    In order to receive a notification for your pull request, you should not use your own credentials, but create a _bot account_ and use corresponding credentials.
   
4.  Run the command `npm test` to test your setup. If you have configured everything correctly, a pull request against your repository should be generated and its URL should be printed. You can then run `gulp` to create the deployment package for AWS Lambda.

5.  If not done already, sign up for [Amazon Web Services](https://aws.amazon.com). Then head to the [IAM console](https://console.aws.amazon.com/iam/) and follow the steps in [Creating a Role for an AWS Service](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html#roles-creatingrole-service-console) in the [IAM User Guide](http://docs.aws.amazon.com/IAM/latest/UserGuide/) to create an IAM role called `lambda_basic_execution` (or some other unique name) for executing your Lambda function. When asked for the role type, select "AWS Lambda" from "AWS Service Roles", and when asked for a policy to be attached, select the "AWSLambdaBasicExecutionRole" policy.

6.  Go to [AWS Lambda](https://console.aws.amazon.com/lambda/) and click on "Get Started Now" or "Create a Lambda function" to create a new function. Skip the selection of a blueprint and fill out the configuration form. You should name your function `processComment` and upload the ZIP file called `dist.zip` created in Step 2 for the function code. For the Role, select the role you've created in the previous step. You may want to set the execution timeout to a higher value than the suggested 3 seconds.

7.  In order to call your Lambda function from the browser, we need to create an API endpoint and connect it to the function. So head to [API Gateway](https://console.aws.amazon.com/apigateway/) and click on "Create API" or "Get Started" to create a new API, which you can call "Comments" or any other name you like. Then click on "Create Method" and choose POST as the HTTP verb. On the next screen, select "Lambda Function" as the integration type, choose the right region and type in the name of your Lambda function: `processComment`. When the method has been created, click on "Method Response" and add a response for HTTP code 500. Go back to the method summary and click on "Integration Response". Add a response for the lambda error regex `.+` with method response status 500. Like this, when your Lambda function fails, you get a server error. Then go back to the root resource `/`, click on "Enable CORS" and confirm the following dialog so that your API endpoint can be called via AJAX. If you want to receive the correct error response in case of a failure, you also need to add the `Access-Control-Allow-Origin` response header to your method response for errors and a matching header mapping with value `'*'` to the corresponding integration response. Finally, deploy your API to a new stage and note the URL of your API endpoint.

8.  Now that your lambda function is set up, you probably want to create a comment form for your blog, which calls your API whenever a user enters a comment. Your form should include fields for name, email, website and the comment itself. If you use [JQuery](https://jquery.com), you can use the following code to make the request and handle the reply from your API:

    ```javascript
    $.ajax({
      type: 'POST',
      url: API_ENDPOINT_URL, // Put the URL of your API endpoint here
      contentType: 'application/json',
      data: JSON.stringify({
        name: NAME, // Name of the commenter
        email: EMAIL, // Email address of the commenter
        url: URL, // Web address of the commenter (optional)
        pageId: PAGE_ID, // ID of the relevant post or page
        comment: COMENT // Comment
      }),
      dataType: 'json',
      success: function (url) {
        // Inform the user of the pull request
      },
      error: function () {
        // Tell the user there was an error
      }
    });
    ```

    Make sure to send the right `pageId` (accessible in Liquid as `page.id`) with the request so that the comment can be attached to the right page.

9.  Finally, how useful is a comment that is stored on GitHub but not displayed on your blog? To display comments next to the post they belong to, copy the file `comments.rb` to `_plugins` and then modify your layout to iterate over the comments, which are stored in the Liquid variable `page.comments`. Each comment has the attributes `name` (name of the commenter), `mail_hash` (MD5 hash of the commenter's email address for use with [Gravatar](http://en.gravatar.com)), `homepage` (URL for linking to the commenter's homepage), `date` (time and date of submission) and `output` (the rendered comment). For instance, you can use the following code to display all relevant comments:

    {% raw %}
    ```html
    {% if page.comments %}
    <ul>
      {% for comment in page.comments %}
      <li>
        <div class="comment-author">
          <img src="https://secure.gravatar.com/avatar/{{ comment.mail_hash }}?s=60&amp;d=mm" alt="{{ comment.name }}">
          {% if comment.homepage %}
          <a href="{{ comment.homepage }}" class="commenter">{{ comment.name }}</a>
          {% else %}
          <span class="commenter">{{ comment.name }}</span>
          {% endif %}
        </div>
        <div class="comment-meta">
          <time datetime="{{ comment.date | date_to_xmlschema }}">{{ comment.date | date_to_string }}</time>
        </div>
        <div class="comment-content">
          {{ comment.output }}
        </div>
      </li>
      {% endfor %}
    </ul>
    {% endif %}
    ```
    {% endraw %}

    There is also a variable `page.comment_count` that contains the number of comments for the given page.

10. Redeploy your site and look forward to your first comment.
