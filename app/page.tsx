import Link from "next/link";

const features = [
  {
    title: "Blazing-fast uploads",
    desc: "Direct-to-cloud pipeline handles large videos without breaking a sweat.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "One-click social formats",
    desc: "Auto-resize for Instagram, Twitter, and Facebook in a single click.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    title: "Secure by default",
    desc: "Auth-gated uploads and shareable links, built on Clerk.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-3.04 8.25-7.5 9.75C9.04 20.25 6 16.556 6 12V6.75l6-2.75 6 2.75V12z" />
      </svg>
    ),
  },
];

const stats = [
  { label: "Videos processed", value: "12k+" },
  { label: "Formats supported", value: "5+" },
  { label: "Avg upload time", value: "<8s" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-300">
      {/* Navbar */}
      <div className="navbar max-w-6xl mx-auto px-6 pt-6">
        <div className="navbar-start">
          <span className="text-xl font-bold tracking-tight">
            Cloud<span className="text-primary">nary</span>
          </span>
        </div>
        <div className="navbar-end gap-2">
          <Link href="/sign-in" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link href="/sign-up" className="btn btn-primary btn-sm rounded-full px-5">
            Get started
          </Link>
        </div>
      </div>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <div className="hero">
          <div className="hero-content flex-col lg:flex-row-reverse gap-12">
            {/* Visual card */}
            <div className="card w-full max-w-md bg-base-100/70 backdrop-blur border border-base-300 shadow-2xl">
              <div className="card-body gap-4">
                <div className="badge badge-primary badge-outline">Live preview</div>
                <h2 className="card-title">Why creators love it</h2>
                <ul className="space-y-3 text-sm text-base-content/70">
                  {features.map((f) => (
                    <li key={f.title} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">{f.icon}</span>
                      <div>
                        <p className="font-medium text-base-content">{f.title}</p>
                        <p>{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="stats stats-vertical sm:stats-horizontal shadow mt-2 bg-base-200">
                  {stats.map((s) => (
                    <div className="stat py-3" key={s.label}>
                      <div className="stat-value text-primary text-2xl">{s.value}</div>
                      <div className="stat-desc">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Copy + CTA */}
            <div className="max-w-xl">
              <div className="badge badge-outline badge-lg border-primary/40 text-primary mb-5">
                Cloudinary SaaS Starter
              </div>
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                Upload, transform, and share your media
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {" "}
                  in seconds.
                </span>
              </h1>
              <p className="mt-5 text-lg text-base-content/70">
                The fastest way for creators and teams to publish video and
                image content everywhere — no bloated tools, no waiting
                around for exports.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sign-up"
                  className="btn btn-primary btn-lg rounded-full gap-2"
                >
                  Create free account
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/sign-in"
                  className="btn btn-outline btn-lg rounded-full"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-base-content/50">
                <div className="avatar-group -space-x-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content w-7 rounded-full text-xs">
                      <span>A</span>
                    </div>
                  </div>
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content w-7 rounded-full text-xs">
                      <span>S</span>
                    </div>
                  </div>
                  <div className="avatar placeholder">
                    <div className="bg-accent text-accent-content w-7 rounded-full text-xs">
                      <span>R</span>
                    </div>
                  </div>
                </div>
                No credit card required · Free tier forever
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
