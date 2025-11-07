import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";
import { getAuthenticatedUser, getBearerTokenFromRequest } from "@/lib/utils";

export async function GET(request: Request) {
  const token = getBearerTokenFromRequest(request);
  const user = await getAuthenticatedUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const habitId = searchParams.get("habitId");

  if (!habitId) {
    return NextResponse.json(
      { error: "habitId query param is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("habit_id", habitId)
    .order("checkin_date", { ascending: false });

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

  const { habitId, checkinDate, completed } = await request.json();

  if (!habitId || !checkinDate) {
    return NextResponse.json(
      { error: "habitId and checkinDate are required" },
      { status: 400 }
    );
  }

  const dateValue = new Date(checkinDate);
  if (Number.isNaN(dateValue.getTime())) {
    return NextResponse.json(
      { error: "checkinDate must be a valid date" },
      { status: 400 }
    );
  }

  const checkinDateOnly = dateValue.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("checkins")
    .insert({
      habit_id: habitId,
      checkin_date: checkinDateOnly,
      completed: Boolean(completed),
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

  if (!id) {
    return NextResponse.json(
      { error: "Checkin id is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("checkins")
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
      { error: "Checkin id is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("checkins").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
