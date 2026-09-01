import Image from "next/image";
import { Reveal } from "./Reveal";

type RoomFeatureProps = {
  id?: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  kicker: string;
  heading: string;
  body: string;
  tags: string[];
  priority?: boolean;
};

export function RoomFeature({
  id,
  image,
  imageAlt,
  imagePosition,
  kicker,
  heading,
  body,
  tags,
  priority,
}: RoomFeatureProps) {
  const imageBlock = (
    <div
      className="roomfeature-image"
      style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="(max-width: 767px) 100vw, 50vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );

  const textBlock = (
    <Reveal className="roomfeature-text">
      <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "#A98A54" }}>{kicker}</span>
      <h2
        className="heading-lg"
        style={{
          margin: "22px 0 0",
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          lineHeight: 1.15,
          color: "#1C1A17",
        }}
      >
        {heading}
      </h2>
      <p style={{ margin: "22px 0 0", fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: "#45403A", maxWidth: 480 }}>
        {body}
      </p>
      <div
        style={{
          display: "flex",
          gap: 30,
          marginTop: 28,
          paddingTop: 22,
          borderTop: "1px solid #E3D9C6",
        }}
      >
        {tags.map((tag) => (
          <span key={tag} style={{ fontSize: 10.5, letterSpacing: "0.2em", color: "#6B6459" }}>
            {tag}
          </span>
        ))}
      </div>
    </Reveal>
  );

  return (
    <section
      id={id}
      className="roomfeature-section roomfeature-grid"
      style={{
        maxWidth: 1320,
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
