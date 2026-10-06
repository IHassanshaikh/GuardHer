/* ===== GUARDHER API Routes — User & Contacts ===== */

import { NextRequest, NextResponse } from "next/server";
import {
  getUser,
  updateUser,
  addTrustedContact,
  removeTrustedContact,
  generateId,
} from "@/lib/store";
import type { TrustedContact } from "@/lib/types";

// GET /api/user — get current user profile + contacts
export async function GET() {
  const user = getUser();
  return NextResponse.json({ user });
}

// PATCH /api/user — update user profile or manage contacts
export async function PATCH(req: NextRequest) {
  const body = await req.json();

  // Add a trusted contact
  if (body.addContact) {
    const contact: TrustedContact = {
      id: generateId("tc"),
      name: body.addContact.name,
      phone: body.addContact.phone,
      relationship: body.addContact.relationship,
    };
    addTrustedContact(contact);
    return NextResponse.json({ user: getUser() });
  }

  // Remove a trusted contact
  if (body.removeContactId) {
    removeTrustedContact(body.removeContactId);
    return NextResponse.json({ user: getUser() });
  }

  // Update profile
  const user = updateUser(body);
  return NextResponse.json({ user });
}
