/**
 * Central Parish & Cathedral Configuration
 * Edit this file to customize the parish name, schedules, and directory.
 */

const SITE_CONFIG = {
  name: "St. Ann Roman Catholic Church",
  tagline: "Parish Church • Est. 1911",
  shortName: "St. Ann Roman Catholic Church",
  address: "291 St Pauls Ave, Jersey City, NJ 07306",
  parishHouseAddress: "291 St Pauls Ave, Jersey City, NJ 07306",
  phone: "(201) 656-4018",
  email: "info@cathedralparish.org",
  hours: {
    church: "6:30 AM – 8:45 PM Daily",
    parishHouse: "8:30 AM – 5:00 PM Daily",
  }
};

const MASS_SCHEDULES = {
  sunday: {
    title: "Sunday & Vigil Masses",
    subtitle: "Celebrated in the Main Sanctuary",
    items: [
      { time: "5:30 PM (Sat)", name: "Saturday Anticipated Vigil Mass" },
      { time: "10:30 AM", name: "Polish Spoken Mass" },
      { time: "12:30 PM", name: "English Spoken Mass", },
    ]
  },
  weekday: {
    title: "Monday – Friday Masses",
    subtitle: "Daily Eucharist offered in the Main Sanctuary",
    items: [
      { time: "7:00 AM", name: "Daily Morning Mass" },
    ]
  },
  confession: {
    title: "Reconciliation & Confession",
    subtitle: "Encounter mercy in the quiet of the Church Confessional",
    items: [
      { time: "Mon–Fri · 7:30 AM", name: "Morning Confessions", note: "Immediately following the 7:00 AM Mass", live: false },
      { time: "Saturday · 4:30 PM", name: "Saturday Confessions", note: "Before the 5:00 PM Vigil Mass", live: false },
      { time: "By Appointment", name: "Private Confession", note: "Contact the Parish House to schedule a time", live: false }
    ]
  },

};

const DAILY_READINGS = {
  liturgicalDay: "Friday of the Thirty-Third Week in Ordinary Time",
  color: "Green",
  firstReading: "Revelation 10:8–11",
  psalm: "Psalm 119:14, 24, 72, 103, 111, 131 — \"How sweet to my taste is your promise!\"",
  gospel: "Luke 19:45–48",
  reflection: "Jesus entered the temple area and began to drive out those selling there, saying: 'My house shall be a house of prayer.' Each day, our cathedral doors open as a sanctuary of stillness in the midst of the city."
};

const SACRAMENTS = [
  {
    id: "baptism",
    title: "Baptism & Initiation",
    eyebrow: "Sacrament of Rebirth",
    summary: "Welcoming infants, children, and adults into the Catholic Church through water and the Spirit.",
    details: "Infant Baptisms are celebrated on the first and third Sundays of each month at 2:30 PM. Parents and godparents attend a single preparation session at the Parish House. Adults seeking Baptism or full communion participate in our OCIA (Order of Christian Initiation of Adults) journey beginning each September.",
    contact: "Sacramental Coordinator · Ext. 214",
    actionLabel: "Request Baptism Packet"
  },
  {
    id: "matrimony",
    title: "Holy Matrimony",
    eyebrow: "Cathedral Weddings",
    summary: "Celebrating the sacred covenant of Christian marriage beneath the vaulted arches of the Cathedral.",
    details: "Weddings are scheduled on Fridays and Saturdays for registered parishioners and couples connected to the Archdiocese. Preparation begins at least nine months prior to your preferred date and includes Pre-Cana formation and liturgical music planning with our Cathedral Organist.",
    contact: "Office of Matrimony · Ext. 208",
    actionLabel: "Inquire About Dates"
  },
  {
    id: "reconciliation",
    title: "Reconciliation & Healing",
    eyebrow: "Mercy & Peace",
    summary: "Experience God's forgiving grace in the Sacrament of Penance and Anointing of the Sick.",
    details: "Priests are available for Confession Monday through Friday following the 8:00 AM Mass and on Saturday afternoons from 3:30 PM to 5:15 PM. For Anointing of the Sick or emergency pastoral visits to nearby hospitals, please contact the Parish House Rectory at any hour.",
    contact: "Rectory Pastoral Line · (212) 753-2261",
    actionLabel: "View Confession Times"
  },
  {
    id: "eucharist",
    title: "First Communion & Confirmation",
    eyebrow: "Youth & Adult Faith",
    summary: "Preparing children and adults to receive the fullness of Christ in the Eucharist and the Spirit.",
    details: "Our Parish Religious Education Program gathers Sunday mornings at 9:45 AM for grades 1–8. Adult Confirmation classes meet in six-week autumn and spring cohorts at the Parish House for baptized Catholics preparing to complete their initiation.",
    contact: "Director of Faith Formation · Ext. 221",
    actionLabel: "Register for Formation"
  },
  {
    id: "records",
    title: "Sacramental Records",
    eyebrow: "Archives & Certificates",
    summary: "Request official copies of Baptism, First Communion, Confirmation, or Marriage certificates.",
    details: "Our Cathedral Archives preserve sacramental registers dating back to the 19th century. Certificates for recent or historic sacraments celebrated at the Cathedral may be requested with valid photo identification and the approximate date of the sacrament.",
    contact: "Cathedral Archives · Ext. 230",
    actionLabel: "Submit Record Request"
  },
  {
    id: "masscards",
    title: "Mass Intentions & Cards",
    eyebrow: "Remember a Loved One",
    summary: "Have the Holy Sacrifice of the Mass offered for the living or deceased with a commemorative card.",
    details: "Announced and unannounced Mass intentions may be arranged in person at the Parish House Reception Desk (8:30 AM – 5:00 PM) or requested online. Beautiful embossed Cathedral Mass Cards are available for sympathy, healing, and thanksgiving.",
    contact: "Parish House Desk · Ext. 200",
    actionLabel: "Request a Mass Card"
  }
];

const CONCERTS = [
  {
    id: "organ-recital",
    series: "Grand Organ Recital Series",
    date: "NOV 24",
    dayTime: "Sunday · 3:15 PM",
    title: "Works of Bach, Widor & Duruflé",
    performer: "Dr. Jennifer Pascual, Director of Music",
    location: "Main Sanctuary • Free Admission",
    description: "Featuring the Cathedral's monumental 9,800-pipe Kilgen gallery and chancel organs in a program of French symphonic masterpieces."
  },
  {
    id: "guest-choir",
    series: "Guest Choir Showcase",
    date: "DEC 05",
    dayTime: "Thursday · 1:30 PM",
    title: "A Celebration of Advent Polyphony",
    performer: "Schola Cantorum Chamber Ensemble",
    location: "Chancel Sanctuary • Open to All",
    description: "Midday sacred choral meditation weaving Palestrina, Victoria, and classic Advent motets in the acoustic resonance of the nave."
  },
  {
    id: "christmas-concert",
    series: "A City Christmas Tradition",
    date: "DEC 14",
    dayTime: "Saturday · 7:00 PM",
    title: "45th Annual Cathedral Christmas Concert",
    performer: "The Cathedral Choir, Brass & Percussion",
    location: "Main Sanctuary • Ticketed Seating",
    description: "Beloved carols, candlelight processions, and festive arrangements for choir, brass quintet, timpani, and grand pipe organ."
  }
];

const FAQS = [
  {
    q: "Do I need tickets or reservations to visit or attend Mass?",
    a: "No tickets are needed for daily visits or regular Sunday and weekday Masses. Admission is always free. Special ticketed seating only applies to select evening concerts and Christmas Midnight Mass."
  },
  {
    q: "Is the Church wheelchair accessible?",
    a: "Yes. Step-free wheelchair accessibility is available at the main entrance at 291 St Pauls Ave. Accessible restrooms and reserved seating are available throughout the nave."
  },
  {
    q: "What are the security and bag guidelines for visitors?",
    a: "For the safety of all worshippers and guests, all bags and packages are subject to a brief visual security check upon entry. Luggage storage is not available, and large suitcases cannot be brought inside."
  },
  {
    q: "May I take photographs inside the Church?",
    a: "Non-flash photography for personal use is welcome during sightseeing hours. Out of reverence for worshippers, photography and video recording are paused while Mass or Confession is in progress."
  },
  {
    q: "How can I request a Mass intention or Mass card?",
    a: "Announced and unannounced Mass intentions may be arranged at the Parish House Reception Desk (8:30 AM – 5:00 PM), where embossed Cathedral Mass Cards are also available."
  }
];

const FUNDS = [
  { id: "annual", label: "Annual Cathedral Fund", desc: "Supports daily worship, pastoral care, and keeping our doors open every day." },
  { id: "restoration", label: "Preservation & Stonework", desc: "Maintains the historic Neo-Gothic limestone facade, roofs, and stained glass." },
  { id: "music", label: "Friends of Cathedral Music", desc: "Sustains the Cathedral Choir, free organ recitals, and Kilgen organ care." },
  { id: "outreach", label: "St. Vincent de Paul Outreach", desc: "Provides meals, shelter support, and emergency assistance to neighbors in need." }
];

window.CathedralData = {
  SITE_CONFIG,
  MASS_SCHEDULES,
  DAILY_READINGS,
  SACRAMENTS,
  CONCERTS,
  FAQS,
  FUNDS
};
