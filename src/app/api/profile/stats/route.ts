import { NextResponse } from 'next/server';
import { getProfileStats } from '@/actions/registro-finca/get-profile-stats';

export async function GET() {
  try {
    const stats = await getProfileStats();
    if (!stats) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API /api/profile/stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
