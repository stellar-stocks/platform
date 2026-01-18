import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: Request) {
  const { dehydratedState } = await req.json();
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions,
  );

  // Example of persisting some state
  // In a real Stacks app, you might persist the userSession state
  session.dehydratedState = dehydratedState;
  await session.save();

  return Response.json({ success: true });
}
