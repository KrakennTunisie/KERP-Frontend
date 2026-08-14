// app/api/invoice-ocr/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("data") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }

  // On reconstruit un FormData propre pour l'envoyer à n8n
  const n8nFormData = new FormData();
  n8nFormData.append("data", file, file.name);

  const res = await fetch(process.env.N8N_PURCHASE_ORDER_OCR!, {
    method: "POST",
    body: n8nFormData,
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Extraction request failed with status ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}