/**
 * Admin index page
 *
 * Redirects to the entities workspace as the phase-1 CMS landing screen.
 */
import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  redirect("/admin/entities");
}
