import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminBannerForm } from "@/components/admin/admin-banner-form"

export default async function AddBannerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <AdminBannerForm />
}
