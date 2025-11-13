import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CollectionForm } from "@/components/admin/collection-form"
import { notFound } from "next/navigation"

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: collection } = await supabase.from("collections").select("*").eq("id", id).single()

  if (!collection) {
    notFound()
  }

  return <CollectionForm collection={collection} />
}
