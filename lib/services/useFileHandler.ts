import { useState, useCallback } from "react";

type AssetType = "logo" | "banner" | "ad";

const ACCEPTED_TYPES: Record<AssetType, string[]> = {
  logo: ["image/jpeg", "image/png"],
  banner: ["image/jpeg", "image/png"],
  ad: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"],
};

const MAX_FILE_SIZE_MB = 40;
const MAX_VIDEO_DURATION = 60;

const getVideoDuration = (file: File): Promise<number> => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Video duration can only be calculated in the browser")
    );
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    const timer: NodeJS.Timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Video metadata loading timed out"));
    }, 5000);

    const cleanup = () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
    };

    video.onloadedmetadata = () => {
      cleanup();
      resolve(video.duration);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video metadata"));
    };
  });
};

export function useFileHandler(label: AssetType) {
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFile = useCallback(
    async (file: File) => {
      const isValidType = ACCEPTED_TYPES[label].includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

      if (!isValidType) {
        return `Invalid file type. Allowed: ${ACCEPTED_TYPES[label]
          .map((t) => t.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      if (!isValidSize) {
        return `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`;
      }

      if (file.type.startsWith("video")) {
        try {
          const duration = await getVideoDuration(file);
          if (duration > MAX_VIDEO_DURATION) {
            return `Video too long. Max duration is ${MAX_VIDEO_DURATION} seconds.`;
          }
          return null;
        } catch (err) {
          console.error("Error getting video duration:", err);
          return "Could not verify video duration";
        }
      }

      return null;
    },
    [label]
  );

  const processFile = useCallback(
    async (
      file: File,
      onSuccess: (file: File, url: string) => void
    ): Promise<string | null> => {
      setIsProcessing(true);
      setError(null);

      try {
        const validationError = await validateFile(file);
        if (validationError) {
          setError(validationError);
          return validationError;
        }

        const blobUrl = URL.createObjectURL(file);
        onSuccess(file, blobUrl);

        if (file.type.startsWith("video")) {
          try {
            const duration = await getVideoDuration(file);
            setVideoDuration(duration);
          } catch (err) {
            console.error("Error getting video duration:", err);
            setVideoDuration(null);
          }
        } else {
          setVideoDuration(null);
        }

        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [validateFile]
  );

  const reset = useCallback(() => {
    setError(null);
    setVideoDuration(null);
    setIsProcessing(false);
  }, []);

  return {
    error,
    videoDuration,
    isProcessing,
    processFile,
    reset,
  };
}
