import { NextResponse } from "next/server";

import { HABIT_FREQUENCIES } from "@/constants";
import { supabase } from "@/lib/supabaseClient";
import { getAuthenticatedUser, getBearerTokenFromRequest } from "@/lib/utils";

export async function GET(request: Request) {
  const token = getBearerTokenFromRequest(request);
  const user = await getAuthenticatedUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const resolutionId = searchParams.get("resolutionId");

  if (!resolutionId) {
    return NextResponse.json(
      { error: "resolutionId query param is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("resolution_id", resolutionId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const token = getBearerTokenFromRequest(request);
  const user = await getAuthenticatedUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { resolutionId, title, frequency } = await request.json();

  if (!resolutionId || !title || !frequency) {
    return NextResponse.json(
      { error: "resolutionId, title, and frequency are required" },
      { status: 400 }
    );
  }

  if (!HABIT_FREQUENCIES.includes(frequency)) {
    return NextResponse.json(
      { error: "frequency must be either 'daily' or 'weekly'" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      resolution_id: resolutionId,
      title,
      frequency,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const token = getBearerTokenFromRequest(request);
  const user = await getAuthenticatedUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...updates } = await request.json();

  if (updates.frequency && !HABIT_FREQUENCIES.includes(updates.frequency)) {
    return NextResponse.json(
      { error: "frequency must be either 'daily' or 'weekly'" },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "Habit id is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const token = getBearerTokenFromRequest(request);
  const user = await getAuthenticatedUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Habit id is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("habits").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
