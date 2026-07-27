import { ImageResponse } from "next/og";

// Replaces the create-next-app favicon. Generated rather than shipped as a
// binary so it stays in step with the palette; swap for a real mark when
// the academy has one.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3B5987",
          color: "#F1F4FB",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        A
      </div>
    ),
    size,
  );
}
