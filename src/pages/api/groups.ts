import { db } from "@/drizzle/db";
import { groups } from "@/drizzle/schema";
import { NextApiRequest, NextApiResponse } from "next";

interface PostBody {
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  if (req.method === "GET") {
    const data = await db.select().from(groups);
    res.status(200).json({ data });
  }

  if (req.method === "POST") {
    const { name } = JSON.parse(req.body) as PostBody;
    const id = crypto.randomUUID();
    await db.insert(groups).values({
      id,
      name,
    });

    res.status(200).json({ message: "Successful" });
  }
  res.status(200).json({ message: req.body });
}
