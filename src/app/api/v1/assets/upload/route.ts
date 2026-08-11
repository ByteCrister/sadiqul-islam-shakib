import { NextRequest } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { asset, assetFile } from "@/db/schema";
import { uploadAsset, type CloudinaryFolder } from "@/lib/cloudinary/cloudinary.lib";
import { requireAuth } from "@/app/api/lib/require-auth";
import { ok, serverError, badRequest } from "@/app/api/lib/api-helpers";

/**
 * Retry a DB operation up to `maxAttempts` times on transient connection errors.
 * Neon's free-tier may cold-start and fail on the first attempt; a short wait
 * and retry is enough to let the connection warm up.
 */
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3, delayMs = 1500): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const isTransient =
        err?.message?.includes("Connect Timeout") ||
        err?.message?.includes("fetch failed") ||
        err?.code === "UND_ERR_CONNECT_TIMEOUT";

      if (!isTransient || attempt === maxAttempts) throw err;
      console.warn(`[DB] Transient error on attempt ${attempt}/${maxAttempts}, retrying in ${delayMs}ms…`, err.message);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const { base64, folder, name, usedIn } = body as {
      base64: string;
      folder: CloudinaryFolder;
      name: string;
      usedIn: string;
    };

    if (!base64 || !folder || !name || !usedIn) {
      return badRequest("Missing required fields: base64, folder, name, usedIn");
    }

    // Extract raw base64 from Data URI: "data:image/png;base64,iVBORw0..."
    const matches = base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-.+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return badRequest("Invalid base64 string format. Must be a valid data URI.");
    }
    const rawBase64 = matches[2];
    const buffer = Buffer.from(rawBase64, "base64");

    // Enforce 2MB limit on the backend as a safety net
    const bytesLimit = 2 * 1024 * 1024;
    if (buffer.length > bytesLimit) {
      return badRequest("File exceeds the 2MB limit.");
    }

    // Compute SHA-256 checksum for deduplication
    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check if an asset_file with this checksum already exists (with retry on cold-start)
    const [existingFile] = await withRetry(() =>
      db.select().from(assetFile).where(eq(assetFile.checksum, checksum)).limit(1)
    );

    let assetFileId: string;

    if (existingFile) {
      // ── Deduplication: Reuse existing file, skip Cloudinary upload ────────
      assetFileId = existingFile.id;
    } else {
      // ── New file: Upload to Cloudinary and persist asset_file row ─────────
      const meta = await uploadAsset(buffer, folder, checksum);

      const [newFile] = await withRetry(() =>
        db
          .insert(assetFile)
          .values({
            cloudinaryPublicId: meta.cloudinaryPublicId,
            url: meta.url,
            format: meta.format || (folder === "pdfs" ? "pdf" : "bin"),
            bytes: meta.bytes,
            width: meta.width ?? null,
            height: meta.height ?? null,
            folder: meta.folder,
            resourceType: meta.resourceType,
            checksum: meta.checksum,
          })
          .returning()
      );

      if (!newFile) throw new Error("Failed to insert asset_file");
      assetFileId = newFile.id;
    }

    // Create a new logical asset record pointing at the (new or reused) file
    const [newAsset] = await withRetry(() =>
      db.insert(asset).values({ name, usedIn, assetFileId }).returning()
    );

    if (!newAsset) throw new Error("Failed to insert asset");

    return ok({ assetId: newAsset.id, assetFileId, deduplicated: !!existingFile }, 201);
  } catch (err) {
    return serverError(err);
  }
}
