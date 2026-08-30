import { Header } from "@/components/villa/Header";
import { Hero } from "@/components/villa/Hero";
import { StatsBar } from "@/components/villa/StatsBar";
import { About } from "@/components/villa/About";
import { RoomStory } from "@/components/villa/RoomStory";
import { Amenities } from "@/components/villa/Amenities";
import { Booking } from "@/components/villa/Booking";
import { Footer } from "@/components/villa/Footer";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Header />
      <Hero />
      <StatsBar />
      <About />
      <RoomStory
        id="rooms"
        video="/videos/living-kitchen.mp4"
        bgColor="#141310"
        gradient="linear-gradient(90deg, rgba(20,19,16,0.66) 0%, rgba(20,19,16,0.18) 62%, rgba(20,19,16,0.35) 100%)"
        align="left"
        kicker="02 — LIVING & KITCHEN"
        heading="One room, eighteen metres, no walls."
        body="The kitchen is a single block of honed marble facing the sea. Glazing slides fully away, so lunch happens somewhere between inside and the terrace. Seating for twelve, a fireplace for the mistral, and a record player nobody can resist."
        tags={["GAGGENAU KITCHEN", "SEATS 12"]}
      />
      <RoomStory
        video="/videos/bathroom.mp4"
        bgColor="#17150F"
        gradient="linear-gradient(270deg, rgba(20,19,16,0.66) 0%, rgba(20,19,16,0.16) 62%, rgba(20,19,16,0.35) 100%)"
        align="right"
        kicker="03 — THE BATHHOUSE"
        heading="Stone, steam, and an open wall."
        body="A monolithic tub cut from a single block of pietra serena, a rain shower open to the cypress, and underfloor heating that runs all winter. Aesop throughout; towels changed twice daily."
        tags={["HAMMAM + SAUNA", "6 ENSUITES"]}
      />
      <Amenities />
      <Booking />
      <Footer />
    </div>
  );
}
