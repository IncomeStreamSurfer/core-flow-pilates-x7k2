// Shared fallback + type defs for studio content. Real data lives in
// Supabase (classes, instructors, class_sessions); these fallbacks let
// pages render meaningfully even before env vars propagate.

export type ClassType = {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  level: string;
  image_url: string;
};

export const CLASS_TYPES: ClassType[] = [
  {
    slug: "reformer-pilates",
    name: "Reformer Pilates",
    short_description: "Spring-loaded resistance work on our reformer beds for full-body strength.",
    description:
      "Our signature small-group Reformer classes use the spring-loaded carriage to build long, lean strength through the entire body. Every class caps at 8 clients so instructors can adjust springs, straps, and cues for your body. Expect controlled, precise movement that challenges balance and core control far more than a mat alone.",
    duration_minutes: 50,
    price_cents: 3800,
    level: "All levels",
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
  },
  {
    slug: "mat-pilates",
    name: "Mat Pilates",
    short_description: "Classical, bodyweight-based Pilates on the mat — no machines required.",
    description:
      "Mat Pilates returns to Joseph Pilates' original repertoire: bodyweight sequences that build core strength, spinal mobility, and control. It's low-impact but never low-intensity — expect to feel muscles you forgot you had. Great as a standalone practice or paired with reformer sessions for extra conditioning between machine days.",
    duration_minutes: 45,
    price_cents: 2800,
    level: "All levels",
    image_url: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=1200&q=80",
  },
  {
    slug: "prenatal-pilates",
    name: "Prenatal Pilates",
    short_description: "Trimester-safe strength and breathwork guided by certified prenatal instructors.",
    description:
      "Designed for every trimester, our Prenatal Pilates classes focus on pelvic floor awareness, safe core work, hip mobility, and breath patterns that carry into labor. All instructors hold prenatal-specific certification and modify every exercise to your stage of pregnancy. Bring a note from your provider if you're newly cleared for exercise.",
    duration_minutes: 45,
    price_cents: 3200,
    level: "Prenatal, all trimesters",
    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  },
  {
    slug: "barre-fusion",
    name: "Barre Fusion",
    short_description: "Pilates principles meet ballet-barre isometrics for a high-energy burn.",
    description:
      "Barre Fusion blends Pilates' core-first philosophy with ballet-barre isometric holds and light hand weights. Expect fast-paced, music-driven blocks targeting glutes, thighs, and arms, bookended by Pilates-style core and stretch segments. It's our highest-energy class — bring water and a small towel.",
    duration_minutes: 50,
    price_cents: 3200,
    level: "All levels",
    image_url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&q=80",
  },
  {
    slug: "private-sessions",
    name: "Private Sessions",
    short_description: "One-on-one reformer or mat instruction built entirely around your goals.",
    description:
      "Private sessions pair you with one instructor for the full hour — ideal for injury rehabilitation, event prep, or simply progressing faster than a group class allows. Your instructor builds a running program across sessions, tracking mobility and strength gains week to week. Available on reformer, mat, or a blend of both.",
    duration_minutes: 55,
    price_cents: 9500,
    level: "All levels, 1:1",
    image_url: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1200&q=80",
  },
];

export type Instructor = {
  slug: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
  short_bio: string;
  image_url: string;
  certifications: string[];
};

export const INSTRUCTORS: Instructor[] = [
  {
    slug: "jane-doe",
    name: "Jane Doe",
    role: "Studio Director & Master Reformer Instructor",
    specialties: ["Reformer Pilates", "Private Sessions"],
    short_bio: "12 years teaching reformer Pilates; trained at Balanced Body and Polestar.",
    bio: "Jane founded Core & Flow after a decade teaching reformer Pilates across Austin's boutique studio scene. She's Polestar and Balanced Body certified, with additional training in post-rehab movement for clients recovering from spine and hip surgery. Jane's classes are precise and unhurried — she'd rather you nail five perfect reps than rush through fifteen. Outside the studio she's usually at Barton Springs or scouting new coffee shops on South Congress.",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    certifications: ["Balanced Body Comprehensive", "Polestar Pilates Certified", "300hr Yoga Alliance"],
  },
  {
    slug: "maria-lopez",
    name: "Maria Lopez",
    role: "Lead Mat & Barre Fusion Instructor",
    specialties: ["Mat Pilates", "Barre Fusion"],
    short_bio: "Former ballet dancer bringing barre precision to every mat sequence.",
    bio: "Maria danced professionally for eight years before discovering Pilates as a way to keep her body strong without the impact of daily ballet class. She built our Barre Fusion program from scratch, blending barre isometrics with classical mat sequencing. Her classes run on a curated playlist and a lot of encouragement — expect to shake by the second set and laugh about it.",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    certifications: ["BASI Pilates Certified", "Barre Above Certified", "NASM-CPT"],
  },
  {
    slug: "emily-chen",
    name: "Emily Chen",
    role: "Prenatal & Postnatal Specialist",
    specialties: ["Prenatal Pilates", "Mat Pilates"],
    short_bio: "Certified prenatal/postnatal instructor and mother of two.",
    bio: "Emily came to prenatal Pilates the hard way — through her own two pregnancies and a frustrating lack of studios that felt genuinely safe and unhurried. She's since become our resident prenatal and postnatal specialist, holding additional certification in diastasis recti recovery and pelvic floor rehabilitation. Expect a slower pace, a lot of breath cues, and zero judgment about what your body can do today.",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    certifications: ["Prenatal & Postnatal Pilates Certified", "Balanced Body Mat Certified", "Pelvic Floor Rehab Specialist"],
  },
  {
    slug: "sarah-kim",
    name: "Sarah Kim",
    role: "Reformer Instructor & Athletic Conditioning Coach",
    specialties: ["Reformer Pilates", "Private Sessions"],
    short_bio: "Works with runners and cyclists on stability and injury prevention.",
    bio: "Sarah's background in athletic training shows in every class — she programs reformer work like a strength coach, focused on single-leg stability, hip control, and the small stabilizer muscles that keep runners and cyclists off the injury list. Many of her private clients are training for marathons or triathlons and use their weekly session as active recovery.",
    image_url: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=800&q=80",
    certifications: ["Balanced Body Reformer Certified", "USAT Level 1 Coach", "FMS Certified"],
  },
];

export const CLASS_FAQS: Record<string, { question: string; answer: string }[]> = {
  "reformer-pilates": [
    { question: "Do I need reformer experience before booking?", answer: "No. Every reformer class opens with a brief setup so first-timers understand spring tension and strap placement. Instructors keep class sizes to 8 so they can spot beginners individually." },
    { question: "What should I wear?", answer: "Fitted, non-baggy clothing (loose fabric catches in the springs) and grip socks. We sell grip socks at the studio if you don't own a pair." },
    { question: "How far in advance can I book?", answer: "The full weekly calendar opens two weeks out. Popular evening slots fill fast — booking online lets you grab a spot the moment it opens." },
  ],
  "mat-pilates": [
    { question: "Is mat Pilates enough of a workout on its own?", answer: "Yes — mat work targets deep core and stabilizer muscles that other workouts miss. Many members pair two mat classes a week with a reformer class for variety." },
    { question: "Do I need equipment?", answer: "Just a mat, which we provide, and comfortable clothing. Some classes use light resistance bands or a small ball, also provided." },
    { question: "Is it suitable for beginners?", answer: "Absolutely. Instructors offer modifications for every exercise, and mat is often the recommended entry point before trying reformer." },
  ],
  "prenatal-pilates": [
    { question: "Is prenatal Pilates safe in every trimester?", answer: "Yes, with modifications. Our instructors are certified in prenatal-specific programming and adjust every exercise to your trimester and how you're feeling that day." },
    { question: "Do I need clearance from my doctor?", answer: "We recommend confirming with your OB or midwife that exercise is appropriate for your pregnancy, especially if this is your first prenatal class." },
    { question: "Can I continue past my due date or start postpartum?", answer: "Many clients practice up to their due week. For postpartum return, we recommend waiting for your provider's clearance (typically 6-8 weeks) before rejoining." },
  ],
  "barre-fusion": [
    { question: "Is Barre Fusion more intense than mat or reformer?", answer: "It's our highest-energy class — expect a faster pace and more cardio-adjacent intervals, bookended by Pilates-style core and stretch work." },
    { question: "Do I need ballet experience?", answer: "None at all. The barre is used purely for balance support during isometric holds — no dance steps involved." },
    { question: "What should I bring?", answer: "Grip socks, water, and a small hand towel — this class works up more of a sweat than our other formats." },
  ],
  "private-sessions": [
    { question: "How is a private session different from group class?", answer: "You get the instructor's full attention for the hour, with a program built and progressed specifically around your goals, injuries, or event training." },
    { question: "Can I book a recurring weekly private slot?", answer: "Yes — most private clients hold a standing weekly or biweekly time with the same instructor so progress carries session to session." },
    { question: "Are privates available for two people?", answer: "We offer semi-private sessions for two at a discounted per-person rate — mention it when you book and we'll pair your schedules." },
  ],
};

export function findClassBySlug(slug: string) {
  return CLASS_TYPES.find((c) => c.slug === slug);
}

export function findInstructorBySlug(slug: string) {
  return INSTRUCTORS.find((i) => i.slug === slug);
}
