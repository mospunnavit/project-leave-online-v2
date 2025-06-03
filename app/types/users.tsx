import { RowDataPacket } from 'mysql2';
export interface Users extends RowDataPacket{
    id?: string;
    username: string;
    password: string;
    firstname?: string;
    lastname?: string;
    department?: string; 
    role?: string; // make role optional
    createdAt?: Date;
  }