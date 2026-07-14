require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

// Skapa boten med din token från miljövariabler
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ── Constants ────────────────────────────────────────────────────────────────
const YOUTUBE = "https://www.youtube.com/channel/UCHUeanvcwYYJlp1kZd5iaJw";
const APP_URL = "https://arifhissab.com";
const SUPPORT = "https://t.me/your_telegram_username"; // 💡 Ändra till ditt faktiska Telegram-användarnamn

// Sparar användarens språkval i minnet (per användar-ID)
const userLang = new Map();

const getLang = (ctx) => userLang.get(ctx.from?.id) || "am";
const setLang = (id, lang) => userLang.set(id, lang);

// Helper för att säkert redigera meddelanden utan att krascha vid "message is not modified"
const safeEditMessageText = async (ctx, text, extra) => {
  try {
    await ctx.editMessageText(text, { parse_mode: "Markdown", ...extra });
  } catch (err) {
    if (!err.message.includes("message is not modified")) {
      console.error("Error editing message text:", err);
    }
  }
};

// ── All 17 Sections (Amharic & English only) ──────────────────────────
const SECTIONS = {
  f01_sales: {
    emoji: "🧾",
    title_am: "01. ሽያጭ (Sales)",
    title_en: "01. Sales",
    video: YOUTUBE,
    guide_am: [
      "🧾 *ክፍል 01: ሽያጭ (Sales)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "ለደንበኛ የሚደረገውን ማንኛውንም የጥሬ ገንዘብ ወይም የብድር ሽያጭ ይመዘግባል። እያንዳንዱ ሽያጭ ታክስ በሚጣልባቸው ዕቃዎች ላይ 15% ተእታ (VAT) በራስ-ሰር ያሰላል፣ የምርት ክምችትዎን ይቀንሳል፣ እና በቀጥታ በዋትስአፕ ወይም በኢሜይል ለደንበኛው መላክ ይቻላል።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. ከዋናው ማውጫ ላይ *ሽያጭ (Sales)* የሚለውን ይክፈቱ እና *+ New* የሚለውን ይጫኑ።",
      "2. ከዝርዝሩ ውስጥ ያለ ደንበኛ ይምረጡ ወይም የአዲስ ደንበኛ ስም ይተይቡ።",
      "3. የተሸጠውን እያንዳንዱን ዕቃ ከብዛትና ዋጋ ጋር ያክሉ — ታክስ ለሚጣልባቸው ዕቃዎች ተእታ (VAT) በራስ-ሰር ይታከላል።",
      "4. እንዴት እንደተከፈለ ይምረጡ (Cash, Telebirr, CBE, ወይም የ30/60 ቀን ብድር) እና ያስቀምጡ።",
      "5. የብድር ሽያጭ ሲከፈል፣ ሽያጩን ከፍተው ሁኔታውን ወደ 'ተከፈለ (Paid)' ለመቀየር *Register Payment* የሚለውን ይጫኑ።",
      "6. ለደንበኛው ኮፒ ለመላክ፣ ሽያጩን ከፍተው በ'Share Sale' ስር *WhatsApp* ወይም *Email* የሚለውን ይጫኑ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ሽያጭን ማስቀመጥ የምርት ክምችትን (Stock) ወዲያውኑ ስለሚቀንስ፣ ሽያጩ እንደተጠናቀቀ ወዲያውኑ ይመዝግቡ፣ እስከ ቀኑ መጨረሻ አይጠብቁ።"
    ].join("\n"),
    guide_en: [
      "🧾 *FEATURE 01: Sales*",
      "",
      "ℹ️ *What it does:*",
      "Records every sale you make to a customer, cash or on credit. Each sale automatically calculates 15% VAT on taxable items, reduces your product stock, and can be sent straight to the customer over WhatsApp or email.",
      "",
      "📌 *Step by step:*",
      "1. Open *Sales* from the main menu and tap *+ New*.",
      "2. Choose an existing customer from the list, or type a new customer's name.",
      "3. Add each item sold with quantity and price — VAT is added automatically for taxable items.",
      "4. Choose how it's being paid (Cash, Telebirr, CBE, or 30/60-day credit) and save.",
      "5. When a credit sale is paid off, open it and tap *Register Payment* to change its status to Paid.",
      "6. To send a copy to the customer, open the sale and tap *WhatsApp* or *Email* under 'Share Sale'.",
      "",
      "⚠️ *Good to know:*",
      "Saving a sale deducts stock immediately, so enter it as soon as the sale happens, not at the end of the day."
    ].join("\n")
  },
  f02_expenses: {
    emoji: "📤",
    title_am: "02. ወጪ (Expenses)",
    title_en: "02. Expenses",
    video: YOUTUBE,
    guide_am: [
      "📤 *ክፍል 02: ወጪ (Expenses)*",
      "",
      "ℹ️ *ወጪ ሲባል ምን ለማለት ነው:*",
      "ንግድዎ የሚያወጣቸውን ማናቸውንም ክፍያዎች (ኪራይ፣ ደሞዝ፣ ግዢዎች፣ መገልገያዎች እና ሌሎችንም) ይመዘግባል — እና በክፍያው ላይ የሚፈለገውን ማንኛውንም የተያዘ ታክስ (WHT) ወይም የተአታ ግብዓት (VAT Input) በራስ-ሰር ያሰላል።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *ወጪ (Expenses)* የሚለውን ከፍተው *+ New* የሚለውን ይጫኑ።",
      "2. የወጪ አካውንቱን ይምረጡ፡ Rent, Salaries, Purchases, Transport, Utilities, ወይም Other።",
      "3. መጠኑን፣ እንዴት እንደተከፈለ፣ የአቅራቢውን ስም እና የደረሰኝ ቁጥሩን ያስገቡ።",
      "4. ታክስ የሚተገበር ከሆነ *WHT* (ዕቃዎች 2% ወይም አገልግሎቶች 3%) ወይም *VAT Input* ይምረጡ — ቅናሹ እርስዎ በሚተይቡበት ጊዜ በቀጥታ ይሰላል።",
      "5. ያስቀምጡ (Save)። ወጪው ወዲያውኑ ይመዘገባል እና ወደ ሂሳብ መዝገብዎ ይላካል።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ወጪዎች ከተቀመጡ በኋላ በአሁኑ ጊዜ ማስተካከል ወይም መሰረዝ አይቻልም — ከመቀመጡ በፊት መጠኑን እና አካውንቱን ደግመው ያረጋግጡ።"
    ].join("\n"),
    guide_en: [
      "📤 *FEATURE 02: Expenses*",
      "",
      "ℹ️ *What it does:*",
      "Logs every payment your business makes — rent, salaries, purchases, utilities, and more — and automatically works out any withholding tax (WHT) or VAT owed on the payment.",
      "",
      "📌 *Step by step:*",
      "1. Open *Expenses* and tap *+ New*.",
      "2. Choose the expense account: Rent, Salaries, Purchases, Transport, Utilities, or Other.",
      "3. Enter the amount, how it was paid, the supplier's name, and the receipt number.",
      "4. If tax applies, select *WHT* (Goods 2% or Services 3%) or *VAT Input* — the deduction is calculated live as you type.",
      "5. Save. The expense is recorded and posted to your books immediately.",
      "",
      "⚠️ *Good to know:*",
      "Expenses cannot currently be edited or deleted after saving — double-check the amount and account before you save."
    ].join("\n")
  },
  f03_products: {
    emoji: "📦",
    title_am: "03. ምርቶች (Products)",
    title_en: "03. Products",
    video: YOUTUBE,
    guide_am: [
      "📦 *ክፍል 03: ምርቶች (Products)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የሚሸጧቸው ዕቃዎች እና አገልግሎቶች ዋና ዝርዝር ነው። እዚህ የገቡት ዋጋዎች፣ የክምችት መጠኖች እና የታክስ ቅንብሮች በሽያጭ እና በሽያጭ ቦታ (POS) ስክሪን ላይ በራስ-ሰር ጥቅም ላይ ይውላሉ።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *ምርቶች (Products)* የሚለውን ከፍተው *+ New* የሚለውን ይጫኑ።",
      "2. የምርቱን ስም (በአማርኛም ጭምር)፣ የSKU ኮድ፣ ምድብ እና መለኪያ (Kg, Litre, Pcs, ወዘተ) ያስገቡ።",
      "3. *Goods* (ዕቃዎች) ወይም *Service* (አገልግሎት) ይምረጡ — ዕቃዎች ሲሆኑ የመነሻ ክምችት መጠን እና ድጋሚ ማዘዣ ነጥብ (reorder point) ይፈልጋሉ።",
      "4. የሽያጭ ዋጋውን፣ ወጪውን እና ዕቃው ተእታ (VAT) የሚከፈልበት መሆኑን ያስገቡ፣ ከዚያ ያስቀምጡ።",
      "5. በኋላ ለማስተካከል የምርት ካርዱን ይጫኑ፤ ለማስወገድ በማስተካከያ ስክሪኑ ውስጥ *Delete* ን ይጠቀሙ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "የምርት መጠን ከማዘዣ ነጥብ በታች ሲወርድ 'Low Stock' የሚል ምልክት በራስ-ሰር ይታያል — ዕቃ ከመጨረሱ በፊት ማስጠንቀቂያ እንዲደርስዎ ያንን ቁጥር በትክክል ያቀናብሩት።"
    ].join("\n"),
    guide_en: [
      "📦 *FEATURE 03: Products*",
      "",
      "ℹ️ *What it does:*",
      "The master list of everything you sell, goods and services alike. Prices, stock levels, and tax settings entered here are used automatically by Sales and the Point-of-Sale screen, so everything stays in sync.",
      "",
      "📌 *Step by step:*",
      "1. Open *Products* and tap *+ New*.",
      "2. Enter the product name (and its Amharic name), SKU code, category, and unit (Kg, Litre, Pcs, etc.).",
      "3. Choose *Goods* or *Service* — Goods requires a starting stock quantity and a reorder point.",
      "4. Enter the selling price, cost, and whether the item is VAT-taxable, then save.",
      "5. To edit later, tap the product card; to remove it, use *Delete* inside the edit screen.",
      "",
      "⚠️ *Good to know:*",
      "A 'Low Stock' badge appears automatically once quantity falls below the reorder point — set that number realistically so you're warned before you run out."
    ].join("\n")
  },
  f04_payroll: {
    emoji: "💼",
    title_am: "04. ደሞዝ (Payroll)",
    title_en: "04. Payroll",
    video: YOUTUBE,
    guide_am: [
      "💼 *ክፍል 04: ደሞዝ (Payroll)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የሰራተኞችዎን ዝርዝር ይይዛል እና የወርሃዊ ክፍያን ያስኬዳል። የገቢ ግብር (PIT) እና የጡረታ መዋጮ (7% ሰራተኛ፣ 11% አሰሪ) ኦፊሴላዊ የኢትዮጵያን ተመኖች በመጠቀም በራስ-ሰር ይሰላሉ።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. ሰራተኛ ለመጨመር *ደሞዝ (Payroll)* ከፍተው *+ New* ይጫኑ — ስም፣ የስራ መደብ፣ ጠቅላላ ደሞዝ (Gross) እና የባንክ ዝርዝሮችን ያስገቡ።",
      "2. የገቢ ግብርን፣ ጡረታን እና የተጣራ ደሞዝን (Net) ለማየት በማንኛውም ሰራተኛ ላይ *Payslip* የሚለውን ይጫኑ።",
      "3. የወሩ እያንዳንዱ ደሞዝ ዝግጁ ከሆነ በኋላ፣ የሁሉንም ሰው ክፍያ በአንድ ጊዜ ለመመዝገብ *Pay Payroll* የሚለውን ይጫኑ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ክፍያው ከተመዘገበ በኋላ፣ ቁልፉ ወደ '✓ Payroll Posted' ይቀየራል እና ለቀኑ ይቆለፋል፣ ስለዚህ ደሞዝ በስህተት ሁለት ጊዜ መከፈል አይችልም።"
    ].join("\n"),
    guide_en: [
      "💼 *FEATURE 04: Payroll*",
      "",
      "ℹ️ *What it does:*",
      "Keeps your employee list and runs the monthly pay. Income tax (PIT) and pension contributions (7% employee, 11% employer) are calculated automatically using official Ethiopian rates.",
      "",
      "📌 *Step by step:*",
      "1. Open *Payroll* and tap *+ New* to add an employee — name, role, gross salary, and bank details.",
      "2. Tap *Payslip* on any employee to preview their PIT, pension, and net salary.",
      "3. Once every salary for the month is ready, tap *Pay Payroll* to post the batch payment for everyone at once.",
      "",
      "⚠️ *Good to know:*",
      "After posting, the button changes to '✓ Payroll Posted' and locks for the rest of the day, so payroll can't be run twice by accident."
    ].join("\n")
  },
  f05_reports: {
    emoji: "📊",
    title_am: "05. ሪፖርቶች (Reports)",
    title_en: "05. Reports",
    video: YOUTUBE,
    guide_am: [
      "📊 *ክፍል 05: ሪፖርቶች (Reports)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የቀጥታ የፋይናንስ ዳሽቦርድ — ማጠቃለያ፣ የትርፍ እና ኪሳራ (P&L)፣ የሂሳብ ሚዛን (Balance Sheet)፣ የገንዘብ ፍሰት (Cash Flow)፣ የተጣራ ሀብት (Net Worth)፣ የERCA ታክስ ማጠቃለያ እና የክምችት ዋጋ — ከተመዘገቡ ሽያጮች እና ወጪዎች በራስ-ሰር ይሰላል።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *ሪፖርቶች (Reports)* የሚለውን ከፍተው የጊዜ ገደብ ይምረጡ፡ ዛሬ (Today)፣ 7 ቀናት፣ ወር ወይም ዓመት።",
      "2. እያንዳንዱን የንግድዎን እይታ ለማየት በየሪፖርት ታቦቹ መካከል ይንቀሳቀሱ።",
      "3. ሊታተም የሚችል የፒዲኤፍ (PDF) ሪፖርት ለማውጣት ወይም በዋትስአፕ፣ በኢሜይል ለማጋራት *Export* የሚለውን ይጫኑ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "የሂሳብ ሚዛን (Balance Sheet) እና የተጣራ ሀብት (Net Worth) የትኛውም የጊዜ ማጣሪያ ቢመረጥ ሁልጊዜም የሁሉንም ጊዜ ጠቅላላ ድምር ያሳያሉ።"
    ].join("\n"),
    guide_en: [
      "📊 *FEATURE 05: Reports*",
      "",
      "ℹ️ *What it does:*",
      "A live financial dashboard — Summary, Profit & Loss, Balance Sheet, Cash Flow, Net Worth, ERCA tax summary, and Stock value — calculated automatically from your recorded sales, expenses, and journal entries.",
      "",
      "📌 *Step by step:*",
      "1. Open *Reports* and choose a time period: Today, 7 Days, Month, or Year.",
      "2. Switch between the report tabs to see each view of your business.",
      "3. Tap *Export* to generate a printable PDF report, or share a text summary via WhatsApp, Email, or your phone's Share menu.",
      "",
      "⚠️ *Good to know:*",
      "Balance Sheet and Net Worth always show all-time totals, no matter which period filter is selected."
    ].join("\n")
  },
  f06_branches: {
    emoji: "🏢",
    title_am: "06. ቅርንጫፎች (Branches)",
    title_en: "06. Branches",
    video: YOUTUBE,
    guide_am: [
      "🏢 *ክፍል 06: ቅርንጫፎች (Branches)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "ንግድዎ ከአንድ በላይ ቦታ ላይ የሚሰራ ከሆነ፣ እያንዳንዱ ቅርንጫፍ የራሱን የተለየ ሽያጭ፣ ወጪ እና ክምችት ይይዛል። ባለቤቱ በቅርንጫፎች መካከል መቀያየር ወይም የተቀናጀ የ'All Branches' እይታን መክፈት ይችላል።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *Branch Management* ከፍተው *+ Add Branch* ይጫኑ — ስም፣ ከተማ እና አድራሻ ያስገቡ።",
      "2. በዚያ ቅርንጫፍ መረጃ ውስጥ መስራት ለመጀመር በማንኛውም ቅርንጫፍ ካርድ ላይ *Switch to this branch* የሚለውን ይጫኑ።",
      "3. እቅድዎ ከአንድ በላይ ቅርንጫፍ የሚፈቅድ ከሆነ፣ ለተቀናጀ አጠቃላይ እይታ *All Branches* የሚለውን ይምረጡ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ስንት ቅርንጫፎች ማከል እንደሚችሉ እንደ እቅድዎ ይወሰናል (Basic = 1, Business = 2, Enterprise = ያልተገደበ)፣ እና ቅርንጫፎችን ማስተዳደር የሚችለው ዋናው የባለቤት አካውንት ብቻ ነው።"
    ].join("\n"),
    guide_en: [
      "🏢 *FEATURE 06: Branches*",
      "",
      "ℹ️ *What it does:*",
      "If your business operates from more than one location, each branch keeps its own separate sales, expenses, and inventory. The owner can switch between branches or open a combined 'All Branches' view.",
      "",
      "📌 *Step by step:*",
      "1. Open *Branch Management* and tap *+ Add Branch* — enter its name, city, and address.",
      "2. Tap *Switch to this branch* on any branch card to start working in that branch's data.",
      "3. If your plan allows more than one branch, select *All Branches* for a combined, read-only overview.",
      "",
      "⚠️ *Good to know:*",
      "How many branches you can add depends on your plan (Basic = 1, Business = 2, Enterprise = unlimited), and only the account owner can manage branches."
    ].join("\n")
  },
  f07_aitax: {
    emoji: "🤖",
    title_am: "07. AI ታክስ ረዳት (AI Tax Assistant)",
    title_en: "07. AI Tax Assistant",
    video: YOUTUBE,
    guide_am: [
      "🤖 *ክፍል 07: AI ታክስ ረዳት (AI Tax Assistant)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "ስለ ተእታ (VAT)፣ የተያዘ ታክስ (Withholding)፣ የገቢ ግብር እና የጡረታ ህጎች በአማርኛ ወይም በእንግሊዝኛ ጥያቄዎችን የሚመልስ አብሮ የተሰራ የውይይት ረዳት ነው።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. ከዋናው ማውጫ ላይ *AI ታክስ ረዳት* የሚለውን ይክፈቱ።",
      "2. ከቀረቡት ፈጣን ጥያቄዎች አንዱን ይጫኑ ወይም የራስዎን ጥያቄ በማንኛውም ቋንቋ ይተይቡ።",
      "3. መልሱን ያንብቡ እና የፈለጉትን ተከታታይ ጥያቄ በማንኛውም ጊዜ ይጠይቁ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ውይይቶች አይቀመጡም — ከስክሪኑ ሲወጡ ወይም መተግበሪያውን እንደገና ሲጭኑ ውይይቱ ወደ መጀመሪያው ይመለሳል።"
    ].join("\n"),
    guide_en: [
      "🤖 *FEATURE 07: AI Tax Assistant*",
      "",
      "ℹ️ *What it does:*",
      "A built-in chat assistant that answers questions about VAT, withholding tax, income tax, and pension rules, in either Amharic or English.",
      "",
      "📌 *Step by step:*",
      "1. Open *AI Tax Assistant* from the main menu.",
      "2. Tap one of the suggested quick questions, or type your own in either language.",
      "3. Read the answer, and ask a follow-up question any time.",
      "",
      "⚠️ *Good to know:*",
      "Conversations are not saved — they reset when you leave the screen or reload the app."
    ].join("\n")
  },
  f08_customers: {
    emoji: "👤",
    title_am: "08. ደንበኞች (Customers)",
    title_en: "08. Customers",
    video: YOUTUBE,
    guide_am: [
      "👤 *ክፍል 08: ደንበኞች (Customers)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "እዳ ያለባቸውን ሰዎች ጨምሮ የደንበኞችዎ አድራሻ ዝርዝር ነው። ያልተከፈሉ እዳዎችን ይከታተሉ እና የክፍያ ማስታወሻዎችን በቀጥታ ከመተግበሪያው ይልኩ።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *ደንበኞች (Customers)* ከፍተው ስም፣ ስልክ ቁጥር እና የግብር ከፋይ መለያ ቁጥር (TIN) ለማከል *+ New* ን ይጫኑ።",
      "2. የደንበኛውን ዝርዝር ሁኔታ እና ያለባቸውን ቀሪ እዳ ለማየት ደንበኛውን ይጫኑ።",
      "3. እዳ ሲከፍሉዎት *Collect Payment* የሚለውን ተጭነው መጠኑን ያስገቡ — ቀሪው እዳ ወዲያውኑ ይሻሻላል።",
      "4. እዳው ከዘገየ በ'Send Reminder' ስር ያለውን *WhatsApp* ወይም *Email* ቁልፍ ይጫኑ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ለደንበኛ መዝገቦች በአሁኑ ጊዜ የማስተካከያ (Edit) ወይም የመሰረዣ (Delete) አማራጭ የለም፣ እና ቀሪ ሂሳብ የሚቀየረው በ'Collect Payment' በኩል ብቻ ነው — በሽያጭ ክፍል ውስጥ ከተሰራ የብድር ሽያጭ በራስ-ሰር አይዘመንም።"
    ].join("\n"),
    guide_en: [
      "👤 *FEATURE 08: Customers*",
      "",
      "ℹ️ *What it does:*",
      "Your customer contact list, including anyone who owes you money. Track outstanding balances and send payment reminders straight from the app.",
      "",
      "📌 *Step by step:*",
      "1. Open *Customers* and tap *+ New* to add a name, phone number, and TIN.",
      "2. Tap a customer to view their details and outstanding balance.",
      "3. When they pay you back, tap *Collect Payment* and enter the amount — the balance updates instantly.",
      "4. If a balance is overdue, tap the *WhatsApp* or *Email* button under 'Send Reminder'.",
      "",
      "⚠️ *Good to know:*",
      "There is no Edit or Delete option for customer records yet, and a balance changes only through 'Collect Payment' — it does not update automatically from a credit sale made in Sales."
    ].join("\n")
  },
  f09_suppliers: {
    emoji: "🚚",
    title_am: "09. አቅራቢዎች (Suppliers)",
    title_en: "09. Suppliers",
    video: YOUTUBE,
    guide_am: [
      "🚚 *ክፍል 09: አቅራቢዎች (Suppliers)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የአቅራቢዎችዎ ማውጫ — እነማን እንደሆኑ፣ የባንክ ዝርዝሮቻቸው፣ የክፍያ ውሎች እና በአሁኑ ጊዜ ምን ያህል እዳ እንዳለብዎ ይከታተላል።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *አቅራቢዎች (Suppliers)* ከፍተው *+ New* ይጫኑ — ስም፣ TIN፣ ምድብ፣ የክፍያ ውሎች እና የባንክ ዝርዝሮችን ያስገቡ።",
      "2. ሙሉ ዝርዝራቸውን እና ያለብዎትን እዳ ለማየት የአቅራቢ ካርድን ይጫኑ።",
      "3. የመነሻ ሂሳባቸውን ጨምሮ መረጃቸውን ለማሻሻል *Edit* ን ይጫኑ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "ለአቅራቢዎች የመሰረዣ (Delete) አማራጭ የለም፣ እና የሚታየው የWHT መጠን (ዕቃዎች 2% / አገልግሎቶች 3%) ለማጣቀሻ የተጻፈ መለያ ነው — ከዚህ ስክሪን ለሚደረግ ክፍያ በራስ-ሰር ተፈጻሚ አይሆንም።"
    ].join("\n"),
    guide_en: [
      "🚚 *FEATURE 09: Suppliers*",
      "",
      "ℹ️ *What it does:*",
      "Your vendor directory — who you buy from, their bank details, payment terms, and how much you currently owe them.",
      "",
      "📌 *Step by step:*",
      "1. Open *Suppliers* and tap *+ New* — enter name, TIN, category, payment terms, and bank details.",
      "2. Tap a supplier card to view their full details and outstanding balance.",
      "3. Tap *Edit* to update their information, including their opening balance.",
      "",
      "⚠️ *Good to know:*",
      "There is no Delete option for suppliers, and the WHT rate shown (2% goods / 3% services) is a reference label — it is not applied automatically to a payment from this screen."
    ].join("\n")
  },
  f10_staff: {
    emoji: "🧑‍🤝‍🧑",
    title_am: "10. ሰራተኞች (Staff)",
    title_en: "10. Staff",
    video: YOUTUBE,
    guide_am: [
      "🧑‍🤝‍🧑 *ክፍል 10: ሰራተኞች (Staff)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የሰራተኛ አባላትን ያክሉ፣ ለእያንዳንዳቸው ሚና (Role) ይመድቡ እና ሙሉ የባለቤትነት መብት ሳይኖራቸው በጋራ መሳሪያ ላይ መግባት እንዲችሉ ፒን (PIN) ይስጧቸው።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *Team* የሚለውን ከፍተው ስም፣ የስራ ሚና እና የእውቂያ ዝርዝሮችን ለማከል *+ New* ይጫኑ።",
      "2. ሚና ይምረጡ — Owner, Accountant, Sales, Cashier, ወይም Viewer — ይህ የትኞቹን ስክሪኖች መክፈት እንደሚችሉ ይወስናል።",
      "3. ለሰራተኛው ለመግቢያ የሚሆን ባለ 6-አሃዝ ፒን ለመስጠት *Set PIN* ን ይጫኑ።",
      "4. በዚሁ ስክሪን አናት ላይ የሚታየውን የድርጅትዎን ኮድ (*Company Code*) ለሰራተኛው ያጋሩ።",
      "5. ሰራተኞች በሎግኢን ስክሪን ላይ 'Staff' የሚለውን በመምረጥ፣ የድርጅቱን ኮድ በማስገባት፣ ስማቸውን መርጠው በፒን ቁጥራቸው ይገባሉ።",
      "6. እያንዳንዱ ሰራተኛ ምን እንደሰራ ለማየት የ*Activity* ታብን ይመልከቱ።"
    ].join("\n"),
    guide_en: [
      "🧑‍🤝‍🧑 *FEATURE 10: Staff*",
      "",
      "ℹ️ *What it does:*",
      "Add staff members, assign each one a role, and give them a PIN so they can sign in on a shared device without full owner access.",
      "",
      "📌 *Step by step:*",
      "1. Open *Team* and tap *+ New* to add a name, role, and contact details.",
      "2. Choose a role — Owner, Accountant, Sales, Cashier, or Viewer — this decides which screens they can open.",
      "3. Tap *Set PIN* to give the staff member a 6-digit PIN for signing in.",
      "4. Share your *Company Code* (shown at the top of this screen) with the staff member.",
      "5. Staff sign in by choosing 'Staff' on the login screen, entering the Company Code, picking their name, and entering their PIN.",
      "6. Check the *Activity* tab to see a log of what each staff member has done."
    ].join("\n")
  },
  f11_settings: {
    emoji: "⚙️",
    title_am: "11. ቅንብሮች (Settings)",
    title_en: "11. Settings",
    video: YOUTUBE,
    guide_am: [
      "⚙️ *ክፍል 11: ቅንብሮች (Settings)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የድርጅትዎ ፕሮፋይል፣ የግል ፕሮፋይል፣ የደንበኝነት ምዝገባ እና ክፍያ፣ ደህንነት እና የመተግበሪያው ገጽታ መቆጣጠሪያ ማዕከል ነው።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *ቅንብሮች (Settings)* ከፍተው አንድ ክፍል ይምረጡ፡ Organisation Profile, My Profile, Subscription & Payment, Security & PIN, ወይም Appearance።",
      "2. በ*Organisation Profile* ስር የንግድዎን ስም፣ TIN፣ የተእታ ምዝገባ እና አድራሻ ወቅታዊ ያድርጉ — እነዚህ በሽያጭ ሰነዶችዎ ላይ ይታያሉ።",
      "3. በ*Subscription & Payment* ስር እቅድዎን ለማግበር ወይም ለማደስ የክፍያ ደረሰኝ ይስቀሉ።",
      "4. በ*Security & PIN* ስር ፒንዎን ይቀይሩ ወይም አካውንትዎን ይሰርዙ (ይህ የይለፍ ቃልዎን ድጋሚ ማስገባት ይጠይቃል)።",
      "5. በ*Appearance* ስር በብርሃን (Light) እና በጨለማ (Dark) ገጽታዎች መካከል ይቀያይሩ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "አካውንትዎን መሰረዝ ሁሉንም የንግድ መረጃዎች — ሽያጮችን፣ ወጪዎችን፣ ደንበኞችን፣ ሁሉንም ነገር — በቋሚነት ያጠፋል እና መመለስ አይቻልም።"
    ].join("\n"),
    guide_en: [
      "⚙️ *FEATURE 11: Settings*",
      "",
      "ℹ️ *What it does:*",
      "The control center for your business profile, personal profile, subscription and payment, security, and app appearance.",
      "",
      "📌 *Step by step:*",
      "1. Open *Settings* and choose a section: Organisation Profile, My Profile, Subscription & Payment, Security & PIN, or Appearance.",
      "2. Under *Organisation Profile*, keep your business name, TIN, VAT registration, and contact details current — they appear on your sales documents.",
      "3. Under *Subscription & Payment*, upload a payment receipt to activate or renew your plan.",
      "4. Under *Security & PIN*, change your PIN, or delete your account (this requires re-entering your password).",
      "5. Under *Appearance*, switch between light and dark theme.",
      "",
      "⚠️ *Good to know:*",
      "Deleting your account permanently erases all business data — sales, expenses, customers, everything — and cannot be undone."
    ].join("\n")
  },
  f12_loans: {
    emoji: "💳",
    title_am: "12. ብድር (Loans)",
    title_en: "12. Loans",
    video: YOUTUBE,
    guide_am: [
      "💳 *ክፍል 12: ብድር (Loans)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "በሁለት ወገኖች መካከል ያለውን ብድር ወይም እዳ ይከታተላል — ለምሳሌ ንግድዎ ከአበዳሪ የሚበደረውን ወይም ለሌላ ሰው የሚያበድረውን ገንዘብ። ይህ ከተለመደው የደንበኛ ወይም የአቅራቢ ሂሳቦች የተለየ ነው።",
      "",
      "📌 *ደረጃ በደረጃ መመሪያ:*",
      "1. *ብድር (Loans)* የሚለውን ከፍተው *+ New* ን ይጫኑ።",
      "2. አበዳሪውን እና ተበዳሪውን ያስገቡ — ካሉ ደንበኞች/አቅራቢዎች ይምረጡ ወይም አዲስ ስም ይተይቡ።",
      "3. ዋናውን የብድር መጠን (Principal)፣ የወለድ መጠን (Interest Rate) እና የመክፈያ ቀኑን ያስገቡ።",
      "4. በራስ-ሰር የተሰላውን ጠቅላላ ድምር (ዋና ቁምነገር + ወለድ) ያረጋግጡ እና ያስቀምጡ።"
    ].join("\n"),
    guide_en: [
      "💳 *FEATURE 12: Loans*",
      "",
      "ℹ️ *What it does:*",
      "Tracks a loan or debt between two parties — for example, money your business borrows from a lender, or lends to someone else. This is separate from ordinary customer or supplier balances.",
      "",
      "📌 *Step by step:*",
      "1. Open *Loans* and tap *+ New*.",
      "2. Enter the lender and the borrower — pick from your existing customers/suppliers, or type a new name.",
      "3. Enter the principal amount, the interest rate (or a fixed interest amount), and the due date.",
      "4. Review the automatically-calculated total (principal + interest) and save."
    ].join("\n")
  },
  f13_overview: {
    emoji: "🏠",
    title_am: "13. የንግድ አጠቃላይ ሁኔታ (Business Overview)",
    title_en: "13. Business Overview",
    video: YOUTUBE,
    guide_am: [
      "🏠 *ክፍል 13: የንግድ አጠቃላይ ሁኔታ (Business Overview)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "መተግበሪያውን ሲከፍቱ መጀመሪያ የሚያዩት የመነሻ ስክሪን ነው። ለተመረጠው ጊዜ ጠቅላላ ሽያጭዎን፣ ጠቅላላ ወጪዎን እና የተጣራ የገንዘብ አቋምዎን፣ ፈጣን አቋራጭ መንገዶችን (Add Sale, Add Expense, Reports) እና የታክስ መክፈያ ቀን እየቀረበ ከሆነ የማስጠንቀቂያ ባነር ያሳያል።",
      "ንግድዎ ከአንድ በላይ ቅርንጫፍ ካለው፣ የቅርንጫፍ መቀያየሪያ እና በእያንዳንዱ ቅርንጫፍ ያለውን የገቢ ዝርዝር ያሳያል።"
    ].join("\n"),
    guide_en: [
      "🏠 *FEATURE 13: Business Overview*",
      "",
      "ℹ️ *What it does:*",
      "The home screen — the first thing you see when you open the app. It shows your total sales, total expenses, and net cash position for the period, quick-action shortcuts (Add Sale, Add Expense, Reports, Calculators), and an alert banner if a tax deadline is approaching.",
      "If your business has more than one branch, it also shows a branch switcher and, in combined view, a revenue breakdown per branch."
    ].join("\n")
  },
  f14_journal: {
    emoji: "📒",
    title_am: "14. ጆርናል (Journal)",
    title_en: "14. Journal",
    video: YOUTUBE,
    guide_am: [
      "📒 *ክፍል 14: ጆርናል (Journal)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "በመተግበሪያው ውስጥ ከእያንዳንዱ ቁጥር በስተጀርባ ያለው ድርብ-ምዝግብ (Double-entry) ደብተር ነው። እያንዳንዱ ሽያጭ፣ ወጪ እና የደሞዝ ክፍያ የተመጣጠነ የዴቢት/ክሬዲት ምዝግብ እዚህ በራስ-ሰር ይለጥፋል።",
      "በተጨማሪም ዝግጁ የሆኑ ቅነሳዎችን በመጠቀም በካሽ ሽያጭ፣ በባንክ ሽያጭ፣ በግዢ፣ በደሞዝ፣ በቫት ክፍያ እና በባንክ ማስተላለፍ ምዝግቦችን በእጅ መፍጠር ይችላሉ።",
      "",
      "⚠️ *ማወቅ የሚጠቅም ነገር:*",
      "አንድ ምዝግብ ከተለጠፈ (Posted) በኋላ ሊስተካከል ወይም ሊሰረዝ አይችልም — ስህተትን ለማስተካከል የዴቢት እና ክሬዲት ቦታን በራስ-ሰር የሚቀይር ማስተካከያ (Reversal) መፍጠር ይኖርብዎታል።"
    ].join("\n"),
    guide_en: [
      "📒 *FEATURE 14: Journal*",
      "",
      "ℹ️ *What it does:*",
      "The double-entry ledger underneath every number in the app. Every sale, expense, and payroll run posts a balanced Debit/Credit entry here automatically.",
      "You can also create entries by hand using ready-made templates — Cash Sale, Bank Sale, Expense, Purchase, Payroll, VAT Payment, Bank Transfer.",
      "An entry needs equal debits and credits before it can be Posted; an unfinished one can be saved as a Draft.",
      "",
      "⚠️ *Good to know:*",
      "Once posted, an entry can't be edited or deleted — to fix a mistake, create a Reversal, which flips the debit and credit automatically."
    ].join("\n")
  },
  f15_ledger: {
    emoji: "📚",
    title_am: "15. ጠቅላላ ሒሳብ (General Ledger)",
    title_en: "15. General Ledger",
    video: YOUTUBE,
    guide_am: [
      "📚 *ክፍል 15: ጠቅላላ ሒሳብ (General Ledger)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የማንኛውንም አካውንት ቀሪ ሂሳብ የትኞቹ ግብይቶች እንደገነቡት በትክክል ማየት እንዲችሉ በሂሳብ መዝገብ የተደራጀ የተለጠፉ የጆርናል ምዝግቦች እይታ ነው።",
      "የአንድን የተወሰነ ግብይት ሂደት ለመከታተል የአካውንት ማጣሪያውን እና የፍለጋ ሳጥኑን ይጠቀሙ። በAccounting ክፍል ውስጥ ከChart of Accounts እና Trial Balance ጎን ይገኛል።"
    ].join("\n"),
    guide_en: [
      "📚 *FEATURE 15: General Ledger*",
      "",
      "ℹ️ *What it does:*",
      "A read-only view of every posted Journal entry, organized by account, so you can see exactly which transactions built up any account's balance.",
      "Use the account filter and search box to trace a specific transaction. Found inside the Accounting section, alongside Chart of Accounts and Trial Balance."
    ].join("\n")
  },
  f16_chartofaccounts: {
    emoji: "🗂️",
    title_am: "16. የሒሳብ ዝርዝር (Chart of Accounts)",
    title_en: "16. Chart of Accounts",
    video: YOUTUBE,
    guide_am: [
      "🗂️ *ክፍል 16: የሒሳብ ዝርዝር (Chart of Accounts)*",
      "",
      "ℹ *ምን ይሰራል:*",
      "ንግድዎ የሚጠቀምባቸው ሙሉ የፋይናንስ አካውንቶች ዝርዝር ነው — ሀብት (Assets)፣ እዳ (Liabilities)፣ ካፒታል (Equity)፣ ገቢ (Income) እና ወጪ (Expense) እያንዳንዳቸው ከኮድ ጋር (ለምሳሌ 1010 ለጥሬ ገንዘብ፣ 4100 ለሽያጭ ገቢ) ከጆርናል በቀጥታ ይሰላሉ።",
      "ነባሪው ዝርዝር የሚፈልጉት ምድብ ከጎደለው አዲስ አካውንት እዚህ ማከል ወይም መተግበሪያውን መጀመሪያ መጠቀም ሲጀምሩ የእያንዳንዱን አካውንት የመነሻ ሂሳብ (Opening Balance) ማዋቀር ይችላሉ።"
    ].join("\n"),
    guide_en: [
      "🗂️ *FEATURE 16: Chart of Accounts*",
      "",
      "ℹ️ *What it does:*",
      "The full list of financial accounts your business uses — Assets, Liabilities, Equity, Income, and Expense — each with a code (like 1010 for Cash, 4100 for Sales Revenue) and a balance calculated live from the Journal.",
      "Add a new account here if the default list is missing a category you need, or set each account's Opening Balance when you first start using the app. Also found inside the Accounting section."
    ].join("\n")
  },
  f17_trialbalance: {
    emoji: "⚖️",
    title_am: "17. ትራያል ባላንስ (Trial Balance)",
    title_en: "17. Trial Balance",
    video: YOUTUBE,
    guide_am: [
      "⚖️ *ክፍል 17: ትራያል ባላንስ (Trial Balance)*",
      "",
      "ℹ️ *ምን ይሰራል:*",
      "የሂሳብ መዝገቦችዎ የተመጣጠኑ መሆናቸውን የሚያረጋግጥ እይታ ነው። የእያንዳንዱን አካውንት የዴቢት እና የክሬዲት ድምር ይዘረዝራል እና ጠቅላላ ዴቢት ከጠቅላላ ክሬዲት ጋር እኩል በሚሆንበት ጊዜ አረንጓዴ 'Balanced ✓' ባነር ያሳያል — ካልተመጣጠነ ደግሞ ቀይ 'Unbalanced' ማስጠንቀቂያ ይሰጣል።"
    ].join("\n"),
    guide_en: [
      "⚖️ *FEATURE 17: Trial Balance*",
      "",
      "ℹ️ *What it does:*",
      "A read-only check confirming your books are balanced. It lists every account's debit and credit total and shows a green 'Balanced ✓' banner when total debits equal total credits — or a red 'Unbalanced' warning if something doesn't add up. Also found inside the Accounting section."
    ].join("\n")
  }
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
      Markup.button.callback("🧾 " + (am ? "01. ሽያጭ" : "01. Sales"), "sec_f01_sales"),
      Markup.button.callback("📤 " + (am ? "02. ወጪ" : "02. Expenses"), "sec_f02_expenses"),
    ],
    [
      Markup.button.callback("📦 " + (am ? "03. ምርቶች" : "03. Products"), "sec_f03_products"),
      Markup.button.callback("💼 " + (am ? "04. ደሞዝ" : "04. Payroll"), "sec_f04_payroll"),
    ],
    [
      Markup.button.callback("📊 " + (am ? "05. ሪፖርቶች" : "05. Reports"), "sec_f05_reports"),
      Markup.button.callback("🏢 " + (am ? "06. ቅርንጫፎች" : "06. Branches"), "sec_f06_branches"),
    ],
    [
      Markup.button.callback("🤖 " + (am ? "07. AI ታክስ ረዳት" : "07. AI Tax Asst"), "sec_f07_aitax"),
      Markup.button.callback("👤 " + (am ? "08. ደንበኞች" : "08. Customers"), "sec_f08_customers"),
    ],
    [
      Markup.button.callback("🚚 " + (am ? "09. አቅራቢዎች" : "09. Suppliers"), "sec_f09_suppliers"),
      Markup.button.callback("🧑‍🤝‍🧑 " + (am ? "10. ሰራተኞች" : "10. Staff"), "sec_f10_staff"),
    ],
    [
      Markup.button.callback("⚙️ " + (am ? "11. ቅንብሮች" : "11. Settings"), "sec_f11_settings"),
      Markup.button.callback("💳 " + (am ? "12. ብድር" : "12. Loans"), "sec_f12_loans"),
    ],
    [
      Markup.button.callback("🏠 " + (am ? "13. አጠቃላይ ሁኔታ" : "13. Overview"), "sec_f13_overview"),
      Markup.button.callback("📒 " + (am ? "14. ጆርናል" : "14. Journal"), "sec_f14_journal"),
    ],
    [
      Markup.button.callback("📚 " + (am ? "15. ጠቅላላ ሒሳብ" : "15. Ledger"), "sec_f15_ledger"),
      Markup.button.callback("🗂️ " + (am ? "16. የሒሳብ ዝርዝር" : "16. Chart of Acc"), "sec_f16_chartofaccounts"),
    ],
    [
      Markup.button.callback("⚖️ " + (am ? "17. ትራያል ባላንስ" : "17. Trial Balance"), "sec_f17_trialbalance"),
    ],
    [
      Markup.button.callback("🌐 " + (am ? "ቋንቋ ቀይር" : "Change Language"), "change_lang"),
      Markup.button.url("💻 Website", APP_URL),
    ],
    [
      Markup.button.url("🆘 " + (am ? "የቴክኒክ ድጋፍ" : "Live Support"), SUPPORT),
    ],
  ], { columns: 2 });
}

function sectionKeyboard(lang, key) {
  const am = lang === "am";
  return Markup.inlineKeyboard([
    [Markup.button.url(am ? "🎥 ቪዲዮ ትምህርት ይመልከቱ" : "🎥 Watch Video Tutorial", SECTIONS[key].video)],
    [Markup.button.callback(am ? "📝 መመሪያ ያንብቡ" : "📝 Read Step-by-Step Guide", `guide_${key}`)],
    [Markup.button.callback(am ? "🔙 ወደ ዋና ማውጫ" : "🔙 Back to Main Menu", "main_menu")],
  ]);
}

function guideKeyboard(lang, key) {
  const am = lang === "am";
  return Markup.inlineKeyboard([
    [Markup.button.url(am ? "🎥 ቪዲዮ ትምህርት ይመልከቱ" : "🎥 Watch Video Tutorial", SECTIONS[key].video)],
    [Markup.button.callback(am ? "🔙 ወደ ዋና ማውጫ" : "🔙 Back to Main Menu", "main_menu")],
  ]);
}

// ── /start ────────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  await ctx.reply(
    "እንኳን ወደ አሪፍ ሂሳብ በሰላም መጡ! 👋\n" +
    "Arif Hissab Complete Guide.\n\n" +
    "አሪፍ ሂሳብ የንግድዎን የሂሳብ አያያዝ፣ የሰራተኞች ደሞዝ እና የዕቃዎች ክምችት ቁጥጥር በቀላሉ የሚያስተናግዱበት ዘመናዊ መድረክ ነው።\n\n" +
    "🌐 ቋንቋ ይምረጡ / Choose your language:",
    { parse_mode: "Markdown", ...langKeyboard() }
  );
});

// ── /menu ─────────────────────────────────────────────────────────────────────
bot.command("menu", async (ctx) => {
  const lang = getLang(ctx);
  const am = lang === "am";
  await ctx.reply(
    am
      ? "🏠 *ዋና ማውጫ — አሪፍ ሂሳብ (17 ክፍሎች)*\n\nየመተግበሪያውን አጠቃቀምና መመሪያ ለመረዳት የሚፈልጉትን ክፍል ይምረጡ፦"
      : "🏠 *Main Menu — Arif Hissab (17 Features)*\n\nPlease select the feature module you want to learn about:",
    { parse_mode: "Markdown", ...mainMenuKeyboard(lang) }
  );
});

// ── /help ─────────────────────────────────────────────────────────────────────
bot.command("help", async (ctx) => {
  const lang = getLang(ctx);
  const am = lang === "am";
  await ctx.reply(
    am
      ? "❓ *እርዳታ — አሪፍ ሂሳብ*\n\n" +
        "/start — ቦቱን እንደገና ለመጀመር\n" +
        "/menu  — ዋናውን ማውጫ ለመክፈት (17 ክፍሎች)\n" +
        "/help  — ይህንን የእርዳታ መልዕክት ለማየት\n\n" +
        "📱 መተግበሪያ ድረ-ገጽ: " + APP_URL + "\n" +
        "🆘 ቀጥታ የቴክኒክ ድጋፍ: " + SUPPORT
      : "❓ *Help — Arif Hissab Bot*\n\n" +
        "/start — Restart the bot\n" +
        "/menu  — Open the 17 features dashboard\n" +
        "/help  — Show this help text\n\n" +
        "📱 Website: " + APP_URL + "\n" +
        "🆘 Support: " + SUPPORT,
    { parse_mode: "Markdown" }
  );
});

// ── Language callbacks ────────────────────────────────────────────────────────
bot.action("lang_am", async (ctx) => {
  setLang(ctx.from.id, "am");
  await ctx.answerCbQuery("አማርኛ ተመርጧል ✓");
  await safeEditMessageText(ctx, "🏠 *ዋና ማውጫ — አሪፍ ሂሳብ (17 ክፍሎች)*\n\nየመተግበሪያውን አጠቃቀምና መመሪያ ለመረዳት የሚፈልጉትን ክፍል ይምረጡ፦", mainMenuKeyboard("am"));
});

bot.action("lang_en", async (ctx) => {
  setLang(ctx.from.id, "en");
  await ctx.answerCbQuery("English selected ✓");
  await safeEditMessageText(ctx, "🏠 *Main Menu — Arif Hissab (17 Features)*\n\nPlease select the feature module you want to learn about:", mainMenuKeyboard("en"));
});

bot.action("change_lang", async (ctx) => {
  await ctx.answerCbQuery();
  await safeEditMessageText(ctx, "🌐 ቋንቋ ይምረጡ / Choose your language:", langKeyboard());
});

// ── Main menu callback ────────────────────────────────────────────────────────
bot.action("main_menu", async (ctx) => {
  const lang = getLang(ctx);
  const am = lang === "am";
  await ctx.answerCbQuery();
  await safeEditMessageText(ctx, 
    am
      ? "🏠 *ዋና ማውጫ — አሪፍ ሂሳብ (17 ክፍሎች)*\n\nየመተግበሪያውን አጠቃቀምና መመሪያ ለመረዳት የሚፈልጉትን ክፍል ይምረጡ፦"
      : "🏠 *Main Menu — Arif Hissab (17 Features)*\n\nPlease select the feature module you want to learn about:", 
    mainMenuKeyboard(lang)
  );
});

// ── Section + Guide callbacks (generated dynamically) ────────────────────────
Object.keys(SECTIONS).forEach((key) => {
  const sec = SECTIONS[key];

  bot.action(`sec_${key}`, async (ctx) => {
    const lang = getLang(ctx);
    const am   = lang === "am";
    const title = am ? sec.title_am : sec.title_en;
    await ctx.answerCbQuery();
    await safeEditMessageText(ctx, 
      `*${title}*\n\n${am ? "ምን ማወቅ ይፈልጋሉ? ከታች ካሉት አማራጮች ይምረጡ፦" : "What would you like to explore? Choose an option:"}`, 
      sectionKeyboard(lang, key)
    );
  });

  bot.action(`guide_${key}`, async (ctx) => {
    const lang = getLang(ctx);
    const am   = lang === "am";
    await ctx.answerCbQuery();
    await safeEditMessageText(ctx, am ? sec.guide_am : sec.guide_en, {
      ...guideKeyboard(lang, key),
      disable_web_page_preview: true
    });
  });
});

// ── Catch-all text message ────────────────────────────────────────────────────
bot.on("text", async (ctx) => {
  const lang = getLang(ctx);
  const am   = lang === "am";
  await ctx.reply(
    am
      ? "📋 እባክዎ መመሪያዎቹን ለመክፈት የ /menu ትዕዛዝን ይጻፉ ወይም ከታች ያሉትን ቁልፎች ይጫኑ፦"
      : "📋 Please type /menu or use the buttons below to navigate through the 17 app features:",
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
    console.log(`✅ Bot is live (17 Features Loaded in AM/EN) — ${new Date().toISOString()}`);
    await bot.telegram.setMyCommands([
      { command: "start", description: "ይጀምሩ / Start" },
      { command: "menu",  description: "ዋና ማውጫ (17 Features) / Main Menu" },
      { command: "help",  description: "እርዳታ / Help" },
    ]);
  })
  .catch((err) => { 
    console.error("❌ Failed to start bot:", err); 
    process.exit(1); 
  });

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
