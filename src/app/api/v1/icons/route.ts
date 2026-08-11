import { NextRequest } from "next/server";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, apiError, serverError } from "@/app/api/lib/api-helpers";

// We import the JSON data outside the handler so it stays in memory across requests
import iconsList from "@/data/icons-list.json";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const platform = searchParams.get("platform");

    if (!platform || (platform !== "lucide" && platform !== "react-icons")) {
      return apiError("Invalid or missing 'platform' parameter (must be 'lucide' or 'react-icons')", 400);
    }

    const maxResults = 50;
    const query = q.toLowerCase();

    // Get the full list for the requested platform
    const allIcons: string[] = iconsList[platform] || [];

    if (!query) {
      // If no query, just return the first 50
      return ok({
        results: allIcons.slice(0, maxResults),
        total: allIcons.length,
      });
    }

    // Filter based on query
    const matched = [];
    for (const icon of allIcons) {
      if (icon.toLowerCase().includes(query)) {
        matched.push(icon);
      }
      if (matched.length >= maxResults) {
        break; // Stop early once we hit max
      }
    }

    return ok({
      results: matched,
      total: allIcons.length,
    });
  } catch (err) {
    return serverError(err);
  }
}
