import { useState } from 'react'
import { IconMailOpened, IconSend } from '@tabler/icons-react'

export default function VerifyEmailScreen({ email, onBackToLogin }) {
  const [resent, setResent] = useState(false)

  const handleResend = () => {
    setResent(true)
  }

  return (
    <div className="bg-surface flex min-h-screen items-center justify-center font-body">
      <main className="w-full max-w-md px-4 py-10 md:px-8">
        <div className="relative overflow-hidden rounded-xl border border-surface-variant bg-surface-lowest/80 shadow-level-2 backdrop-blur-md">
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-primary-container via-secondary-container to-primary-container"
          />
          <div className="flex flex-col items-center p-6 text-center md:p-8">
            <h1 className="font-display mb-6 text-xl font-bold tracking-tight text-primary-container">
              CampusHustle
            </h1>

            <div className="relative mb-4 flex size-24 items-center justify-center rounded-full bg-primary-fixed">
              <IconMailOpened
                size={48}
                className="text-primary-container"
                aria-hidden="true"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full border-2 border-primary-fixed-dim opacity-75"
              />
            </div>

            <h2 className="mb-1 text-xl font-semibold text-on-surface">Check your inbox!</h2>
            <p className="mb-6 px-4 text-base text-on-surface-variant">
              We&apos;ve sent a verification link to{' '}
              <span className="font-semibold text-on-surface">{email}</span>. Click the link to
              activate your account and join the hustle.
            </p>

            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={handleResend}
                className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary-container px-6 py-3 text-sm font-semibold text-primary-container transition-colors duration-200 hover:bg-surface-low focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 focus:ring-offset-surface-lowest"
              >
                <IconSend
                  size={20}
                  className="transition-transform group-hover:translate-y-[-2px]"
                  aria-hidden="true"
                />
                {resent ? 'Email sent — check your inbox' : 'Resend Email'}
              </button>
              <button
                type="button"
                onClick={onBackToLogin}
                className="mt-1 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-outline">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <a href="#" className="text-primary hover:underline">
            contact support
          </a>
          .
        </p>
      </main>
    </div>
  )
}
