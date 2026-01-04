import { ForgotPasswordData, LoginOTPData } from './templates/email.template';

interface LoginOTP {
  type: 'login_otp';
  data: LoginOTPData;
}

interface ForgotPassword {
  type: 'forgot_password';
  data: ForgotPasswordData;
}


export type MailTemplate = LoginOTP | ForgotPassword;

export interface EmailArgs {
  to: string | string[];
  subject: string;
  template: MailTemplate;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

