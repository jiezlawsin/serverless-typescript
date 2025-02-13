require("dotenv").config();
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
// import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
// const AWS = require("aws-sdk");
// AWS.config.region = process.env.AWS_LAMBDA_REGION;
// var lambda = new AWS.Lambda({ region: process.env.AWS_LAMBDA_REGION });
const returnSequelizeConfig = async () => {
  const secretsManager = new SecretsManagerClient({ region: process.env.AWS_LAMBDA_REGION });
  // const secretsManager = new AWS.SecretsManager();
  if (process.env.APP_ENV == "local") {
    return {
      local: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "postgres",
        seederStorage: "sequelize",
        seederStorageTableName: "SeederStorage"
      },
    };
  } else {
    const secret = await secretsManager.send(new GetSecretValueCommand({ SecretId: process.env.AWS_LAMBDA_SECRET })) // fetch secret

    // const secret = await secretsManager
    //   .getSecretValue({ SecretId: process.env.AWS_LAMBDA_SECRET }) // fetch secret
    //   .promise();
    const parsedSecret = JSON.parse(secret.SecretString);
    const environment = {};
    environment[process.env.APP_ENV] = {
      host: await decrypt(parsedSecret.LAMBDA_DB_HOST),
      database: await decrypt(parsedSecret.LAMBDA_DB_NAME),
      username: await decrypt(parsedSecret.LAMBDA_DB_USERNAME),
      password: await decrypt(parsedSecret.LAMBDA_DB_PASSWORD),
      dialect: "postgres",
      seederStorage: "sequelize",
      seederStorageTableName: "SeederStorage"
    };
    console.log('Running on ', process.env.APP_ENV)
    // console.log('ENVIRONMENT VARIABLES' , environment)
    return environment;
  }
};

const decrypt = async (value) => {
  const lambda = new LambdaClient({ region: process.env.AWS_LAMBDA_REGION });
  var params = {
    FunctionName: "decryption", // the lambda function we are going to invoke
    InvocationType: "RequestResponse",
    Payload: "{ \"value\": " + JSON.stringify(value) + "}"
  }

  // var request = lambda.invoke(params)
  // var response = await request.promise()
  // return JSON.parse(response.Payload)

  const invoke = new InvokeCommand(params)
  const response = await lambda.send(invoke)
  const responsePayload = Buffer.from(response.Payload).toString()
  return JSON.parse(responsePayload)

};

module.exports = returnSequelizeConfig;
