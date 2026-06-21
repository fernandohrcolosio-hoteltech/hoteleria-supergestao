import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://secure.mlstatic.com https://checkout.mercadopago.com https://www.mercadopago.com https://*.mercadopago.com",
            "frame-src 'self' https://checkout.mercadopago.com https://www.mercadopago.com https://*.mercadopago.com",
            "connect-src 'self' https://api.mercadopago.com https://checkout.mercadopago.com https://www.mercadopago.com https://*.mercadopago.com https://trwsrekqqpvqmdgzjxjx.supabase.co",
            "img-src 'self' data: https:",
            "style-src 'self' 'unsafe-inline' https://secure.mlstatic.com https://checkout.mercadopago.com",
            "font-src 'self' data:",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;
