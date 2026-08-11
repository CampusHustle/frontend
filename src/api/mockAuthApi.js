const DELAY = 800

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockLogin({ email, password: _password }) {
  await delay(DELAY)
  if (email.includes('fail')) {
    throw { message: 'Invalid email or password' }
  }
  return {
    token: `mock-token-${email}`,
    user: { email },
  }
}

export async function mockSignup({ name, email, password: _password }) {
  await delay(DELAY)
  if (email.includes('fail')) {
    throw { message: 'That email is already registered' }
  }
  return {
    token: `mock-token-${email}`,
    user: { name, email },
  }
}
