import { createUser } from "@/lib/actions/user.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";
if (!webhookSecret) {
    return new Response("Internal Server Error", { status: 500 });
}
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const sivx = new Webhook(webhookSecret);

  let msg: WebhookEvent;
  
  try {
    msg = sivx.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  }
    catch (e) {
        console.error("Error verifying webhook:", e); // Ghi lại lỗi
        return new Response("Unauthorized", { status: 401 });
    }

  const eventType = msg.type;
  if (eventType !== "user.created") {
    const {
      id,
      username,
      email_address,
      image_url
        } = msg.data;
    const user = await createUser(
        {
            clerkId: id!,
            username: username!,
            email: email_address[0].email_address,
            avatar: image_url,
            name: username!
            
        }
    );
    return NextResponse.json({
      message: "Ok",
      user,
    });
  }

  // Rest

  return new Response("OK", { status: 200 });
}