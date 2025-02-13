pipeline {
    agent any
    tools {
        nodejs '20.18.3'
    }
    environment {
        AWS_ACCESS_KEY_ID = credentials('terraform_user')
        AWS_SECRET_ACCESS_KEY = credentials('terraform_user')
        AWS_ACCOUNT = credentials('aws-account')
        AWS_REGION = credentials('aws-region')
    }
    stages {
        stage('Set AWS Credentials') {
            steps {
                sh('aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID')
                sh('aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY')
                sh('aws configure set default.region $AWS_REGION')
            }
        }
        stage('Cleanup') {
            steps {
                echo('Pruning docker images...')
                sh 'docker image prune -a'
            }
        }
        stage('Dependencies') {
            steps {
                echo('Preparing dependecies...')
                sh 'npm ci'
            }
        }
        stage('Build') {
            steps {
                echo('Building ...')
                sh('npx gulp set --env development')
                sh('npx gulp deploy')
                sh('npx tsc')
                sh('npm run migrate')
                sh('npm run seed')
            }   
        }
        stage('Deployment') {
            steps {
                sh('npx sls deploy --stage=development')
            }
        }
    }
}