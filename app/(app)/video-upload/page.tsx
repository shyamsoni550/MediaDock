"use client"
import React,{useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/navigation'



function VideoUpload() {

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const router = useRouter()
  //max file size 70MB
  const MAX_FILE_SIZE = 70 * 1024 * 1024
  const fileSizeLabel = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "No file selected"

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() 
    if (!file) return;

    if(file.size > MAX_FILE_SIZE) {
      //add notification for file size exceeds 70MB
      alert("File size exceeds 70MB. Please upload a smaller file.")
      return;
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData)
      //check for 200 status code
      router.push("/home")
    } catch (error) {
      console.error("Error uploading video:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8 text-base-content sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="hero overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xl">
          <div className="hero-content grid w-full gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_340px] lg:p-10">
            <div>
              <div className="badge badge-secondary badge-outline mb-4">
                Video studio
              </div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                Upload Video
              </h1>
              <p className="mt-4 max-w-2xl text-base text-base-content/70 sm:text-lg">
                Add a title, description, and source file to publish your video
                through the Cloudinary pipeline.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="badge badge-lg badge-neutral">70MB limit</div>
                <div className="badge badge-lg badge-neutral">Video files</div>
                <div className="badge badge-lg badge-neutral">Fast upload</div>
              </div>
            </div>

            <div className="rounded-lg border border-base-300 bg-base-200 p-4">
              <div className="text-sm font-semibold text-base-content/70">
                Selected file
              </div>
              <div className="mt-4 rounded-md bg-base-100 p-4">
                <div className="truncate text-lg font-bold">
                  {file ? file.name : "Waiting for upload"}
                </div>
                <div className="mt-1 text-sm text-base-content/60">
                  {fileSizeLabel}
                </div>
              </div>
              <progress
                className="progress progress-secondary mt-4 w-full"
                value={file ? Math.min(file.size, MAX_FILE_SIZE) : 0}
                max={MAX_FILE_SIZE}
              ></progress>
            </div>
          </div>
        </div>

        <form
          onSubmit={handlesubmit}
          className="grid gap-6 lg:grid-cols-[1fr_380px]"
        >
          <section className="card rounded-lg border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-6">
              <div>
                <h2 className="card-title">Video details</h2>
                <p className="mt-1 text-sm text-base-content/60">
                  These details will travel with the upload.
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your video a title"
                  className="input input-bordered input-lg w-full rounded-md focus:input-secondary"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this video about?"
                  className="textarea textarea-bordered min-h-36 w-full rounded-md focus:textarea-secondary"
                  rows={6}
                />
              </div>

              {isUploading && (
                <div className="rounded-lg border border-secondary/20 bg-secondary/10 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">Uploading video</span>
                    <span className="text-base-content/60">Please wait</span>
                  </div>
                  <progress className="progress progress-secondary w-full"></progress>
                </div>
              )}
            </div>
          </section>

          <aside className="card h-fit rounded-lg border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-6">
              <div>
                <h2 className="card-title">Source file</h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Select the video you want to upload.
                </p>
              </div>

              <label
                htmlFor="video-file"
                className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-secondary/40 bg-base-200 px-5 py-10 text-center transition hover:border-secondary hover:bg-secondary/10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-content shadow-lg shadow-secondary/20 transition group-hover:scale-105">
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
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </span>
                <span className="max-w-full truncate font-semibold">
                  {file ? file.name : "Click to select a video"}
                </span>
                <span className="text-sm text-base-content/50">
                  MP4, MOV, or WEBM up to 70MB
                </span>
                <input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
              </label>

              <div className="stats stats-vertical rounded-lg border border-base-300 bg-base-200 shadow-none">
                <div className="stat">
                  <div className="stat-title">File size</div>
                  <div className="stat-value text-2xl">{fileSizeLabel}</div>
                  <div className="stat-desc">Maximum allowed is 70MB</div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-secondary w-full gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Video"
                )}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default VideoUpload
