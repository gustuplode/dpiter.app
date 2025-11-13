import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CollectionForm } from "@/components/admin/collection-form"

export default async function NewCollectionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return <CollectionForm />
}
