import { useState, useEffect } from 'react'
import { IconCircleCheck, IconClock, IconMailOpened, IconSend, IconShieldCheck } from '@tabler/icons-react'
import { verifyEmail, resendVerification } from '../api/authApi.js'

export default function VerifyEmailScreen({
  email,
  devToken,
  initialCountdown = 60,
  onBackToLogin,
  onVerificationSuccess,
}) {
  const urlToken = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('token')
    : null

  const effectiveToken = urlToken || devToken

  const [status, setStatus] = useState(urlToken ? 'verifying' : 'pending')
  const [errorMessage, setErrorMessage] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState('')
  const [countdown, setCountdown] = useState(initialCountdown)

  // 1-minute countdown timer for asking/resending verification link
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // Automatic verification if token is present in URL search params
  useEffect(() => {
    if (!urlToken) return

    let isMounted = true
    async function runAutoVerify() {
      try {
        await verifyEmail(urlToken)
        if (isMounted) {
          setStatus('verified')
          onVerificationSuccess?.()
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error')
          setErrorMessage(err?.message || 'Email verification link is invalid or has expired.')
        }
      }
    }

    runAutoVerify()
    return () => {
      isMounted = false
    }
  }, [urlToken, onVerificationSuccess])

  // Action when user clicks "Verify Email"
  const handleVerifyEmail = async () => {
    setIsVerifying(true)
    setErrorMessage('')

    if (effectiveToken) {
      try {
        await verifyEmail(effectiveToken)
        setStatus('verified')
        onVerificationSuccess?.()
      } catch (err) {
        setStatus('error')
        setErrorMessage(err?.message || 'Email verification failed or token expired.')
      } finally {
        setIsVerifying(false)
      }
      return
    }

    // If no token in URL or memory, inform the user to check their email or use resend
    setIsVerifying(false)
    setErrorMessage('Please open the verification link sent to your email or click Resend if you need a new link.')
  }

  // Action when user clicks "Resend Email" (available once countdown reaches 0)
  const handleResend = async () => {
    if (!email || isResending || countdown > 0) return
    setIsResending(true)
    setResendStatus('')
    setErrorMessage('')

    try {
      await resendVerification(email)
      setResendStatus('New verification link sent — check your inbox!')
      setCountdown(60) // Restart 1-minute countdown
    } catch {
      setResendStatus('New verification link sent — check your inbox!')
      setCountdown(60)
    } finally {
      setIsResending(false)
    }
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

            {status === 'verified' ? (
              <>
                <div className="relative mb-4 flex size-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <IconCircleCheck size={52} stroke={2} aria-hidden="true" />
                </div>
                <h2 className="mb-1 text-xl font-semibold text-on-surface">Email Verified!</h2>
                <p className="mb-6 px-4 text-base text-on-surface-variant">
                  Your university email has been verified successfully. You are now ready to start hustling!
                </p>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 hover:bg-primary-container cursor-pointer"
                >
                  Continue to Sign In
                </button>
              </>
            ) : status === 'verifying' ? (
              <>
                <div className="relative mb-4 flex size-24 items-center justify-center rounded-full bg-primary-fixed">
                  <div className="size-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                </div>
                <h2 className="mb-1 text-xl font-semibold text-on-surface">Verifying your account...</h2>
                <p className="mb-6 px-4 text-base text-on-surface-variant">
                  Please wait while we confirm your university credentials.
                </p>
              </>
            ) : (
              <>
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
                  <span className="font-semibold text-on-surface">{email}</span>. Click the button below to verify or check your inbox.
                </p>

                {errorMessage && (
                  <div className="mb-4 w-full rounded-lg bg-error-container/20 border border-error/30 p-2.5 text-xs text-error">
                    {errorMessage}
                  </div>
                )}

                {resendStatus && (
                  <div className="mb-4 w-full rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-xs text-emerald-700 dark:text-emerald-400">
                    {resendStatus}
                  </div>
                )}

                <div className="flex w-full flex-col gap-3">
                  {/* Primary "Verify Email" button */}
                  <button
                    type="button"
                    disabled={isVerifying}
                    onClick={handleVerifyEmail}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-level-1 transition-all duration-200 hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
                  >
                    <IconShieldCheck
                      size={20}
                      className="transition-transform group-hover:scale-110"
                      aria-hidden="true"
                    />
                    {isVerifying ? 'Verifying...' : 'Verify Email'}
                  </button>

                  {/* Resend Link with 1-Minute Countdown */}
                  <button
                    type="button"
                    disabled={countdown > 0 || isResending}
                    onClick={handleResend}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary-container px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-container transition-colors duration-200 hover:bg-surface-low focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 focus:ring-offset-surface-lowest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {countdown > 0 ? (
                      <>
                        <IconClock size={18} className="animate-pulse text-outline" aria-hidden="true" />
                        <span>Resend verification link in {countdown}s</span>
                      </>
                    ) : (
                      <>
                        <IconSend
                          size={18}
                          className="transition-transform group-hover:translate-y-[-2px]"
                          aria-hidden="true"
                        />
                        <span>{isResending ? 'Sending...' : 'Resend Email'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="mt-1 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>

                {devToken && status === 'pending' && (
                  <div className="mt-5 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      ⚡ Local Dev Environment Notice
                    </p>
                    <p className="mt-1 text-[11px] text-on-surface-variant">
                      In development without an SMTP server, the verification email was printed to your backend terminal.
                    </p>
                  </div>
                )}
              </>
            )}
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
