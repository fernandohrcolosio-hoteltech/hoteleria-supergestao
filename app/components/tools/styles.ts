import type { CSSProperties } from "react";

export const s = {
  badge: {
    display: "inline-block",
    background: "var(--gold-pale, #f5e9c8)",
    color: "#7a5c1e",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: 20,
    marginBottom: 10,
  } as CSSProperties,

  desc: {
    color: "var(--text-muted)",
    fontSize: 15,
    maxWidth: 600,
    lineHeight: 1.6,
  } as CSSProperties,

  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--navy)",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  } as CSSProperties,

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--navy-mid, #1a2e45)",
    marginBottom: 6,
  } as CSSProperties,

  textarea: {
    width: "100%",
    background: "var(--cream)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "11px 14px",
    fontFamily: "inherit",
    fontSize: 14,
    color: "var(--text-main)",
    outline: "none",
    resize: "vertical",
    minHeight: 80,
  } as CSSProperties,

  input: {
    width: "100%",
    background: "var(--cream)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "11px 14px",
    fontFamily: "inherit",
    fontSize: 14,
    color: "var(--text-main)",
    outline: "none",
  } as CSSProperties,

  actionsRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
  } as CSSProperties,
};

export const card: CSSProperties = {
  background: "var(--white)",
  border: "1px solid var(--border)",
  borderRadius: 20,
  padding: 28,
  marginBottom: 20,
  boxShadow: "0 4px 24px rgba(13,27,42,0.10)",
};

export const btnGold: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "var(--gold)",
  color: "var(--navy)",
  border: "none",
  borderRadius: 10,
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

export const btnOutline: CSSProperties = {
  background: "transparent",
  border: "1.5px solid var(--border)",
  color: "var(--navy)",
  borderRadius: 10,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

export const toolHeader: CSSProperties = {
  marginBottom: 32,
};
