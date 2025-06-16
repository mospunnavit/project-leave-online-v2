'use client';
import { useEffect, useState } from 'react';
import { Department } from "@/app/types/department";
import { Users } from "@/app/types/users";
import { Loading } from "@/app/components/loading";

interface EdituserForm {
  departments: Department[];
  user: Users;
  onSubmit: (formData: any) => void;
}



export default function EdituserForm({ departments, user, onSubmit }: EdituserForm) {
    
 const [formData, setFormData] = useState({
  id: user.id,
  username: user.username,
  firstname: user.firstname,
  lastname: user.lastname,
  role: user.role,
  department: user.department ? user.department.toString() : "",
  departments: user.departments.map((d) => d.id),
});

  useEffect(() => {
      console.log(formData);
  }, [formData]);
  
  const handleDepartmentChange = (id: string) => {
  setFormData((prev) => {
    const selected = prev.departments.includes(id)
      ? prev.departments.filter((d) => d !== id) // เอาออก
      : [...prev.departments, id];              // เพิ่มเข้า
    return { ...prev, departments: selected };
  });
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: 'Username', name: 'username' },
        { label: 'First Name', name: 'firstname' },
        { label: 'Last Name', name: 'lastname' },
      ].map(({ label, name }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type="text"
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
            required
          />
        </div>
      ))}

     

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
          required
        >
          <option value="">-- เลือก Role --</option>
          <option value="admin">Admin</option>
          <option value="head">head</option>
           <option value="manager">manager</option>
            <option value="hr">Hr</option>
          <option value="user">User</option>
        </select>
      </div>
       <div>
        <label className="block text-sm font-medium text-gray-700">department</label>
       <select
  id="department"
  name="department"
  value={formData.department}
  onChange={handleChange}
  className=" border border-gray-300 rounded-md text-sm"
>
  <option value="" disabled>
    -- กรุณาเลือกแผนก --
  </option>
  {departments.map((dept) => (
    <option key={dept.id} value={dept.id.toString()}>
      {dept.department_name}
    </option>
  ))}
</select>
      </div>
      <div>
       <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departments</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {departments.map((dept) => (
                <label key={dept.id} className="flex items-center space-x-2">
                    <input
                    type="checkbox"
                    value={dept.id}
                    checked={formData.departments.includes(dept.id.toString())}
                    onChange={() => handleDepartmentChange(dept.id.toString())}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{dept.department_name}</span>
                </label>
                ))}
            </div>
            </div>
      </div>

      <div className="md:col-span-2 flex justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          บันทึกผู้ใช้
        </button>
      </div>
    </form>
  );
}
