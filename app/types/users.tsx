export interface Users {
    id?: string;
    email: string;
    password: string;
    name?: string; // make name optional
    role?: string; // make role optional
    createdAt?: Date;
  }