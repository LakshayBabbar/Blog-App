export default function Loading() {
  return (
    <div className="flex space-x-2 justify-center items-center bg-white h-screen w-full dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="h-8 w-8 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-8 w-8 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-8 w-8 bg-slate-950 rounded-full animate-bounce"></div>
    </div>
  );
}
