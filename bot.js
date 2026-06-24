require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ── Constants ────────────────────────────────────────────────────────────────
const YOUTUBE = "https://www.youtube.com/channel/UCHUeanvcwYYJlp1kZd5iaJw";
const APP_URL = "https://arifhissab.com";
const SUPPORT = "https://t.me/your_telegram_username"; // 💡 የእርስዎን ቴሌግራም ዩዘርኔም እዚህ ያስገቡ

// Per-user language preference (in-memory)
const userLang = new Map();

const getLang = (ctx) => userLang.get(ctx.from?.id) || "am";
const setLang  = (id, lang) => userLang.set(id, lang);

// ── Section content with perfect Amharic & English Structure ──────────────────
const SECTIONS = {
  // 1. AI & Tools
  ai_tools: {
    emoji: "🤖",
    title_am: "AI & መሳሪያዎች (AI Tax & Calculators)",
    title_en: "AI & Tools",
    video:    YOUTUBE,
    guide_am: [
      "🤖 *AI & መሳሪያዎች — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. በመተግበሪያው ላይ ወደ 'AI Tax Assistant' ክፍል ይግቡ።",
      "2. ማንኛውንም የ ERCA ታክስ ህግ፣ የትርፍ ስሌት ወይም የኦዲት ጥያቄ በአማርኛ ወይም በእንግሊዝኛ በጽሁፍ ይጠይቁት።",
      "3. ለፈጣን ስሌቶች '🧮 ካልኩሌተሮች' የሚለውን በመጫን የ VAT 15%၊ የደሞዝ ታክስ (PIT) ወይም የብድር ስሌቶችን ያለ ኢንተርኔት ያካሂዱ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *AI Tax Assistant (Claude AI):* የኢትዮጵያን የገቢዎች ታክስ አዋጅና ደንብ መነሻ በማድረግ ፈጣን ማብራሪያ የሚሰጥ የቴክኖሎጂ ረዳት ነው።",
      "• *የመቆራረጫ ነጥብ (Break-Even Point):* ንግዱ ኪሳራም ሆነ ትርፍ ሳይኖረው፣ የወጣውን ወጪ ብቻ ሙሉ በሙሉ መመለስ የቻለበት የሽያጭ መጠን ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "ውድ የሂሳብ አማካሪዎችን ሳያስፈልግዎ የ ERCA ህጎችን በራስዎ ቋንቋ በፍጥነት ለመረዳት ይረዳል። ካልኩሌተሮቹ የታክስ ስህተቶችን አስቀድመው በማስላት ከቅጣት ይጠብቁዎታል።",
    ].join("\n"),
    guide_en: [
      "🤖 *AI & Tools — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Open the 'AI Tax Assistant' section in the app.",
      "2. Type any ERCA tax law, profit calculation, or audit question in Amharic or English.",
      "3. For quick math, open '🧮 Calculators' to compute 15% VAT, Income Tax (PIT), or loans offline.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *AI Tax Assistant (Claude AI):* An intelligent assistant trained on Ethiopian tax regulations to provide instant answers.",
      "• *Break-Even Point:* The sales volume where total revenue exactly equals total business expenses (no profit, no loss).",
      "",
      "💡 *How this section helps:*",
      "Saves expensive consultancy fees by providing instant tax answers. The offline calculators eliminate manual errors and keep your pricing accurate.",
    ].join("\n"),
  },

  // 2. Invoices & Receipts
  invoices: {
    emoji: "🧾",
    title_am: "ፋክቱርና ደረሰኝ",
    title_en: "Invoices & Receipts",
    video:    YOUTUBE,
    guide_am: [
      "🧾 *ፋክቱርና ደረሰኝ — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'ፋክቱርና ደረሰኝ' (Sales) ገጽ በመግባት '+ አዲስ ደረሰኝ' የሚለውን ይጫኑ።",
      "2. ደንበኛ ይምረጡ፤ ከዚያም የተሸጡትን ዕቃዎች ወይም አገልግሎቶች ከዝርዝሩ ውስጥ ይጨምሩ።",
      "3. ስርዓቱ የ 15% VAT ታክስን በራስ-ሰር ያሰላል； በመጨረሻም 'አስቀምጥ' የሚለውን በመጫን ህጋዊ ፋክቱርና ደረሰኝ ያውጡ።",
      "4. ለሽያጭ ጨረታዎች '📋 ሽያጭ እና ግዢ ጨረታ' (Estimates) የሚለውን ይጠቀሙ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ሽያጭ (Sales):* በሱቁ ውስጥ ለደንበኞች ዕቃ በመሸጥ የሚሰበሰብ ጠቅላላ የንግድ ገቢ (Revenue) ነው።",
      "• *ፋክቱርና ደረሰኝ (Invoice & Receipt):* የተሸጡ ዕቃዎችን፣ ዋጋንና የታክስ ዝርዝርን የያዘ ለደንበኛ የሚሰጥ ኦፊሴላዊ የሽያጭ ማረጋገጫ ሰነድ ነው።",
      "• *የጨረታ ሰነድ (Estimate/Quote):* ሽያጭ ከመፈጸሙ በፊት ለደንበኛ የሚሰጥ የዋጋ ማቅረቢያ ማስታወሻ ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "የሱቁን የዕለት ተዕለት ሽያጭ በአስተማማኝ ሁኔታ ይከታተላል። ደንበኞች በምን እንደከፈሉ (ካሽ፣ ሲቢኢ፣ ቴሌብር) በግልጽ ያስቀምጣል፣ እንዲሁም ፋክቱርና ደረሰኞችን በ WhatsApp በቀጥታ ለመላክ ያስችላል። የ ERCA ደምቦችን ሙሉ በሙሉ ያሟላል።",
    ].join("\n"),
    guide_en: [
      "🧾 *Invoices & Receipts — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Go to 'Invoices & Receipts' (Sales) and click '+ New Receipt'.",
      "2. Select a customer and add the items or services sold from your stock.",
      "3. The system automatically calculates the 15% VAT; click 'Save' to issue the official invoice and receipt.",
      "4. Use '📋 Estimates/Quotes' to issue price offers before actual sales.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Sales:* Total business revenue earned from selling items or services to customers.",
      "• *Invoice & Receipt:* The official document issued to customers showing items bought, prices, and tax breakdown.",
      "• *Estimate/Quote:* A preliminary price offer sent to a customer before confirming a sale.",
      "",
      "💡 *How this section helps:*",
      "Tracks daily sales performance, logs payment methods (Cash, CBE, Telebirr), and allows you to send digital invoices and receipts via WhatsApp. Fully ERCA compliant.",
    ].join("\n"),
  },

  // 3. Expenses
  expenses: {
    emoji: "📤",
    title_am: "ወጪዎች (Expenses)",
    title_en: "Expenses",
    video:    YOUTUBE,
    guide_am: [
      "📤 *ወጪዎች — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'ወጪዎች' (Expenses) ገጽ በመግባት '+ አዲስ ወጪ' የሚለውን ቁልፍ ይጫኑ።",
      "2. የወጪውን መጠን፣ ዝርዝር መግለጫ እና የወጪ ምድቡን (ለምሳሌ፡ ኪራይ፣ ግዢ) ያስገቡ።",
      "3. የታክስ ዓይነት ይምረጡ (WHT 2% ለዕቃ፣ 3% ለአገልግሎት ወይም የ VAT ግቤት) እና 'አስቀምጥ' የሚለውን ይጫኑ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *የንግድ ወጪ (Expense):* ሱቁን ለማንቀሳቀስ (ለቤት ኪራይ, ለዕቃ መግዣ, ለሠራተኛ) የሚወጣ ማንኛውም ገንዘብ ነው።",
      "• *የተቀናሽ ታክስ (Withholding Tax - WHT):* ከአቅራቢዎች ላይ ቀንሰን ለገቢዎች (ERCA) የምናስገባው ህጋዊ ታክስ ነው። (ዕቃ 2%፣ አገልግሎት 3%)።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "የንግድዎ ገንዘብ የት ላይ እንደሚወጣ በትክክል ያሳያል። ወርሃዊ የ VAT እና WHT ታክስ መግለጫዎችን በየወሩ 25ኛ ቀን ለ ERCA ያለ ምንም መዘግየት በሰዓቱ ለማቅረብ ይረዳል።",
    ].join("\n"),
    guide_en: [
      "📤 *Expenses — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Go to the 'Expenses' section and tap '+ New Expense'.",
      "2. Enter the amount, description, and expense category (e.g., Rent, Purchasing).",
      "3. Select the tax type (WHT 2% for goods, 3% for services, or VAT input credit) and tap 'Save'.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Expense:* Any money spent to run the daily business operations (rent, purchasing stock, utility bills).",
      "• *Withholding Tax (WHT):* Tax deducted at source from suppliers and remitted to ERCA (Goods 2%, Services 3%).",
      "",
      "💡 *How this section helps:*",
      "Provides clear visibility into business cash outflows. Helps you prepare and file VAT and WHT reports accurately to ERCA by the 25th of every month.",
    ].join("\n"),
  },

  // 4. Stock & Suppliers
  stock: {
    emoji: "📦",
    title_am: "ምርቶች & አቅራቢዎች (Stock & Suppliers)",
    title_en: "Stock & Suppliers",
    video:    YOUTUBE,
    guide_am: [
      "📦 *ምርቶች & አቅራቢዎች — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'ምርቶች' (Products) ገጽ በመግባት '+ አዲስ ምርት' በሚለው ስም፣ መግዣና መሸጫ ዋጋ ያስገቡ።",
      "2. መጀመሪያ ላይ ያለዎትን የዕቃ ብዛት (Opening Stock) ይሙሉ—ሽያጭ ሲያካሂዱ ሲስተሙ ራሱ ይቀንሳል።",
      "3. በ '🏪 አቅራቢዎች' (Suppliers) ክፍል ውስጥ ዕቃ ያበደሩዎትን ነጋዴዎች እና ያለብዎትን ዕዳ (Accounts Payable) ይከታተሉ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ክምችት (Stock/Inventory):* በሱቅዎ ውስጥ የሚገኙ ለመሸጥ የተዘጋጁ ዕቃዎች ጠቅላላ ብዛት ነው።",
      "• *ያልተከፈለ ዕዳ (Accounts Payable - AP):* ከአቅራቢዎች ዕቃ በብድር ገዝተው ገና ያልከፈሉት የገንዘብ መጠን ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "በሱቅዎ ውስጥ የትኛው ዕቃ እንደተሸጠ እና የትኛው ሊያልቅ እንደሆነ ያሳውቅዎታል። ዕቃ ሳይታወቅ እንዳይጠፋና ሳይመዘገብ እንዳይወጣ ይከላከላል።",
    ].join("\n"),
    guide_en: [
      "📦 *Stock & Suppliers — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Open the 'Products' section, tap '+ New Product' and enter name, cost, and selling price.",
      "2. Set the initial stock level (Opening Stock); the system automatically deducts items as they sell.",
      "3. Use the '🏪 Suppliers' section to manage vendor details and tracking what you owe.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Stock/Inventory:* The total quantity of goods currently available in your shop for sale.",
      "• *Accounts Payable (AP):* The unpaid financial obligations or debts your business owes to its suppliers for goods bought on credit.",
      "",
      "💡 *How this section helps:*",
      "Gives real-time visibility into stock levels, alerts you before inventory runs out, and accurately tracks debts owed to suppliers.",
    ].join("\n"),
  },

  // 5. Accounting
  accounting: {
    emoji: "📓",
    title_am: "የሒሳብ አያያዝ (Ledger & COA)",
    title_en: "Accounting Modules",
    video:    YOUTUBE,
    guide_am: [
      "📓 *የሒሳብ አያያዝ — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'ጆርናል' (Journal Entries) ገጽ በመግባት የንግድ ግብይቶችን በዴቢት (DR) እና ክሬዲት (CR) ይመዝግቡ።",
      "2. 'ጠቅላላ ሒሳብ' (General Ledger) ውስጥ ሁሉንም የጆርናል መዝገቦች በአንድ ላይ ያግኙ።",
      "3. በ 'የሒሳብ ዝርዝር' (Chart of Accounts) እና 'ትራያል ባላንስ' (Trial Balance) አማካኝነት የዴቢት እና ክሬዲት ሚዛን እኩል መሆኑን ያረጋግጡ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ድርብ-ግቤት (Double-Entry):* እያንዳንዱ የንግድ እንቅስቃሴ በሁለት ቦታ (በዴቢትና በክሬዲት) እኩል ሆኖ የሚመዘገብበት ህጋዊ የሂሳብ አሰራር ነው።",
      "• *ትራያል ባላንስ (Trial Balance):* የሁሉም ሂሳቦች ስብስብ ሆኖ የዴቢት እና የክሬዲት ድምር እኩል መሆኑን ማረጋገጫ ሪፖርት ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "ሱቅዎ በህጋዊ መንገድ የሂሳብ አያያዝ መመሪያ ቁጥር 176/2014 (ERCA Directive) አሟልቶ እንዲራመድ ያደርጋል። በታክስ ኦዲት ወቅት ምንም ስህተት እንዳይገኝ የሂሳብ ሚዛኑን ይጠብቃል።",
    ].join("\n"),
    guide_en: [
      "📓 *Accounting — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Go to 'Journal' to record financial transactions using Debits (DR) and Credits (CR).",
      "2. Use 'General Ledger' to view chronological entries across all books.",
      "3. Open the 'Chart of Accounts (COA)' and 'Trial Balance' to ensure your books balance perfectly (Debit = Credit).",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Double-Entry Bookkeeping:* A standardized accounting system where every transaction has an equal and opposite Debit and Credit entry.",
      "• *Trial Balance:* A sheet listing balances of all ledger accounts to check mathematical accuracy (Total DR must equal Total CR).",
      "",
      "💡 *How this section helps:*",
      "Ensures full compliance with ERCA Directive 176/2014 for professional business accounting. Keeps your financials clean, structured, and audit-ready.",
    ].join("\n"),
  },

  // 6. Payroll
  payroll: {
    emoji: "💰",
    title_am: "ደሞዝ & ሰራተኞች (Payroll & HR)",
    title_en: "HR & Payroll",
    video:    YOUTUBE,
    guide_am: [
      "💰 *ደሞዝ & ሰራተኞች — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'የቡድን አስተዳደር' (Team) በመግባት የሰራተኞችን ዝርዝር፣ ሚና እና ፈቃድ ይመዝግቡ።",
      "2. ወደ 'ደሞዝ' (Payroll) ገጽ በመግባት የሰራተኛውን 'ጠቅላላ ደሞዝ' (Gross Salary) ያስገቡ።",
      "3. ሲስተሙ የገቢ ታክስ (PIT) እና የጡረታ መዋጮን በኢትዮጵያ ህግ መሰረት በራስ-ሰር ያሰላል፤ 'አስቀምጥ' በማለት ያጽድቁ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ጠቅላላ ደሞዝ (Gross Salary):* ምንም ዓይነት የታክስ ወይም የጡረታ ቅናሽ ሳይደረግበት ለሰራተኛው የተወሰነ ሙሉ ወርሃዊ ደሞዝ ነው።",
      "• *የሰራተኛ ገቢ ታክስ (PIT):* ከሰራተኛው ደሞዝ ላይ ተቀንሶ ለገቢዎች (ERCA) የሚከፈል የደሞዝ ግብር ነው።",
      "• *የጡረታ መዋጮ:* በህጉ መሰረት ከሰራተኛው 7%፣ ከቀጣሪው ደግሞ 11% ተሰልቶ ለጡረታ ፈንድ (PSSSA) የሚገባ ገንዘብ ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "የሰራተኞችዎን ወርሃዊ ደሞዝ ያለ ምንም ስህተት በኢትዮጵያ የታክስ እርከን መሰረት ያሰላል። በየወሩ 30ኛ ቀን ለጡረታ መስሪያ ቤት የሚከፈለውን መረጃ በትክክል ያዘጋጃል።",
    ].join("\n"),
    guide_en: [
      "💰 *HR & Payroll — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Go to 'Team Management' to add employees and manage their roles/permissions.",
      "2. Open the 'Payroll' module and enter the employee's 'Gross Salary'.",
      "3. The system automatically computes PIT (Personal Income Tax) and Pension contributions based on Ethiopian law. Tap 'Save'.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Gross Salary:* The total salary amount agreed upon before any statutory deductions or taxes are applied.",
      "• *Personal Income Tax (PIT):* The mandatory employment tax deducted from salaries and remitted to ERCA.",
      "• *Pension (7% / 11%):* Legal retirement contributions (7% deducted from employee, 11% contributed by employer) remitted to PSSSA.",
      "",
      "💡 *How this section helps:*",
      "Automates monthly payroll processing using updated Ethiopian tax brackets. Keeps records flawless and ready for PSSSA filings before the 30th of every month.",
    ].join("\n"),
  },

  // 7. Reports
  reports: {
    emoji: "📊",
    title_am: "ሪፖርቶች & ታክስ (Reports & ERCA)",
    title_en: "Reports & Tax",
    video:    YOUTUBE,
    guide_am: [
      "📊 *ሪፖርቶች & ታክስ — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'ሪፖርቶች' (Reports) ገጽ በመግባት የጊዜ ገደቡን (ዛሬ፣ ወር፣ ወይም ዓመት) ይምረጡ።",
      "2. የትርፍና ኪሳራ (P&L) ወይም የክምችት (Stock) ሪፖርቶችን ይመልከቱ።",
      "3. ለታክስ ፋይሊንግ '🏛 ለ ERCA' የሚለውን ክፍል በመጫን ወርሃዊ የ VAT እና WHT ማጠቃለያዎችን በ PDF ያውርዱ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ትርፍና ኪሳራ (Profit & Loss):* ከሽያጭ የተገኘው ገቢ ላይ ወጪዎች ተቀንሰው ንግዱ ያተረፈውን ትክክለኛ የተጣራ ትርፍ (Net Profit) የሚያሳይ ዘገባ ነው።",
      "• *የ ERCA ታክስ ሪፖርት:* ለገቢዎች ባለስልጣን በየወሩ ለማቅረብ ዝግጁ ተደርጎ የሚሰራ የሽያጭና ግዢ የታክስ ማጠቃለያ ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "ሱቅዎ እያተረፈ ወይስ እየከሰረ መሆኑን በግልጽ ያሳያል። በኦዲት ወቅት ለታክስ ኦዲተሮች የሚቀርቡ ህጋዊ ሪፖርቶችን በአንድ ክሊክ በማዘጋጀት ጊዜና ገንዘብዎን ይቆጥባል።",
    ].join("\n"),
    guide_en: [
      "📊 *Reports & Tax — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Open the 'Reports' section and choose your period filter (Today, Month, or Year).",
      "2. Review the Profit & Loss (P&L) statement or Stock valuation reports.",
      "3. For tax submission, go to '🏛 For ERCA' to export your monthly VAT and WHT summaries directly into PDF.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Profit & Loss (P&L):* A financial statement summarizing revenues and expenses to show the actual net profit of the business.",
      "• *ERCA Tax Report:* Generated summaries of taxable sales and input VAT required for monthly standard declarations.",
      "",
      "💡 *How this section helps:*",
      "Helps you evaluate whether your business is growing or losing money. Automatically generates legal, precise reports required during formal ERCA tax auditing.",
    ].join("\n"),
  },

  // 8. Branches
  branches: {
    emoji: "🏪",
    title_am: "ቅርንጫፎች (Branches Management)",
    title_en: "Branches Management",
    video:    YOUTUBE,
    guide_am: [
      "🏪 *ቅርንጫፎች — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ 'ቅርንጫፍ አስተዳደር' (Branches) ገጽ ይግቡ።",
      "2. '+ አዲስ ቅርንጫፍ' የሚለውን በመጫን የቅርንጫፉን ስም፣ ስልክ እና አድራሻ ያስገቡ።",
      "3. ከላይ ያለውን የሱቅ ምልክት በመጫን ከተለያዩ ቅርንጫፎች መካከል በቀላሉ ይቀያይሩ። ዳታው ለየብቻው ይያዛል።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ቅርንጫፍ (Branch):* በተለያየ ቦታ የሚገኙ ነገር ግን በአንድ ዋና ድርጅት ወይም ባለowner ስር የሚተዳደሩለያዩ ሱቆች ናቸው።",
      "• *ገለልተኛ መረጃ (Isolated Data):* የእያንዳንዱ ሱቅ ሽያጭና ክምችት ሳይቀላቀል ለየብቻው በነጻነት የሚቀመጥበት መንገድ ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "ሳይንቀሳቀሱ እና ያሉበት ቦታ ሆነው የሁሉም ሱቆችዎን የዕለት ተዕለት ሽያጭ፣ ወጪ እና ክምችት በአንድ ማዕከላዊ አካውንት ላይ ለመቆጣጠር ያስችሎታል።",
    ].join("\n"),
    guide_en: [
      "🏪 *Branches Management — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Go to 'Branch Management'.",
      "2. Click '+ New Branch' and fill in the name, phone number, and location details.",
      "3. Tap the shop icon in the header to instantly switch between different branches with separated data.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Branch:* Multiple store locations run under a single centralized business account.",
      "• *Isolated Data:* Information kept separated per store location so sales and stock numbers do not get mixed up.",
      "",
      "💡 *How this section helps:*",
      "Allows multi-shop owners to view individual and consolidated sales, expenses, and stock data from a single dashboard anywhere.",
    ].join("\n"),
  },

  // 9. FAQ
  faq: {
    emoji: "❓",
    title_am: "እርዳታ & የ ERCA ጥያቄዎች (FAQ)",
    title_en: "Help & FAQ",
    video:    YOUTUBE,
    guide_am: [
      "❓ *እርዳታ & የ ERCA ጥያቄዎች*",
      "",
      "📌 *መመሪያ (ተደጋግመው የሚነሱ ጥያቄዎች):*",
      "• *ጥያቄ:* ኢንተርኔት በሌለበት ቦታ (Offline) አፑ ይሰራል?",
      "  *መልስ:* አዎ! ፋክቱርና ደረሰኝ ለመቁረጥ፣ ምርት ለመመዝገብ እና ካልኩሌተሮችን ለመጠቀም ኢንተርኔት አያስፈልግም። ዳታው ስልክዎ ላይ ይያዝና ኢንተርኔት ሲያገኝ በራሱ ከዳመና ጋር ይገናኛል።",
      "• *ጥያቄ:* መረጃዬ በደህንነት ይጠበቃል? ለ ERCA ይላካል?",
      "  *መልስ:* መረጃዎ ሙሉ በሙሉ ሚስጥራዊነቱ ተጠብቆ በግል ክላውድዎ ላይ ይቀመጣል። የእርስዎን ፍቃድ እና ትዕዛዝ ሳይኖር መረጃዎ ለሶስተኛ ወገንም ሆነ ለ ERCA በፍጹም አይጋራም።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *ክላውድ ባክአፕ (Cloud Backup):* ስልክዎ ቢጠፋ ወይም ቢበላሽ እንኳ መረጃዎ እንዳይጠፋ በኢንተርኔት አማካኝነት ደህንነቱ በተጠበቀ አገልጋይ ላይ ማስቀመጥ ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "አፕሊኬሽኑን ያለምንም ስጋት እንዲጠቀሙ እና ስለ ዳታዎ ደህንነት እንዲሁም ስለ ታክስ አሰራሮች ያሉዎትን ጥያቄዎች በራስዎ ጊዜ ምላሽ እንዲያገኙ ይረዳል።",
    ].join("\n"),
    guide_en: [
      "❓ *Help & FAQ — Guide*",
      "",
      "📌 *Step-by-Step Guide (Frequently Asked Questions):*",
      "• *Q: Does the app work completely offline?*",
      "  *A:* Yes! You can issue a 'ፋክቱርና ደረሰኝ' (invoice/receipt), check stock, and use calculators without internet. Data auto-syncs to the cloud once connected.",
      "• *Q: Is my business data safe? Is it automatically shared with ERCA?*",
      "  *A:* Your financial records are encrypted and private. We never share or expose your data to ERCA or any third party without your explicit export command.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *Cloud Sync:* Secure online storage that acts as a live backup, ensuring you can retrieve your records if you lose your phone.",
      "",
      "💡 *How this section helps:*",
      "Provides reassurance regarding data privacy and helps you overcome offline usage barriers, making your operations reliable anywhere.",
    ].join("\n"),
  },

  // 10. App Download
  app_download: {
    emoji: "📱",
    title_am: "የመተግበሪያ አወራረድ (Arif Hissab App)",
    title_en: "Download Arif Hissab App",
    video:    YOUTUBE,
    guide_am: [
      "📱 *የመተግበሪያ አወራረድ — መመሪያ*",
      "",
      "📌 *መመሪያ (የደረጃ በደረጃ ማብራሪያ):*",
      "1. ወደ ኦፊሴላዊ ድረ-ገጻችን [arifhissab.com](https://arifhissab.com) ይግቡ።",
      "2. እንደ ስልክዎ ዓይነት 'Download for Android' ወይም 'Download for iOS' የሚለውን ይጫኑ።",
      "3. አፑን ከጫኑ በኋላ በስልክ ቁጥርዎ ፈጣን ምዝገባ በማካሄድ የ 14 ቀን ነጻ የሙከራ ጊዜ (Free Trial) ያግኙ።",
      "",
      "📌 *የቃላት መፍቻ (ትራንዛክሽንና ታክስ):*",
      "• *v9.0 AI Powered:* የቅርብ ጊዜው የመተግበሪያው ስሪት ሲሆን የሂሳብ አያያዝን በ AI የታገዘ እና ከ ERCA ህጎች ጋር ፍጹም የተጣጣመ ያደረገ ስሪት ነው።",
      "",
      "💡 *የዚህ ክፍል ጠቀሜታ (ለነጋዴው):*",
      "የተወሳሰቡ የሂሳብ ደብተሮችን በማስቀረት ሙሉ ሱቅዎን በስልክዎ ላይ በቀላሉ ለመቆጣጠር እና ንግድዎን ወደ ዘመናዊ ዲጂታል አሰራር ለመቀየር የመጀመሪያው እርምጃ ነው።",
    ].join("\n"),
    guide_en: [
      "📱 *Download App — Guide*",
      "",
      "📌 *Step-by-Step Guide:*",
      "1. Visit our official website: [arifhissab.com](https://arifhissab.com).",
      "2. Click either 'Download for Android' or 'Download for iOS' depending on your smartphone.",
      "3. Install the app, register with your phone number, and instantly unlock a 14-day premium free trial.",
      "",
      "📌 *Vocabulary & Definitions:*",
      "• *v9.0 AI Powered:* The latest production release featuring built-in AI tax logic and fully compliant ERCA accounting books.",
      "",
      "💡 *How this section helps:*",
      "Replaces messy physical accounting notebooks with a pocket-sized mobile solution, paving your way toward a fully digitalized business.",
    ].join("\n"),
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
      Markup.button.callback("🤖 " + (am ? "AI & መሳሪያዎች"      : "AI & Tools"),           "sec_ai_tools"),
      Markup.button.callback("🧾 " + (am ? "ፋክቱርና ደረሰኝ"     : "Invoices & Receipts"), "sec_invoices"),
    ],
    [
      Markup.button.callback("📤 " + (am ? "ወጪዎች"             : "Expenses"),            "sec_expenses"),
      Markup.button.callback("📦 " + (am ? "ምርቶች & አቅራቢዎች"  : "Stock & Suppliers"),   "sec_stock"),
    ],
    [
      Markup.button.callback("📓 " + (am ? "የሒሳብ አያያዝ"       : "Accounting Books"),    "sec_accounting"),
      Markup.button.callback("💰 " + (am ? "ደሞዝ & ሰራተኞች"    : "HR & Payroll"),        "sec_payroll"),
    ],
    [
      Markup.button.callback("📊 " + (am ? "ሪፖርቶች & ታክስ"     : "Reports & Tax"),       "sec_reports"),
      Markup.button.callback("🏪 " + (am ? "ቅርንጫፎች"          : "Branches"),            "sec_branches"),
    ],
    [
      Markup.button.callback("❓ " + (am ? "እርዳታ & FAQ"        : "Help & FAQ"),          "sec_faq"),
      Markup.button.callback("📱 " + (am ? "አፕሊኬሽን አውርድ"     : "Download App"),        "sec_app_download"),
    ],
    [
      Markup.button.callback("🌐 " + (am ? "ቋንቋ ቀይር"        : "Change Language"),      "change_lang"),
      Markup.button.url("💻 Website", APP_URL),
    ],
    [
      Markup.button.url("🆘 " + (am ? "ቀጥታ ድጋፍ (Support)"   : "Get Live Support"),    SUPPORT),
    ],
  ]);
}

function sectionKeyboard(lang, key) {
  const am = lang === "am";
  return Markup.inlineKeyboard([
    [Markup.button.url(    am ? "🎥 ቪዲዮ ትምህርት ይመልከቱ" : "🎥 Watch Video Tutorial",  SECTIONS[key].video)],
    [Markup.button.callback(am ? "📝 መመሪያ ያንብቡ"       : "📝 Read Step-by-Step Guide", `guide_${key}`)],
    [Markup.button.callback(am ? "🔙 ወደ ዋና ምናሌ"       : "🔙 Back to Main Menu",       "main_menu")],
  ]);
}

function guideKeyboard(lang, key) {
  const am = lang === "am";
  return Markup.inlineKeyboard([
    [Markup.button.url(    am ? "🎥 ቪዲዮ ትምህርት ይመልከቱ" : "🎥 Watch Video Tutorial",  SECTIONS[key].video)],
    [Markup.button.callback(am ? "🔙 ወደ ዋና ምናሌ"       : "🔙 Back to Main Menu",       "main_menu")],
  ]);
}

// ── /start ────────────────────────────────────────────────────────────────────
bot.start(async (ctx) => {
  await ctx.reply(
    "እንኳን ወደ አሪፍ ሂሳብ በሰላም መጡ! 👋\n" +
    "አሪፍ ሂሳብ የንግድዎን የሂሳብ አያያዝ፣ የሰራተኞች ደሞዝ እና የዕቃዎች ክምችት ቁጥጥር በቀላሉ የሚያስተናግዱበት ዘመናዊ መድረክ ነው። ይህ መድረክ ስለ ሽያጭ አጠቃቀም፣ ወጪዎች፣ ደሞዝ እና የ ERCA ታክስ አያያዝ አጫጭር የቪዲዮ ትምህርቶችን እና ፈጣን ድጋፍ የሚሰጥበት አውቶማቲክ መድረክ ነው።\n\n" +
    "ለመጀመር የሚፈልጉትን የስራ ክፍል ከታች ካለው ማውጫ (Menu) ላይ ይምረጡ፦\n\n" +
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
      ? "🏠 *ዋና ምናሌ — አሪፍ ሂሳብ v9.0*\n\nየመተግበሪያውን አጠቃቀምና መመሪያ ለመረዳት የሚፈልጉትን ክፍል ይምረጡ፦"
      : "🏠 *Main Menu — Arif Hissab v9.0*\n\nPlease select the module you want to learn about:",
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
        "/menu  — ዋናውን ማውጫ ለመክፈት\n" +
        "/help  — ይህንን የእርዳታ መልዕክት ለማየት\n\n" +
        "📱 መተግበሪያ ድረ-ገጽ: " + APP_URL + "\n" +
        "🆘 ቀጥታ የቴክኒክ ድጋፍ: " + SUPPORT
      : "❓ *Help — Arif Hissab Bot*\n\n" +
        "/start — Restart the bot\n" +
        "/menu  — Open the main dashboard\n" +
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
  await ctx.editMessageText(
    "🏠 *ዋና ምናሌ — አሪፍ ሂሳብ v9.0*\n\nየመተግበሪያውን አጠቃቀምና መመሪያ ለመረዳት የሚፈልጉትን ክፍል ይምረጡ፦",
    { parse_mode: "Markdown", ...mainMenuKeyboard("am") }
  );
});

bot.action("lang_en", async (ctx) => {
  setLang(ctx.from.id, "en");
  await ctx.answerCbQuery("English selected ✓");
  await ctx.editMessageText(
    "🏠 *Main Menu — Arif Hissab v9.0*\n\nPlease select the module you want to learn about:",
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
      ? "🏠 *ዋና ምናሌ — አሪፍ ሂሳብ v9.0*\n\nየመተግበሪያውን አጠቃቀምና መመሪያ ለመረዳት የሚፈልጉትን ክፍል ይምረጡ፦"
      : "🏠 *Main Menu — Arif Hissab v9.0*\n\nPlease select the module you want to learn about:",
    { parse_mode: "Markdown", ...mainMenuKeyboard(lang) }
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
    await ctx.editMessageText(
      `${sec.emoji} *${title}*\n\n${am ? "ምን ማወቅ ይፈልጋሉ? ከታች ካሉት አማራጮች ይምረጡ፦" : "What would you like to explore? Choose an option:"}`,
      { parse_mode: "Markdown", ...sectionKeyboard(lang, key) }
    );
  });

  bot.action(`guide_${key}`, async (ctx) => {
    const lang = getLang(ctx);
    const am   = lang === "am";
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      am ? sec.guide_am : sec.guide_en,
      { parse_mode: "Markdown", ...guideKeyboard(lang, key), disable_web_page_preview: true }
    );
  });
});

// ── Catch-all text message ────────────────────────────────────────────────────
bot.on("text", async (ctx) => {
  const lang = getLang(ctx);
  const am   = lang === "am";
  await ctx.reply(
    am
      ? "📋 እባክዎ መመሪያዎቹን ለመክፈት የ /menu ትዕዛዝን ይጻፉ ወይም ከታች ያሉትን ቁልፎች ይጫኑ፦"
      : "📋 Please type /menu or use the buttons below to navigate through the app guides:",
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
    console.log("✅ Telegram Bot commands menu synchronized");
  })
  .catch((err) => { 
    console.error("❌ Failed to start bot:", err); 
    process.exit(1); 
  });

process.once("SIGINT",  () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
