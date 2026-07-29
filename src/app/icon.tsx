import { ImageResponse } from "next/og";

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
          background: "#f2600c",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2.4px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "white" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
