import {
  FORGOT_PASS_OTP_EMAIL_TEMPLATE,
  VERIFY_OTP_EMAIL_TEMPLATE,
} from 'src/common/email-templates';

export default {
  development: () => ({
    ormConfig: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      entities: [process.env.DB_ENTITIES],
      migrations: [process.env.DB_MIGRATIONS],
      subscribers: [process.env.DB_SUBSCRIBERS],
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
    },

    accountVerificationEmail: {
      subject: process.env.EMAIL_SUBJECT,
      fromEmail: process.env.EMAIL_FROM,
      emailBody: process.env.EMAIL_BODY,
      OTPTemplate: VERIFY_OTP_EMAIL_TEMPLATE,
    },

    forgotPasswordEmail: {
      subject: process.env.FORGOT_EMAIL_SUBJECT,
      fromEmail: process.env.FORGOT_EMAIL_FROM,
      emailBody: process.env.FORGOT_EMAIL_BODY,
      OTPTemplate: FORGOT_PASS_OTP_EMAIL_TEMPLATE,
    },

    server: {
      host: process.env.SERVER_HOST,
      port: process.env.SERVER_PORT,
    },
  }),

  production: () => ({
    ormConfig: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      replicas: [
        {
          host: 'database-1.cluster-ro-c7s2amci8ky2.us-east-2.rds.amazonaws.com', // Read replica 1
          port: parseInt(process.env.DB_PORT, 10),
        },
      ],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      entities: [process.env.DB_ENTITIES],
      migrations: [process.env.DB_MIGRATIONS],
      subscribers: [process.env.DB_SUBSCRIBERS],
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
    },

    accountVerificationEmail: {
      subject: process.env.EMAIL_SUBJECT,
      fromEmail: process.env.EMAIL_FROM,
      emailBody: process.env.EMAIL_BODY,
      OTPTemplate: VERIFY_OTP_EMAIL_TEMPLATE,
    },

    forgotPasswordEmail: {
      subject: process.env.FORGOT_EMAIL_SUBJECT,
      fromEmail: process.env.FORGOT_EMAIL_FROM,
      emailBody: process.env.FORGOT_EMAIL_BODY,
      OTPTemplate: FORGOT_PASS_OTP_EMAIL_TEMPLATE,
    },

    server: {
      host: process.env.SERVER_HOST,
      port: process.env.SERVER_PORT,
    },
  }),
};
