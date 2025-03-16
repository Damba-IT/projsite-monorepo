import { Hono } from "hono";
import { WebhookService } from "../services/webhooks/webhook-service";
import { UsersService } from "../services/user-service";
import { KnockService } from "../services/notifications/knock-service";
import type { HonoEnv, ClerkWebhookEvent } from "../types";

const webhookRouter = new Hono<HonoEnv>();

webhookRouter.post("/clerkusers", async (c) => {
  try {
    const db = c.get('db');
    const usersService = new UsersService(db);

    const evt = await WebhookService.verifyWebhook(c, process.env.WEBHOOK_SECRET || "") as ClerkWebhookEvent;
    if (!evt) return c.json({ success: false, message: "Invalid webhook" }, 400);

    const userData = {
      clerk_user_id: evt.data.id,
      first_name: evt.data.first_name,
      last_name: evt.data.last_name,
      email: evt.data.email_addresses[0]?.email_address,
      phone_number: evt.data.phone_numbers?.[0]?.phone_number || undefined,
      image: evt.data.profile_image_url,
      super_admin: evt.data.public_metadata?.superAdmin || false,
      source: "webhook",
    };

    switch (evt.type) {
      case "user.created":
        await usersService.create(userData);
        await KnockService.syncUser("ADD", userData);
        return c.json({ success: true, message: "User created" }, 201);

      case "user.updated":
        await usersService.update(userData.clerk_user_id, userData);
        await KnockService.syncUser("UPDATE", userData);
        return c.json({ success: true, message: "User updated" });

      case "user.deleted":
        await usersService.markAsDeleted(userData.clerk_user_id);
        await KnockService.syncUser("DELETE", userData);
        return c.json({ success: true, message: "User deleted" });

      default:
        return c.json({ success: false, message: "Unhandled event" }, 400);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return c.json({ success: false, message: "Internal Server Error" }, 500);
  }
});

export default webhookRouter;
