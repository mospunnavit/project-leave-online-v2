import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ExcelJS from 'exceljs';

function formatThaiDateYYYYMMDD(isoDateString: string): string {
  const date = new Date(isoDateString);
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, '0');
  const day = String(tzDate.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ไข 1: เพิ่ม Promise
) {
  const { id } = await params; // ✅ แก้ไข 2: await params แล้ว destructure
  const leaveformId = parseInt(id); // ✅ แก้ไข 3: ไม่ต้อง await parseInt

  try {
        const [datas] = await db.query(
            `SELECT l.id ,u.username, u.firstname, u.lastname, u.department, 
            l.leave_date, l.end_leave_date, l.start_time, l.end_time, l.reason, l.lt_code , lt.lt_name, l.lc_code, l.usequotaleave,
            l.status, l.submitted_at, l.image_filename, l.exported, d.department_name
            FROM leaveform l 
            LEFT JOIN users u ON l.u_id = u.id
            LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
            LEFT JOIN departments d ON u.department = d.id
            where l.id = ? order by l.leave_date`,
            [leaveformId]
          );
  
     const [holidays] = await db.query(`SELECT date FROM holiday`) as any;
        const holidaysArray = holidays.map((row: any) => new Date(row.date).toISOString());
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Leaveinformations');

        worksheet.columns = [
            { header: 'รหัสพนักงาน', key: 'username', width: 10 },
            { header: 'วันที่ลา', key: 'leave_date', width: 20 },
            { header: 'รหัสกะ', key: 'shift_code', width: 20 },
            { header: 'รหัสผลข้อตกลงเงินหัก', key: 'lt_code', width: 20 },
            { header: 'รหัสลักษณะการรูดบัตร', key: 'lc_code', width: 20 },
            { header: 'วิธีลา', key: 'leave_method', width: 20 },
            { header: 'จำนวนที่ลา', key: 'usequotaleave', width: 20 },
            ];

            (datas as any[]).forEach((data) => {
            //ลาวันเดียวจะต้องไม่มี end leave date
            if (data.end_leave_date == null) {
                
                worksheet.addRow({
                username: data.username,
                leave_date: formatThaiDateYYYYMMDD(data.leave_date),
                shift_code: '00',
                lt_code: data.lt_code,
                lc_code: data.lc_code,
                leave_method: 'ตามที่บันทึก',
                usequotaleave: parseFloat(data.usequotaleave) === 1.00 ? "1" : data.usequotaleave
            });
            }else{
                console.log("inside",data);
                const startDate = new Date(data.leave_date);
                const endDate = new Date(data.end_leave_date);
            
                let currentDate = new Date(startDate);
                
                while (currentDate <= endDate) {
                    console.log(currentDate);
                    console.log(formatThaiDateYYYYMMDD(currentDate.toISOString()));
                    console.log((holidaysArray.includes(currentDate.toISOString())));
                    //หากโดนวันหยุดไม่นับ
                    if (holidaysArray.includes(currentDate.toISOString())){
                        console.log('holiday', currentDate);
                        currentDate.setDate(currentDate.getDate() + 1); // อย่าลืมเพิ่มวันก่อน continue
                        continue;
                    }
                   
                   
                    
                    worksheet.addRow({
                        username: data.username,
                        leave_date: formatThaiDateYYYYMMDD(currentDate.toISOString()),
                        shift_code: '00',
                        lt_code: data.lt_code,
                        lc_code: data.lc_code,
                        leave_method: 'ตามที่บันทึก',
                        usequotaleave: '1',
                    });
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
           
        });
        const buffer = await workbook.xlsx.writeBuffer();
        await db.query(`UPDATE leaveform l SET exported = 1 where l.id = ?`, [leaveformId]);
        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="leave_report.xlsx"',
            },
        });

  }catch (err) {
      console.log(err);
  }
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   
}