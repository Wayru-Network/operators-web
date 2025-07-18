"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

type AssetType = "logo" | "banner" | "ad";
type Props = {
  onSelect: (file: File, url: string) => void;
  label: AssetType;
  existingUrl?: string;
};

const ACCEPTED_TYPES: Record<AssetType, string[]> = {
  logo: ["image/jpeg", "image/png"],
  banner: ["image/jpeg", "image/png"],
  ad: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"],
};

const MAX_FILE_SIZE_MB = 40;

export default function FileInput({ onSelect, label, existingUrl }: Props) {
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingUrl ?? null
  );
  const [fileData, setFileData] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File) => {
      const isValidType = ACCEPTED_TYPES[label].includes(file.type);
      const isValidSize =
        label === "ad" ? file.size <= MAX_FILE_SIZE_MB * 1024 * 1024 : true;

      if (!isValidType) {
        return `Invalid file type. Allowed: ${ACCEPTED_TYPES[label]
          .map((t) => t.split("/")[1].toUpperCase())
          .join(", ")}`;
      }

      if (!isValidSize) {
        return `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`;
      }

      return null;
    },
    [label]
  );

  const processFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      setFileData(file);
      onSelect(file, blobUrl);
    },
    [onSelect, validateFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileData(file);
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
      onSelect(file, newUrl);
    },
    [onSelect]
  );

  const handleReset = useCallback(() => {
    setPreviewUrl(null);
    onSelect(new File([], ""), "");
    setFileData(null);
    setError(null);
    setIsOver(false);
  }, [onSelect]);

  const getHelperText = () => {
    if (label === "logo" || label === "banner") {
      return "Use JPG or PNG (transparent background preferred)";
    }
    return "Use JPG, PNG, GIF, MP4 or WEBM — up to 40MB";
  };

  const getDisplayLabel = () => {
    return `Drag and drop your ${label} here or browse files`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!previewUrl ? (
        <div
          className={`flex flex-col items-center justify-center w-full h-48 rounded-[10px] bg-white ${
            isOver ? "ring-2 ring-blue-500" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsOver(false);
            const items = e.dataTransfer.items;
            if (items) {
              for (const item of Array.from(items)) {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) processFile(file);
                }
              }
            } else if (e.dataTransfer.files.length) {
              processFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <label
            htmlFor={`file-${label}`}
            className="h-full w-full flex flex-col justify-center items-center bg-[#F8FAFA] dark:bg-[#858585] text-black dark:text-white rounded-[10px] cursor-pointer"
          >
            <Upload className="text-black" />
            <p className="pt-4">{getDisplayLabel()}</p>
            <p className="text-xs">{getHelperText()}</p>
            {error && (
              <p className="text-red-500 text-xs mt-2 px-4 text-center">
                {error}
              </p>
            )}
          </label>
        </div>
      ) : (
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          {fileData?.type?.startsWith("video") ||
          previewUrl.endsWith(".mp4") ||
          previewUrl.endsWith(".webm") ? (
            <video
              src={previewUrl}
              controls
              className={`rounded-md object-contain ${
                label === "logo"
                  ? "w-32 h-32"
                  : label === "banner"
                  ? "w-full h-32"
                  : "w-full h-48"
              }`}
            />
          ) : (
            <Image
              src={previewUrl}
              alt="Preview"
              className={`rounded-md object-contain ${
                label === "logo"
                  ? "w-32 h-32"
                  : label === "banner"
                  ? "w-full h-32"
                  : "w-full h-48"
              }`}
              width={label === "logo" ? 128 : 640}
              height={label === "logo" ? 128 : 320}
            />
          )}

          <div className="flex gap-4">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 p-2 bg-[#F8FAFA] dark:bg-[#858585] text-black dark:text-white rounded-[10px] cursor-pointer"
            >
              <Upload size={16} />
              Upload new
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 p-2 bg-[#F8FAFA] dark:bg-[#858585] text-black dark:text-white rounded-[10px] cursor-pointer"
            >
              <X size={16} />
              Remove
            </button>
          </div>
        </div>
      )}
      <input
        id={`file-${label}`}
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
