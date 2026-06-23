// Arif Hissab Telegram Bot — @Arifhissabbot
require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ── Constants ────────────────────────────────────────────────────────────────
const YOUTUBE = "https://www.youtube.com/channel/UCHUeanvcwYYJlp1kZd5iaJw";
const APP_URL = "https://arifhissab.com";
const SUPPORT  = "https://t.me/Arifhissabbot";

// Per-user language preference (in-memory; survives restarts via /start re-select)
const userLang = new Map();

const getLang = (ctx) => userLang.get(ctx.from?.id) || "am";
const setLang  = (id, lang) => userLang.set(id, lang);

// ── Section content ──────────────────────────────────────────────────────────
const SECTIONS = {
  invoices: {
    emoji: "🧾",
    title_am: "ፋክቱር & ሽያጭ",
    title_en: "Invoices & Sales",
    video:    YOUTUBE,
    guide_am: [
      "🧾 *ፋክቱር & ሽያጭ — መመሪያ*",
      "",
      "📌 *አዲስ ፋክቱር ለመፍጠር:*",
      "1. \'ፋክቱሮች\' ሞጁል ክፈት",
      "2. \'+ ፋክቱር\' ቁልፍ ተጫን",
      "3. ደምበኛ ምረጥ ወይም አዲስ ፍጠር",
      "4. ምርቶች / አገልግሎቶች ጨምር",
      "5. VAT 15% ሰምጦ ይሰላል",
      "6. \'አስቀምጥ\' ቁልፍ ተጫን",
      "",
      "📌 *ሁኔታ ወደ \'ተከፈለ\' ለመቀየር:*",
      "• ፋክቱሩን ክፈት → \'ክፍያ ምልክት\' ቁልፍ",
      "• ክፍያ ዘዴ: ጥሬ ፣ CBE ፣ Telebirr",
      "",
      "📌 *ፋክቱር ለማጋራት:*",
      "• WhatsApp ወይም Email በኩል",
      "",
      "💡 VAT 15% ሁሌም ተካቷል",
      "💡 ቁጥር: INV-000001 (ያለማቋረጥ)",
      "💡 ERCA ደምቦቹን ሙሉ ያሟላል",
    ].join("\n"),
    guide_en: [
      "🧾 *Invoices & Sales — Guide*",
      "",
      "📌 *Create an Invoice:*",
      "1. Open 'Invoices' module",
      "2. Tap '+ Invoice'",
      "3. Select or create a customer",
      "4. Add products / services",
      "5. VAT 15% calculated automatically",
      "6. Tap 'Save'",
      "",
      "📌 *Mark as Paid:*",
      "• Open invoice → tap 'Mark Paid'",
      "• Choose: Cash / CBE / Telebirr",
      "• Cash/CBE/Telebirr → updates COA balance",
      "",
      "📌 *Share Invoice:*",
      "• Via WhatsApp or Email",
      "",
      "💡 VAT 15% always included",
      "💡 Sequential numbering: INV-000001",
      "💡 Fully ERCA compliant format",
    ].join("\n"),
  },

  expenses: {
    emoji: "📤",
    title_am: "ወጪዎች",
    title_en: "Expenses",
    video:    YOUTUBE,
    guide_am: [
      "📤 *ወጪዎች — መመሪያ*",
      "",
      "📌 *ወጪ ለመቅዳት:*",
      "1. \'ወጪዎች\' ሞጁል ክፈት",
      "2. \'+ ወጪ\' ቁልፍ ተጫን",
      "3. መጠን ፣ መግለጫ ፣ ዓይነት ጻፍ",
      "4. ታክስ ዓይነት ምረጥ:",
      "   • ምንም ታክስ",
      "   • WHT 2% — ዕቃዎች",
      "   • WHT 3% — አገልግሎቶች",
      "   • VAT ግቤት ክሬዲት",
      "5. \'አስቀምጥ\' ቁልፍ ተጫን",
      "",
      "📌 *WHT ምንድን ነው?*",
      "• Withholding Tax = ከምንከፍለው ቀንሰን ለ ERCA",
      "• ዕቃ: 2% ፣ አገልግሎት: 3%",
      "• አቅራቢው ቀሪውን ብቻ ይቀበላል",
      "",
      "⏰ WHT ለ ERCA ወር 25ኛ ቀን ይቀርባል",
      "⏰ VAT ለ ERCA ወር 25ኛ ቀን ይቀርባል",
    ].join("\n"),
    guide_en: [
      "📤 *Expenses — Guide*",
      "",
      "📌 *Record an Expense:*",
      "1. Open 'Expenses' module",
      "2. Tap '+ Expense'",
      "3. Enter amount, description, account category",
      "4. Choose tax type:",
      "   • No tax",
      "   • WHT 2% — goods",
      "   • WHT 3% — services",
      "   • VAT input credit",
      "5. Tap 'Save'",
      "",
      "📌 *What is WHT?*",
      "• Withholding Tax = deducted before paying supplier",
      "• Goods: 2%   Services: 3%",
      "• Supplier receives the net amount",
      "",
      "⏰ WHT due to ERCA by the 25th monthly",
      "⏰ VAT due to ERCA by the 25th monthly",
    ].join("\n"),
  },

  payroll: {
    emoji: "💰",
    title_am: "ደሞዝ & ሰራተኞች",
    title_en: "Payroll & HR",
    video:    YOUTUBE,
    guide_am: [
      "💰 *ደሞዝ & ሰራተኞች — መመሪያ*",
      "",
      "📌 *ደሞዝ ለማሰራ:*",
      "1. \'ደሞዝ\' ሞጁል ክፈት",
      "2. ሰራተኛ ምረጥ",
      "3. ጠቅላላ ደሞዝ አስገባ",
      "4. ስርዓቱ ሰምጦ ያሰላል:",
      "   • PIT (ገቢ ታክስ)",
      "   • ጡረታ 7% (ሰራተኛ)",
      "   • ጡረታ 11% (ቀጣሪ)",
      "   • ተጣሪ ደሞዝ",
      "",
      "📊 *PIT ዕርከኖች (Ethiopian):*",
      "• 0 – 600         → 0%",
      "• 601 – 1,650     → 10%",
      "• 1,651 – 3,200   → 15%",
      "• 3,201 – 5,250   → 20%",
      "• 5,251 – 7,800   → 25%",
      "• 7,801 – 10,900  → 30%",
      "• 10,901+         → 35%",
      "",
      "📌 *ምሳሌ (ጠቅላላ ETB 10,000):*",
      "• PIT:         ETB 1,445",
      "• ጡረታ 7%:    ETB 700",
      "• ተጣሪ:        ETB 7,855",
      "• ቀጣሪ ጡረታ:  ETB 1,100",
      "",
      "⏰ ጡረታ ለ PSSSA ወር 30ኛ ቀን ይቀርባል",
    ].join("\n"),
    guide_en: [
      "💰 *Payroll & HR — Guide*",
      "",
      "📌 *Run Payroll:*",
      "1. Open 'Payroll' module",
      "2. Select employee",
      "3. Enter gross salary",
      "4. System auto-calculates:",
      "   • PIT (Personal Income Tax)",
      "   • Pension 7% (employee deduction)",
      "   • Pension 11% (employer contribution)",
      "   • Net salary",
      "",
      "📊 *PIT Brackets (Ethiopian):*",
      "• 0 – 600         → 0%",
      "• 601 – 1,650     → 10%",
      "• 1,651 – 3,200   → 15%",
      "• 3,201 – 5,250   → 20%",
      "• 5,251 – 7,800   → 25%",
      "• 7,801 – 10,900  → 30%",
      "• 10,901+         → 35%",
      "",
      "📌 *Example (Gross ETB 10,000):*",
      "• PIT:            ETB 1,445",
      "• Pension 7%:     ETB 700",
      "• Net salary:     ETB 7,855",
      "• Employer cost:  ETB 11,100 (incl. 11%)",
      "",
      "⏰ Pension due to PSSSA by 30th monthly",
    ].join("\n"),
  },

  accounting: {
    emoji: "📓",
    title_am: "የሒሳብ አያያዝ",
    title_en: "Accounting",
    video:    YOUTUBE,
    guide_am: [
      "📓 *የሒሳብ አያያዝ — መመሪያ*",
      "",
      "📌 *4 ቁልፍ ሞጁሎች:*",
      "",
      "🔹 *ሂሳብ ማስታወሻ (Journal)*",
      "• ድርብ ሂሳብ አያያዝ",
      "• DR = CR ሊሆን ይገባል",
      "• 7 ዝግጁ አብነቶች አሉ",
      "• DRAFT ወይም POST ሁኔታ",
      "",
      "🔹 *ዋና ዝርዝር (GL)*",
      "• ሁሉም ግብይቶች ዝርዝር",
      "• በጊዜ ወይም ሂሳብ ይፍጉ",
      "",
      "🔹 *የሂሳብ ዕቅድ (COA)*",
      "• 19 ነባሪ ሂሳቦች",
      "• ASSET · LIABILITY · EQUITY · INCOME · EXPENSE",
      "• ኮዶች: 1010–6400",
      "",
      "🔹 *ሙከራ ሚዛን (TB)*",
      "• DR vs CR ትክክለኛነት ማረጋገጫ",
      "",
      "💡 ERCA Directive 176/2014 ሙሉ ተኳሃኝ",
      "💡 ማስታወሻ ቁጥር: JRN-2018-0001",
    ].join("\n"),
    guide_en: [
      "📓 *Accounting — Guide*",
      "",
      "📌 *4 Key Modules:*",
      "",
      "🔹 *Journal*",
      "• Double-entry bookkeeping",
      "• DR must equal CR to POST",
      "• 7 quick-entry templates",
      "• DRAFT or POSTED status",
      "",
      "🔹 *General Ledger (GL)*",
      "• All transactions per account",
      "• Filter by date or account",
      "",
      "🔹 *Chart of Accounts (COA)*",
      "• 19 default accounts",
      "• ASSET · LIABILITY · EQUITY · INCOME · EXPENSE",
      "• Codes: 1010–6400",
      "",
      "🔹 *Trial Balance (TB)*",
      "• Verify DR = CR across all accounts",
      "",
      "💡 ERCA Directive 176/2014 compliant",
      "💡 Entry numbering: JRN-2018-0001",
    ].join("\n"),
  },

  ai: {
    emoji: "🤖",
    title_am: "AI Tax Assistant & Tools",
    title_en: "AI Tax Assistant & Tools",
    video:    YOUTUBE,
    guide_am: [
      "🤖 *AI Tax Assistant & Tools — መመሪያ*",
      "",
      "📌 *AI የታክስ ረዳት:*",
      "• ሁሉንም የ ERCA ጥያቄዎች ይጠይቁ",
      "• VAT, WHT, PIT, ጡረታ ሁሉ ያብራራል",
      "• አማርኛ ወይም እንግሊዝኛ ይደግፋል",
      "• Claude AI ሞዴል ይጠቀማል",
      "• ኢንተርኔት ሲጠፋ ሎካል ሞዴል አለ",
      "",
      "📌 *7 ካልኩሌተሮች:*",
      "1. VAT 15% — ጨምር / ቀንስ",
      "2. ደሞዝ / PIT — ተጣሪ ሰምጦ",
      "3. WHT 2-3% — ምን ይቀነሳል",
      "4. ትርፍ ዜሮ ነጥብ (Break-Even)",
      "5. ብድር / Loan (ወርሃዊ ክፍያ)",
      "6. ትርፍ% / Markup%",
      "7. ምንዛሬ (USD, EUR, GBP…)",
      "",
      "💡 ሁሉም ካልኩሌሽኖች ERCA ደምቦቹን ያሟላሉ",
      "💡 ካልኩሌተሮቹ ሁሌም ያለ ኢንተርኔት ይሰሩ",
    ].join("\n"),
    guide_en: [
      "🤖 *AI Tax Assistant & Tools — Guide*",
      "",
      "📌 *AI Tax Assistant:*",
      "• Ask any ERCA tax question",
      "• Explains VAT, WHT, PIT, Pension",
      "• Supports Amharic & English",
      "• Powered by Claude AI (claude-sonnet)",
      "• Local fallback when offline",
      "",
      "📌 *7 Calculators:*",
      "1. VAT 15% — add or extract",
      "2. Salary / PIT — compute net pay",
      "3. WHT 2-3% — compute withholding",
      "4. Break-Even — units & revenue",
      "5. Loan — monthly repayment",
      "6. Margin & Markup percentages",
      "7. Currency (USD, EUR, GBP, SAR…)",
      "",
      "💡 All calculations follow ERCA regulations",
      "💡 Calculators work fully offline",
    ].join("\n"),
  },

  stock: {
    emoji: "📦",
    title_am: "ምርቶች & አቅራቢዎች",
    title_en: "Stock & Suppliers",
    video:    YOUTUBE,
    guide_am: [
      "📦 *ምርቶች & አቅራቢዎች — መመሪያ*",
      "",
      "📌 *ምርት ለማከል:*",
      "1. \'ምርቶች\' ሞጁል ክፈት",
      "2. \'+ ምርት\' ቁልፍ ተጫን",
      "3. ስም (አማርኛ + እንግሊዝኛ) ፣ ዋጋ ፣ ዝቅተኛ ዋጋ ጻፍ",
      "4. ዓይነት ምረጥ: ዕቃ ወይም አገልግሎት",
      "5. ክምችት ጀምሪ (ዕቃ ብቻ)",
      "",
      "📌 *ክምችት ቁጥጥር:*",
      "• ፋክቱር ሲፈጠር ክምችት ሰምጦ ይቀነሳል",
      "• POS ሽያጭ ሲደረግ ክምችት ይቀነሳል",
      "• ዝቅተኛ ምልክት ሲደርስ ማስጠንቀቂያ",
      "• ዳግም ዕቃ ነጥብ (reorder point) ይቀምጡ",
      "",
      "📌 *አቅራቢዎች:*",
      "• TIN ፣ ባንክ ፣ ዕዳ (AP) ይከታተሉ",
      "• WHT: ዕቃ 2% ፣ አገልግሎት 3%",
      "• ክፍያ ጊዜ: ወዲያው/Net15/Net30/Net60",
      "",
      "💡 አገልግሎቶች ምንም ክምችት የላቸውም",
      "💡 ዕቃ ክምችት ዜሮ ሲሆን POS ይዘጋል",
    ].join("\n"),
    guide_en: [
      "📦 *Stock & Suppliers — Guide*",
      "",
      "📌 *Add a Product:*",
      "1. Open 'Products' module",
      "2. Tap '+ Product'",
      "3. Enter name (Amharic + English), price, cost",
      "4. Choose type: Goods or Service",
      "5. Set opening stock level (goods only)",
      "",
      "📌 *Stock Control:*",
      "• Stock deducted automatically on invoice",
      "• Stock deducted on every POS sale",
      "• Low-stock notification at reorder point",
      "• Set custom reorder threshold per product",
      "",
      "📌 *Suppliers:*",
      "• Track TIN, bank account, AP balance",
      "• WHT rate: Goods 2% · Services 3%",
      "• Payment terms: Immediate/Net15/Net30/Net60",
      "",
      "💡 Services have no stock (stock = null)",
      "💡 POS blocks items with zero stock",
    ].join("\n"),
  },

  reports: {
    emoji: "📊",
    title_am: "ሪፖርቶች & ERCA",
    title_en: "Reports & ERCA",
    video:    YOUTUBE,
    guide_am: [
      "📊 *ሪፖርቶች & ERCA — መመሪያ*",
      "",
      "📌 *5 ሪፖርት ዓይነቶች:*",
      "",
      "🔹 *ማጠቃለያ (Summary)*",
      "• ተጣሪ ትርፍ/ኪሳራ ዋና ቁጥር",
      "• 7 ቀን SVG ቻርት",
      "• ዋና 6 ቁጥሮች",
      "",
      "🔹 *ትርፍ & ኪሳራ (P&L)*",
      "• ሽያጭ vs ወጪ ዝርዝር",
      "• ወጪ በዓይነት ተደምሮ",
      "",
      "🔹 *ሚዛን ዘገባ (Balance Sheet)*",
      "• ንብረቶች / ዕዳዎች / ካፒታል (COA ላይ ተመሥርቶ)",
      "",
      "🔹 *ERCA ሪፖርት*",
      "• VAT ጠቅላላ ፣ WHT ጠቅላላ ፣ ጡረታ ጠቅላላ",
      "• ቀን ቆጠራ: VAT/WHT 25ኛ ፣ ጡረታ 30ኛ",
      "",
      "🔹 *ክምችት ሪፖርት*",
      "• ዋጋ ጠቅላላ ፣ ዝቅተኛ ዝርዝር",
      "",
      "💡 ዘመን: ዛሬ / 7 ቀን / ወር / ዓመት",
      "💡 WhatsApp, Email ወይም ፕሪንት ያጋሩ",
    ].join("\n"),
    guide_en: [
      "📊 *Reports & ERCA — Guide*",
      "",
      "📌 *5 Report Types:*",
      "",
      "🔹 *Summary*",
      "• Net profit/loss hero number",
      "• 7-day SVG chart",
      "• 6 key metrics at a glance",
      "",
      "🔹 *Profit & Loss (P&L)*",
      "• Revenue vs expense breakdown",
      "• Expenses grouped by account category",
      "",
      "🔹 *Balance Sheet*",
      "• Assets / Liabilities / Equity (from COA)",
      "",
      "🔹 *ERCA Report*",
      "• VAT total · WHT total · Pension total",
      "• Filing calendar: VAT/WHT 25th · Pension 30th",
      "",
      "🔹 *Stock Report*",
      "• Inventory value · low-stock list",
      "",
      "💡 Periods: Today / 7 Days / Month / Year",
      "💡 Export: WhatsApp · Email · Print",
    ].join("\n"),
  },

  branches: {
    emoji: "🏪",
    title_am: "ቅርንጫፎች",
    title_en: "Branches",
    video:    YOUTUBE,
    guide_am: [
      "🏪 *ቅርንጫፎች — መመሪያ*",
      "",
      "📌 *ቅርንጫፍ ለማከል:*",
      "1. \'ቅርንጫፍ አስተዳደር\' ሞጁል ክፈት",
      "2. \'+ ቅርንጫፍ\' ቁልፍ ተጫን",
      "3. ስም ፣ ከተማ ፣ አድራሻ ጻፍ",
      "",
      "📌 *ቅርንጫፎች መቀያየር:*",
      "• ሰርጥ ጭኛ ምልክት → ቅርንጫፍ ምረጥ",
      "• \'ሁሉም ቅርንጫፎች\' — ጥቅል ዕይታ",
      "",
      "📌 *ፕላን ልኬቶች:*",
      "• Basic (950 ብር/ወር): 1 ቅርንጫፍ",
      "• Business (1,750 ብር/ወር): 2 ቅርንጫፎች",
      "• Enterprise (2,200 ብር/ወር): ሀ ቅርንጫፎች",
      "",
      "📌 *ሁሉም ቅርንጫፍ ዕይታ:*",
      "• ፕሮ + ሁሉም ቅርንጫፎች (>1) ሲኖሩ",
      "• ጥቅል P&L ያያሉ",
      "• ማጣሪያ ብቻ — ዳታ አይጻፍም",
      "",
      "💡 እያንዳንዱ ቅርንጫፍ ሙሉ ነጻ ዳታ አለው",
      "💡 Firestore ቁልፍ: b_{id}_invoices",
    ].join("\n"),
    guide_en: [
      "🏪 *Branches — Guide*",
      "",
      "📌 *Add a Branch:*",
      "1. Open 'Branch Management'",
      "2. Tap '+ Branch'",
      "3. Enter name, city, address",
      "",
      "📌 *Switch Branches:*",
      "• Header branch icon → select branch",
      "• 'All Branches' for combined read-only view",
      "",
      "📌 *Plan Limits:*",
      "• Basic (ETB 950/mo): 1 branch",
      "• Business (ETB 1,750/mo): 2 branches",
      "• Enterprise (ETB 2,200/mo): Unlimited",
      "",
      "📌 *All Branches View:*",
      "• Requires Pro + multiple branches",
      "• Combined P&L across all branches",
      "• Read-only — no writes in this mode",
      "",
      "💡 Each branch has fully isolated data",
      "💡 Firestore key: b_{id}_invoices",
    ].join("\n"),
  },
};

// ── Keyboards ────────────────────────────────────────────────────────────────
function langKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🇪🇹 አማርኛ", "lang_am"),
      Markup.button.callback("🇬🇧 English", "lang_en"),
    ],
  ]);
}

function mainMenuKeyboard(lang) {
  const am = lang === "am";
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🧾 " + (am ? "ፋክቱር & ሽያጭ"     : "Invoices & Sales"),    "sec_invoices"),
      Markup.button.callback("📤 " + (am ? "ወጪዎች"             : "Expenses"),            "sec_expenses"),
    ],
    [
      Markup.button.callback("💰 " + (am ? "ደሞዝ & ሰራተኞች"    : "Payroll & HR"),        "sec_payroll"),
      Markup.button.callback("📓 " + (am ? "የሒሳብ አያያዝ"       : "Accounting"),          "sec_accounting"),
    ],
    [
      Markup.button.callback("🤖 AI Tax Assistant & Tools",                             "sec_ai"),
      Markup.button.callback("📦 " + (am ? "ምርቶች & አቅራቢዎች" : "Stock & Suppliers"),   "sec_stock"),
    ],
    [
      Markup.button.callback("📊 " + (am ? "ሪፖርቶች & ERCA"   : "Reports & ERCA"),      "sec_reports"),
      Markup.button.callback("🏪 " + (am ? "ቅርንጫፎች"          : "Branches"),            "sec_branches"),
    ],
    [
      Markup.button.callback("🌐 " + (am ? "ቋንቋ ቀይር"        : "Change Language"),      "change_lang"),
      Markup.button.url("📱 " + (am ? "መተግበሪያ ክፈት"        : "Open App"),             APP_URL),
    ],
    [
      Markup.button.url("🆘 " + (am ? "ድጋፍ ያግኙ"           : "Get Support"),           SUPPORT),
    ],
  ]);
}

function sectionKeyboard(lang, key) {
  const am = lang === "am";
  const sec = SECTIONS[key];
  return Markup.inlineKeyboard([
    [Markup.button.url(    am ? "🎥 ቪዲዮ ትምህርት ይመልከቱ" : "🎥 Watch Video Tutorial",  sec.video)],
    [Markup.button.callback(am ? "📝 መመሪያ ያንብቡ"       : "📝 Read Step-by-Step Guide", `guide_${key}`)],
    [Markup.button.callback(am ? "🔙 ወደ ዋና ምናሌ"       : "🔙 Back to Main Menu",       "main_menu")],
  ]);
}

function guideKeyboard(lang, key) {
  const am = lang === "am";
  const sec = SECTIONS[key];
  return Markup.inlineKeyboard([
    [Markup.button.url(    am ? "🎥 ቪዲዮ ትምህርት ይመልከቱ" : "🎥 Watch Video Tutorial",  sec.video)],
    [Markup.button.callback(am ? "🔙 ወደ ዋና ምናሌ"       : "🔙 Back to Main Menu",       "main_menu")],
  ]);
}

// ── /start ────────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  await ctx.reply(
    "🎉 *እንኳን ወደ አሪፍ ሂሳብ በሰላም መጡ\\!*\n" +
    "Welcome to Arif Hissab Bot\\!\n\n" +
    "ቋንቋ ይምረጡ / Choose your language:",
    { parse_mode: "MarkdownV2", ...langKeyboard() }
  );
});

// ── /menu ─────────────────────────────────────────────────────────────────────
bot.command("menu", async (ctx) => {
  const lang = getLang(ctx);
  const am = lang === "am";
  await ctx.reply(
    am
      ? "🏠 *ዋና ምናሌ — አሪፍ ሂሳብ*\n\nምን ለማወቅ ይፈልጋሉ? ክፍሉን ይምረጡ:"
      : "🏠 *Main Menu — Arif Hissab*\n\nWhich section would you like to learn about?",
    { parse_mode: "Markdown", ...mainMenuKeyboard(lang) }
  );
});

// ── /help ─────────────────────────────────────────────────────────────────────
bot.command("help", async (ctx) => {
  const lang = getLang(ctx);
  const am = lang === "am";
  await ctx.reply(
    am
      ? "❓ *እርዳታ — አሪፍ ሂሳብ ቦት*\n\n" +
        "/start — እንደ አዲስ ጀምር\n" +
        "/menu  — ዋና ምናሌ ክፈት\n" +
        "/help  — ይህ ዝርዝር\n\n" +
        "ሁሉም ክፍሎቹ ከዋና ምናሌ ይገኛሉ።\n\n" +
        "📱 መተግበሪያ: " + APP_URL + "\n" +
        "🆘 ድጋፍ: " + SUPPORT
      : "❓ *Help — Arif Hissab Bot*\n\n" +
        "/start — Restart bot\n" +
        "/menu  — Open main menu\n" +
        "/help  — This help message\n\n" +
        "All sections are available from the main menu.\n\n" +
        "📱 App: " + APP_URL + "\n" +
        "🆘 Support: " + SUPPORT,
    { parse_mode: "Markdown" }
  );
});

// ── Language callbacks ────────────────────────────────────────────────────────
bot.action("lang_am", async (ctx) => {
  setLang(ctx.from.id, "am");
  await ctx.answerCbQuery("አማርኛ ተምርጧል ✓");
  await ctx.editMessageText(
    "🏠 *ዋና ምናሌ — አሪፍ ሂሳብ*\n\nምን ለማወቅ ይፈልጋሉ? ክፍሉን ይምረጡ:",
    { parse_mode: "Markdown", ...mainMenuKeyboard("am") }
  );
});

bot.action("lang_en", async (ctx) => {
  setLang(ctx.from.id, "en");
  await ctx.answerCbQuery("English selected ✓");
  await ctx.editMessageText(
    "🏠 *Main Menu — Arif Hissab*\n\nWhich section would you like to learn about?",
    { parse_mode: "Markdown", ...mainMenuKeyboard("en") }
  );
});

bot.action("change_lang", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    "🌐 ቋንቋ ይምረጡ / Choose your language:",
    { parse_mode: "Markdown", ...langKeyboard() }
  );
});

// ── Main menu callback ────────────────────────────────────────────────────────
bot.action("main_menu", async (ctx) => {
  const lang = getLang(ctx);
  const am = lang === "am";
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    am
      ? "🏠 *ዋና ምናሌ — አሪፍ ሂሳብ*\n\nምን ለማወቅ ይፈልጋሉ? ክፍሉን ይምረጡ:"
      : "🏠 *Main Menu — Arif Hissab*\n\nWhich section would you like to learn about?",
    { parse_mode: "Markdown", ...mainMenuKeyboard(lang) }
  );
});

// ── Section + Guide callbacks (generated for all 8 sections) ─────────────────
Object.keys(SECTIONS).forEach((key) => {
  const sec = SECTIONS[key];

  // Section landing → shows Video + Guide + Back
  bot.action(`sec_${key}`, async (ctx) => {
    const lang = getLang(ctx);
    const am   = lang === "am";
    const title = am ? sec.title_am : sec.title_en;
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `${sec.emoji} *${title}*\n\n${am ? "ምን ለማወቅ ይፈልጋሉ?" : "What would you like to know?"}`,
      { parse_mode: "Markdown", ...sectionKeyboard(lang, key) }
    );
  });

  // Guide → shows full step-by-step content + Video + Back
  bot.action(`guide_${key}`, async (ctx) => {
    const lang = getLang(ctx);
    const am   = lang === "am";
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      am ? sec.guide_am : sec.guide_en,
      { parse_mode: "Markdown", ...guideKeyboard(lang, key) }
    );
  });
});

// ── Catch-all text message ────────────────────────────────────────────────────
bot.on("text", async (ctx) => {
  const lang = getLang(ctx);
  const am   = lang === "am";
  await ctx.reply(
    am
      ? "📋 ከዚህ በታች ያሉ ምናሌዎቹን ለመድረስ /menu ይጻፉ ወይም ቁልፍ ይጫኑ:"
      : "📋 Type /menu or press the button to browse all sections:",
    { parse_mode: "Markdown", ...mainMenuKeyboard(lang) }
  );
});

// ── Error handler ─────────────────────────────────────────────────────────────
bot.catch((err, ctx) => {
  console.error(`[${new Date().toISOString()}] Error for ${ctx.updateType}:`, err.message);
});

// ── Launch ────────────────────────────────────────────────────────────────────
bot.launch()
  .then(async () => {
    console.log(`✅ @Arifhissabbot is live — ${new Date().toISOString()}`);
    await bot.telegram.setMyCommands([
      { command: "start", description: "ይጀምሩ / Start" },
      { command: "menu",  description: "ዋና ማውጫ / Main Menu" },
      { command: "help",  description: "እርዳታ / Help" },
    ]);
    console.log("✅ Bot commands menu updated");
  })
  .catch((err) => { console.error("❌ Failed to start bot:", err); process.exit(1); });

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
