/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // --- API ROUTE: HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', time: new Date().toISOString() });
  });

  // --- API ROUTE: SEND SMTP EMAIL & GENERATE INVOICE MAIL ---
  app.post('/api/send-email', async (req: express.Request, res: express.Response) => {
    const { to, subject, html, smtpSettings } = req.body;

    if (!to || !subject || !html) {
      res.status(400).json({ error: 'Missing parameter: to, subject, or html body is required.' });
      return;
    }

    console.log(`[EMAIL DISPATCH] To: ${to} | Subject: "${subject}"`);

    // Check if the admin settings has enabled SMTP
    const smtp = smtpSettings || { isEnabled: false };

    if (smtp.isEnabled && smtp.host && smtp.port && smtp.email) {
      try {
        console.log(`[SMTP] Attempting connection to ${smtp.host}:${smtp.port} using user ${smtp.email}`);
        
        // Setup transporter
        // WARNING: Always handle credentials safely, do not expose keys
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: Number(smtp.port),
          secure: Number(smtp.port) === 465, // true for 465, false for 587
          auth: {
            user: smtp.email,
            pass: smtp.password || '', // SMTP email password (configured dynamically in admin panel of running container)
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const mailOptions = {
          from: `"Quirky Fruity Store" <${smtp.email}>`,
          to,
          subject,
          html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[SMTP] Real Email sent successfully! MessageID:', info.messageId);
        res.json({ success: true, message: 'SMTP email sent successfully.', messageId: info.messageId });
        return;
      } catch (err: any) {
        console.error('[SMTP ERROR] Failed to send real email. Falling back to log print.', err);
        res.json({
          success: true,
          warn: true,
          message: `Attempted real email via SMTP, but failed: ${err.message}. Printed email content to server log instead.`,
          logSimulated: true
        });
        return;
      }
    } else {
      // SMTP not configured or disabled by admin
      console.log('================================================================');
      console.log(`[SIMULATED EMAIL DISPATCH] (SMTP is not enabled in settings)`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`--- Email HTML Content ---`);
      console.log(html);
      console.log('================================================================');

      res.json({
        success: true,
        message: 'Email simulated and printed to terminal successfully. (Configure SMTP in settings to send real emails!)',
        simulated: true
      });
      return;
    }
  });

  // --- VITE MIDDLEWARE CONFIGURATION ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Mount Vite dev server middlewares
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OK] Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[CRITICAL] Server startup error:', error);
});
