### Run the app
`npm run dev`

### Credentials needed
- Fivetran API Key & Secret
- BigQuery Service Account key file `fivetran.json` with the necessary permissions (BigQuery User, BigQuery Metadata Viewer)
- (I can give you mine if you are insane enough to choose this app)


### Obsolete code
The app is not using Prisma or GraphQL anymore.

### Suggested improvements
- Use only payload not query parameters when calling the backend API
- There is a lot of repeated code in a lot of functions

### Missing features
- Editing the schema (hash/enable/disable columns) for multiple connectors at the same time
- Calculating actual MAR's 
- Estimating monthly billing
- Suggesting cost cutting measures to the users
- Improved date filtering