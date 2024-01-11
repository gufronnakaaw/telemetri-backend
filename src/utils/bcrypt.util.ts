import * as bcrypt from 'bcrypt';

export async function hash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const result = await bcrypt.hash(password, salt);
  return result;
}

export async function verify(
  password: string,
  encrypted: string,
): Promise<boolean> {
  const result = await bcrypt.compare(password, encrypted);
  return result;
}
