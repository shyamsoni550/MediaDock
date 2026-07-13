import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-3 py-6 sm:px-4 sm:py-10">
      <div className="card w-full max-w-sm border border-primary shadow-xl sm:max-w-md">
        <div className="card-body p-4 sm:p-6 lg:p-8">
          <div className="mb-4 text-center sm:mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-content sm:mb-4 sm:h-14 sm:w-14">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m-4-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
                />
              </svg>
            </div>

            <h1 className="text-xl font-semibold text-base-content sm:text-2xl">Create your account</h1>
            <p className="mt-2 text-sm text-base-content/70">
              Join us and start managing your media effortlessly
            </p>
          </div>

          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-none bg-transparent p-0 rounded-none',
                formButtonPrimary: 'btn btn-primary btn-block rounded-full h-12',
                footerActionLink: 'link link-primary font-medium',
                socialButtonsBlockButton: 'btn btn-outline btn-block rounded-full h-12',
                formFieldInput: 'input input-bordered input-sm sm:input-md w-full',
                formFieldLabel: 'text-sm font-medium text-base-content',
                dividerLine: 'bg-base-300',
                headerTitle: 'text-center text-lg sm:text-xl font-semibold text-base-content',
                headerSubtitle: 'text-center text-base-content/60',
              },
            }}
          />
        </div>
      </div>
    </main>
  )
}