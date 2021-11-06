This repository is a companion to "Deploying a Multi-Cloud API Gateway with Kong".

The demo mini-project for this post includes 3 microservices.

## Users Service

The Users service (found in `/users-service`) is a Node.js Express server that is meant to be deployed to Google App Engine. It makes use of Google Datastore (just for variety's sake), but the data could easily have been stored in a JSON file for simplicity.

## Orders Service

The Orders service (found in `/orders-service`) is a Node.js Express server that is meant to be bundled into a docker image, and then that image is pushed to AWS ECR, and then an AWS EC2 instance runs that docker image.

## Authentication Service

The Authentication service (found in `/auth-service`) is the code used for an AWS Lambda. Because this is not a single JavaScript file and there are dependencies (in `package.json`), all files and dependencies need to be zipped up and uploaded to AWS Lambda. With the AWS CLI, that would look like this:

```
cd auth-service

zip -r lambdafunc.zip \
index.js credentials.json package.json node_modules/

aws lambda update-function-code \
--function-name kong-multi-cloud-auth-service \
--zip-file=fileb://./lambdafunc.zip
```

This assumes that your Lambda is called `kong-multi-cloud-auth-service`, and it requires that you have proper AWS IAM credentials configured.

## kong.yml.template

A sample `kong.yml` declarative configuration file is also included, to show what it might look like to configure services and routes and these three services, along with JWT authentication and rate limiting plugins.
