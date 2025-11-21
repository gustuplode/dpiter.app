import { createClient } from "@/lib/supabase/server"
import { BannerCarouselClient } from "./banner-carousel-client"

export async function DynamicBannerCarousel() {
  const supabase = await createClient()

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true })

  if (!banners || banners.length === 0) {
    return null
  }

  return <BannerCarouselClient banners={banners} />
}
