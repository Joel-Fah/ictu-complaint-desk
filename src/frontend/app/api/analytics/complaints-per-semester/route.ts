// app/api/analytics/complaints-per-semester/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - replace with your actual data source
  return NextResponse.json([
    { semester: "Spring 2023", total_complaints: 15 },
    { semester: "Fall 2023", total_complaints: 22 }
  ]);
}