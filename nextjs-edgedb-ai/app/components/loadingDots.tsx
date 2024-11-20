export default function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <span className="w-1.5 h-1.5 bg-[#333333] rounded-full animate-pulse delay-[0ms]"></span>
      <span className="w-1.5 h-1.5 bg-[#333333] rounded-full animate-pulse delay-[200ms]"></span>
      <span className="w-1.5 h-1.5 bg-[#333333] rounded-full animate-pulse delay-[400ms]"></span>
    </span>
  );
}
