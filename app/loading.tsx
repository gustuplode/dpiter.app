export default function Loading() {
  return (
    <div className="flex-1 flex min-h-[50vh] w-full items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[#8A3224]/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-[#8A3224] rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
