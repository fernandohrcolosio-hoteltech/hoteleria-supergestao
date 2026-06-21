import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Add CSP header without nonce to allow Mercado Pago
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://secure.mlstatic.com https://checkout.mercadopago.com https://www.mercadopago.com; frame-src 'self' https://checkout.mercadopago.com https://www.mercadopago.com; connect-src 'self' https://api.mercadopago.com https://checkout.mercadopago.com https://www.mercadopago.com https://trwsrekqqpvqmdgzjxjx.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;"
  );

  // Protect authenticated routes
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/ferramenta")) {
    const user = response.headers.get("x-user-id");
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
