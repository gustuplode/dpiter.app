import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

export default async function HomePage() {
  const supabase = await createClient()

  let collections: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("collections")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (fetchError) {
      error = fetchError
    } else {
      collections = data || []
    }
  } catch (e) {
    error = e
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f6f5] dark:bg-[#23150f]">
      <div className="bg-primary py-2 text-center text-sm font-bold text-white">
        <span>🔥 47% off limited time offer</span>
      </div>

      <main className="flex-1">
        {error ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load collections</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Please make sure the database tables are created. Run the SQL scripts in the scripts folder.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug || collection.id}`}
                  className="flex flex-col group"
                >
                  <div className="relative w-full overflow-hidden bg-gray-200">
                    <div
                      className="w-full bg-cover bg-center bg-no-repeat aspect-[3/4]"
                      style={{ backgroundImage: `url('${collection.image_url}')` }}
                    />
                    {collection.is_limited_time && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        <span className="material-symbols-outlined !text-sm">schedule</span>
                        <span>Limited Time</span>
                      </div>
                    )}
                  </div>
                  <div className="px-2 pt-2 pb-4">
                    <p className="text-xs md:text-sm font-bold uppercase leading-normal tracking-wide text-slate-700 dark:text-slate-400">
                      {collection.brand}
                    </p>
                    <p className="text-sm md:text-base font-normal leading-normal text-[#23150f] dark:text-[#f8f6f5] line-clamp-2">
                      {collection.title}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-lg text-slate-600 dark:text-slate-400">No collections available yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Collections will appear here once they are published
                </p>
              </div>
            )}
          </div>
        )}

        <div className="h-24" />
      </main>

      <BottomNav />
    </div>
  )
}
