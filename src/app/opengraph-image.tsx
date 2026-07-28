import { ImageResponse } from "next/og";

export const alt =
  "A.O.A | As-Sattar Online Academy. Learn the Qur'an in its own language.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The social card. Built from the palette rather than a shipped asset, so it
// cannot drift out of step with the site.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F1F4FB",
          color: "#1B2A45",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "0.06em" }}>
            A.O.A
          </span>
          <span
            style={{
              fontSize: 18,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#3B5987",
            }}
          >
            As-Sattar Online Academy
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Learn the Qur&rsquo;an in its own language.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "3px solid #1B2A45",
            paddingTop: 24,
            fontSize: 22,
            color: "#3B5987",
          }}
        >
          <span>Live classes in English, Arabic and Yoruba</span>
          <span>First lesson free</span>
        </div>
      </div>
    ),
    size,
  );
}
