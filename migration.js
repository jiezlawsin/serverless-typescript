require('dotenv').config();

const { exec } = require('child_process');

module.exports = {
  migrateStatus: () => {
    exec(`npx sequelize db:migrate:status --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },

  generate: () => {

    exec(`npx sequelize migration:generate --name=${process.env.npm_config_name}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },

  migrate: () => {
    exec(`npx sequelize db:migrate --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  migrateRollback: () => {
    exec(`npx sequelize db:migrate:undo --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  migrateReset: () => {
    exec(`npx sequelize db:migrate:undo:all --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  seedGenerate: () => {
    exec(`npx sequelize seed:generate --name=${process.env.npm_config_name}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  seed: () => {
    exec(`npx sequelize db:seed:all --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  seedRollback: () => {
    exec(`npx sequelize db:seed:undo --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  seedReset: () => {
    exec(`npx sequelize db:seed:undo:all --env ${process.env.APP_ENV}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  },
  seedSpecificRollback: () => {
    exec(`npx sequelize db:seed:undo --env ${process.env.APP_ENV} --seed ${process.env.npm_config_name}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`${stdout}`);
      }

      console.log(`${stdout}`);
      console.warn(`${stderr}`);
    });
  }
};
