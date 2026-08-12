const DELAY = 800

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockSignUp({ username, email, password: _password }) {
  await delay(DELAY)
  if (email.includes('fail')) {
    throw { message: 'That email is already registered' }
  }
  return {
    token: `mock-token-${email}`,
    user: { username, email },
  }
}

export async function mockSignIn({ email, password: _password, rememberMe: _rememberMe }) {
  await delay(DELAY)
  if (email.includes('fail')) {
    throw { message: 'Invalid email or password' }
  }
  return {
    token: `mock-token-${email}`,
    user: { email },
  }
}
