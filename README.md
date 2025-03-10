## Setup Instructions

### 1. **Environment Variables**

Create a `.env` file in the root directory with the following variables:

```bash
# General
NODE_ENV = development

# Server
SERVER_HOST
SERVER_PORT
FRONTEND_URL

# OTP & JWT
OTP_EXPIRY (ms)
JWT_SECRET
JWT_LIFETIME

# Google OAuth 2.0
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
ACCESS_TOKEN_EXPIRY (ms)

# MySQL
DB_TYPE
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_DATABASE
DB_SYNCHRONIZE
DB_LOGGING
DB_ENTITIES
DB_MIGRATIONS
DB_SUBSCRIBERS


# Email Templates
EMAIL_SUBJECT
EMAIL_FROM
EMAIL_BODY

FORGOT_EMAIL_SUBJECT
FORGOT_EMAIL_FROM
FORGOT_EMAIL_BODY

HR_CONTACT_EMAIL_SUBJECT
HR_CONTACT_EMAIL_FROM
HR_CONTACT_EMAIL_BODY

# AWS
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_BUCKET
```

### 2. Project setup

Run this command in terminal to setup the project first.

```bash
$ npm install
```

### 3. Compile and run the project

Run this command in terminal to compile and run the project.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 4. Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
