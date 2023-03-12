# Configuration

The services configuration used during build, deployment and run, is done via environment variables.

There is different levels of configuration, that can be shared for the project, or specific to each branch / preview environment.

## Public Project Configuration

Some of the configurations variable are available through the PublicProjectConfiguration.ts file.

## Project Environment Configuration

These env variables are shared for all branches of the project.

### For development environment
You should define them in the .env file at the root of the workspace.

### For CI / Build
They are set at the CI level and injected into jobs

### For deployment
They are set at the level of the container namespace and will be injected into every app runtime

## Project secrets

These env variables are sensitive data, only available through the Secret Manager

### For development environment

You should define your own variables for these values. Asked a team member to access to some if needed.

### For CI / Build
CI System has access to the Secret Manager for access to needed env variables during build

### For Deployment
They are set during infrastructure deployment at the level of the container namespace and will be injected into runtimes via encrypted secret environment variables.


## Branch specific environment Configuration
These env variables are specific to each branch / preview environment / dev environement/

They are non sensitive variables (e.g. name of the branch/preview environment) and secret variables (e.g. database credentials).
Non-sensitive variables are injected during build.

Sensitive variables are dynamicaly created and added to the Secret Manager by the CI system, then accessed using the secret manager when needed.


### For development environment
You should define them in the .env file at the root of the workspace.

### For CI / Build
They are computed and set during jobs.

### For deployment
They are set at the level of each container runtime environment 





