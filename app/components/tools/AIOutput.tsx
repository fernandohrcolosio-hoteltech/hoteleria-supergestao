"use client";

export function AIOutput({
  visible,
  loading,
  result,
}: {
  visible: boolean;
  loading: boolean;
  result: string;
}) {
  if (!visible) return null;

  return (
    <div
      style={{
        background: "var(--navy)",
        color: "var(--cream)",
        borderRadius: 20,
        padding: 28,
        marginTop: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, var(--gold), var(--gold-light, #e2c47a), var(--gold))",
        }}
      />
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--gold)",
          marginBottom: 14,
        }}
      >
        ✦ Análise IA
      </div>
      {loading ? (
        <div style={{ color: "var(--gold-light, #e2c47a)", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="inline-block animate-spin">⟳</span> Analisando com IA...
        </div>
      ) : (
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.75,
            color: "rgba(250,248,243,0.9)",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}
