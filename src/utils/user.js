export function hasCompletedProfile(user) {
  if (!user) return false
  if (user.isProfileComplete) return true
  return Boolean(user.bio && user.bio.trim().length > 0 && user.university && user.department)
}

export function profileFromForm(form) {
  const name = [form.firstName, form.lastName].filter(Boolean).join(' ').trim()
  return {
    ...(name ? { name } : {}),
    gender: form.gender ? form.gender.toLowerCase().trim() : undefined,
    profilePicUrl: form.profilePicUrl || '',
    bio: form.bio?.trim() || '',
    university: form.university?.trim() || '',
    department: (form.major || form.department || '').trim(),
    year: form.year ? (isNaN(Number(form.year)) ? form.year : Number(form.year)) : 1,
    skillsLearning: form.skills || [],
    skillsTeaching: form.subjects || [],
    hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : 0,
    availability: form.availability || [],
    isProfileComplete: true,
  }
}
