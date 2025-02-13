import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export const retrieveLambdaConfig = async (lambdaSecret) => {
    try {
        const secretsManager = new SecretsManagerClient({ region: process.env.AWS_LAMBDA_REGION });
        const data = await secretsManager.send(new GetSecretValueCommand({ SecretId: lambdaSecret })) // fetch secret

        if (data.SecretString) {
            const parsedSecret = JSON.parse(data.SecretString)
            // Use parsedSecret safely here

            Object.keys(parsedSecret).forEach(key => {
                if (!process.env[key]) {
                    process.env[key] = parsedSecret[key]
                }
            })
            return data.SecretString
        } else {
            // Handle the case where SecretString is undefined
            console.error("Secret not retrieved successfully.")
        }

    } catch (error) {
        return null
    }
}