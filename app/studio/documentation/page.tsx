import { redirect } from "next/navigation";

export default function DocumentationPage(): never {
  redirect("/studio/documentation/getting-started");
}
