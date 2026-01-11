const WEBHOOK_URL = 'https://tabby180756.app.n8n.cloud/webhook/56ecccdc-3c7f-44d6-9ce4-125aa62f8856';
const DEFAULT_TIMEOUT_MS = 15000;

type WebhookPayload = FormData | Record<string, unknown>;

export const postAutomationWebhook = async (payload: WebhookPayload, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const options: RequestInit = {
      method: 'POST',
      signal: controller.signal,
    };

    if (payload instanceof FormData) {
      options.body = payload;
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(WEBHOOK_URL, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to trigger automation workflow');
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Automation webhook timed out. Please try again.');
    }

    throw error instanceof Error ? error : new Error('Failed to trigger automation workflow');
  } finally {
    window.clearTimeout(timeoutId);
  }
};
