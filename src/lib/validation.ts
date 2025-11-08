export default function validateEmail(email: string): string | null {
  if (!email.includes("@")) return "Please enter a valid email adress.";
  if (!email.includes("@stud.noroff.no"))
    return "Email must end with @stud.noroff.no";
  return null;

  // MAYBE REMOVE THIS FILE!!
}
