import { Webhook } from "svix";
import { Context } from "hono";
import { ClerkWebhookEvent } from "../../types";

export class WebhookService {
  static async verifyWebhook(c: Context, secret: string): Promise<ClerkWebhookEvent | null> {
    try {
      const headers = c.req.raw.headers;
      const payload = await c.req.arrayBuffer();

      const svixId = headers.get("svix-id");
      const svixTimestamp = headers.get("svix-timestamp");
      const svixSignature = headers.get("svix-signature");

      if (!svixId || !svixTimestamp || !svixSignature) {
        throw new Error("Missing required Svix headers");
      }

      const wh = new Webhook(secret);
      return wh.verify(Buffer.from(payload), {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return null;
    }
  }
}