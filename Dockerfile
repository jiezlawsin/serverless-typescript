FROM public.ecr.aws/lambda/nodejs:18.2023.11.18.01-x86_64

COPY node_modules ./
COPY dist ./

# You can overwrite command in `serverless.yml` template
# CMD ["functions/auth/login.handler"]
