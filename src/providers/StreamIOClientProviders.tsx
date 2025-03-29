"use client";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import provideTokenAction from "@/actions/provideToken";

interface Props {
  children: ReactNode;
}

export default function StreamIOClientProvider({ children }: Props) {
  const client = useInitClient();
  if (!client) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}

function useInitClient() {
  const { user, ...data } = useUser();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!data.isLoaded) {
      return;
    }

    let streamUser: User;
    if (user?.id) {
      streamUser = {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      };
    } else {
      const id = nanoid();
      streamUser = {
        id,
        type: "guest",
        name: `Guest ${id}`,
      };
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_KEY;
    if (!apiKey) {
      throw new Error("Configuration not provided");
    }
    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: user?.id ? provideTokenAction : undefined,
    });

    setClient(client);

    return () => {
      client.disconnectUser();
      setClient(null);
    };
  }, [user?.id, user?.username, user?.imageUrl, data.isLoaded]);

  return client;
}
