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
    image: FP + "Adult_male_Royal_Bengal_tiger.jpg?width=400",
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
    image: FP + "Male_silverback_Gorilla.JPG?width=400",
  },
  {
    name: "Kangaroo",    nameHe: "קנגורו",
    code: "ani-kangaroo",emoji: "🦘",    difficulty: "easy",
    image: FP + "Eastern_Grey_Kangaroo_Feeding.jpg?width=400",
  },
  {
    name: "Cheetah",     nameHe: "ברדלס",
    code: "ani-cheetah", emoji: "🐆",    difficulty: "easy",
    image: FP + "Cheetah_(Acinonyx_jubatus)_female_2.jpg?width=400",
  },
  {
    name: "Hippopotamus",nameHe: "היפופוטם",
    code: "ani-hippo",   emoji: "🦛",    difficulty: "easy",
    image: FP + "Hippo_Baby.JPG?width=400",
  },
  {
    name: "Penguin",     nameHe: "פינגווין",
    code: "ani-penguin", emoji: "🐧",    difficulty: "easy",
    image: FP + "Emperor-walk_hg.jpg?width=400",
  },
  {
    name: "Flamingo",    nameHe: "פלמינגו",
    code: "ani-flamingo",emoji: "🦩",    difficulty: "easy",
    image: FP + "Flamingo_Stretching_Wings_in_Water.jpg?width=400",
  },
  {
    name: "Shark",       nameHe: "כריש",
    code: "ani-shark",   emoji: "🦈",    difficulty: "easy",
    image: FP + "White_shark.jpg?width=400",
  },
  {
    name: "Dog",         nameHe: "כלב",
    code: "ani-dog",     emoji: "🐕",    difficulty: "easy",
    image: FP + "Golden_retriever.jpg?width=400",
  },
  {
    name: "Cat",         nameHe: "חתול",
    code: "ani-cat",     emoji: "🐱",    difficulty: "easy",
    image: FP + "European_shorthair_procumbent_Quincy.jpg?width=400",
  },
  {
    name: "Horse",       nameHe: "סוס",
    code: "ani-horse",   emoji: "🐴",    difficulty: "easy",
    image: FP + "IcelandicHorseInWinter.jpg?width=400",
  },
  {
    name: "Cow",         nameHe: "פרה",
    code: "ani-cow",     emoji: "🐄",    difficulty: "easy",
    image: FP + "Cow_portrait.jpg?width=400",
  },
  {
    name: "Sheep",       nameHe: "כבש",
    code: "ani-sheep",   emoji: "🐑",    difficulty: "easy",
    image: FP + "Sheep_looking_to_the_right.jpg?width=400",
  },
  {
    name: "Rabbit",      nameHe: "ארנב",
    code: "ani-rabbit",  emoji: "🐰",    difficulty: "easy",
    image: FP + "Bright_Ears_(9338800710).jpg?width=400",
  },
  {
    name: "Duck",        nameHe: "ברווז",
    code: "ani-duck",    emoji: "🦆",    difficulty: "easy",
    image: FP + "A_Mallard_duck.jpg?width=400",
  },
  {
    name: "Donkey",      nameHe: "חמור",
    code: "ani-donkey",  emoji: "🫏",    difficulty: "easy",
    image: FP + "Donkey_in_Clovelly,_North_Devon,_England.jpg?width=400",
  },
  {
    name: "Goat",        nameHe: "עז",
    code: "ani-goat",    emoji: "🐐",    difficulty: "easy",
    image: FP + "Brown_female_goat.jpg?width=400",
  },
  {
    name: "Rooster",     nameHe: "תרנגול",
    code: "ani-rooster", emoji: "🐓",    difficulty: "easy",
    image: FP + "Rooster04_adjusted.jpg?width=400",
  },

  // ── MEDIUM ────────────────────────────────────────────────────────────────
  {
    name: "Wolf",        nameHe: "זאב",
    code: "ani-wolf",    emoji: "🐺",    difficulty: "medium",
    image: FP + "Mexican_Wolf_2_yfb-edit_1.jpg?width=400",
  },
  {
    name: "Brown Bear",  nameHe: "דוב חום",
    code: "ani-brownbear",emoji: "🐻",   difficulty: "medium",
    image: FP + "Kamchatka_Brown_Bear_near_Dvuhyurtochnoe_on_2015-07-23.jpg?width=400",
  },
  {
    name: "Leopard",     nameHe: "נמר מנוקד",
    code: "ani-leopard", emoji: "🐆",    difficulty: "medium",
    image: FP + "Male_leopard_-_Mara.jpg?width=400",
  },
  {
    name: "Rhinoceros",  nameHe: "קרנף",
    code: "ani-rhino",   emoji: "🦏",    difficulty: "medium",
    image: FP + "White_Rhino.jpg?width=400",
  },
  {
    name: "Camel",       nameHe: "גמל",
    code: "ani-camel",   emoji: "🐪",    difficulty: "medium",
    image: FP + "Dromedary_in_Thar_desert.jpg?width=400",
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
    image: FP + "Young_male_chimp.png?width=400",
  },
  {
    name: "Jaguar",      nameHe: "יגואר",
    code: "ani-jaguar",  emoji: "🐆",    difficulty: "medium",
    image: FP + "Jaguar_(Panthera_onca_palustris)_male_Three_Brothers_River_2.jpg?width=400",
  },
  {
    name: "Moose",       nameHe: "אייל הצפון",
    code: "ani-moose",   emoji: "🫎",    difficulty: "medium",
    image: FP + "Male_Moose.jpg?width=400",
  },
  {
    name: "Red Fox",     nameHe: "שועל אדום",
    code: "ani-fox",     emoji: "🦊",    difficulty: "medium",
    image: FP + "Red_Fox_(Vulpes_vulpes)_-British_Wildlife_Centre-8.jpg?width=400",
  },
  {
    name: "Meerkat",     nameHe: "סוריקטה",
    code: "ani-meerkat", emoji: "🐾",    difficulty: "medium",
    image: FP + "Suricata_suricatta.jpg?width=400",
  },
  {
    name: "Crocodile",   nameHe: "תמסח",
    code: "ani-crocodile",emoji: "🐊",   difficulty: "medium",
    image: FP + "NileCrocodile.jpg?width=400",
  },
  {
    name: "Bald Eagle",  nameHe: "עיט",
    code: "ani-baldeagle",emoji: "🦅",   difficulty: "medium",
    image: FP + "Bald_eagle_head_frontal.jpg?width=400",
  },
  {
    name: "Sloth",       nameHe: "עצלן",
    code: "ani-sloth",   emoji: "🦥",    difficulty: "medium",
    image: FP + "Two-toed_sloth_Costa_Rica.jpg?width=400",
  },
  {
    name: "Peacock",     nameHe: "טווס",
    code: "ani-peacock", emoji: "🦚",    difficulty: "medium",
    image: FP + "Peacock_Dance.jpg?width=400",
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
    image: FP + "Blue_Whale_(Balaenoptera_musculus)_Mysticeti_baleen_whale.jpg?width=400",
  },
  {
    name: "Lynx",        nameHe: "לינקס",
    code: "ani-lynx",    emoji: "🐱",    difficulty: "hard",
    image: FP + "Lynx_lynx_poing.jpg?width=400",
  },
  {
    name: "Otter",       nameHe: "לוטרה",
    code: "ani-otter",   emoji: "🦦",    difficulty: "hard",
    image: FP + "Otter_Portrait_(24121714981).jpg?width=400",
  },
  {
    name: "Capybara",    nameHe: "קפיבארה",
    code: "ani-capybara",emoji: "🐾",    difficulty: "hard",
    image: FP + "Capybara_(Hydrochoerus_hydrochaeris).JPG?width=400",
  },
  {
    name: "Bison",       nameHe: "ביזון",
    code: "ani-bison",   emoji: "🐃",    difficulty: "hard",
    image: FP + "American_bison_k5680-1.jpg?width=400",
  },
  {
    name: "Warthog",     nameHe: "חזיר יבלות",
    code: "ani-warthog", emoji: "🐗",    difficulty: "hard",
    image: FP + "Warthog_12.JPG?width=400",
  },
  {
    name: "Mandrill",    nameHe: "מנדריל",
    code: "ani-mandrill",emoji: "🐒",    difficulty: "hard",
    image: FP + "Mandrill_at_SF_Zoo.jpg?width=400",
  },
  {
    name: "Tapir",       nameHe: "טפיר",
    code: "ani-tapir",   emoji: "🐾",    difficulty: "hard",
    image: FP + "Malayan_Tapir_001.jpg?width=400",
  },
  {
    name: "Toucan",      nameHe: "טוקן",
    code: "ani-toucan",  emoji: "🐦",    difficulty: "hard",
    image: FP + "Ramphastos_sulfuratus_-bird_park_-Honduras.jpg?width=400",
  },
  {
    name: "Octopus",     nameHe: "תמנון",
    code: "ani-octopus", emoji: "🐙",    difficulty: "hard",
    image: FP + "Octopus_Vulgaris.jpg?width=400",
  },

];
