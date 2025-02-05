"use client";

import { useLoading } from "@/context/loading-context";
import { Loader2 } from "lucide-react";

const LoadingOverlay = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg">
        <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
