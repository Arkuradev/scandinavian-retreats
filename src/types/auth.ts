export interface AuthUser {
  name: string;
  email: string;
  avatar?: { url?: string; alt?: string } | null;
  venueManager: boolean;
}
