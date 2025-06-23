import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
    const body = await req.json();

    const { holiday_date, holiday_remark, is_sunday } = body;
    if (!holiday_date || !holiday_remark) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    try {
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO holiday (date, remark, sunday) VALUES (?, ?, ?)',
            [holiday_date, holiday_remark, is_sunday]
        );
        return NextResponse.json(result);
    } catch (err: Error | any) {
        console.log(err);
        if(err.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Holiday already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}