import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// =============================================================================
// Page
// =============================================================================

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/studio/new");
  }

  return null;
}
