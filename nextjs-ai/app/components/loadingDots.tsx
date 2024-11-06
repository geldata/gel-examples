export default function LoadingDots() {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 bg-[#9e6bbd] rounded-full animate-pulse delay-[0ms]"></span>
      <span className="w-2 h-2 bg-[#9e6bbd] rounded-full animate-pulse delay-[200ms]"></span>
      <span className="w-2 h-2 bg-[#9e6bbd] rounded-full animate-pulse delay-[400ms]"></span>
    </span>
  );
}
