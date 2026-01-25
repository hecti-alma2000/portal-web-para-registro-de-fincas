export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  password: string;
  role: String;
  image?: string | null;
  isPrimary?: boolean;
}
