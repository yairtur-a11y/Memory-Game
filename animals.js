// ── Mammals ────────────────────────────────────────────────────────────────
// image → Special:FilePath URL (no MD5 hash needed; MediaWiki resolves it)

const FP = "https://commons.wikimedia.org/wiki/Special:FilePath/";

const animalMembers = [

  // ── EASY ─────────────────────────────────────────────────────────────────
  {
    name: "Lion",        nameHe: "אריה",
    code: "ani-lion",    emoji: "🦁",    difficulty: "easy",
    image: FP + "Lion_waiting_in_Namibia.jpg?width=400",
  },
  {
    name: "Elephant",    nameHe: "פיל",
    code: "ani-elephant",emoji: "🐘",    difficulty: "easy",
    image: FP + "African_Bush_Elephant.jpg?width=400",
  },
  {
    name: "Tiger",       nameHe: "נמר",
    code: "ani-tiger",   emoji: "🐯",    difficulty: "easy",
    image: FP + "Walking_tiger_female.jpg?width=400",
  },
  {
    name: "Giraffe",     nameHe: "ג'ירפה",
    code: "ani-giraffe", emoji: "🦒",    difficulty: "easy",
    image: FP + "Giraffe_Mikumi_National_Park.jpg?width=400",
  },
  {
    name: "Zebra",       nameHe: "זברה",
    code: "ani-zebra",   emoji: "🦓",    difficulty: "easy",
    image: FP + "Plains_Zebra_Equus_quagga.jpg?width=400",
  },
  {
    name: "Giant Panda", nameHe: "פנדה ענקית",
    code: "ani-panda",   emoji: "🐼",    difficulty: "easy",
    image: FP + "Grosser_Panda.JPG?width=400",
  },
  {
    name: "Polar Bear",  nameHe: "דוב קוטב",
    code: "ani-polarbear",emoji: "🐻‍❄️", difficulty: "easy",
    image: FP + "Polar_Bear_-_Alaska_(cropped).jpg?width=400",
  },
  {
    name: "Dolphin",     nameHe: "דולפין",
    code: "ani-dolphin", emoji: "🐬",    difficulty: "easy",
    image: FP + "Tursiops_truncatus_01.jpg?width=400",
  },
  {
    name: "Gorilla",     nameHe: "גורילה",
    code: "ani-gorilla", emoji: "🦍",    difficulty: "easy",
    image: FP + "Gorilla_gorilla_gorilla01.jpg?width=400",
  },
  {
    name: "Kangaroo",    nameHe: "קנגורו",
    code: "ani-kangaroo",emoji: "🦘",    difficulty: "easy",
    image: FP + "Male_eastern_grey_kangaroo.jpg?width=400",
  },
  {
    name: "Cheetah",     nameHe: "ברדלס",
    code: "ani-cheetah", emoji: "🐆",    difficulty: "easy",
    image: FP + "Cheetah_(Acinonyx_jubatus)_female_2.jpg?width=400",
  },
  {
    name: "Hippopotamus",nameHe: "היפופוטם",
    code: "ani-hippo",   emoji: "🦛",    difficulty: "easy",
    image: FP + "Hippo_at_Serengeti_National_Park.jpg?width=400",
  },

  // ── MEDIUM ────────────────────────────────────────────────────────────────
  {
    name: "Wolf",        nameHe: "זאב",
    code: "ani-wolf",    emoji: "🐺",    difficulty: "medium",
    image: FP + "YellowstonePark_WolfBlack.jpg?width=400",
  },
  {
    name: "Brown Bear",  nameHe: "דוב חום",
    code: "ani-brownbear",emoji: "🐻",   difficulty: "medium",
    image: FP + "Kamchatka_Brown_Bear_near_Dvuhyurtochnoe_on_2015-07-23.jpg?width=400",
  },
  {
    name: "Leopard",     nameHe: "נמר מנוקד",
    code: "ani-leopard", emoji: "🐆",    difficulty: "medium",
    image: FP + "Leopard_Africa_edit.jpg?width=400",
  },
  {
    name: "Rhinoceros",  nameHe: "קרנף",
    code: "ani-rhino",   emoji: "🦏",    difficulty: "medium",
    image: FP + "White_Rhinoceros.jpg?width=400",
  },
  {
    name: "Camel",       nameHe: "גמל",
    code: "ani-camel",   emoji: "🐪",    difficulty: "medium",
    image: FP + "Camel_in_Oman.jpg?width=400",
  },
  {
    name: "Koala",       nameHe: "קואלה",
    code: "ani-koala",   emoji: "🐨",    difficulty: "medium",
    image: FP + "Koala_climbing_tree.jpg?width=400",
  },
  {
    name: "Orangutan",   nameHe: "אורנגאוטן",
    code: "ani-orangutan",emoji: "🦧",   difficulty: "medium",
    image: FP + "Orang_Utan,_Semenggok_Forest_Reserve,_Sarawak,_Borneo,_Malaysia.JPG?width=400",
  },
  {
    name: "Chimpanzee",  nameHe: "שימפנזה",
    code: "ani-chimp",   emoji: "🐒",    difficulty: "medium",
    image: FP + "Chimpanzee_seated_-_Patricia_Figueira.jpg?width=400",
  },
  {
    name: "Jaguar",      nameHe: "יגואר",
    code: "ani-jaguar",  emoji: "🐆",    difficulty: "medium",
    image: FP + "Standing_jaguar.jpg?width=400",
  },
  {
    name: "Moose",       nameHe: "אייל הצפון",
    code: "ani-moose",   emoji: "🫎",    difficulty: "medium",
    image: FP + "Moose-alcesalces.jpg?width=400",
  },
  {
    name: "Red Fox",     nameHe: "שועל אדום",
    code: "ani-fox",     emoji: "🦊",    difficulty: "medium",
    image: FP + "Red_Fox_(Vulpes_vulpes)_-_British_Wildlife_Centre-edit2.jpg?width=400",
  },
  {
    name: "Meerkat",     nameHe: "סוריקטה",
    code: "ani-meerkat", emoji: "🐾",    difficulty: "medium",
    image: FP + "Suricata_suricatta.jpg?width=400",
  },

  // ── HARD ──────────────────────────────────────────────────────────────────
  {
    name: "Snow Leopard",nameHe: "נמר שלגים",
    code: "ani-snowleopard",emoji: "🐆", difficulty: "hard",
    image: FP + "Schneeleopard.jpg?width=400",
  },
  {
    name: "Blue Whale",  nameHe: "לווייתן כחול",
    code: "ani-bluewhale",emoji: "🐋",   difficulty: "hard",
    image: FP + "Blue_Whale_001.jpg?width=400",
  },
  {
    name: "Lynx",        nameHe: "לינקס",
    code: "ani-lynx",    emoji: "🐱",    difficulty: "hard",
    image: FP + "Lynx_lynx_poing.jpg?width=400",
  },
  {
    name: "Otter",       nameHe: "לוטרה",
    code: "ani-otter",   emoji: "🦦",    difficulty: "hard",
    image: FP + "Lutra_lutra-4.jpg?width=400",
  },
  {
    name: "Capybara",    nameHe: "קפיבארה",
    code: "ani-capybara",emoji: "🐾",    difficulty: "hard",
    image: FP + "Capybara_(Hydrochoerus_hydrochaeris).JPG?width=400",
  },
  {
    name: "Bison",       nameHe: "ביזון",
    code: "ani-bison",   emoji: "🐃",    difficulty: "hard",
    image: FP + "Bison_bison_bison_Wichita.jpg?width=400",
  },
  {
    name: "Warthog",     nameHe: "חזיר יבלות",
    code: "ani-warthog", emoji: "🐗",    difficulty: "hard",
    image: FP + "Common_Warthog_2012.jpg?width=400",
  },
  {
    name: "Mandrill",    nameHe: "מנדריל",
    code: "ani-mandrill",emoji: "🐒",    difficulty: "hard",
    image: FP + "Mandrill_at_SF_Zoo.jpg?width=400",
  },
  {
    name: "Tapir",       nameHe: "טפיר",
    code: "ani-tapir",   emoji: "🐾",    difficulty: "hard",
    image: FP + "Malayan_Tapir.jpg?width=400",
  },
  {
    name: "Wolverine",   nameHe: "גלוטון",
    code: "ani-wolverine",emoji: "🦡",   difficulty: "hard",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Wolverine_%28Gulo_gulo%29%2C_Korkeasaari.JPG",
  },

];
