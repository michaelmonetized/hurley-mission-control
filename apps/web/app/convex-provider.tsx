"use client";

import { ReactNode, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
