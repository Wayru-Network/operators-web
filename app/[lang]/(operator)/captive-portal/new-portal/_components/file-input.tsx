"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

type Props = {
  onSelect: (file: File, url: string) => void;
};

export default function FileInput({ onSelect }: Props) {
  const [isOver, setIsOver] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      const blobUrl = URL.createObjectURL(file);
      onSelect(file, blobUrl);
    },
    [onSelect]
  );

  return (
    <div
      className={`flex flex-col items-center justify-center h-48 w-full max-w-lg rounded-[10px] bg-white ${
        isOver ? "ring-2 ring-blue-500" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDragEnd={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);

        /* dataTransfer.items cubre arrastre moderno */
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
        htmlFor="file"
        className="h-full w-full flex flex-col justify-center items-center bg-[#F8FAFA] text-black rounded-[10px] cursor-pointer"
      >
        <Image
          src="/assets/upload.svg"
          alt="Upload icon"
          width={20}
          height={20}
        />
        <p className="pt-4">Drag and drop your logo here or browse files</p>
        <p className="text-xs">
          Use JPG or PNG (transparent background preferred), 300 × 100 px
        </p>
      </label>

      <input
        id="file"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const fileList = e.target.files;
          if (fileList?.[0]) processFile(fileList[0]);
        }}
      />
    </div>
  );
}
