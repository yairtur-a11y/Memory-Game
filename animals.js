// ── Mammals ────────────────────────────────────────────────────────────────
// Fields mirror familyMembers so existing quiz/cards/type logic works:
//   name / nameHe  → animal name
//   image          → photo URL (Wikimedia Commons thumbnails)
//   emoji          → fallback if image fails to load
//   code           → unique id for answer matching
//   difficulty     → "easy" | "medium" | "hard"

const W = "https://upload.wikimedia.org/wikipedia/commons/thumb/";

const animalMembers = [

  // ── EASY ─────────────────────────────────────────────────────────────────
  {
    name: "Lion",        nameHe: "אריה",
    code: "ani-lion",    emoji: "🦁",    difficulty: "easy",
    image: W + "7/73/Lion_waiting_in_Namibia.jpg/400px-Lion_waiting_in_Namibia.jpg",
  },
  {
    name: "Elephant",    nameHe: "פיל",
    code: "ani-elephant",emoji: "🐘",    difficulty: "easy",
    image: W + "3/37/African_Bush_Elephant.jpg/400px-African_Bush_Elephant.jpg",
  },
  {
    name: "Tiger",       nameHe: "נמר",
    code: "ani-tiger",   emoji: "🐯",    difficulty: "easy",
    image: W + "3/3f/Walking_tiger_female.jpg/400px-Walking_tiger_female.jpg",
  },
  {
    name: "Giraffe",     nameHe: "ג'ירפה",
    code: "ani-giraffe", emoji: "🦒",    difficulty: "easy",
    image: W + "9/9e/Giraffe_Mikumi_National_Park.jpg/400px-Giraffe_Mikumi_National_Park.jpg",
  },
  {
    name: "Zebra",       nameHe: "זברה",
    code: "ani-zebra",   emoji: "🦓",    difficulty: "easy",
    image: W + "e/e3/Plains_Zebra_Equus_quagga.jpg/400px-Plains_Zebra_Equus_quagga.jpg",
  },
  {
    name: "Giant Panda", nameHe: "פנדה ענקית",
    code: "ani-panda",   emoji: "🐼",    difficulty: "easy",
    image: W + "0/0f/Grosser_Panda.JPG/400px-Grosser_Panda.JPG",
  },
  {
    name: "Polar Bear",  nameHe: "דוב קוטב",
    code: "ani-polarbear",emoji: "🐻‍❄️", difficulty: "easy",
    image: W + "6/66/Polar_Bear_-_Alaska_%28cropped%29.jpg/400px-Polar_Bear_-_Alaska_%28cropped%29.jpg",
  },
  {
    name: "Dolphin",     nameHe: "דולפין",
    code: "ani-dolphin", emoji: "🐬",    difficulty: "easy",
    image: W + "1/10/Tursiops_truncatus_01.jpg/400px-Tursiops_truncatus_01.jpg",
  },
  {
    name: "Gorilla",     nameHe: "גורילה",
    code: "ani-gorilla", emoji: "🦍",    difficulty: "easy",
    image: W + "b/bb/Gorilla_gorilla_gorilla01.jpg/400px-Gorilla_gorilla_gorilla01.jpg",
  },
  {
    name: "Kangaroo",    nameHe: "קנגורו",
    code: "ani-kangaroo",emoji: "🦘",    difficulty: "easy",
    image: W + "0/00/Male_eastern_grey_kangaroo.jpg/400px-Male_eastern_grey_kangaroo.jpg",
  },
  {
    name: "Cheetah",     nameHe: "ברדלס",
    code: "ani-cheetah", emoji: "🐆",    difficulty: "easy",
    image: W + "a/a2/Cheetah1_modified.jpg/400px-Cheetah1_modified.jpg",
  },
  {
    name: "Hippopotamus",nameHe: "היפופוטם",
    code: "ani-hippo",   emoji: "🦛",    difficulty: "easy",
    image: W + "c/ca/Hippo_at_Serengeti_National_Park.jpg/400px-Hippo_at_Serengeti_National_Park.jpg",
  },

  // ── MEDIUM ────────────────────────────────────────────────────────────────
  {
    name: "Wolf",        nameHe: "זאב",
    code: "ani-wolf",    emoji: "🐺",    difficulty: "medium",
    image: W + "d/d9/YellowstonePark_WolfBlack.jpg/400px-YellowstonePark_WolfBlack.jpg",
  },
  {
    name: "Brown Bear",  nameHe: "דוב חום",
    code: "ani-brownbear",emoji: "🐻",   difficulty: "medium",
    image: W + "5/5d/Kamchatka_Brown_Bear_near_Dvuhyurtochnoe_on_2015-07-23.jpg/400px-Kamchatka_Brown_Bear_near_Dvuhyurtochnoe_on_2015-07-23.jpg",
  },
  {
    name: "Leopard",     nameHe: "נמר מנוקד",
    code: "ani-leopard", emoji: "🐆",    difficulty: "medium",
    image: W + "c/c5/Leopard_Africa_edit.jpg/400px-Leopard_Africa_edit.jpg",
  },
  {
    name: "Rhinoceros",  nameHe: "קרנף",
    code: "ani-rhino",   emoji: "🦏",    difficulty: "medium",
    image: W + "1/1a/White_Rhinoceros.jpg/400px-White_Rhinoceros.jpg",
  },
  {
    name: "Camel",       nameHe: "גמל",
    code: "ani-camel",   emoji: "🐪",    difficulty: "medium",
    image: W + "4/4d/Camel_in_Oman.jpg/400px-Camel_in_Oman.jpg",
  },
  {
    name: "Koala",       nameHe: "קואלה",
    code: "ani-koala",   emoji: "🐨",    difficulty: "medium",
    image: W + "4/49/Koala_climbing_tree.jpg/400px-Koala_climbing_tree.jpg",
  },
  {
    name: "Orangutan",   nameHe: "אורנגאוטן",
    code: "ani-orangutan",emoji: "🦧",   difficulty: "medium",
    image: W + "b/be/Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG/400px-Orang_Utan%2C_Semenggok_Forest_Reserve%2C_Sarawak%2C_Borneo%2C_Malaysia.JPG",
  },
  {
    name: "Chimpanzee",  nameHe: "שימפנזה",
    code: "ani-chimp",   emoji: "🐒",    difficulty: "medium",
    image: W + "4/43/Chimpanzee_seated_-_Patricia_Figueira.jpg/400px-Chimpanzee_seated_-_Patricia_Figueira.jpg",
  },
  {
    name: "Jaguar",      nameHe: "יגואר",
    code: "ani-jaguar",  emoji: "🐆",    difficulty: "medium",
    image: W + "0/0a/Standing_jaguar.jpg/400px-Standing_jaguar.jpg",
  },
  {
    name: "Moose",       nameHe: "אייל הצפון",
    code: "ani-moose",   emoji: "🫎",    difficulty: "medium",
    image: W + "6/62/Moose-alcesalces.jpg/400px-Moose-alcesalces.jpg",
  },
  {
    name: "Red Fox",     nameHe: "שועל אדום",
    code: "ani-fox",     emoji: "🦊",    difficulty: "medium",
    image: W + "0/03/Red_Fox_%28Vulpes_vulpes%29_-_British_Wildlife_Centre-edit2.jpg/400px-Red_Fox_%28Vulpes_vulpes%29_-_British_Wildlife_Centre-edit2.jpg",
  },
  {
    name: "Meerkat",     nameHe: "סוריקטה",
    code: "ani-meerkat", emoji: "🐾",    difficulty: "medium",
    image: W + "c/cd/Suricata_suricatta.jpg/400px-Suricata_suricatta.jpg",
  },

  // ── HARD ──────────────────────────────────────────────────────────────────
  {
    name: "Snow Leopard",nameHe: "נמר שלגים",
    code: "ani-snowleopard",emoji: "🐆", difficulty: "hard",
    image: W + "2/2a/Schneeleopard.jpg/400px-Schneeleopard.jpg",
  },
  {
    name: "Blue Whale",  nameHe: "לווייתן כחול",
    code: "ani-bluewhale",emoji: "🐋",   difficulty: "hard",
    image: W + "1/1c/Blue_Whale_001.jpg/400px-Blue_Whale_001.jpg",
  },
  {
    name: "Lynx",        nameHe: "לינקס",
    code: "ani-lynx",    emoji: "🐱",    difficulty: "hard",
    image: W + "6/68/Lynx_lynx_poing.jpg/400px-Lynx_lynx_poing.jpg",
  },
  {
    name: "Otter",       nameHe: "לוטרה",
    code: "ani-otter",   emoji: "🦦",    difficulty: "hard",
    image: W + "3/38/Lutra_lutra-4.jpg/400px-Lutra_lutra-4.jpg",
  },
  {
    name: "Capybara",    nameHe: "קפיבארה",
    code: "ani-capybara",emoji: "🐾",    difficulty: "hard",
    image: W + "e/ec/Capybara_%28Hydrochoerus_hydrochaeris%29.JPG/400px-Capybara_%28Hydrochoerus_hydrochaeris%29.JPG",
  },
  {
    name: "Bison",       nameHe: "ביזון",
    code: "ani-bison",   emoji: "🐃",    difficulty: "hard",
    image: W + "7/71/Bison_bison_bison_Wichita.jpg/400px-Bison_bison_bison_Wichita.jpg",
  },
  {
    name: "Warthog",     nameHe: "חזיר יבלות",
    code: "ani-warthog", emoji: "🐗",    difficulty: "hard",
    image: W + "6/63/Common_Warthog_2012.jpg/400px-Common_Warthog_2012.jpg",
  },
  {
    name: "Mandrill",    nameHe: "מנדריל",
    code: "ani-mandrill",emoji: "🐒",    difficulty: "hard",
    image: W + "8/8a/Mandrill_at_SF_Zoo.jpg/400px-Mandrill_at_SF_Zoo.jpg",
  },
  {
    name: "Tapir",       nameHe: "טפיר",
    code: "ani-tapir",   emoji: "🐾",    difficulty: "hard",
    image: W + "5/5f/Malayan_Tapir.jpg/400px-Malayan_Tapir.jpg",
  },
  {
    name: "Wolverine",   nameHe: "גלוטון",
    code: "ani-wolverine",emoji: "🦡",   difficulty: "hard",
    image: W + "7/7f/Wolverine_at_Alaska_Wildlife_Conservation_Center.jpg/400px-Wolverine_at_Alaska_Wildlife_Conservation_Center.jpg",
  },

];
