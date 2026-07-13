"use client";
import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square(1:1)": {
    Width: 1080,
    Height: 1080,
    "Aspect Ratio": "1:1",
  },
  "Instagram Portrait(4:5)": {
    Width: 1080,
    Height: 1350,
    "Aspect Ratio": "4:5",
  },
  "Twitter Post (16:9)": {
    Width: 1200,
    Height: 675,
    "Aspect Ratio": "16:9",
  },
  "Twitter Header (3:1)": {
    Width: 1500,
    Height: 500,
    "Aspect Ratio": "3:1",
  },
  "Facebook Post (205:78)": {
    Width: 1200,
    Height: 675,
    "Aspect Ratio": "205:78",
  },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square(1:1)",
  );
  const [isuploading, setIsUploading] = useState(false);
  const [istransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const selectedFormatDetails = socialFormats[selectedFormat];

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Image upload failed");
      }
      const data = await response.json();
      setUploadedImage(data.public_id);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="hero overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xl">
          <div className="hero-content grid w-full gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px] lg:p-10">
            <div>
              <div className="badge badge-primary badge-outline mb-4">
                Image workspace
              </div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                Social Media Image Creator
              </h1>
              <p className="mt-4 max-w-2xl text-base text-base-content/70 sm:text-lg">
                Upload one image and prepare polished crops for Instagram,
                Twitter, and Facebook without leaving the dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="badge badge-lg badge-neutral">Auto crop</div>
                <div className="badge badge-lg badge-neutral">Cloudinary</div>
                <div className="badge badge-lg badge-neutral">Ready export</div>
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4">
              <div className="text-sm font-semibold text-base-content/70">
                Current output
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md bg-base-100 p-3">
                  <div className="text-xl font-bold">
                    {selectedFormatDetails.Width}
                  </div>
                  <div className="text-xs text-base-content/50">width</div>
                </div>
                <div className="rounded-md bg-base-100 p-3">
                  <div className="text-xl font-bold">
                    {selectedFormatDetails.Height}
                  </div>
                  <div className="text-xs text-base-content/50">height</div>
                </div>
                <div className="rounded-md bg-base-100 p-3">
                  <div className="text-xl font-bold">
                    {selectedFormatDetails["Aspect Ratio"]}
                  </div>
                  <div className="text-xs text-base-content/50">ratio</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="card h-fit rounded-lg border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-6">
              <div>
                <h2 className="card-title">Upload asset</h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Choose a clean source image for the best platform crops.
                </p>
              </div>

              <label
                htmlFor="image-upload"
                className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary/40 bg-base-200 px-5 py-10 text-center transition hover:border-primary hover:bg-primary/10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg shadow-primary/20 transition group-hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75v12"
                    />
                  </svg>
                </span>
                <span className="font-semibold">Click to upload an image</span>
                <span className="text-sm text-base-content/50">
                  PNG, JPG, or WEBP recommended
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {isuploading && (
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">Uploading</span>
                    <span className="text-base-content/60">Please wait</span>
                  </div>
                  <progress className="progress progress-primary w-full"></progress>
                </div>
              )}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Choose format</p>
                  <span className="badge badge-ghost">
                    {selectedFormatDetails["Aspect Ratio"]}
                  </span>
                </div>
                <div className="grid gap-2">
                  {Object.keys(socialFormats).map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setSelectedFormat(format as SocialFormat)}
                      className={`btn justify-between rounded-md ${
                        selectedFormat === format
                          ? "btn-primary"
                          : "btn-ghost bg-base-200"
                      }`}
                    >
                      <span className="truncate">{format}</span>
                      <span className="text-xs opacity-70">
                        {socialFormats[format as SocialFormat].Width} x{" "}
                        {socialFormats[format as SocialFormat].Height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="card rounded-lg border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="card-title">Live preview</h2>
                  <p className="text-sm text-base-content/60">
                    {uploadedImage
                      ? "Review the transformed crop before downloading."
                      : "Your transformed image will appear here after upload."}
                  </p>
                </div>
                {uploadedImage && (
                  <button
                    className="btn btn-primary gap-2"
                    onClick={handleDownload}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3.75m0 0l4.5 3.75M12 3.75v12"
                        transform="rotate(180 12 12)"
                      />
                    </svg>
                    Download
                  </button>
                )}
              </div>

              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg border border-base-300 bg-base-200 p-4 sm:p-8">
                {uploadedImage ? (
                  <>
                    {istransforming && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/75 backdrop-blur-sm">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                      </div>
                    )}
                    <CldImage
                      width={selectedFormatDetails.Width}
                      height={selectedFormatDetails.Height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="Transformed image"
                      crop="fill"
                      aspectRatio={selectedFormatDetails["Aspect Ratio"]}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="max-h-[560px] w-auto rounded-md object-contain shadow-2xl"
                    />
                  </>
                ) : (
                  <div className="max-w-sm text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-100 text-base-content/60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.6}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5A1.5 1.5 0 0021.75 18V6A1.5 1.5 0 0020.25 4.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                        />
                      </svg>
                    </div>
                    <p className="font-semibold">No image uploaded yet</p>
                    <p className="mt-1 text-sm text-base-content/60">
                      Select a source file to unlock the preview and download
                      action.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
