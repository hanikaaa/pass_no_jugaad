import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'passnojugaadd@gmail.com';
const SMTP_USER = process.env.SMTP_USER || process.env.GMAIL_USER || 'passnojugaadd@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, payload } = req.body || {};

    if (!type || !payload) {
      return res.status(400).json({ error: 'Missing type or payload' });
    }

    // Configure Transporter
    const transporter = nodemailer.createTransport(
      SMTP_HOST === 'smtp.gmail.com'
        ? {
            service: 'gmail',
            auth: SMTP_PASS
              ? {
                  user: SMTP_USER,
                  pass: SMTP_PASS.replace(/\s+/g, ''), // Strip spaces from Google App Password
                }
              : undefined,
          }
        : {
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: SMTP_PASS
              ? {
                  user: SMTP_USER,
                  pass: SMTP_PASS,
                }
              : undefined,
          }
    );

    const emailsToSend: { to: string; subject: string; html: string }[] = [];

    // ─── 1. Pass Request (Buyer Interest in Event) ────────────────
    if (type === 'pass_request') {
      const {
        eventName,
        buyerName,
        buyerEmail,
        buyerPhone,
        quantity,
        budgetMin,
        budgetMax,
        priorityNote,
        organiserEmail,
      } = payload;

      // Email to Super Admin
      emailsToSend.push({
        to: ADMIN_EMAIL,
        subject: `🔥 New Pass Request: ${eventName} - ${buyerName} (${quantity} passes)`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border-radius: 12px; overflow: hidden; border: 1px solid rgba(26,22,18,0.1);">
            <div style="background: #7A1F2E; padding: 24px; color: #FAF7F2;">
              <h1 style="margin: 0; font-size: 22px; font-family: Georgia, serif;">Pass No Jugaad — New Pass Request</h1>
              <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">A buyer has shown direct interest for passes.</p>
            </div>
            <div style="padding: 24px; color: #1A1612;">
              <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid rgba(26,22,18,0.08); margin-bottom: 20px;">
                <h2 style="margin: 0 0 12px; font-size: 18px; color: #C1440E;">🎪 ${eventName}</h2>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Buyer:</strong></td><td style="padding: 6px 0;">${buyerName}</td></tr>
                  <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Email:</strong></td><td style="padding: 6px 0;"><a href="mailto:${buyerEmail}" style="color: #C1440E;">${buyerEmail}</a></td></tr>
                  ${buyerPhone ? `<tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Phone:</strong></td><td style="padding: 6px 0;"><a href="tel:${buyerPhone}" style="color: #2D7A4F; font-weight: bold;">${buyerPhone}</a></td></tr>` : ''}
                  <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Pass Quantity:</strong></td><td style="padding: 6px 0;"><strong>${quantity} Passes</strong></td></tr>
                  <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Budget:</strong></td><td style="padding: 6px 0;">₹${budgetMin} – ₹${budgetMax} per pass</td></tr>
                  ${priorityNote ? `<tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Buyer Note:</strong></td><td style="padding: 6px 0; color: #7A1F2E;">${priorityNote}</td></tr>` : ''}
                  <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Time:</strong></td><td style="padding: 6px 0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
                </table>
              </div>
              <p style="font-size: 13px; color: #6B5B52; line-height: 1.5;">
                Log in to the <a href="https://passnojugaad.in" style="color: #C1440E; font-weight: bold;">Super Admin Dashboard</a> to match this buyer with available organiser passes.
              </p>
            </div>
          </div>
        `,
      });

      // Confirmation Email to Buyer
      if (buyerEmail) {
        emailsToSend.push({
          to: buyerEmail,
          subject: `🎟️ We received your request for ${eventName} | Pass No Jugaad`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border-radius: 12px; overflow: hidden; border: 1px solid rgba(26,22,18,0.1);">
              <div style="background: #1A1612; padding: 24px; color: #FAF7F2; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-family: Georgia, serif;">Pass No Jugaad</h1>
                <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.8;">Ahmedabad's Navratri Discovery & Jugaad Platform</p>
              </div>
              <div style="padding: 24px; color: #1A1612;">
                <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${buyerName || 'Garba Lover'}</strong>,</p>
                <p style="font-size: 14px; color: #6B5B52; line-height: 1.6; margin: 0 0 20px;">
                  We have received your pass requirement for <strong>${eventName}</strong>. Our matchmaking team is actively checking verified organiser allocations and seller drops.
                </p>
                <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid rgba(26,22,18,0.08); margin-bottom: 20px;">
                  <h3 style="margin: 0 0 10px; font-size: 15px; color: #C1440E;">Summary of your request:</h3>
                  <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1A1612; line-height: 1.8;">
                    <li><strong>Event:</strong> ${eventName}</li>
                    <li><strong>Passes requested:</strong> ${quantity}</li>
                    <li><strong>Target Budget:</strong> ₹${budgetMin} – ₹${budgetMax}</li>
                    ${buyerPhone ? `<li><strong>Phone:</strong> ${buyerPhone}</li>` : ''}
                    ${priorityNote ? `<li><strong>Your note:</strong> ${priorityNote}</li>` : ''}
                  </ul>
                </div>
                <p style="font-size: 13px; color: #6B5B52; line-height: 1.5; margin: 0 0 20px;">
                  You will receive an email as soon as verified passes matching your budget become available.
                </p>
                <p style="font-size: 12px; color: #9A8B82; border-top: 1px solid rgba(26,22,18,0.08); padding-top: 14px; margin: 0;">
                  Questions? Reply directly to this email at <a href="mailto:passnojugaadd@gmail.com" style="color: #C1440E;">passnojugaadd@gmail.com</a>.
                </p>
              </div>
            </div>
          `,
        });
      }

      // Email to Event Organiser (if registered contact available)
      if (organiserEmail && organiserEmail !== ADMIN_EMAIL) {
        emailsToSend.push({
          to: organiserEmail,
          subject: `⚡ New Buyer Interested in Passes: ${eventName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
              <h2 style="color: #7A1F2E; margin-top: 0;">Pass No Jugaad — Incoming Buyer Lead</h2>
              <p style="font-size: 14px; color: #1A1612;">A buyer is actively looking for passes to your event <strong>${eventName}</strong>.</p>
              <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 4px 0; font-size: 13px;"><strong>Buyer Name:</strong> ${buyerName}</p>
                ${buyerPhone ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Buyer Phone:</strong> ${buyerPhone}</p>` : ''}
                <p style="margin: 4px 0; font-size: 13px;"><strong>Quantity:</strong> ${quantity} passes</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>Willing Budget:</strong> ₹${budgetMin} – ₹${budgetMax}</p>
              </div>
              <p style="font-size: 13px; color: #6B5B52;">Log in to your Organiser Hub on <a href="https://passnojugaad.in">passnojugaad.in</a> to view full details.</p>
            </div>
          `,
        });
      }
    }

    // ─── 2. Radar / Jugaad Signal Submission ──────────────────────
    else if (type === 'jugaad_signal') {
      const {
        buyerName,
        buyerEmail,
        buyerPhone,
        preferredDates,
        numPasses,
        budgetMin,
        budgetMax,
        eventTypes,
        artistPreference,
        specificEvent,
        readiness,
      } = payload;

      emailsToSend.push({
        to: ADMIN_EMAIL,
        subject: `📡 New Radar Signal from ${buyerName} (${numPasses} passes, ${readiness})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
            <h2 style="color: #C1440E; margin-top: 0;">New Radar Signal Logged</h2>
            <table style="width: 100%; font-size: 14px;">
              <tr><td><strong>Buyer:</strong></td><td>${buyerName} (${buyerEmail})</td></tr>
              ${buyerPhone ? `<tr><td><strong>Phone:</strong></td><td><a href="tel:${buyerPhone}" style="color: #2D7A4F; font-weight: bold;">${buyerPhone}</a></td></tr>` : ''}
              <tr><td><strong>Dates:</strong></td><td>${preferredDates?.join(', ') || 'Any'}</td></tr>
              <tr><td><strong>Passes:</strong></td><td>${numPasses}</td></tr>
              <tr><td><strong>Budget:</strong></td><td>₹${budgetMin} – ₹${budgetMax}</td></tr>
              <tr><td><strong>Vibes:</strong></td><td>${eventTypes?.join(', ') || 'Any'}</td></tr>
              <tr><td><strong>Artist Preference:</strong></td><td>${artistPreference || 'None'}</td></tr>
              <tr><td><strong>Specific Event:</strong></td><td>${specificEvent || 'None'}</td></tr>
              <tr><td><strong>Readiness:</strong></td><td>${readiness}</td></tr>
            </table>
          </div>
        `,
      });

      if (buyerEmail) {
        emailsToSend.push({
          to: buyerEmail,
          subject: `✨ Your Jugaad Signal is Active on Radar | Pass No Jugaad`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
              <h2 style="color: #C1440E; margin-top: 0;">We're tracking passes for you!</h2>
              <p>Hi ${buyerName || 'there'}, your requirement for ${numPasses} passes on ${preferredDates?.join(', ') || 'Navratri dates'} has been pinned on our Radar.</p>
              <p>Whenever organisers post allocations matching your budget (₹${budgetMin}–₹${budgetMax}), we will alert you immediately!</p>
            </div>
          `,
        });
      }
    }

    // ─── 3. Event Submission by Organiser ─────────────────────────
    else if (type === 'event_submission') {
      const {
        name,
        venue,
        date,
        priceMin,
        priceMax,
        contactEmail,
        contactPhone,
        artist,
        hasArtistImage,
        instagramLink,
      } = payload;

      emailsToSend.push({
        to: ADMIN_EMAIL,
        subject: `⏳ New Event Pending Review: ${name} @ ${venue}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px;">
            <h2 style="color: #7A1F2E; margin-top: 0;">Event Submitted for Approval</h2>
            <p><strong>Event:</strong> ${name}</p>
            <p><strong>Venue:</strong> ${venue}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Price:</strong> ₹${priceMin} – ₹${priceMax}</p>
            ${artist ? `<p><strong>Featured Artist:</strong> ${artist} ${hasArtistImage ? '(Photo attached)' : ''}</p>` : ''}
            <p><strong>Contact Email:</strong> <a href="mailto:${contactEmail}">${contactEmail}</a></p>
            ${contactPhone ? `<p><strong>Contact Phone:</strong> <a href="tel:${contactPhone}">${contactPhone}</a></p>` : ''}
            <p><strong>Instagram:</strong> ${instagramLink || '—'}</p>
            <p><a href="https://passnojugaad.in" style="display: inline-block; padding: 10px 18px; background: #C1440E; color: #fff; text-decoration: none; border-radius: 6px;">Open Super Admin Dashboard</a></p>
          </div>
        `,
      });
    }

    // ─── 4. User Signup Notification ──────────────────────────────
    else if (type === 'user_signup') {
      const { name, email } = payload;
      emailsToSend.push({
        to: ADMIN_EMAIL,
        subject: `👤 New User Signup: ${name || 'New User'} (${email})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; padding: 24px; border-radius: 12px; border: 1px solid rgba(26,22,18,0.1);">
            <div style="background: #1A1612; padding: 18px; border-radius: 8px; color: #FAF7F2; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 20px; font-family: Georgia, serif;">Pass No Jugaad — New Member</h2>
            </div>
            <p style="font-size: 15px; color: #1A1612;">A new user has just registered on the platform:</p>
            <table style="width: 100%; font-size: 14px; margin: 16px 0;">
              <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Name:</strong></td><td>${name || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Email:</strong></td><td><a href="mailto:${email}" style="color: #C1440E;">${email}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Role:</strong></td><td>Buyer / Seeker</td></tr>
              <tr><td style="padding: 6px 0; color: #6B5B52;"><strong>Timestamp:</strong></td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
          </div>
        `,
      });
    }

    // ─── 5. Event Approved Notification to Organiser ───────────────
    else if (type === 'event_approved') {
      const { eventName, organiserEmail, date, venue } = payload;
      if (organiserEmail) {
        emailsToSend.push({
          to: organiserEmail,
          subject: `🎉 Your Event is Approved & Live on Pass No Jugaad: ${eventName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border-radius: 12px; overflow: hidden; border: 1px solid rgba(26,22,18,0.1);">
              <div style="background: #2D7A4F; padding: 24px; color: #FAF7F2;">
                <h1 style="margin: 0; font-size: 22px; font-family: Georgia, serif;">Event Approved & Published!</h1>
                <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Your event is now live for attendees to discover and request passes.</p>
              </div>
              <div style="padding: 24px; color: #1A1612;">
                <h2 style="margin: 0 0 10px; font-size: 20px; color: #1A1612;">🎪 ${eventName}</h2>
                <p style="margin: 0 0 16px; font-size: 14px; color: #6B5B52;">${date ? `📅 ${date}` : ''} ${venue ? `· 📍 ${venue}` : ''}</p>
                <div style="background: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid rgba(26,22,18,0.08); margin-bottom: 20px;">
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1A1612;">
                    Your event has passed review by our curation team. Pass seekers in Ahmedabad can now view your listing and submit pass requests.
                  </p>
                </div>
                <p style="font-size: 13px; color: #6B5B52; line-height: 1.5;">
                  Manage your incoming pass requests in the <a href="https://passnojugaad.in" style="color: #C1440E; font-weight: bold;">Organiser Dashboard</a>.
                </p>
              </div>
            </div>
          `,
        });
      }
    }

    // ─── 6. Event Rejected Notification to Organiser ───────────────
    else if (type === 'event_rejected') {
      const { eventName, organiserEmail, reason } = payload;
      if (organiserEmail) {
        emailsToSend.push({
          to: organiserEmail,
          subject: `Update regarding your event listing: ${eventName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border-radius: 12px; overflow: hidden; border: 1px solid rgba(26,22,18,0.1);">
              <div style="background: #7A1F2E; padding: 24px; color: #FAF7F2;">
                <h1 style="margin: 0; font-size: 20px; font-family: Georgia, serif;">Event Listing Status Update</h1>
              </div>
              <div style="padding: 24px; color: #1A1612;">
                <h2 style="margin: 0 0 10px; font-size: 18px; color: #1A1612;">🎪 ${eventName}</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #6B5B52; margin: 0 0 16px;">
                  Thank you for submitting your event to Pass No Jugaad. Our curation team reviewed your listing, and unfortunately it could not be approved at this time.
                </p>
                ${reason ? `
                  <div style="background: #ffffff; padding: 16px; border-radius: 8px; border-left: 4px solid #7A1F2E; margin-bottom: 20px;">
                    <div style="font-size: 12px; font-weight: bold; color: #7A1F2E; text-transform: uppercase; margin-bottom: 4px;">Reason from curation team:</div>
                    <div style="font-size: 14px; color: #1A1612;">${reason}</div>
                  </div>
                ` : ''}
                <p style="font-size: 13px; color: #6B5B52; line-height: 1.5;">
                  If you have updated details or questions, reply to <a href="mailto:passnojugaadd@gmail.com" style="color: #C1440E;">passnojugaadd@gmail.com</a> or resubmit via the Organiser Form.
                </p>
              </div>
            </div>
          `,
        });
      }
    }

    // Dispatch Emails via Nodemailer SMTP
    if (SMTP_PASS) {
      for (const email of emailsToSend) {
        await transporter.sendMail({
          from: `"Pass No Jugaad" <${SMTP_USER}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
        });
      }
      return res.status(200).json({ success: true, count: emailsToSend.length });
    } else {
      console.log('SMTP credentials not configured yet. Logged notifications:', emailsToSend);
      return res.status(200).json({
        success: true,
        message: 'SMTP credentials pending. Email payload recorded successfully.',
        emails: emailsToSend.map(e => ({ to: e.to, subject: e.subject })),
      });
    }
  } catch (error: any) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
