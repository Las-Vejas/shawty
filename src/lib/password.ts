import bcrypt from 'bcryptjs';

/**
 * Hash a password with salt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password with salt
 */
export async function hashPassword(password: string): Promise<string> {
  // Use 10 salt rounds (default is 10, good balance between security and speed)
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password to compare
 * @param hashedPassword - Hashed password from database
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
