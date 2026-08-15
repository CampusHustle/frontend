export function hasCompletedProfile(user) {
  return Boolean(user && user.university && user.department)
}

export function profileFromForm(form) {
  const name = [form.firstName, form.lastName].filter(Boolean).join(' ').trim()
  return {
    ...(name ? { name } : {}),
    bio: form.bio,
    university: form.university,
    department: form.major,
    year: form.year,
    skillsLearning: form.skills,
    skillsTeaching: form.subjects,
    hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
  }
}
