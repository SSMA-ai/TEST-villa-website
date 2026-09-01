import Image from "next/image";
import { gallery } from "@/lib/villa-data";

export function Gallery() {
  return (
    <section id="gallery" style={{ background: "#EFEAE1" }}>
      <div className="gallery-section" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          className="section-header-row"
          style={{
            justifyContent: "space-between",
            gap: 40,
            marginBottom: 52,
          }}
        >
          <div>
            <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "#A98A54" }}>
              05 — GALLERY
            </span>
            <h2
              className="heading-xl"
              style={{
                margin: "24px 0 0",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                lineHeight: 1.12,
              }}
            >
              Twelve rooms, one horizon.
            </h2>
          </div>
        </div>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <figure
              key={item.file}
              style={{
                position: "relative",
                margin: 0,
                aspectRatio: "4 / 5",
                overflow: "hidden",
                backgroundColor: "#E3DACB",
              }}
            >
              <Image
                src={item.file}
                alt={item.label}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(20,19,16,0) 60%, rgba(20,19,16,0.55) 100%)",
                }}
              />
              <figcaption
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: "0.28em", color: "#F7F4EF" }}>
                  {item.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
