import { NextResponse } from "next/server";
import { estimateEmissions } from "../../../lib/emissions-estimator";

type AnalyzeRequestBody = {
  text?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;

    if (typeof body.text !== "string" || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: "El campo text debe ser una cadena no vacia." },
        { status: 400 },
      );
    }

    return NextResponse.json(estimateEmissions(body.text));
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud debe ser JSON valido." },
      { status: 400 },
    );
  }
}
