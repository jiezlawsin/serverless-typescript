import * as pg from 'pg'
import { Sequelize, Transaction } from 'sequelize'
import { initModels } from '../models/init-models'
import { retrieveLambdaConfig } from '../functions/shared/retrieveLambdaConfig'
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

let DB: db
let DBTransaction: any
export class db {

    sequelize!: Sequelize
    User: any;

    constructor() {
        // Moved to init() 
    }

    async init() {
        if (process.env.APP_ENV !== 'local') {
            const secretsManager = new SecretsManagerClient({ region: process.env.AWS_LAMBDA_REGION });
            const secret = await secretsManager.send(new GetSecretValueCommand({ SecretId: process.env.AWS_LAMBDA_DBCONFIG_SECRET })) // fetch secret

            if (secret.SecretString) {
                const parsedSecret = JSON.parse(secret.SecretString)
                // Use parsedSecret safely here

                process.env.DB_HOST = parsedSecret.LAMBDA_DB_HOST
                process.env.DB_NAME = parsedSecret.LAMBDA_DB_NAME
                process.env.DB_USER = parsedSecret.LAMBDA_DB_USERNAME
                process.env.DB_PASSWORD = parsedSecret.LAMBDA_DB_PASSWORD
            } else {
                // Handle the case where SecretString is undefined
                console.error("Secret not retrieved successfully.")
            }
        }

        this.sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: "postgres",
            dialectModule: pg,
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }

        })
        initModels(this.sequelize)
        this.User = this.sequelize.models.User
    }

    async associate() {
        //associations here: Example below:
        // this.User.hasMany(this.ActivityLogs, { foreignKey: 'userSub' })
    }

    async seed() {
        // seeders here
    }

    async authenticate() {
        try {
            //Create associations
            await this.associate()
            //Sync DB
            // await this.sequelize.sync()
            //     .then(() => console.log('DB Connection established successfully.'))
            //     .catch(err => console.error(`DB Sequelize Connection Failed: ${err}`))

        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }


}

export const getDBInstance = async (initialize: boolean = false) => {
    if (!DB || DB === undefined || initialize) {
        DB = new db()
        await DB.init()
        await DB.authenticate()
        await DB.seed()
    } else {
        // console.log('DB Already Initialized)')
    }
    return DB
}

export const getTransaction = async (initialize: boolean = false) => {
    if (!DBTransaction || DBTransaction === undefined || initialize) {
        DBTransaction = await DB.sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        })
    }
    return DBTransaction
}