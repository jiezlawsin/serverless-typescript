# Serverless - AWS Node.js TypeScript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Summary

This is a project using TypeScript with AWS Lambda functions utilizing the Serverless framework.

## Installation/Deployment Instructions

### Requirements

- **NodeJS** `(v.22.14.0)`
- If using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you are using the correct Node version for local development and Lambda runtime compatibility.

### Installation

#### Using NPM

```sh
npm install
```

#### Using Yarn

```sh
yarn install
```

### Running Locally

To test functions locally, run:

```sh
npm run dev
```

### Invoking Lambda Locally

Invoke a Lambda function with the following command, replacing `myLambdaFunctionName` with the actual function name:

```sh
npx serverless invoke local --function myLambdaFunctionName --stage=local
```

## AWS Configuration

Ensure that your AWS credentials are configured properly. Check your current AWS configuration with:

```sh
aws sts get-caller-identity
```

To configure AWS credentials, run:

```sh
aws configure
```

Provide the AWS Access Key ID, Secret Access Key, and the appropriate region (e.g., `ap-southeast-1`).

## Project Structure

The source code is located in the `src` folder, structured as follows:

- `functions/` - Contains Lambda function code and configuration.
- `db/` - Contains Sequelize models, database connection, and stub data.
- `util/` - Contains utility functions used throughout the project.
- `libs/` - Contains shared logic used by multiple Lambda functions.
- `models/` - Defines data types for the project.
- `repositories/` - Contains repository patterns for managing data models.

## Third-Party Libraries

- [@serverless/typescript](https://github.com/serverless/typescript) - Provides TypeScript definitions for `serverless.yml`.
- [serverless-offline](https://github.com/dherault/serverless-offline) - Enables local execution of Serverless functions.
- [sequelize](https://www.npmjs.com/package/sequelize) - A promise-based ORM for PostgreSQL and other databases.

## Sequelize Migrations & Seeding

Refer to the [Sequelize Migrations Documentation](https://sequelize.org/docs/v6/other-topics/migrations/) for more details.

### Migrations

Set up the `.env` variable `APP_ENV` before running migrations.

- Generate a migration:

  ```sh
  npm run migration:generate --name=add_name_column_to_users_table
  ```

- Run migrations:

  ```sh
  npm run migrate
  ```

- Rollback the last migration:

  ```sh
  npm run migrate:rollback
  ```

- Reset all migrations:

  ```sh
  npm run migrate:reset
  ```

### Seeding

- Generate a seed file:

  ```sh
  npm run seed:generate --name=seed_data_to_pages_table
  ```

- Run seeders:

  ```sh
  npm run seed
  ```

- Rollback the last executed seed:

  ```sh
  npm run seed:rollback
  ```

- Reset all seeds:

  ```sh
  npm run seed:reset
  ```

- Rollback a specific seed file:

  ```sh
  npm run seed:specific:rollback --name=20240213033003-sample_seed.js
  ```

## Deployment

### Steps

1. Install Node.js version `14.18.x` using `nvm`.
2. Install dependencies:
   
   ```sh
   npm install
   ```

3. Ensure AWS credentials are properly configured.
4. Set the environment variables:

   ```sh
   npx gulp set --env {ENV}
   ```

5. Run database migrations:

   ```sh
   npm run migrate
   ```

6. Deploy using Serverless:

   ```sh
   npx sls deploy --stage=development
   ```

## Rolling Back a Serverless Deployment

### Steps

1. List previous deployments:

   ```sh
   npx sls deploy list --stage=development
   ```

2. Identify the desired rollback timestamp from the list, e.g.,

   ```
   2023-11-22 07:12:39 UTC
   Timestamp: 1699961858087
   Files:
     - compiled-cloudformation-template.json
     - myappserverless.zip
     - serverless-state.json
   ```

3. Roll back to a specific deployment:

   ```sh
   npx sls rollback --timestamp 1699961858087 --stage=development
   ```

4. If it's the first time deploying and you need to reset everything:

   ```sh
   npx sls remove --stage development
   ```


_Last updated: February 13, 2025 by Aries Lawsin_