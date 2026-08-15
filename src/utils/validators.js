const EDU_ET_REGEX = /^[^\s@]+@[^\s@]+\.edu\.et$/

export function validateUsername(username) {
  if (!username || username.trim() === '') {
    return 'Username is required'
  }
  return null
}

export function validateName(name) {
  if (!name || name.trim() === '') {
    return 'Name is required'
  }
  return null
}

export function validateEduEmail(email) {
  if (!email || email.trim() === '') {
    return 'Email is required'
  }
  if (!EDU_ET_REGEX.test(email.trim())) {
    return 'Email must end with .edu.et'
  }
  return null
}

export function validateEmail(email) {
  return validateEduEmail(email)
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  return null
}

export function validateConfirmPassword(password, confirm) {
  if (confirm === '') {
    return 'Please confirm your password'
  }
  if (confirm !== password) {
    return 'Passwords do not match'
  }
  return null
}

export function validateTerms(checked) {
  if (!checked) {
    return 'You must agree to the terms to continue'
  }
  return null
}

