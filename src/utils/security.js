import passwordValidator from "password-validator";

export function onlyAlpha(str) {
  const reg =
    /^[a-z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$/i;
  if (str.match(reg) == null) return false;
  else return true;
}

export function onlyAlphanumeric(str) {
  const reg =
    /^[a-z 0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$/i;
  if (str.match(reg) == null) return false;
  else return true;
}

export function mail(str) {
  const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (str.match(reg) == null) return false;
  else return true;
}

export function password(str) {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 1 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values
  return schema.validate(str);
}
