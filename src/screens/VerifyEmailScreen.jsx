import { useState, useEffect } from 'react'
import { IconCircleCheck, IconMail, IconSend, IconArrowLeft, IconShieldCheck } from '@tabler/icons-react'
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

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Auto-verify if token in URL
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
          setErrorMessage(err?.message || 'Verification link expired or invalid.')
        }
      }
    }
    runAutoVerify()
    return () => {
      isMounted = false
    }
  }, [urlToken, onVerificationSuccess])

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

    setIsVerifying(false)
    setErrorMessage('Please click the verification link in your inbox or use Resend Email.')
  }

  const handleResend = async () => {
    if (!email || isResending || countdown > 0) return
    setIsResending(true)
    setResendStatus('')
    setErrorMessage('')

    try {
      await resendVerification(email)
      setResendStatus('New verification link sent — check your inbox!')
      setCountdown(60)
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to resend. Please try again.')
      setCountdown(30)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4 py-8 antialiased">
      <main className="w-full max-w-sm">
        <div className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-8 shadow-level-2 text-center">
          <div className="mb-4">
            <span className="font-display text-xl font-bold tracking-tight text-primary">
              CampusHustle
            </span>
          </div>

          {status === 'verified' ? (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                <IconCircleCheck size={36} stroke={2} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-on-surface">Email Verified!</h2>
              <p className="mt-1 text-xs text-on-surface-variant mb-5">
                Your university email has been verified successfully.
              </p>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90 cursor-pointer"
              >
                Continue to Sign In
              </button>
            </div>
          ) : status === 'verifying' ? (
            <div className="flex flex-col items-center py-4">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <h2 className="text-sm font-semibold text-on-surface">Verifying your account...</h2>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconMail size={32} stroke={1.8} aria-hidden="true" />
              </div>

              <h2 className="text-lg font-bold text-on-surface">Check your inbox!</h2>
              <p className="mt-1 text-xs text-on-surface-variant mb-4 max-w-[260px]">
                We sent a verification link to{' '}
                <span className="font-semibold text-on-surface">{email}</span>
              </p>

              {errorMessage && (
                <div className="mb-3 w-full rounded-lg bg-error-container/20 border border-error/20 p-2 text-xs text-error">
                  {errorMessage}
                </div>
              )}

              {resendStatus && (
                <div className="mb-3 w-full rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-xs text-emerald-600 dark:text-emerald-400">
                  {resendStatus}
                </div>
              )}

              <div className="flex w-full flex-col gap-2.5">
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleVerifyEmail}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  <IconShieldCheck size={16} aria-hidden="true" />
                  <span>{isVerifying ? 'Verifying...' : 'Verify Email'}</span>
                </button>

                <button
                  type="button"
                  disabled={countdown > 0 || isResending}
                  onClick={handleResend}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-low py-2.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-high disabled:opacity-50 cursor-pointer"
                >
                  <IconSend size={14} aria-hidden="true" />
                  <span>
                    {isResending
                      ? 'Sending...'
                      : countdown > 0
                      ? `Resend verification link in ${countdown}s`
                      : 'Resend Email'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="flex items-center justify-center gap-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors py-1 cursor-pointer"
                >
                  <IconArrowLeft size={14} />
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
