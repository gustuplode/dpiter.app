import { createClient } from "@/lib/supabase/server"
import { AdFormatForm } from "@/components/admin/ad-format-form"
import { notFound } from "next/navigation"

export default async function EditInterstitialAdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ad } = await supabase.from("ad_formats").select("*").eq("id", id).single()

  if (!ad) notFound()

  return <AdFormatForm formatType="interstitial" initialData={ad} />
}
