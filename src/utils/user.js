export function hasCompletedProfile(user) {
  return Boolean(user && user.university && user.department)
}

export function profileFromForm(form) {
  return {
    bio: form.bio,
    department: form.department,
    year: form.year,
    skillsLearning: form.skills,
    skillsTeaching: form.subjects,
    hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : null,
  }
}
