import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getAuthenticatedUser, getBearerTokenFromRequest } from "@/lib/utils";
import { MAX_CONCURRENT_RESOLUTIONS } from "@/constants";

export async function GET(request: Request) {
  const token = getBearerTokenFromRequest(request);
  const user = await getAuthenticatedUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create authenticated client with user's token for RLS
  const supabase = await createSupabaseServerClient(token);
  const { data, error } = await supabase
    .from("resolutions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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

  // Check active resolution count
  // Create authenticated client with user's token for RLS
  const supabase = await createSupabaseServerClient(token);
  const { count, error: countError } = await supabase
    .from("resolutions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if (count !== null && count >= MAX_CONCURRENT_RESOLUTIONS) {
    return NextResponse.json(
      {
        error: `You've reached the maximum of ${MAX_CONCURRENT_RESOLUTIONS} active resolutions. Complete or archive one to create a new resolution.`,
      },
      { status: 403 }
    );
  }

  const {
    title,
    description,
    why_text,
    start_date,
    target_date,
    privacy = "private",
  } = await request.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!why_text || why_text.trim().length < 10) {
    return NextResponse.json(
      {
        error:
          "Please provide a reason why this resolution matters to you (at least 10 characters).",
      },
      { status: 400 }
    );
  }

  if (!target_date) {
    return NextResponse.json(
      { error: "Target date is required" },
      { status: 400 }
    );
  }

  // Set start_date to today if not provided
  const startDate = start_date || new Date().toISOString().split("T")[0];
  const targetDate = target_date;

  // Validate date range
  if (new Date(targetDate) < new Date(startDate)) {
    return NextResponse.json(
      { error: "Target date must be on or after start date." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("resolutions")
    .insert({
      user_id: user.id,
      title,
      description,
      why_text,
      start_date: startDate,
      target_date: targetDate,
      privacy,
      status: "active",
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
      { error: "Resolution id is required" },
      { status: 400 }
    );
  }

  // Create authenticated client with user's token for RLS
  const supabase = await createSupabaseServerClient(token);
  const { data, error } = await supabase
    .from("resolutions")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
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
      { error: "Resolution id is required" },
      { status: 400 }
    );
  }

  // Create authenticated client with user's token for RLS
  const supabase = await createSupabaseServerClient(token);
  const { error } = await supabase
    .from("resolutions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
