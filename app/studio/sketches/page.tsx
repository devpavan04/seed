import { redirect } from "next/navigation";

export default function SketchesPage(): never {
  redirect("/studio/sketches/all");
}
