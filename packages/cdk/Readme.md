# Deployment using CDK

## Infrastructure

Project is hosted by Scaleway, provisioning is done via Terraform with CDK.

### Manual operations

* Create project on Scaleway
* Add relevant users to the projects with full access on project resources (and secret manager)
* Create an IAM Application with with full access on project resources (and secret manager) with credentials to use in CI / CD deployments
* Add your domain name, and another preview domain name, and validate it using DNS
* Add your email sending domain name and validate it using DNS
* Add secrets to the Secret manager (you will find them documented in .env.dist), with "web" or "project" tags, depending on which stack is using it.

### Project Stack

Project stack will deploy only on a pipeline triggered from the "infra" branch and will provision resources shared between all services of this project.


### Web App Stack

Web App Stack will deploy on every branch and provision all resources nessecary for a preview environment or production version of the app

## Helper commands

Update bucket CORS: `aws --profile=kime:scaleway:mon-suivi-social s3api put-bucket-cors --bucket mss-developer-unsafe-uploads --cors-configuration file://~/dev/anct/mss/packages/cdk/src/development-buckets-cors-rules.json`
