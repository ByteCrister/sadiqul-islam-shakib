export const html = (name: string, email: string, message: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>New Contact Request</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #2563eb; padding: 16px 24px; text-align: center;">
                <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">📩 New Contact Request</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 24px; color: #333333;">
                <p style="margin: 0 0 12px 0; font-size: 16px;">
                  You’ve received a new contact form submission:
                </p>

                <table cellspacing="0" cellpadding="0" style="width: 100%; margin-top: 12px;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
                    <td style="padding: 8px; color: #333;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 8px; color: #333;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                    <td style="padding: 8px; color: #333; line-height: 1.5;">
                      ${message.replace(/\n/g, "<br/>")}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #888;">
                This message was sent from your website contact form.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;
