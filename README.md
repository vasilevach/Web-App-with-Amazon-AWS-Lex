# Voice Recognition Bot Web App with Amazon AWS Lex
Based on [Simple React Webpack Babel Starter Kit](https://github.com/alicoding/react-webpack-babel)

### Read the blog post


### To run

* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) installed in your system.

* Then install the dependencies:

```
npm install
```

* Run development server:

```
npm start
```

Open the web browser to `http://localhost:8888/`

## Steps to create the Lex Web App

### Set up a test bot

[AWS Lex documentation](http://docs.aws.amazon.com/lex/latest/dg/what-is.html) is explaining how to create a bot very well, so for this example I will go with the default “Order Flowers” bot
* Go to Services -> Artificial Intelligence -> Lex
* Click Create
* Choose the “Sample” : “Order flowers”
* Click Create
This bot has two utterances: “I would like to pick up flowers” and “I would like to order some flowers” which are more than enough to test.


### Set up AWS Cognito Account
This step might seem a bit of redundant at this point but, you will use this account a bit later so it is best if we just have it available while we are at the AWS console.

* Go to Cognito
* Click “Manage Your user pools”
* Create a new user pool, let’s say this one will be called “Lex”.
* Go to “users and Groups” on the left navigation
* Create a new user following the prompt
* Go to “Federated Identities” (it is located in the Header, on the left, next to the “User Pools” heading.
* If you don’t have on created: Create, I called mine “Lex”.
* I also enabled access to Unauthenticated identities, which should not be done, but I was ok for the “proof of concept” I was doing
* It will ask you to create a new IAM role, you click “Allow”
* Save the number you get provided
* Or if you already have one: click on it
* Click on “edit identity pool” and copy and paste the “Identity pool ID”


### Give your user access to Lex
* Go to IAM. (Services -> Security, Identity & Compliance -> IAM) and either create a new role or give one of the existing roles permissions to Lex.
* You can do that by going to Roles on the leftside menu, clicking on one of the existing roles (or the new one),  Permissions -> Managed Policies -> Attach Policy.
* Start typing in the filter “Lex..” and attach the “AmazonLexFullAccess” policy.
* Now return to Cognito, Create a group and attach the IAM role with Lex permissions to that group.

### Code
The code is in the repo.
