import { NextResponse, type NextRequest } from "next/server";

const SLIDES_INDEX_PATH = "/slider";

// Every page except the slide decks is hidden for now.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(SLIDES_INDEX_PATH, request.url));
}

export const config = {
  matcher: ["/((?!slider|_next/static|_next/image|.*\\..*).*)"],
};
