import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: "Word parameter is required" }, { status: 400 });
  }

  const lowercaseWord = word.toLowerCase();

  try {
    const dbResult = await pool.query('SELECT data FROM words WHERE word = $1', [lowercaseWord]);
    
    if (dbResult.rows.length > 0) {
      console.log(`Cache Hit for: ${lowercaseWord}`);
      return NextResponse.json({ data: dbResult.rows[0].data }); 
    }

    console.log(`Cache Miss for: ${lowercaseWord}. Fetching from external API...`);
    const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${lowercaseWord}`);
    
    if (!result.ok) {
      return NextResponse.json({ error: "Word not found or API error" }, { status: result.status });
    }

    const data = await result.json();

    await pool.query(
      'INSERT INTO words (word, data) VALUES ($1, $2) ON CONFLICT (word) DO NOTHING',
      [lowercaseWord, JSON.stringify(data)]
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Database/API error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
