import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - AsiaShop',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AsiaShop</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${name}!</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            Thank you for creating an account with AsiaShop. To complete your registration, please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #64748b; line-height: 1.6; font-size: 14px;">
            If you're having trouble clicking the button, copy and paste the following link into your browser:
            <br>
            <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 14px;">
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create an account with AsiaShop, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password - AsiaShop',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AsiaShop</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1e293b; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            Hi ${name}, we received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; line-height: 1.6; font-size: 14px;">
            If you're having trouble clicking the button, copy and paste the following link into your browser:
            <br>
            <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; color: #64748b; font-size: 14px;">
          <p>This password reset link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendOrderConfirmationEmail(email: string, orderData: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AsiaShop</h1>
        </div>
        
        <div style="background-color: #f0fdf4; padding: 30px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #22c55e;">
          <h2 style="color: #166534; margin-top: 0;">Order Confirmed!</h2>
          <p style="color: #15803d; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your order. We'll send you a shipping confirmation email as soon as your items are on the way.
          </p>
          <p style="color: #15803d; font-weight: 500;">
            Order Number: ${orderData.orderNumber}
          </p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #1e293b; margin-top: 0;">Order Summary</h3>
          <!-- Order items would be listed here -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-weight: 500; font-size: 18px; color: #1e293b;">
              <span>Total: $${orderData.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to AsiaShop!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AsiaShop</h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1e293b; margin-top: 0;">Welcome to AsiaShop, ${name}!</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            Your email has been successfully verified. You can now enjoy all the features of your AsiaShop account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}