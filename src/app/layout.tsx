import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          display: "flex",
          height: "100vh",
          background: "#0b0f19",
          color: "#e5e7eb",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <Providers>
          <Sidebar />

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <header
              style={{
                height: 56,
                borderBottom: "1px solid #1f2937",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: 600 }}>TaskFlow</div>

              <input
                placeholder="Search cards..."
                style={{
                  width: 320,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #374151",
                  background: "#111827",
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />

              <div style={{ fontSize: 14, color: "#9ca3af" }}>User</div>
            </header>

            <main style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}