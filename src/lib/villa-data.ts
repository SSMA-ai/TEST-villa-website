export const stats = [
  { key: "a", value: "6", label: "BEDROOM SUITES" },
  { key: "b", value: "8,400", label: "SQ FT INTERIOR" },
  { key: "c", value: "4", label: "MIN TO THE BEACH" },
  { key: "d", value: "Villa", label: "PRIVATE ESTATE" },
];

export const amenities = [
  { title: "Infinity pool", body: "18m, heated year-round, sea-facing", radius: "50%", rotate: "0deg" },
  { title: "Fibre wifi", body: "1 Gbps throughout, mesh to the terrace", radius: "2px", rotate: "45deg" },
  { title: "Private parking", body: "Gated, four cars, EV charger", radius: "2px", rotate: "0deg" },
  { title: "Climate control", body: "Room-by-room cooling and underfloor heat", radius: "50%", rotate: "0deg" },
  { title: "Housekeeping", body: "Daily, 8am–4pm, laundry included", radius: "2px", rotate: "45deg" },
  { title: "Chef on request", body: "Michelin-trained, market menus", radius: "50%", rotate: "0deg" },
  { title: "Hammam & sauna", body: "Lower level, cedar and stone", radius: "2px", rotate: "0deg" },
  { title: "Tender & mooring", body: "Berth for 12m at Cap Ferrat", radius: "50%", rotate: "45deg" },
];

// The design's export listed 6 gallery slots (terrace-dusk.jpg, suite-main.jpg, etc.) that
// don't exist as real assets. Using the 3 real photos we do have instead of fabricating images.
export const gallery = [
  { label: "EXTERIOR & POOL", file: "/images/exterior.jpg" },
  { label: "LIVING & KITCHEN", file: "/images/living-kitchen.jpg" },
  { label: "PRIMARY BATHROOM", file: "/images/bathroom.jpg" },
];

export const navLinks = [
  { href: "#about", label: "ABOUT" },
  { href: "#rooms", label: "ROOMS" },
  { href: "#location", label: "LOCATION" },
  { href: "#contact", label: "CONTACT" },
];
