# Project Name

## Setup Instructions

### Environment Variables

This project requires a `.env` file to be created in the root directory. Below are the required environment variables:

```ini
NODE_ENV=
SERVER_HOST=
SERVER_PORT=
FRONTEND_URL=
ADMIN_FRONTEND_URL=

APP_ADMIN_MAIL=
APP_ADMIN_FIRST_NAME=
APP_ADMIN_LAST_NAME=
APP_ADMIN_PASSWORD=

OTP_EXPIRY=

JWT_SECRET=
JWT_LIFETIME=
ACCESS_TOKEN_EXPIRY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

DB_TYPE=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
DB_SYNCHRONIZE=
DB_LOGGING=
DB_ENTITIES=
DB_MIGRATIONS=
DB_SUBSCRIBERS=

EMAIL_SUBJECT=
EMAIL_FROM=
EMAIL_BODY=
FORGOT_EMAIL_SUBJECT=
FORGOT_EMAIL_FROM=
FORGOT_EMAIL_BODY=

AWS_SES_ACCESS_KEY_ID=
AWS_SES_SECRET_ACCESS_KEY=
AWS_SES_REGION=

AWS_S3_BUCKET_ACCESS_KEY_ID=
AWS_S3_BUCKET_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_REGION=
AWS_S3_BUCKET_NAME=
```

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-name>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install NestJS CLI:
   ```sh
   npm install -g @nestjs/cli
   ```
4. Create a `.env` file and add the required variables as shown above.
5. Start the application in development mode:
   ```sh
   npm run start:dev
   ```

### Contributing

Feel free to submit issues or pull requests!
