import { NextResponse } from "next/server";
import { listCourses } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ courses: listCourses() });
}
