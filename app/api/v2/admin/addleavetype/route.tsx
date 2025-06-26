import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
    const body = await req.json();

    const { lt_code, lt_name, quotaperyear } = body;
    if (!lt_code || !lt_name || !quotaperyear) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    try {
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO leave_types (lt_code, lt_name, quotaperyear) VALUES (?, ?, ?)',
            [lt_code, lt_name, quotaperyear]
        );
        return NextResponse.json(result);
    } catch (err: Error | any) {
        console.log(err);
        if(err.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'leavetypes already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}