export default function HairLoading() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-[#883223] via-[#a64028] to-[#883223] animate-shimmer bg-[length:200%_100%]" />

      <main className="flex-1 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-b border-r border-gray-200 dark:border-gray-700 contain-layout"
            >
              <div
                className="relative w-full bg-gray-200 dark:bg-gray-700 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
                style={{ paddingBottom: "125%" }}
              />

              <div className="p-2 flex flex-col bg-gray-50 dark:bg-gray-800">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-0.5 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />

                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
                  <div className="flex gap-1">
                    <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
                    <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
                    <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
