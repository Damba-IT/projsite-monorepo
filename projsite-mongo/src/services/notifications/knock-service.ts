const KNOCK_SECRET = process.env.KNOCK_SECRET || "test_sk_1234567890";
const KNOCK_BASE_URL = "https://api.knock.app/v1";

export class KnockService {
  static async makeRequest(method: string, path: string, data?: object) {
    try {
      const response = await fetch(`${KNOCK_BASE_URL}/${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${KNOCK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Knock API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Knock API Request Failed: ${error.message}`);
      throw error;
    }
  }

  static async syncUser(action: "ADD" | "UPDATE" | "DELETE", user: any) {
    const userId = user.clerk_user_id;

    try {
      if (action === "ADD" || action === "UPDATE") {
        await this.makeRequest("PUT", `users/${userId}`, {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        });
      } else if (action === "DELETE") {
        await this.makeRequest("DELETE", `users/${userId}`);
      }
      console.log(`Knock user ${action} successful`);
    } catch (error) {
      console.error(`Knock user ${action} failed:`, error);
    }
  }
}