"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard, { type VideoRecord } from "@/components/VideoCard";

type VideosResponse = {
  videos?: VideoRecord[];
};

function Home() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setError(null);
        const response = await axios.get<VideosResponse>("/api/videos");
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to fetch videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "video"}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`/api/videos/${id}`);
      setVideos((currentVideos) =>
        currentVideos.filter((video) => video.id !== id),
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      setError("Failed to delete video. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="badge badge-primary badge-outline mb-4">Library</div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Videos
          </h2>
          <p className="mt-3 max-w-2xl text-base text-base-content/60">
            Browse your uploaded videos, review compression details, and
            download optimized Cloudinary exports.
          </p>
        </div>

        <div className="stats w-full rounded-lg border border-base-300 bg-base-100 shadow-xl sm:w-auto">
          <div className="stat">
            <div className="stat-title">Uploads</div>
            <div className="stat-value text-primary">{videos.length}</div>
            <div className="stat-desc">Available in library</div>
          </div>
        </div>
      </section>

      {error && (
        <div className="alert alert-error rounded-lg">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-96 rounded-lg bg-base-300" />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-base-300 bg-base-100 p-10 text-center shadow-xl">
          <h2 className="text-xl font-bold">No videos uploaded yet</h2>
          <p className="mt-2 text-base-content/60">
            Upload a video to see it appear in your library.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
