#!/bin/bash

# Need to setup AWS CLI for this
# Install AWS CLI for Windows https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html
# Run "aws configure" in AWS CLI
# Enter the following
#  AWS Access Key ID: AWS_ACCESS_KEY_ID
#  AWS Secret Access Key: AWS_SECRET_ACCESS_KEY
#  Default region name: ap-southeast-1
#  Default output format: None

# make file executable
set -e

instructions ()
{
  echo "*********************************************"
  echo "Run this script as an npm task              *"
  echo "$ npm run deploy <env>                      *"
  echo "env: eg. dev, qa, uat, prod                 *"
  echo "for example: $ npm run deploy dev           *"
  echo "*********************************************"
}

if [ $# -eq 0 ]; then
  instructions
  exit 1
fi

# install packages
npm ci

# set env variables
npx gulp set --env $1
npx gulp deploy

npx tsc
# serverless deploy 
# npx sls deploy --stage=$1
npx sls deploy --stage=$1

# run database migrations
npm run migrate
npm run seed

echo "🚀 🚀 🚀 🚀 🚀 "

sleep 10
