import { RawUserWithDepartments } from '@/app/types/users';
import { UserWithDepartments } from '@/app/types/users';



function transformUser(raw: RawUserWithDepartments): UserWithDepartments {
  const ids = raw.departments_id?.split(',').map(id => id.trim()) ?? [];
  const names = raw.departments_name?.split(',').map(name => name.trim()) ?? [];

  const departments = ids.map((id, i) => ({
    id,
    name: names[i] ?? ''
  }));

  return {
    id: raw.id,
    username: raw.username,
    firstname: raw.firstname,
    lastname: raw.lastname,
    department: raw.main_department_name,
    role: raw.role,
    departments,
  };
}


export default transformUser;