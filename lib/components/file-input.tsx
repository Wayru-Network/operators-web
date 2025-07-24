"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useFileHandler } from "@/lib/services/useFileHandler";
import { addToast } from "@heroui/react";

type AssetType = "logo" | "banner" | "ad";
type Props = {
  onSelect: (file: File, url: string) => void;
  label: AssetType;
  existingUrl?: string;
};

export default function FileInput({ onSelect, label, existingUrl }: Props) {
  const [isOver, setIsOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingUrl ?? null,
  );
  const [fileData, setFileData] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { error, videoDuration, processFile, reset } = useFileHandler(label);

  const handleProcess = useCallback(
    async (file: File) => {
      const err = await processFile(file, (processed, url) => {
        setPreviewUrl(url);
        setFileData(processed);
        onSelect(processed, url);
      });

      if (!err) {
        inputRef.current!.value = "";
      }
    },
    [processFile, onSelect],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleProcess(file);
      inputRef.current!.value = "";
    },
    [handleProcess],
  );

  const handleReset = useCallback(() => {
    setPreviewUrl(null);
    setFileData(null);
    onSelect(new File([], ""), "");
    reset();
    setIsOver(false);
  }, [onSelect, reset]);

  useEffect(() => {
    if (error) {
      addToast({
        title: "File Error",
        description: error,
        color: "danger",
      });
    }
  }, [error, videoDuration]);
  const getHelperText = () =>
    label === "logo" || label === "banner"
      ? "Use JPG or PNG (transparent background preferred)"
      : "Use JPG, PNG, GIF, MP4 or WEBM — up to 40MB";

  const getDisplayLabel = () =>
    `Drag and drop your ${label} here or browse files`;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!previewUrl ? (
        <div
          className={`flex flex-col items-center justify-center w-full h-48 rounded-[10px] bg-white dark:bg-[#222222] ${
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
                  if (file) handleProcess(file);
                }
              }
            } else if (e.dataTransfer.files.length) {
              handleProcess(e.dataTransfer.files[0]);
            }
          }}
        >
          <label
            htmlFor={`file-${label}`}
            className="h-full w-full flex flex-col justify-center items-center bg-[#F8FAFA] dark:bg-[#222222] text-black dark:text-white rounded-[10px] cursor-pointer"
          >
            <Upload className="text-black dark:text-white" />
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
          previewUrl.includes(".mp4") ||
          previewUrl.includes(".webm") ? (
            <>
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
            </>
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
