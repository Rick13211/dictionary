import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: "Word parameter is required" }, { status: 400 });
  }

  try {
    const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await result.json();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch from dictionary API" }, { status: 500 });
  }
}