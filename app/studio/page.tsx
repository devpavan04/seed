import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

export default async function StudioPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/studio/all-sketches");
  }

  // Logged out users see the sign-in page via the layout
  return null;
}
