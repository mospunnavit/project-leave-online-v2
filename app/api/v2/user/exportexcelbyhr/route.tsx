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
            conditions.push('l.leave_date BETWEEN ? AND ?');
            params.push(from_date.trim(), to_date.trim());
        }
        if (status.trim()) {
            conditions.push('l.status = ?');
            params.push(status.trim());
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const [datas] = await db.query(
            `SELECT l.id, u.username,
               l.leave_date, l.lt_code, l.lc_code, l.usequotaleave
             FROM leaveform l 
             LEFT JOIN users u ON l.u_id = u.id
             LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
              
             ${whereClause}`,
            [...params]
        );

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
            worksheet.addRow({
                username: data.username,
                leave_date: formatThaiDateYYYYMMDD(data.leave_date),
                shift_code: '00',
                lt_code: data.lt_code,
                lc_code: data.lc_code,
                leave_method: 'ตามที่บันทึก',
                usequotaleave: data.usequotaleave,
            });
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