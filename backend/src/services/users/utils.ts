export const maskEmail = async (email:string)=> {
    const [name, domain] = email.split("@");

  if (name.length <= 3) {
    return `${name[0]}***@${domain}`;
  }
  return `${name.slice(0, 3)}***@${domain}`;
}