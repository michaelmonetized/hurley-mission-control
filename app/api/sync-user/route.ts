import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://accurate-goldfinch-601.convex.cloud";

export async function POST(request: NextRequest) {
  try {
    const { clerkId, displayName } = await request.json();

    if (!clerkId || !displayName) {
      return NextResponse.json(
        { error: "clerkId and displayName required" },
        { status: 400 }
      );
    }

    // Check if user exists by making HTTP call to Convex
    let queryResponse;
    try {
      const queryRes = await fetch(`${CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "queries:getUserByClerkId",
          args: { clerkId },
        }),
      });
      queryResponse = await queryRes.json();
    } catch (fetchErr) {
      console.error("Query fetch failed:", fetchErr);
      throw fetchErr;
    }

    if (queryResponse && !queryResponse.error && queryResponse.value) {
      return NextResponse.json(
        { userId: queryResponse.value._id },
        { status: 200 }
      );
    }

    // Create new user
    let mutationResponse;
    try {
      const mutRes = await fetch(`${CONVEX_URL}/api/mutation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "mutations:createUser",
          args: {
            kind: "human",
            clerkId,
            displayName,
          },
        }),
      });
      mutationResponse = await mutRes.json();
    } catch (fetchErr) {
      console.error("Mutation fetch failed:", fetchErr);
      throw fetchErr;
    }

    if (mutationResponse?.error) {
      throw new Error(`Mutation error: ${mutationResponse.error}`);
    }

    return NextResponse.json(
      { userId: mutationResponse.value || mutationResponse },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Failed to sync user:", errorMsg);
    return NextResponse.json(
      { error: "Failed to sync user", details: process.env.NODE_ENV === "development" ? errorMsg : undefined },
      { status: 500 }
    );
  }
}
