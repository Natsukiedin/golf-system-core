import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the login or dashboard page
  redirect("/login");
}
