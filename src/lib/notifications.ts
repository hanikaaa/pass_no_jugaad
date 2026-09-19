/**
 * Email Notification Client
 * Dispatches real-time alerts to Super Admin (passnojugaadd@gmail.com)
 * and confirmation emails to buyers/organisers.
 */

export async function sendNotification(
  type: 'pass_request' | 'jugaad_signal' | 'event_submission',
  payload: Record<string, any>
): Promise<boolean> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to dispatch notification:', err);
    return false;
  }
}
