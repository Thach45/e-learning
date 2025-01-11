import { Webhook } from 'svix'; // Đảm bảo bạn đã cài đặt và nhập đúng thư viện svix
import { NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser } from '@/lib/actions/user.actions';


export async function POST(req: Request) {
  const svix_signature = req.headers.get("svix-signature") ?? "";
  const webhookSecret = process.env.WEBHOOK_SECRET; // Đảm bảo bạn đã thiết lập biến môi trường này

  if (!webhookSecret) {
    return new Response("Internal Server Error", { status: 500 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const svix = new Webhook(webhookSecret);

  let msg: WebhookEvent;

  try {
    msg = svix.verify(body, {
      "svix-id": req.headers.get("svix-id") ?? "",
      "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (e) {
    console.error("Error verifying webhook:", e); // Ghi lại lỗi
    return new Response("Unauthorized", { status: 401 });
  }

  const eventType = msg.type;
  if (eventType === "user.created") {
    const { id, username, email_addresses, image_url } = msg.data;
    const user = await createUser({
      clerkId: id!,
      username: username!,
      email: email_addresses[0].email_address,
      avatar: image_url,
      name: username!,
    });
    return NextResponse.json({
      message: "Ok",
      user,
    });
  }

  return new Response("Event type not handled", { status: 400 });
}