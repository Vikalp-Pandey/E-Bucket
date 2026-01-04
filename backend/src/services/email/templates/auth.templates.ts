// M1: Templates using HTML string
// export interface LoginOTPData {
//   otp: string;
// }

// export function LoginOTPEmailTemplate(data: LoginOTPData) {
//   return `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//       <h2 style="color: #4CAF50;">Your One-Time Password (OTP)</h2>
//       <p>Use the following OTP to log in to your account:</p>
//       <div style="font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background-color: #f4f4f4; border-radius: 5px; text-align: center;">
//         ${data.otp}
//       </div>
//       <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
//       <p>If you did not request this OTP, please ignore this email.</p>
//       <br/>
//       <p>Best regards,<br/>The Team</p>
//     </div>
//   `;
// }

// export interface ForgotPasswordData {
//   resetLink: string;
// }

// export function ForgotPasswordEmailTemplate(data: ForgotPasswordData) {
//   return `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//       <h2 style="color: #4CAF50;">Password Reset Request</h2>
//       <p>We received a request to reset your password. Click the link below to set a new password:</p>
//       <div style="margin: 20px 0; text-align: center;">
//         <a href="${data.resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
//       </div>
//       <p>If you did not request a password reset, please ignore this email.</p>
//       <br/>
//       <p>Best regards,<br/>The Team</p>
//     </div>;
//   `;
// }


