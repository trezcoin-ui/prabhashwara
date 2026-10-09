import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to auth on first visit
  redirect("/auth");
}
