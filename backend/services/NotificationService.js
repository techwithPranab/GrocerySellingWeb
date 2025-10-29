const EmailService = require('./EmailService');

class NotificationService {
  // Send order confirmation notifications
  async sendOrderConfirmation(user, orderDetails) {
    const notifications = [];

    // Email notification
    if (user.email) {
      notifications.push(
        this.sendEmailNotification(
          'order_confirmation',
          user.email,
          'Order Confirmation - Fresh Grocery Store',
          { user, orderDetails }
        )
      );
    }

    // SMS notification
    if (user.phone) {
      notifications.push(
        this.sendSMSNotification(
          'order_confirmation',
          user.phone,
          { user, orderDetails }
        )
      );
    }

    // Send all notifications (don't fail if some fail)
    await Promise.allSettled(notifications);
  }

  // Send password reset notifications
  async sendPasswordReset(user, resetToken) {
    const notifications = [];

    // Email notification
    if (user.email) {
      notifications.push(
        this.sendEmailNotification(
          'password_reset',
          user.email,
          'Password Reset Request - Fresh Grocery Store',
          { user, resetToken }
        )
      );
    }

    // SMS notification
    if (user.phone) {
      notifications.push(
        this.sendSMSNotification(
          'password_reset',
          user.phone,
          { user, resetToken }
        )
      );
    }

    await Promise.allSettled(notifications);
  }

  // Send welcome notifications
  async sendWelcome(user) {
    const notifications = [];

    // Email notification
    if (user.email) {
      notifications.push(
        this.sendEmailNotification(
          'welcome',
          user.email,
          'Welcome to Fresh Grocery Store!',
          { user }
        )
      );
    }

    await Promise.allSettled(notifications);
  }

  // Send low stock alerts (to admin)
  async sendLowStockAlert(adminUsers, productName, currentStock) {
    const notifications = [];

    for (const admin of adminUsers) {
      // Email notification
      if (admin.email) {
        notifications.push(
          this.sendEmailNotification(
            'low_stock_alert',
            admin.email,
            'Low Stock Alert - Fresh Grocery Store',
            { admin, productName, currentStock }
          )
        );
      }

      // SMS notification
      if (admin.phone) {
        notifications.push(
          this.sendSMSNotification(
            'low_stock_alert',
            admin.phone,
            { admin, productName, currentStock }
          )
        );
      }
    }

    await Promise.allSettled(notifications);
  }

  // Generic email notification sender
  async sendEmailNotification(type, email, subject, data) {
    try {
      switch (type) {
        case 'order_confirmation':
          await EmailService.sendOrderConfirmationEmail(email, data.orderDetails);
          break;
        case 'password_reset':
          await EmailService.sendPasswordResetEmail(email, data.resetToken);
          break;
        case 'welcome':
          await EmailService.sendWelcomeEmail(email, data.user.name);
          break;
        case 'low_stock_alert':
          // For low stock, we need to create a custom email
          await this.sendLowStockAlertEmail(email, data);
          break;
        default:
          console.warn(`Unknown email notification type: ${type}`);
      }
    } catch (error) {
      console.error(`Failed to send ${type} email to ${email}:`, error);
      // Don't throw - we don't want notification failures to break the main flow
    }
  }

  // Generic SMS notification sender
  async sendSMSNotification(type, phoneNumber, data) {
    try {
      switch (type) {
        case 'order_confirmation':
          await EmailService.sendOrderConfirmationSMS(phoneNumber, data.orderDetails);
          break;
        case 'password_reset':
          await EmailService.sendPasswordResetSMS(phoneNumber, data.resetToken);
          break;
        case 'low_stock_alert':
          await EmailService.sendLowStockAlertSMS(phoneNumber, data.productName, data.currentStock);
          break;
        default:
          console.warn(`Unknown SMS notification type: ${type}`);
      }
    } catch (error) {
      console.error(`Failed to send ${type} SMS to ${phoneNumber}:`, error);
      // Don't throw - we don't want notification failures to break the main flow
    }
  }

  // Custom low stock alert email
  async sendLowStockAlertEmail(email, data) {
    try {
      const mailOptions = {
        from: `"Fresh Grocery Store" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Low Stock Alert - Fresh Grocery Store',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #EF4444; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">⚠️ Low Stock Alert</h1>
            </div>

            <div style="padding: 30px; background-color: #f9f9f9;">
              <p style="color: #666; line-height: 1.6;">
                This is an automated alert from Fresh Grocery Store inventory management system.
              </p>

              <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #EF4444;">
                <h3 style="margin-top: 0; color: #333;">Stock Alert Details</h3>
                <p><strong>Product:</strong> ${data.productName}</p>
                <p><strong>Current Stock:</strong> ${data.currentStock} units</p>
                <p><strong>Status:</strong> <span style="color: #EF4444; font-weight: bold;">LOW STOCK</span></p>
              </div>

              <p style="color: #666; line-height: 1.6;">
                Please restock this item as soon as possible to avoid stockouts and ensure smooth operations.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/admin/products"
                   style="background-color: #10B981; color: white; padding: 12px 30px;
                          text-decoration: none; border-radius: 5px; font-weight: bold;
                          display: inline-block;">
                  Manage Inventory
                </a>
              </div>
            </div>

            <div style="background-color: #333; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                © 2025 Fresh Grocery Store - Inventory Management System
              </p>
            </div>
          </div>
        `
      };

      await EmailService.transporter.sendMail(mailOptions);
      console.log('Low stock alert email sent to:', email);
    } catch (error) {
      console.error('Error sending low stock alert email:', error);
      throw error;
    }
  }

  // Send order status update notifications
  async sendOrderStatusUpdate(user, orderDetails, statusUpdate) {
    const notifications = [];

    // Email notification
    if (user.email) {
      notifications.push(
        this.sendEmailNotification(
          'order_status_update',
          user.email,
          `Order ${orderDetails.orderNumber} Status Update`,
          { user, orderDetails, statusUpdate }
        )
      );
    }

    // SMS notification
    if (user.phone) {
      notifications.push(
        this.sendSMSNotification(
          'order_status_update',
          user.phone,
          { user, orderDetails, statusUpdate }
        )
      );
    }

    await Promise.allSettled(notifications);
  }
}

module.exports = new NotificationService();
