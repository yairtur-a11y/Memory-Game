// ── Car brands ────────────────────────────────────────────────────────────
// Fields mirror allCountries so existing quiz helpers work without changes:
//   country / nameHe  → brand name
//   capital / capitalHe → country of origin
//   code               → unique id (used for data-code matching)
//   logo               → logo image URL
//   difficulty         → "easy" | "medium" | "hard"

const CAR_LOGO = "https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/";

const carBrands = [

  // ── EASY ─────────────────────────────────────────────────────────────────
  { country: "Toyota",       nameHe: "טויוטה",       code: "car-toyota",      capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "toyota.png",        difficulty: "easy" },
  { country: "BMW",          nameHe: "ב.מ.וו",        code: "car-bmw",         capital: "Germany",       capitalHe: "גרמניה",       logo: CAR_LOGO + "bmw.png",           difficulty: "easy" },
  { country: "Mercedes-Benz",nameHe: "מרצדס-בנץ",    code: "car-mercedes",    capital: "Germany",       capitalHe: "גרמניה",       logo: CAR_LOGO + "mercedes-benz.png", difficulty: "easy" },
  { country: "Volkswagen",   nameHe: "פולקסווגן",    code: "car-vw",          capital: "Germany",       capitalHe: "גרמניה",       logo: CAR_LOGO + "volkswagen.png",    difficulty: "easy" },
  { country: "Honda",        nameHe: "הונדה",         code: "car-honda",       capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "honda.png",         difficulty: "easy" },
  { country: "Ford",         nameHe: "פורד",          code: "car-ford",        capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "ford.png",          difficulty: "easy" },
  { country: "Chevrolet",    nameHe: "שברולט",        code: "car-chevrolet",   capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "chevrolet.png",     difficulty: "easy" },
  { country: "Audi",         nameHe: "אאודי",         code: "car-audi",        capital: "Germany",       capitalHe: "גרמניה",       logo: CAR_LOGO + "audi.png",          difficulty: "easy" },
  { country: "Nissan",       nameHe: "ניסאן",         code: "car-nissan",      capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "nissan.png",        difficulty: "easy" },
  { country: "Ferrari",      nameHe: "פרארי",         code: "car-ferrari",     capital: "Italy",         capitalHe: "איטליה",       logo: CAR_LOGO + "ferrari.png",       difficulty: "easy" },
  { country: "Tesla",        nameHe: "טסלה",          code: "car-tesla",       capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "tesla.png",         difficulty: "easy" },
  { country: "Porsche",      nameHe: "פורשה",         code: "car-porsche",     capital: "Germany",       capitalHe: "גרמניה",       logo: CAR_LOGO + "porsche.png",       difficulty: "easy" },

  // ── MEDIUM ────────────────────────────────────────────────────────────────
  { country: "Volvo",        nameHe: "וולוו",         code: "car-volvo",       capital: "Sweden",        capitalHe: "שוודיה",       logo: CAR_LOGO + "volvo.png",         difficulty: "medium" },
  { country: "Lamborghini",  nameHe: "למבורגיני",     code: "car-lamborghini", capital: "Italy",         capitalHe: "איטליה",       logo: CAR_LOGO + "lamborghini.png",   difficulty: "medium" },
  { country: "Land Rover",   nameHe: "לנד רובר",      code: "car-landrover",   capital: "UK",            capitalHe: "בריטניה",      logo: CAR_LOGO + "land-rover.png",    difficulty: "medium" },
  { country: "Jeep",         nameHe: "ג'יפ",          code: "car-jeep",        capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "jeep.png",          difficulty: "medium" },
  { country: "Subaru",       nameHe: "סובארו",        code: "car-subaru",      capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "subaru.png",        difficulty: "medium" },
  { country: "Mazda",        nameHe: "מאזדה",         code: "car-mazda",       capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "mazda.png",         difficulty: "medium" },
  { country: "Hyundai",      nameHe: "יונדאי",        code: "car-hyundai",     capital: "South Korea",   capitalHe: "קוריאה הדרומית",logo: CAR_LOGO + "hyundai.png",      difficulty: "medium" },
  { country: "Kia",          nameHe: "קיה",           code: "car-kia",         capital: "South Korea",   capitalHe: "קוריאה הדרומית",logo: CAR_LOGO + "kia.png",          difficulty: "medium" },
  { country: "Peugeot",      nameHe: "פיג'ו",         code: "car-peugeot",     capital: "France",        capitalHe: "צרפת",         logo: CAR_LOGO + "peugeot.png",       difficulty: "medium" },
  { country: "Renault",      nameHe: "רנו",           code: "car-renault",     capital: "France",        capitalHe: "צרפת",         logo: CAR_LOGO + "renault.png",       difficulty: "medium" },
  { country: "Citroën",      nameHe: "סיטרואן",       code: "car-citroen",     capital: "France",        capitalHe: "צרפת",         logo: CAR_LOGO + "citroen.png",       difficulty: "medium" },
  { country: "Fiat",         nameHe: "פיאט",          code: "car-fiat",        capital: "Italy",         capitalHe: "איטליה",       logo: CAR_LOGO + "fiat.png",          difficulty: "medium" },
  { country: "Alfa Romeo",   nameHe: "אלפא רומיאו",   code: "car-alfaromeo",   capital: "Italy",         capitalHe: "איטליה",       logo: CAR_LOGO + "alfa-romeo.png",    difficulty: "medium" },
  { country: "Maserati",     nameHe: "מזראטי",        code: "car-maserati",    capital: "Italy",         capitalHe: "איטליה",       logo: CAR_LOGO + "maserati.png",      difficulty: "medium" },
  { country: "Bentley",      nameHe: "בנטלי",         code: "car-bentley",     capital: "UK",            capitalHe: "בריטניה",      logo: CAR_LOGO + "bentley.png",       difficulty: "medium" },
  { country: "Rolls-Royce",  nameHe: "רולס-רויס",     code: "car-rollsroyce",  capital: "UK",            capitalHe: "בריטניה",      logo: CAR_LOGO + "rolls-royce.png",   difficulty: "medium" },
  { country: "Cadillac",     nameHe: "קדילק",         code: "car-cadillac",    capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "cadillac.png",      difficulty: "medium" },
  { country: "Lexus",        nameHe: "לקסוס",         code: "car-lexus",       capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "lexus.png",         difficulty: "medium" },
  { country: "Mitsubishi",   nameHe: "מיצובישי",      code: "car-mitsubishi",  capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "mitsubishi.png",    difficulty: "medium" },

  // ── HARD ──────────────────────────────────────────────────────────────────
  { country: "Bugatti",      nameHe: "בוגאטי",        code: "car-bugatti",     capital: "France",        capitalHe: "צרפת",         logo: CAR_LOGO + "bugatti.png",       difficulty: "hard" },
  { country: "McLaren",      nameHe: "מקלרן",         code: "car-mclaren",     capital: "UK",            capitalHe: "בריטניה",      logo: CAR_LOGO + "mclaren.png",       difficulty: "hard" },
  { country: "Aston Martin", nameHe: "אסטון מרטין",   code: "car-astonmartin", capital: "UK",            capitalHe: "בריטניה",      logo: CAR_LOGO + "aston-martin.png",  difficulty: "hard" },
  { country: "Dodge",        nameHe: "דודג'",         code: "car-dodge",       capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "dodge.png",         difficulty: "hard" },
  { country: "Chrysler",     nameHe: "כרייסלר",       code: "car-chrysler",    capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "chrysler.png",      difficulty: "hard" },
  { country: "Buick",        nameHe: "ביואיק",        code: "car-buick",       capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "buick.png",         difficulty: "hard" },
  { country: "Lincoln",      nameHe: "לינקולן",       code: "car-lincoln",     capital: "USA",           capitalHe: "ארה\"ב",       logo: CAR_LOGO + "lincoln.png",       difficulty: "hard" },
  { country: "Acura",        nameHe: "אקורה",         code: "car-acura",       capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "acura.png",         difficulty: "hard" },
  { country: "Infiniti",     nameHe: "אינפיניטי",     code: "car-infiniti",    capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "infiniti.png",      difficulty: "hard" },
  { country: "Genesis",      nameHe: "ג'נסיס",        code: "car-genesis",     capital: "South Korea",   capitalHe: "קוריאה הדרומית",logo: CAR_LOGO + "genesis.png",      difficulty: "hard" },
  { country: "Suzuki",       nameHe: "סוזוקי",        code: "car-suzuki",      capital: "Japan",         capitalHe: "יפן",          logo: CAR_LOGO + "suzuki.png",        difficulty: "hard" },
  { country: "Skoda",        nameHe: "סקודה",         code: "car-skoda",       capital: "Czech Republic",capitalHe: "צ'כיה",        logo: CAR_LOGO + "skoda.png",         difficulty: "hard" },
  { country: "SEAT",         nameHe: "סיאט",          code: "car-seat",        capital: "Spain",         capitalHe: "ספרד",         logo: CAR_LOGO + "seat.png",          difficulty: "hard" },
  { country: "Opel",         nameHe: "אופל",          code: "car-opel",        capital: "Germany",       capitalHe: "גרמניה",       logo: CAR_LOGO + "opel.png",          difficulty: "hard" },
  { country: "Lancia",       nameHe: "לנצ'יה",        code: "car-lancia",      capital: "Italy",         capitalHe: "איטליה",       logo: CAR_LOGO + "lancia.png",        difficulty: "hard" },
  { country: "Lotus",        nameHe: "לוטוס",         code: "car-lotus",       capital: "UK",            capitalHe: "בריטניה",      logo: CAR_LOGO + "lotus.png",         difficulty: "hard" },
  { country: "Dacia",        nameHe: "דאצ'יה",        code: "car-dacia",       capital: "Romania",       capitalHe: "רומניה",       logo: CAR_LOGO + "dacia.png",         difficulty: "hard" },
  { country: "BYD",          nameHe: "BYD",           code: "car-byd",         capital: "China",         capitalHe: "סין",          logo: CAR_LOGO + "byd.png",           difficulty: "hard" },

];
