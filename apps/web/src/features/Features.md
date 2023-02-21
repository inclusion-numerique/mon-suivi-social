# Features

Features are the value added of the application.
We aim for each feature to be :

* Tidy :
  * All files related to a feature must be in the same directory
* Safe :
  * A security rule (see security/rules.ts) that can apply to a grantee (user), with the same function being used in the frontend and backend to ensure consistency
  * The security rule is checked before presenting the feature to the user
  * The security rule is checked before querying or mutating data
* Typed :
  * The data type needed as an input for a feature is typed and validated (see data typing validation with Zod)
* Debuggable :
    * In case of error the monitoring is pinged (see sentry)


## Queries

If the feature is access to information (a view, an export, a detailed info page...) :

* Filtered :
  * The 'where' clause of the filters is colocated with the security rule
* Typed :
  * The return data is typed (see infering types from prisma queries)

## Mutations

If the feature's goal is to alter the state of the application (adding, updating, deleting data, ...)

* Auditable :
  * A function must be created to fetch the initial state that could be modified by the mutation
  * A function must be created to translate the initial state to the input data (form data / API data)
  * This info must be compared with the input data to compute the intent of diff of application state (see computing diff with deep-object-diff)
  * The diff will be used to create a mutation log data

* Transactional : 
  * All of none of the state change must be made
  * An Audit log with the diff must be created in the same transaction as the changes
