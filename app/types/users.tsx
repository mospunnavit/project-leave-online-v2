export interface Users {
    id?: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    department?: string; 
    role?: string; // make role optional
    createdAt?: Date;
  }