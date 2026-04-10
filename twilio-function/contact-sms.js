/**
 * Twilio Function — receives contact form POST and sends formatted SMS to Brandi.
 *
 * SETUP:
 * 1. Sign up at twilio.com (free trial gives you $15 credit)
 * 2. Buy a phone number (~$1.15/month) — this is the "from" number
 * 3. Go to Functions & Assets → Services → Create Service (name it "brandi-website")
 * 4. Add a new function, path: /contact-sms
 * 5. Paste this code into the function editor
 * 6. In the service Settings → Environment Variables, add:
 *      BRANDI_PHONE = +18139247366
 *      TWILIO_FROM   = +1XXXXXXXXXX  (your purchased Twilio number)
 *      ALLOWED_ORIGIN = https://brandirininger.com
 * 7. Click "Deploy All"
 * 8. Copy the function URL and paste it into main.js (replace YOUR-TWILIO-FUNCTION-URL)
 *
 * Cost: ~$1.15/month for the phone number + $0.0079 per text sent.
 * A typical real estate site gets 10-30 leads/month = ~$1.40/month total.
 */

exports.handler = function (context, event, callback) {
  // CORS headers so the static site can POST here
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', context.ALLOWED_ORIGIN || 'https://brandirininger.com');
  response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');

  // Handle preflight
  if (event.request && event.request.method === 'OPTIONS') {
    response.setStatusCode(204);
    return callback(null, response);
  }

  // Parse the incoming data (Twilio Functions auto-parse JSON body)
  const name = event.name || 'Unknown';
  const phone = event.phone || 'Not provided';
  const email = event.email || '';
  const interest = event.interest_label || '';
  const timeline = event.timeline_label || '';
  const message = event.message || '';

  // Build the formatted text message
  let sms = `🏠 NEW LEAD from brandirininger.com\n\n`;
  sms += `Name: ${name}\n`;
  sms += `Phone: ${phone}\n`;
  if (email) sms += `Email: ${email}\n`;
  if (interest) sms += `Interest: ${interest}\n`;
  if (timeline) sms += `Timeline: ${timeline}\n`;
  if (message) sms += `\nMessage:\n${message}`;

  // Send the SMS via Twilio
  const client = context.getTwilioClient();
  client.messages
    .create({
      to: context.BRANDI_PHONE,
      from: context.TWILIO_FROM,
      body: sms,
    })
    .then(function (msg) {
      response.setStatusCode(200);
      response.setBody({ success: true, sid: msg.sid });
      callback(null, response);
    })
    .catch(function (err) {
      console.error('SMS send failed:', err);
      response.setStatusCode(500);
      response.setBody({ success: false, error: 'Failed to send message' });
      callback(null, response);
    });
};
