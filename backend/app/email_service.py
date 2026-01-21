"""
Email Service Module for BiosciZone
Handles sending email notifications via SMTP (Gmail)
"""

import asyncio
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

from .config import settings

logger = logging.getLogger(__name__)


def is_smtp_configured() -> bool:
    """Check if SMTP is properly configured"""
    return bool(settings.SMTP_USER and settings.SMTP_PASSWORD)


async def send_email_async(
    to_emails: List[str],
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> bool:
    """
    Send email asynchronously via SMTP
    
    Args:
        to_emails: List of recipient email addresses
        subject: Email subject
        html_content: HTML body content
        text_content: Optional plain text fallback
    
    Returns:
        True if email sent successfully, False otherwise
    """
    if not is_smtp_configured():
        logger.warning("SMTP not configured, skipping email notification")
        return False
    
    if not to_emails:
        logger.info("No recipients provided, skipping email")
        return False
    
    try:
        import aiosmtplib
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
        msg["To"] = ", ".join(to_emails)
        
        # Add plain text version
        if text_content:
            msg.attach(MIMEText(text_content, "plain", "utf-8"))
        
        # Add HTML version
        msg.attach(MIMEText(html_content, "html", "utf-8"))
        
        # Send email
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        
        logger.info(f"Email sent successfully to {to_emails}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False


def send_email_background(
    to_emails: List[str],
    subject: str,
    html_content: str,
    text_content: Optional[str] = None
) -> None:
    """
    Send email in background (fire and forget)
    This is used from synchronous context
    """
    if not is_smtp_configured() or not to_emails:
        return
    
    try:
        # Create new event loop for background task
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(
            send_email_async(to_emails, subject, html_content, text_content)
        )
        loop.close()
    except Exception as e:
        logger.error(f"Background email failed: {str(e)}")


def create_feedback_notification_email(
    sender_name: str,
    sender_email: str,
    student_id: Optional[str],
    subject: str,
    message: str
) -> tuple[str, str, str]:
    """
    Create email content for feedback notification
    
    Returns:
        Tuple of (email_subject, html_content, text_content)
    """
    email_subject = f"[BiosciZone] Feedback mới từ {sender_name}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }}
            .header {{ background: linear-gradient(135deg, #0066CC, #0099FF); color: white; padding: 24px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 24px; }}
            .content {{ padding: 24px; }}
            .info-row {{ display: flex; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee; }}
            .info-label {{ font-weight: bold; color: #666; width: 120px; flex-shrink: 0; }}
            .info-value {{ color: #333; }}
            .message-box {{ background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 16px; }}
            .message-label {{ font-weight: bold; color: #666; margin-bottom: 8px; }}
            .message-content {{ color: #333; white-space: pre-wrap; line-height: 1.6; }}
            .footer {{ background-color: #f8f9fa; padding: 16px; text-align: center; color: #888; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📬 Có Feedback Mới!</h1>
            </div>
            <div class="content">
                <div class="info-row">
                    <span class="info-label">Họ tên:</span>
                    <span class="info-value">{sender_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:{sender_email}">{sender_email}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">MSSV:</span>
                    <span class="info-value">{student_id or 'Không có'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Chủ đề:</span>
                    <span class="info-value"><strong>{subject}</strong></span>
                </div>
                <div class="message-box">
                    <div class="message-label">Nội dung:</div>
                    <div class="message-content">{message}</div>
                </div>
            </div>
            <div class="footer">
                Email này được gửi tự động từ hệ thống BiosciZone.<br>
                Vui lòng đăng nhập vào Admin Panel để phản hồi.
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
[BiosciZone] Có Feedback Mới!

Họ tên: {sender_name}
Email: {sender_email}
MSSV: {student_id or 'Không có'}
Chủ đề: {subject}

Nội dung:
{message}

---
Email này được gửi tự động từ hệ thống BiosciZone.
Vui lòng đăng nhập vào Admin Panel để phản hồi.
    """
    
    return email_subject, html_content, text_content
