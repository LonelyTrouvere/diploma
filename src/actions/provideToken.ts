"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export default async function provideTokenAction() {
  const streamKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const streamSecret = process.env.CLERK_SECRET_KEY;
  if (!streamKey || !streamSecret) {
    throw new Error("Configuration not provided");
  }

  const user = await currentUser();
  if (!user) {
    throw new Error("No user");
  }

  const streamClient = new StreamClient(streamKey, streamSecret);
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  const iat = Math.floor(Date.now() / 1000) - 60;
  const token = streamClient.generateUserToken({
    user_id: user.id,
    exp,
    iat,
  });
  return token;
}
