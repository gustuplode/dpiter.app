export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-[#8A3224]/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-[#8A3224] rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
