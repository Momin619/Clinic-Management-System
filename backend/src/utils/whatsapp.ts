// src/utils/whatsapp.ts
//
// ── WHATSAPP CONFIRMATION — SIMPLE wa.me APPROACH ────────────────────────────
//
// Strategy chosen: wa.me deep-link with a URL-encoded pre-filled message.
//
// How it works:
//   1. After a successful appointment creation, the service builds a wa.me link.
//   2. The link is returned inside the API response as `whatsappLink`.
//   3. The frontend (or clinic staff) clicks/opens the link → WhatsApp opens
//      with the confirmation message pre-filled and ready to send to the patient.
//
// Why this approach (for now):
//   • Zero external dependencies — no Twilio API keys, no webhooks, no cost.
//   • Works on any device (mobile deep-link, WhatsApp Web on desktop).
//   • Simple to extend: swap buildWhatsAppLink() output for a Twilio API call
//     later without touching service, controller, or route layers.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface WhatsAppLinkOptions {
  phone: string; // patient's phone, e.g. "+923001234567"
  patientName: string;
  doctorName: string;
  date: string; // human-readable date string
  time: string; // e.g. "10:30 AM"
}

/**
 * Builds a wa.me deep-link that opens WhatsApp with a pre-filled
 * appointment confirmation message addressed to the patient's number.
 *
 * @example
 * buildWhatsAppLink({
 *   phone: "+923001234567",
 *   patientName: "Ali Raza",
 *   doctorName: "Dr. Sara Ahmed",
 *   date: "Saturday, June 15, 2025",
 *   time: "10:30 AM",
 * });
 * // → "https://wa.me/923001234567?text=..."
 */
export const buildWhatsAppLink = ({
  phone,
  patientName,
  doctorName,
  date,
  time,
}: WhatsAppLinkOptions): string => {
  // wa.me requires digits only — strip spaces, dashes, parentheses, leading +
  const sanitizedPhone = phone.replace(/\D/g, "");

  const message = [
    `✅ *Appointment Confirmed*`,
    ``,
    `Dear ${patientName},`,
    `Your appointment has been successfully scheduled.`,
    ``,
    `👨‍⚕️ *Doctor:* ${doctorName}`,
    `📅 *Date:* ${date}`,
    `🕐 *Time:* ${time}`,
    ``,
    `Please arrive 10 minutes before your scheduled time.`,
    `For rescheduling or cancellations, please contact us in advance.`,
    ``,
    `Thank you for choosing our clinic. 🏥`,
  ].join("\n");

  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
};
