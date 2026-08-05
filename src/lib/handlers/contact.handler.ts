/**
 * contact.handler.ts
 *
 * Server-side data fetcher for the /contact page.
 * Fetches social links with context = "contact".
 */

import { getSocialLinksByContext } from "./layout.handler";
import type { DSocialLink } from "@/types/dashboard.types";

export async function getContactSocialLinks(): Promise<DSocialLink[]> {
  return getSocialLinksByContext("contact");
}
