import { RowDataPacket } from 'mysql2';
export interface Department {
  id: string;
  name: string;
}

export interface Users extends RowDataPacket{
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'head' | 'manager' | 'hr' | 'user'; // ปรับได้ตาม roles ที่คุณมี
  main_department_id: string;
  main_department_name: string;
  departments: Department[];
}

export interface RawUserWithDepartments extends RowDataPacket{
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  departments_id: string | null;
  departments_name: string | null;
}

export interface UserWithDepartments {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  main_department_name: string;
  main_department_id: string;
  departments: {
    id: string;
    name: string;
  }[];
}