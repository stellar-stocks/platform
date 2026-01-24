"use client";
import { useState, useCallback } from "react";

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
  reset: () => void;
}

export function useClipboard(): UseClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Auto-reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setIsCopied(false);
  }, []);

  return {
    copy,
    isCopied,
    reset,
  };
}
