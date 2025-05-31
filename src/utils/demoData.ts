
import { Quote } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { format, subDays, addDays } from "date-fns";

const companyNames = [
  "Byggbolaget AB",
  "Renovera Stockholm",
  "Hemfix Solutions",
  "Moderna Hem AB",
  "Fastighetsservice Nord",
  "Kvalitetsbyggarna",
  "Snabbreparationer AB",
  "Professionella Hantverkare",
  "Stockholms Renovering",
  "Byggmästarna i Stockholm",
  "Hemförbättring AB",
  "Kvalitetshantverkare",
  "Snygga Hem Stockholm",
  "Renovera Direkt AB",
  "Byggservice Stockholm",
  "Hantverkarna AB",
  "Moderna Fastigheter",
  "Hemreparationer Stockholm",
  "Kvalitetsarbete AB",
  "Byggproffs Stockholm"
];

const contactNames = [
  "Anna Andersson",
  "Erik Eriksson",
  "Maria Johansson",
  "Lars Larsson",
  "Emma Nilsson",
  "Johan Persson",
  "Sofia Gustafsson",
  "Magnus Pettersson",
  "Lisa Olsson",
  "Daniel Svensson",
  "Karin Lindberg",
  "Mikael Hansson",
  "Helena Holm",
  "Andreas Björk",
  "Camilla Strand",
  "Patrik Lund",
  "Jenny Berglund",
  "Martin Ek",
  "Susanne Dahl",
  "Robert Lindström"
];

const quoteDescriptions = [
  "Badrumsrenovering komplett",
  "Målning av vardagsrum och hall",
  "Köksrenovering med nya skåp",
  "Byte av golv i sovrum",
  "Installation av ny belysning",
  "Tapetsering av barnrum",
  "Plattsättning i badrum",
  "Målning av fasad",
  "Montering av ny köksbänk",
  "Reparation av vattenskada",
  "Installation av ny dusch",
  "Byte av fönster i vardagsrum",
  "Målning av trappuppgång",
  "Montering av inbyggda garderober",
  "Renovering av gästtoalett",
  "Installation av luftvärmepump",
  "Byte av parkett i hall",
  "Målning av sovrummet",
  "Montering av nya köksluckor",
  "Reparation av takläckage"
];

const serviceItems = [
  { description: "Rivning av befintligt badrum", price: 15000, unit: "st" },
  { description: "Målning väggar och tak", price: 8500, unit: "kvm" },
  { description: "Installation nya köksskåp", price: 45000, unit: "st" },
  { description: "Lägga nytt laminatgolv", price: 350, unit: "kvm" },
  { description: "Montera taklampa", price: 1200, unit: "st" },
  { description: "Tapetsera rum", price: 280, unit: "kvm" },
  { description: "Lägga kakel", price: 450, unit: "kvm" },
  { description: "Fasadmålning", price: 320, unit: "kvm" },
  { description: "Montera bänkskiva", price: 8500, unit: "st" },
  { description: "Fuktskaderemediation", price: 12000, unit: "st" },
  { description: "Installera duschkabin", price: 18000, unit: "st" },
  { description: "Byte av fönster", price: 6500, unit: "st" },
  { description: "Målning trappa", price: 4500, unit: "st" },
  { description: "Bygga garderob", price: 22000, unit: "st" },
  { description: "Renovera toalett", price: 35000, unit: "st" },
  { description: "Installera värmepump", price: 28000, unit: "st" },
  { description: "Lägga parkett", price: 420, unit: "kvm" },
  { description: "Målning sovrum", price: 6500, unit: "st" },
  { description: "Montera köksluckor", price: 15000, unit: "st" },
  { description: "Reparera tak", price: 18500, unit: "st" }
];

export function generateDemoQuotes(): Quote[] {
  const quotes: Quote[] = [];
  const today = new Date();

  // Generate 20 sent quotes
  for (let i = 0; i < 20; i++) {
    const createdDate = subDays(today, Math.floor(Math.random() * 30) + 1);
    const validUntilDate = addDays(createdDate, 30);
    const serviceItem = serviceItems[i];
    const quantity = serviceItem.unit === "kvm" ? Math.floor(Math.random() * 50) + 10 : 1;
    
    quotes.push({
      id: uuidv4(),
      number: `OFF-${format(createdDate, "yyyyMMdd")}-${(i + 1).toString().padStart(3, '0')}`,
      title: quoteDescriptions[i],
      createdAt: format(createdDate, "yyyy-MM-dd"),
      validUntil: format(validUntilDate, "yyyy-MM-dd"),
      status: "sent",
      recipient: {
        name: contactNames[i],
        companyName: companyNames[i],
        email: `${contactNames[i].toLowerCase().replace(" ", ".")}@${companyNames[i].toLowerCase().replace(/\s+/g, "").replace("ab", "")}.se`,
        phone: `070-${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 90) + 10}`,
        address: `${["Storgatan", "Kungsgatan", "Drottninggatan", "Sveavägen", "Birger Jarlsgatan"][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 200) + 1}, 111 ${Math.floor(Math.random() * 90) + 10} Stockholm`
      },
      items: [{
        id: uuidv4(),
        description: serviceItem.description,
        quantity: quantity,
        unit: serviceItem.unit,
        price: serviceItem.price
      }],
      notes: "Arbetet utförs vardagar 08:00-17:00. Material ingår i priset.",
      terms: "Betalningsvillkor: 30 dagar\nOfferttid: 30 dagar\nPriset gäller i 30 dagar från offertdatum."
    });
  }

  // Generate 20 draft quotes
  for (let i = 0; i < 20; i++) {
    const createdDate = subDays(today, Math.floor(Math.random() * 10) + 1);
    const validUntilDate = addDays(createdDate, 30);
    const serviceItem = serviceItems[(i + 20) % serviceItems.length];
    const quantity = serviceItem.unit === "kvm" ? Math.floor(Math.random() * 40) + 15 : 1;
    
    quotes.push({
      id: uuidv4(),
      number: `OFF-${format(createdDate, "yyyyMMdd")}-${(i + 21).toString().padStart(3, '0')}`,
      title: quoteDescriptions[(i + 20) % quoteDescriptions.length] || `Projekt ${i + 1}`,
      createdAt: format(createdDate, "yyyy-MM-dd"),
      validUntil: format(validUntilDate, "yyyy-MM-dd"),
      status: "draft",
      recipient: {
        name: contactNames[(i + 20) % contactNames.length] || `Kund ${i + 1}`,
        companyName: companyNames[(i + 20) % companyNames.length] || `Företag ${i + 1}`,
        email: `kund${i + 1}@example.com`,
        phone: `070-${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 90) + 10}`,
        address: `${["Malmskillnadsgatan", "Hamngatan", "Regeringsgatan", "Vasagatan", "Klarabergsgatan"][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 150) + 1}, 111 ${Math.floor(Math.random() * 90) + 20} Stockholm`
      },
      items: [{
        id: uuidv4(),
        description: serviceItem.description,
        quantity: quantity,
        unit: serviceItem.unit,
        price: serviceItem.price
      }],
      notes: "Offert under utarbetning. Kontakta oss för frågor.",
      terms: "Betalningsvillkor: 30 dagar\nOfferttid: 30 dagar"
    });
  }

  return quotes;
}
