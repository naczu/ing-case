export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

export function validateDateOfBirth(date) {
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 18 && age <= 70;
}

export function validateEmploymentDate(date) {
  const employmentDate = new Date(date);
  const today = new Date();
  return employmentDate <= today;
}