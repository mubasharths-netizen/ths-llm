import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { listCaseEvents, listComplaints, listDiscipline, reviewCase } from "@/lib/conduct";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { error } = await requireSession(["admin"]);
  if (error) return error;
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if (type && id) {
    return NextResponse.json({ events: listCaseEvents(type, id) });
  }
  return NextResponse.json({
    complaints: listComplaints({}),
    reports: listDiscipline({}),
  });
}

export async function PATCH(request: Request) {
  const { user, error } = await requireSession(["admin"]);
  if (error) return error;
  try {
    const body = (await request.json()) as {
      type?: string;
      id?: string;
      status?: string;
      adminNotes?: string;
      visibleToStudent?: boolean;
    };
    const type = body.type === "discipline" ? "discipline" : body.type === "complaint" ? "complaint" : null;
    const id = String(body.id || "");
    const status = String(body.status || "").trim();
    if (!type || !id || !status) {
      return NextResponse.json({ error: "Case, status, and type are required." }, { status: 400 });
    }
    const allowed = new Set(["Pending", "Under Review", "Resolved", "Closed", "Recorded", "Approved", "Rejected"]);
    if (!allowed.has(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const result = reviewCase({
      adminName: user!.name,
      type,
      id,
      status,
      adminNotes: typeof body.adminNotes === "string" ? body.adminNotes.trim() : "",
      visibleToStudent: Boolean(body.visibleToStudent),
    });
    if (result.error) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to update the case." }, { status: 400 });
  }
}
