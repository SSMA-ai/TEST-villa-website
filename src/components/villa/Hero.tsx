export function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        width: "100vw",
        maxWidth: "100%",
        height: "100vh",
        minHeight: 640,
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <video
        src="/videos/hero-aerial.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          backgroundColor: "#2E2B26",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(20,19,16,0.42) 0%, rgba(20,19,16,0.08) 34%, rgba(20,19,16,0.55) 100%)",
          opacity: 0.45,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ width: "min(720px, 100%)", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginBottom: 30,
            }}
          >
            <span style={{ width: 34, height: 1, background: "rgba(255,255,255,0.45)" }} />
            <span
              style={{
                fontSize: 9.5,
                letterSpacing: "0.42em",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              CÔTE D&apos;AZUR · FRANCE
            </span>
            <span style={{ width: 34, height: 1, background: "rgba(255,255,255,0.45)" }} />
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(46px, 6.6vw, 96px)",
              lineHeight: 0.98,
              letterSpacing: "0.02em",
              color: "#FFFFFF",
              textShadow: "0 2px 40px rgba(20,19,16,0.45)",
            }}
          >
            Villa Aurora
          </h1>
          <p
            style={{
              margin: "26px auto 0",
              maxWidth: 430,
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 1px 20px rgba(20,19,16,0.5)",
            }}
          >
            Six suites above the water, a cypress terrace, and nothing on the horizon but the
            sea. Reserved for one party at a time.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 38,
            }}
          >
            <a
              href="#booking"
              className="btn-hero-primary"
              style={{
                padding: "15px 34px",
                background: "rgba(255,255,255,0.94)",
                color: "#1C1A17",
                fontSize: 10.5,
                letterSpacing: "0.26em",
                transition: "background 350ms ease",
              }}
            >
              RESERVE THE VILLA
            </a>
            <a
              href="#rooms"
              className="btn-hero-secondary"
              style={{
                padding: "15px 30px",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#FFFFFF",
                fontSize: 10.5,
                letterSpacing: "0.26em",
                transition: "border-color 350ms ease",
              }}
            >
              VIEW THE HOUSE
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 42,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            fontSize: 9.5,
            letterSpacing: "0.46em",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          SCROLL TO EXPLORE
        </span>
        <span
          style={{
            width: 1,
            height: 92,
            background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0))",
          }}
        />
      </div>
    </section>
  );
}
