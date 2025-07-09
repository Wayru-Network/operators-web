"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

type AssetType = "logo" | "banner" | "ad";

type Props = {
  onSelect: (file: File, url: string) => void;
  label: AssetType;
};

const ACCEPTED_TYPES: Record<AssetType, string[]> = {
  logo: ["image/jpeg", "image/png"],
  banner: ["image/jpeg", "image/png"],
  ad: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"],
};

const MAX_FILE_SIZE_MB = 40;

export default function FileInput({ onSelect, label }: Props) {
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
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
  };

  const processFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);
      const blobUrl = URL.createObjectURL(file);
      onSelect(file, blobUrl);
    },
    [onSelect, label]
  );

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
    <div
      className={`flex flex-col items-center justify-center w-full h-48 max-w-lg rounded-[10px] bg-white ${
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
          <p className="text-red-500 text-xs mt-2 px-4 text-center">{error}</p>
        )}
      </label>

      <input
        id={`file-${label}`}
        type="file"
        accept={ACCEPTED_TYPES[label].join(",")}
        className="hidden"
        onChange={(e) => {
          const fileList = e.target.files;
          if (fileList?.[0]) processFile(fileList[0]);
        }}
      />
    </div>
  );
}
