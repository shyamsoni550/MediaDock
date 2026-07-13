"use client";

import React, { useMemo, useState } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Clock, Download, FileDown, FileUp, Play, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";

dayjs.extend(relativeTime);

export type VideoRecord = {
  id: string;
  public_id?: string;
  publicId?: string;
  title?: string | null;
  description?: string | null;
  format?: string | null;
  created_at?: string | null;
  createdAt?: string | Date | null;
  bytes?: number | string | null;
  size?: number | string | null;
  originalSize?: number | string | null;
  orignalSize?: number | string | null;
  compressedSize?: number | string | null;
  duration?: number | string | null;
};

interface VideoCardProps {
  video: VideoRecord;
  onDownload: (url: string, title: string) => void;
  onDelete?: (id: string) => Promise<void> | void;
}

const toNumber = (value: VideoRecord[keyof VideoRecord]) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatFileSize = (size: number) => {
  if (!size) return "0 KB";
  return filesize(size, { base: 10, standard: "jedec" });
};

const formatDuration = (value: VideoRecord["duration"]) => {
  const seconds = toNumber(value);
  if (!seconds) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const compressionPercentage = (originalSize: number, compressedSize: number) => {
  if (!originalSize || !compressedSize || compressedSize >= originalSize) {
    return null;
  }

  return (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const publicId = video.public_id || video.publicId || "";
  const title = video.title || "Untitled video";
  const description = video.description || "No description added yet.";
  const createdAt = video.created_at || video.createdAt;
  const originalSize = toNumber(video.originalSize || video.orignalSize || video.size);
  const compressedSize = toNumber(video.compressedSize || video.bytes);
  const savedPercent = compressionPercentage(originalSize, compressedSize);

  const thumbnailUrl = useMemo(() => {
    if (!publicId) return "";

    return getCldImageUrl({
      src: publicId,
      width: 640,
      height: 360,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, [publicId]);

  const fullVideoUrl = useMemo(() => {
    if (!publicId) return "";

    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, [publicId]);

  const previewUrl = useMemo(() => {
    if (!publicId) return "";

    return getCldVideoUrl({
        src: publicId,
        width: 640,
        height: 360,
        crop: "fill",
        quality: "auto:eco",
        format: "mp4",
        assetType: "video",
      });
  }, [publicId]);

  const handleDownload = () => {
    if (!fullVideoUrl) return;
    onDownload(fullVideoUrl, title);
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;

    const confirmed = window.confirm(`Delete "${title}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(video.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article
      className="card overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <figure className="relative aspect-video bg-base-300">
        {publicId ? (
          <>
            {isHovered && !previewError ? (
              <video
                src={previewUrl}
                poster={thumbnailUrl}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                onError={() => setPreviewError(true)}
              />
            ) : (
              <img
                src={thumbnailUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute left-4 top-4 badge badge-neutral gap-1 border-0 bg-black/60 text-white">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(video.duration)}
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Play className="h-5 w-5 fill-current" />
              </span>
              <span className="text-sm font-semibold">
                {isHovered && !previewError ? "Preview playing" : "Hover preview"}
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-base-content/60">
            <Play className="h-12 w-12" />
            <span className="text-sm font-semibold">Video source missing</span>
          </div>
        )}
      </figure>

      <div className="card-body gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="card-title line-clamp-1 text-lg">{title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-base-content/60">
              {description}
            </p>
          </div>
          {video.format && (
            <span className="badge badge-primary uppercase">{video.format}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-base-200 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-base-content/50">
              <FileUp className="h-4 w-4" />
              Original
            </div>
            <div className="mt-1 font-bold">{formatFileSize(originalSize)}</div>
          </div>
          <div className="rounded-md bg-base-200 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-base-content/50">
              <FileDown className="h-4 w-4" />
              Current
            </div>
            <div className="mt-1 font-bold">{formatFileSize(compressedSize)}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4">
          <div>
            {savedPercent ? (
              <span className="badge badge-success badge-outline">
                {savedPercent}% smaller
              </span>
            ) : (
              <span className="badge badge-ghost">Optimized</span>
            )}
            <p className="mt-2 text-xs text-base-content/50">
              {createdAt ? dayjs(createdAt).fromNow() : "Upload date unknown"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-error btn-sm btn-square"
              onClick={handleDelete}
              disabled={!onDelete || isDeleting}
              aria-label={`Delete ${title}`}
              title="Delete video"
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm gap-2"
              onClick={handleDownload}
              disabled={!fullVideoUrl}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
