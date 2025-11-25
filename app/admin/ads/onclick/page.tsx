import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { AdFormatList } from "@/components/admin/ad-format-list"

export default async function OnclickAdsPage() {
  const supabase = await createClient()

  const { data: ads } = await supabase
    .from("ad_formats")
    .select("*")
    .eq("format_type", "onclick")
    .order("position", { ascending: true })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdFormatList formatType="onclick" ads={ads || []} />
    </Suspense>
  )
}
