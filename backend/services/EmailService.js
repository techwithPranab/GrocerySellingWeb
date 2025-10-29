const nodemailer = require('nodemailer');
const twilio = require('twilio');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize Twilio client if credentials are provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `"Fresh Grocery Store" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request - Fresh Grocery Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #10B981; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Fresh Grocery Store</h1>
            </div>

            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                You have requested to reset your password. Please click the button below to reset your password.
                This link will expire in 1 hour for security reasons.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="background-color: #10B981; color: white; padding: 12px 30px;
                          text-decoration: none; border-radius: 5px; font-weight: bold;
                          display: inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request this password reset, please ignore this email.
                Your password will remain unchanged.
              </p>

              <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #10B981;">${resetUrl}</a>
              </p>
            </div>

            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                © 2025 Fresh Grocery Store. All rights reserved.
              </p>
            </div>
          </div>
        `,
        text: `
          Password Reset Request - Fresh Grocery Store

          You have requested to reset your password. Please visit the following link to reset your password:
          ${resetUrl}

          This link will expire in 1 hour for security reasons.

          If you didn't request this password reset, please ignore this email.
          Your password will remain unchanged.

          © 2025 Fresh Grocery Store. All rights reserved.
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: `"Fresh Grocery Store" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Welcome to Fresh Grocery Store!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #10B981; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Fresh Grocery Store</h1>
            </div>

            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Welcome ${name}!</h2>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining Fresh Grocery Store! We're excited to have you as part of our community.
              </p>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Start shopping for fresh, organic groceries delivered right to your doorstep.
                Use code <strong>WELCOME20</strong> for 20% off on your first order!
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/products"
                   style="background-color: #10B981; color: white; padding: 12px 30px;
                          text-decoration: none; border-radius: 5px; font-weight: bold;
                          display: inline-block;">
                  Start Shopping
                </a>
              </div>
            </div>

            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                © 2025 Fresh Grocery Store. All rights reserved.
              </p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  async sendOrderConfirmationEmail(email, orderDetails) {
    try {
      const mailOptions = {
        from: `"Fresh Grocery Store" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Order Confirmation - ${orderDetails.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #10B981; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Fresh Grocery Store</h1>
            </div>

            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Order Confirmed!</h2>

              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your order! Your order has been confirmed and is being processed.
              </p>

              <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">Order Details</h3>
                <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
                <p><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
                <p><strong>Estimated Delivery:</strong> ${new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/orders/${orderDetails._id}"
                   style="background-color: #10B981; color: white; padding: 12px 30px;
                          text-decoration: none; border-radius: 5px; font-weight: bold;
                          display: inline-block;">
                  Track Order
                </a>
              </div>
            </div>

            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                © 2025 Fresh Grocery Store. All rights reserved.
              </p>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      if (!this.twilioClient) {
        console.warn('Twilio client not configured, skipping SMS send');
        return false;
      }

      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      console.log('SMS sent:', result.sid);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  }

  async sendOrderConfirmationSMS(phone, orderDetails) {
    try {
      const message = `Fresh Grocery: Order ${orderDetails.orderNumber} confirmed! Total: ₹${orderDetails.total}. Track at: ${process.env.FRONTEND_URL || 'http://localhost:3001'}/orders/${orderDetails._id}`;
      await this.sendSMS(phone, message);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation SMS:', error);
      throw error;
    }
  }

  async sendPasswordResetSMS(phone, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
      const message = `Fresh Grocery: Reset your password: ${resetUrl}. Link expires in 1 hour.`;
      await this.sendSMS(phone, message);
      return true;
    } catch (error) {
      console.error('Error sending password reset SMS:', error);
      throw error;
    }
  }

  async sendLowStockAlertSMS(phone, productName, currentStock) {
    try {
      const message = `Fresh Grocery Alert: ${productName} is low on stock (${currentStock} remaining). Please restock soon.`;
      await this.sendSMS(phone, message);
      return true;
    } catch (error) {
      console.error('Error sending low stock alert SMS:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
