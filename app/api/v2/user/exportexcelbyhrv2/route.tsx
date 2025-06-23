// pages/api/users.ts
import db from '@/lib/db';
import { NextResponse } from "next/server";
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

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    
    const from_date = searchParams.get("from_date" as string) || '';
    const to_date = searchParams.get("to_date" as string) || '';
    const status = searchParams.get("status") || 'approved';

    try {
        const conditions: string[] = [];
        const params: any[] = [];


        if(from_date.trim() && to_date.trim()) {
            conditions.push('(l.leave_date BETWEEN ? AND ? OR l.end_leave_date BETWEEN ? AND ?)');
            params.push(from_date.trim(), to_date.trim(), from_date.trim(), to_date.trim());
            
        }
        
        if(status.trim()) {
            conditions.push('l.status = ?');
            params.push(status.trim());
        }
        console.log(params);
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const [datas] = await db.query(
            `SELECT l.id ,u.username, u.firstname, u.lastname, u.department, 
            l.leave_date, l.end_leave_date, l.start_time, l.end_time, l.reason, l.lt_code , lt.lt_name, l.lc_code, l.usequotaleave,
            l.status, l.submitted_at, l.image_filename, l.exported, d.department_name
            FROM leaveform l 
            LEFT JOIN users u ON l.u_id = u.id
            LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
            LEFT JOIN departments d ON u.department = d.id
            ${whereClause} order by l.leave_date`,
            [...params]
          );
        const [holidays] = await db.query(`SELECT date FROM holiday`) as any;
        console.log(holidays);
        const holidaysArray = holidays.map((row: any) => new Date(row.date).toISOString());
        console.log(holidaysArray);
        console.log(datas);
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
                usequotaleave: data.usequotaleave,
            });
            }else{
                const startDate = new Date(data.leave_date);
                const endDate = new Date(data.end_leave_date);
                const fromDate = new Date(from_date + 'T00:00:00+07:00');
                const toDate = new Date(to_date + 'T00:00:00+07:00');
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
                    //ก่อนวันที่เลือกไม่นับ
                    console.log("current and from",currentDate.toISOString() , fromDate);
                    console.log("current and from",currentDate , fromDate);
                    if(currentDate.toISOString() < fromDate.toISOString()){
                        currentDate.setDate(currentDate.getDate() + 1);
                        console.log('before leave selected', currentDate);
                         continue;

                    }
                    if(currentDate.toISOString() > toDate.toISOString()){
                        currentDate.setDate(currentDate.getDate() + 1);
                        console.log('after leave selected', currentDate);
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
        await db.query(`UPDATE leaveform l SET exported = 1 ${whereClause}`, params);
        return new Response(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="leave_report.xlsx"',
            },
        });

    } catch (err) {
        console.error( err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}