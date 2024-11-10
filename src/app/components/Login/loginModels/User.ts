export interface User {
  id: string;
  userName: string;
  email: string;
  connectionString: string;
  keyAnswerName: string | null;
  keyRequestName: string | null;
  roles: string[];
}
