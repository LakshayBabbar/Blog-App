"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";

export default function Loading() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(92), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-full ">
      <Progress value={progress} className="w-[90%] sm:w-[60%] md:w-[40%]" />
    </div>
  );
}
