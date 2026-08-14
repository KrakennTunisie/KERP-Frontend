// app/api/resume-statics/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const stats = await req.json();
  console.log("hi")
  const res = await fetch(process.env.N8N_RESUME_STATICS!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stats),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `n8n request failed with status ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}