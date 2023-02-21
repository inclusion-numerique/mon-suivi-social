
# Deployment using CDK

## Helper commands

Update bucket CORS: `aws --profile=kime:scaleway:mon-suivi-social s3api put-bucket-cors --bucket mss-developer-unsafe-uploads --cors-configuration file://~/dev/anct/mss/packages/cdk/src/development-buckets-cors-rules.json`
