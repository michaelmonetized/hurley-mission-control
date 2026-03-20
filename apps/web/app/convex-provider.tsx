"use client";

import { ReactNode, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://accurate-goldfinch-601.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    // For now, skip auth token setup (will integrate Clerk later)
    // convex.setAuth(async () => {
    //   const token = await getToken({ template: "convex" });
    //   return token || "";
    // });
  }, []);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
