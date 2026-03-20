import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "http://localhost:3210";

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
    const queryResponse = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "queries:getUserByClerkId",
        args: { clerkId },
      }),
    }).then((r) => r.json());

    if (queryResponse && !queryResponse.error) {
      return NextResponse.json(
        { userId: queryResponse.value?._id || queryResponse._id },
        { status: 200 }
      );
    }

    // Create new user
    const mutationResponse = await fetch(`${CONVEX_URL}/api/mutation`, {
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
    }).then((r) => r.json());

    if (mutationResponse?.error) {
      throw new Error(mutationResponse.error);
    }

    return NextResponse.json(
      { userId: mutationResponse.value || mutationResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to sync user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
