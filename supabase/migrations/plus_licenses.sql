-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS plus_licenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  tool_slug text NOT NULL,
  used_by text,           -- session_id de quem ativou
  activated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS plus_licenses_code_idx ON plus_licenses(code);
CREATE INDEX IF NOT EXISTS plus_licenses_tool_slug_idx ON plus_licenses(tool_slug);
CREATE INDEX IF NOT EXISTS plus_licenses_used_by_idx ON plus_licenses(used_by);
