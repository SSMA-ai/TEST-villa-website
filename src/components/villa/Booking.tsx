"use client";

import { useState } from "react";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const NIGHTLY_RATE = 4800;

function dateKey(y: number, m: number, d: number) {
  return y * 10000 + m * 100 + d;
}

function formatKey(k: number | null) {
  if (k === null) return "—";
  const y = Math.floor(k / 10000);
  const m = Math.floor(k / 100) % 100;
  const d = k % 100;
  return new Date(y, m, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Booking() {
  const now = new Date();
  const [y, setY] = useState(now.getFullYear());
  const [m, setM] = useState(now.getMonth());
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const pick = (py: number, pm: number, pd: number) => {
    const k = dateKey(py, pm, pd);
    if (start === null || (start !== null && end !== null)) {
      setStart(k);
      setEnd(null);
    } else if (k <= start) {
      setStart(k);
      setEnd(null);
    } else {
      setEnd(k);
    }
  };

  const nights = (() => {
    if (start === null || end === null) return 0;
    const a = new Date(Math.floor(start / 10000), Math.floor(start / 100) % 100, start % 100);
    const b = new Date(Math.floor(end / 10000), Math.floor(end / 100) % 100, end % 100);
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  })();

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const days: {
    key: string;
    label: string;
    disabled: boolean;
    bg: string;
    color: string;
    opacity: number;
    onClick: (() => void) | null;
  }[] = [];

  for (let i = 0; i < firstDow; i++) {
    days.push({
      key: `b${i}`,
      label: "",
      disabled: true,
      bg: "transparent",
      color: "transparent",
      opacity: 1,
      onClick: null,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const k = dateKey(y, m, d);
    const past = k < todayKey;
    const isStart = k === start;
    const isEnd = k === end;
    const inRange = start !== null && end !== null && k > start && k < end;
    days.push({
      key: `d${k}`,
      label: String(d),
      disabled: past,
      bg: isStart || isEnd ? "#1C1A17" : inRange ? "#E8E1D5" : "transparent",
      color: isStart || isEnd ? "#F7F4EF" : past ? "#C7BFB2" : "#1C1A17",
      opacity: past ? 0.55 : 1,
      onClick: past ? null : () => pick(y, m, d),
    });
  }

  const monthLabel = new Date(y, m, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const arrivalLabel = formatKey(start);
  const departureLabel = formatKey(end);
  const totalLabel = nights ? `${nights} nights · €${(nights * NIGHTLY_RATE).toLocaleString("en-GB")}` : "—";
  const submitLabel = nights ? `REQUEST ${nights} NIGHTS` : "REQUEST AVAILABILITY";
  const hint =
    start === null
      ? "Select an arrival date on the calendar."
      : end === null
        ? "Now select a departure date."
        : "Minimum stay 5 nights in high season.";
  const guestFirst = first.trim() || "guest";

  const prevMonth = () => {
    if (m === 0) {
      setY(y - 1);
      setM(11);
    } else {
      setM(m - 1);
    }
  };
  const nextMonth = () => {
    if (m === 11) {
      setY(y + 1);
      setM(0);
    } else {
      setM(m + 1);
    }
  };

  const reset = () => {
    setSent(false);
    setStart(null);
    setEnd(null);
    setFirst("");
    setLast("");
    setEmail("");
    setPhone("");
    setNotes("");
  };

  const fieldStyle = {
    padding: "11px 0",
    border: "none",
    borderBottom: "1px solid #E3D9C6",
    background: "transparent",
    fontSize: 15,
    fontWeight: 300,
    outline: "none",
    width: "100%",
  } as const;

  const fieldLabelStyle = { fontSize: 9, letterSpacing: "0.28em", color: "#A09683" } as const;

  return (
    <section id="booking" style={{ background: "#F7F4EF" }}>
      <div className="booking-section" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          className="section-header-row"
          style={{
            justifyContent: "space-between",
            gap: 40,
            marginBottom: 60,
          }}
        >
          <div>
            <span style={{ fontSize: 9.5, letterSpacing: "0.42em", color: "#A98A54" }}>
              06 — RESERVE
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
              Choose your dates.
            </h2>
          </div>
          <p style={{ margin: 0, maxWidth: 320, fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "#6B6459" }}>
            Enquiries are answered personally within one business day. No payment is taken online.
          </p>
        </div>

        <div
          className="booking-grid"
          style={{
            background: "#E3D9C6",
            border: "1px solid #E3D9C6",
          }}
        >
          <div className="booking-panel" style={{ background: "#FFFFFF" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              <button
                type="button"
                onClick={prevMonth}
                className="cal-nav-btn"
                style={{
                  width: 38,
                  height: 38,
                  border: "1px solid #E3D9C6",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#6B6459",
                  transition: "border-color 300ms ease, color 300ms ease",
                }}
              >
                ←
              </button>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.04em" }}>
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="cal-nav-btn"
                style={{
                  width: 38,
                  height: 38,
                  border: "1px solid #E3D9C6",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#6B6459",
                  transition: "border-color 300ms ease, color 300ms ease",
                }}
              >
                →
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
                marginBottom: 10,
              }}
            >
              {WEEKDAYS.map((w) => (
                <span key={w} style={{ textAlign: "center", fontSize: 9, letterSpacing: "0.18em", color: "#A09683" }}>
                  {w}
                </span>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {days.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  disabled={d.disabled}
                  onClick={d.onClick ?? undefined}
                  style={{
                    height: 46,
                    border: "none",
                    borderRadius: 0,
                    cursor: d.onClick ? "pointer" : "default",
                    fontSize: 13.5,
                    fontWeight: 300,
                    background: d.bg,
                    color: d.color,
                    opacity: d.opacity,
                    transition: "background 220ms ease, color 220ms ease",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 40, marginTop: 34, paddingTop: 26, borderTop: "1px solid #E8E1D5" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "#A98A54" }}>ARRIVAL</span>
                <span style={{ fontSize: 15, fontWeight: 300 }}>{arrivalLabel}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "#A98A54" }}>DEPARTURE</span>
                <span style={{ fontSize: 15, fontWeight: 300 }}>{departureLabel}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginLeft: "auto", textAlign: "right" }}>
                <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "#A98A54" }}>TOTAL</span>
                <span style={{ fontSize: 15, fontWeight: 300 }}>{totalLabel}</span>
              </div>
            </div>
          </div>

          <div className="booking-panel" style={{ background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 22 }}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "40px 0" }}>
                <span style={{ fontSize: 9.5, letterSpacing: "0.36em", color: "#A98A54" }}>
                  ENQUIRY RECEIVED
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 32, lineHeight: 1.2 }}>
                  Thank you — {guestFirst}.
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 300, lineHeight: 1.8, color: "#6B6459" }}>
                  We have your request for {arrivalLabel} → {departureLabel}. Célia from the
                  estate office will write to you within one business day.
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-outline-dark"
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 12,
                    padding: "13px 26px",
                    border: "1px solid #1C1A17",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 10.5,
                    letterSpacing: "0.26em",
                    transition: "background 300ms ease, color 300ms ease",
                  }}
                >
                  NEW ENQUIRY
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabelStyle}>FIRST NAME</span>
                    <input
                      className="field-input"
                      value={first}
                      onChange={(e) => setFirst(e.target.value)}
                      placeholder="Camille"
                      style={fieldStyle}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    <span style={fieldLabelStyle}>LAST NAME</span>
                    <input
                      className="field-input"
                      value={last}
                      onChange={(e) => setLast(e.target.value)}
                      placeholder="Rousseau"
                      style={fieldStyle}
                    />
                  </label>
                </div>
                <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={fieldLabelStyle}>EMAIL</span>
                  <input
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={fieldStyle}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={fieldLabelStyle}>TELEPHONE</span>
                  <input
                    className="field-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 00 00 00 00"
                    style={fieldStyle}
                  />
                </label>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <span style={fieldLabelStyle}>GUESTS</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="guest-btn"
                      style={{
                        width: 36,
                        height: 36,
                        border: "1px solid #E3D9C6",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#6B6459",
                        transition: "border-color 300ms ease",
                      }}
                    >
                      –
                    </button>
                    <span style={{ minWidth: 28, textAlign: "center", fontFamily: "var(--font-display)", fontSize: 22 }}>
                      {guests}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(12, g + 1))}
                      className="guest-btn"
                      style={{
                        width: 36,
                        height: 36,
                        border: "1px solid #E3D9C6",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#6B6459",
                        transition: "border-color 300ms ease",
                      }}
                    >
                      +
                    </button>
                    <span style={{ fontSize: 12.5, fontWeight: 300, color: "#9A9184" }}>of 12 maximum</span>
                  </div>
                </div>

                <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={fieldLabelStyle}>NOTES</span>
                  <textarea
                    className="field-input"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Chef, transfers, occasion…"
                    style={{ ...fieldStyle, resize: "none" }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setSent(true)}
                  className="btn-submit"
                  style={{
                    marginTop: 8,
                    padding: "17px 0",
                    border: "none",
                    background: "#1C1A17",
                    color: "#F7F4EF",
                    cursor: "pointer",
                    fontSize: 10.5,
                    letterSpacing: "0.3em",
                    transition: "background 350ms ease",
                  }}
                >
                  {submitLabel}
                </button>
                <span style={{ fontSize: 12, fontWeight: 300, color: "#A09683" }}>{hint}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
