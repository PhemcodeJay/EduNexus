import { db } from "./db";
import { users, students, teachers, courses, fees, events, enrollments } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const [teacherUser] = await db.insert(users).values({
    id: "teacher-1",
    email: "math.teacher@school.com",
    firstName: "Alan",
    lastName: "Turing",
    role: "teacher",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alan",
  }).returning();

  const [studentUser] = await db.insert(users).values({
    id: "student-1",
    email: "student.jane@school.com",
    firstName: "Jane",
    lastName: "Doe",
    role: "student",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  }).returning();

  const [studentUser2] = await db.insert(users).values({
    id: "student-2",
    email: "student.john@school.com",
    firstName: "John",
    lastName: "Smith",
    role: "student",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  }).returning();

  const [teacher] = await db.insert(teachers).values({
    userId: teacherUser.id,
    fullName: "Alan Turing",
    age: 45,
    gender: "Male",
    specialization: "Mathematics & Computer Science",
  }).returning();

  const [student1] = await db.insert(students).values({
    userId: studentUser.id,
    fullName: "Jane Doe",
    gender: "Female",
    age: 16,
    class: "Form 3",
    dob: "2008-05-15",
    address: "123 School Lane",
    phone: "555-0101",
  }).returning();

  const [student2] = await db.insert(students).values({
    userId: studentUser2.id,
    fullName: "John Smith",
    gender: "Male",
    age: 17,
    class: "Form 3",
    dob: "2009-08-20",
    address: "456 Academy Road",
    phone: "555-0102",
  }).returning();

  const [mathCourse] = await db.insert(courses).values({
    courseCode: "MATH101",
    name: "Advanced Mathematics",
    description: "Calculus and Linear Algebra",
    teacherId: teacher.id,
    schedule: "Mon/Wed 09:00 AM",
  }).returning();

  const [csCourse] = await db.insert(courses).values({
    courseCode: "CS101",
    name: "Computer Science 101",
    description: "Introduction to Programming",
    teacherId: teacher.id,
    schedule: "Tue/Thu 11:00 AM",
  }).returning();

  const [cryptoCourse] = await db.insert(courses).values({
    courseCode: "CRYPTO101",
    name: "Crypto Made Simple: The Essential Guide to Digital Wealth",
    description: "A comprehensive guide covering cryptocurrency basics, blockchain technology, trading strategies, investing, risk management, and security. Topics include Bitcoin, Ethereum, technical analysis, candlestick patterns, staking, yield farming, privacy, and protecting digital assets.",
    teacherId: teacher.id,
    schedule: "Self-paced",
    contentType: "pdf",
    content: "CRYPTO MADE SIMPLE: THE ESSENTIAL GUIDE TO DIGITAL WEALTH\n\nPREFACE\n\nIn the dynamic intersection of finance and technology, cryptocurrencies and blockchain have emerged as transformative forces, fundamentally reshaping our understanding of wealth, transactions, and security. This book is designed to be inclusive, ensuring that individuals of all backgrounds can embark on the exciting journey of cryptocurrency. Whether you are entirely new to the concept or a seasoned investor looking for deeper insights, our aim is to provide you with the knowledge, resources, and confidence to navigate the ever-evolving crypto landscape.\n\nCHAPTER ONE: WHAT IS CRYPTOCURRENCY?\n\nCryptocurrency is a type of digital or virtual currency that relies on encryption for security. It operates on a decentralized network called blockchain, where transactions are recorded transparently and securely. Unlike traditional currencies, cryptocurrencies are not controlled by governments or banks. They can be used for various purposes including online transactions and investment.\n\nFinancial Opportunities in Cryptocurrency:\n- Investing: Buy and hold with expectation of value increase\n- Trading: Frequent buy/sell for profit from price changes\n- Mining: Validate transactions and earn new coins\n- Staking: Hold coins to support networks and receive rewards\n- Yield Farming: Earn interest by lending/staking in DeFi platforms\n- NFTs: Monetize digital creations\n\nCrypto Wallets:\nA cryptocurrency wallet is a digital tool that allows you to store, send, and receive cryptocurrencies. Types include hardware wallets (physical devices), software wallets (applications), and paper wallets (physical documents). Security practices include using reputable providers, enabling 2FA, and keeping private keys offline.\n\nTypes of Cryptocurrencies:\n- Bitcoin (BTC): The first and most well-known cryptocurrency, often considered digital gold\n- Ethereum (ETH): Known for smart contract functionality and DApps\n- Binance Coin (BNB): Native cryptocurrency of Binance exchange\n- Monero (XMR): Privacy-focused cryptocurrency\n- Stablecoins: Pegged to traditional currencies to reduce volatility\n- Altcoins: All cryptocurrencies other than Bitcoin\n- NFTs: Unique digital assets representing ownership\n\nCHAPTER TWO: WHAT IS BLOCKCHAIN?\n\nBlockchain is a decentralized and distributed ledger technology that records all transactions across a network. Key features include:\n- Append-Only and Immutable: Data cannot be altered once recorded\n- Cryptographic Links: Each block contains a hash of the previous block\n- Decentralization: Maintained by a network of participants\n- Transparency and Trust: All participants can verify the data\n- Fraud Prevention: Built-in security mechanisms\n\nTypes of Blockchains:\n- Public Blockchains: Open to anyone (Bitcoin, Ethereum)\n- Private Blockchains: Restricted to specific groups\n- Consortium Blockchains: Governed by multiple organizations\n- Hybrid Blockchains: Combination of public and private\n- Federated Blockchains: Semi-private with predefined nodes\n\nTokens and Airdrops:\nTokens are digital assets on blockchain. Airdrops distribute free tokens to promote new cryptocurrencies or reward holders. The journey from airdrop to trading pair involves creation, distribution, exchange listing, liquidity growth, and adoption.\n\nCHAPTER THREE: CRYPTOCURRENCY TRADING\n\nFundamental Analysis (FA): Evaluating underlying factors like project team, technology, real-world applications, and market adoption.\n\nTechnical Analysis (TA): Studying historical price charts, patterns, and trading volume to predict future price movements.\n\nCandlestick Charts: Each candlestick shows open, high, low, and close prices. Green indicates price increase, red indicates decrease. Patterns include Doji, Hammer, Shooting Star, Engulfing patterns, etc.\n\nTrading Concepts:\n- Trading Pairs: Combinations of two assets (e.g., BTC/USD, ETH/BTC)\n- Order Books: Real-time list of buy and sell orders\n- Market Orders: Buy/sell immediately at best available price\n- Limit Orders: Buy/sell at specific price or better\n- Trend Lines: Connect data points to visualize trends\n- Support and Resistance: Price levels where reversals likely occur\n\nTypes of Trading:\n- Day Trading: Buy/sell within 24 hours\n- Swing Trading: Hold for days to months\n- Position Trading: Hold for months or years\n- Scalping: Quick trades within minutes or seconds\n\nRisk Management:\n- Diversification: Spread investments across assets\n- Hedging: Take positions to offset potential losses\n- Use advanced order types (stop-loss, take-profit)\n- Follow the 1% rule: Risk only 1% of capital per trade\n- Have an exit strategy\n- Do Your Own Research (DYOR)\n\nTechnical Indicators:\n- RSI (Relative Strength Index): Measures overbought/oversold conditions\n- Moving Averages (MA): Smooth price data to identify trends\n- MACD: Compares two moving averages for momentum\n- Stochastic RSI: Combines RSI and Stochastic Oscillator\n- Bollinger Bands: Measures volatility\n\nCHAPTER FOUR: CRYPTO INVESTING STRATEGY\n\nFundamental Analysis for Investing: Examine technology, team, adoption potential, and tokenomics.\n\nAsset Allocation and Diversification: Distribute capital among different asset types to maximize returns while minimizing risk.\n\nDollar-Cost Averaging (DCA): Regularly purchase fixed amounts regardless of price to reduce timing risk.\n\nPassive Income Methods:\n- Mining: Validate transactions for rewards\n- Staking: Lock coins to support network and earn rewards\n- Yield Farming: Provide liquidity in DeFi protocols\n- Crypto Lending: Lend assets for interest\n- DEX Liquidity Provision: Provide liquidity to exchanges\n- Affiliate Programs: Earn commissions by promoting crypto products\n- Content Creation: Monetize blockchain-based content\n\nCHAPTER FIVE: PRIVACY AND SECURITY\n\nUnderstanding Ransomware: Malicious software that encrypts files and demands ransom.\n\nPrivacy Tools and Techniques:\n- TOR Network: Anonymity network for private browsing\n- Device Fingerprinting: Websites track devices via unique attributes\n- Phishing: Fraudulent attempts to steal sensitive information\n- End-to-End Encryption (E2EE): Ensures only sender and recipient can read messages\n\nSecurity Best Practices:\n- Use hardware wallets for storage\n- Enable two-factor authentication\n- Use strong, unique passwords\n- Keep software updated\n- Use cold storage for significant holdings\n- Continuously educate about threats\n\nCONCLUSION\n\n\"Crypto Made Simple\" empowers readers with knowledge, tools, and practical advice to make informed decisions, protect their assets, and harness the potential of the cryptocurrency landscape.",
  }).returning();

  const [tradeCourse] = await db.insert(courses).values({
    courseCode: "TRADE101",
    name: "The Essential Trading Guide: Mastering Market Momentum",
    description: "Master profitable trading strategies with market momentum analysis. Learn about elephant bars, tail bars, moving averages, bull/bear flags, risk management, and crypto futures trading.",
    teacherId: teacher.id,
    schedule: "Self-paced",
    contentType: "pdf",
    content: "THE ESSENTIAL TRADING GUIDE: MASTERING MARKET MOMENTUM FOR PROFITABLE TRADING STRATEGIES\n\nPREFACE\n\nWelcome to The Essential Trading Guide. This comprehensive guide explores market dynamics, price movements, trends, and indicators. Drawing from years of experience, it equips you with essential knowledge and tools to identify, analyze, and capitalize on market momentum. Applicable to stocks, forex, commodities, and cryptocurrencies.\n\nCHAPTER ONE: CONCEPT OF TIME AND SPACE IN TRADING\n\nTime and Space Equilibrium: Price movements that unfold steadily over time reflect balanced and sustainable trends. Traders view this as a sign of genuine market trends.\n\nReal Moves vs Unreal Moves:\n- Real Moves: Price fluctuations that occur steadily and consistently over time, indicating genuine momentum\n- Unreal Moves: Rapid price changes outpacing natural progression, often unsustainable and leading to corrections\n\nElephant Bars: Large candlesticks with significant price range indicating strong market momentum.\n- Bear Elephant Bar: Large bearish candlestick with long body and short upper shadow\n- Bull Elephant Bar: Large bullish candlestick with long body and short lower shadow\n\nTail Bars (Pin Bars): Feature long wicks indicating price rejection. Signal potential reversals or continuations.\n\nStrategic Entry Tactics:\n- Anticipation Entry: Enter when 75% of candle time has elapsed\n- Confirmation Entry: Enter when next candle closes beyond anticipation bar's close\n\nStop-Loss Strategies:\n- One-Bar Stop: Place stop at high/low of entry candle\n- Two-Bar Stop: Place stop beyond high/low of two most recent candles\n\nProfit-Taking Levels: Set targets at support/resistance levels, Fibonacci extensions, or previous swing highs/lows.\n\nCHAPTER TWO: UNDERSTANDING BULL AND BEAR FLAGS\n\nBull Flag: Continuation pattern in uptrend with sharp rise (flagpole) followed by consolidation (flag). Breakout above flag confirms continuation.\n\nBear Flag: Continuation pattern in downtrend with sharp fall followed by consolidation. Breakdown below flag confirms continuation.\n\nMarket Pauses:\n- Price Pause: Consolidation within narrow range\n- Time Pause: Reduced volatility over time\n- Temporary Stops: Brief reversals within broader trend\n\nSimple Moving Averages (SMAs):\n- 8-day SMA: Short-term trend indicator\n- 20-day SMA: Medium-term trend, dynamic support/resistance\n- 50-day SMA: Intermediate-term trend\n- 100-day SMA: Longer-term trend\n- 200-day SMA: Long-term trend benchmark\n\nBuyable Dips and Breakout Strategies:\n- Buy dips when price bounces off 200-day MA support\n- Sell rallies when price fails to break 200-day MA resistance\n- Use 20-day MA for shorter-term entry/exit points\n\nCHAPTER THREE: POWER MOVES AND TREND REVERSAL PATTERNS\n\nPower Moves: Rapid, decisive price movements indicating strong momentum. Signal new trends or continuation of existing ones.\n\nMajor Turn Patterns:\n- V-Bottom Reversal: Sharp decline followed by rapid recovery forming V-shape\n- Dead Cat Bounce: Temporary recovery in downtrend before continuation\n- Clearing Bottoms: Price breaks above resistance after consolidation\n\nPullback Probabilities:\n- 33% Pullback: Moderate likelihood of retracement (85% chance continuation if fails)\n- 50% Pullback: Balanced probability (60% chance continuation if fails)\n- 66% Pullback: Strong retracement likely (20% chance continuation if fails)\n- 100% Pullback: Near-certainty of complete reversal\n\nCRYPTO FUTURES TRADING\n\nPerpetual Contracts: Preferred for leverage trading, 24/7 availability, high liquidity, no expiry, and funding mechanisms that track spot prices. Key considerations include leverage management, risk management, technical analysis, and staying informed on market developments.",
  }).returning();

  // Enroll students
  await db.insert(enrollments).values([
    { studentId: student1.id, courseId: mathCourse.id },
    { studentId: student1.id, courseId: csCourse.id },
    { studentId: student2.id, courseId: csCourse.id },
  ]);

  // Create Events
  await db.insert(events).values([
    {
      title: "Science Fair 2024",
      description: "Annual Science Fair for all grades.",
      date: new Date("2024-12-15T09:00:00Z"),
      location: "Main Auditorium",
    },
    {
      title: "Parent-Teacher Conference",
      description: "Term 1 review.",
      date: new Date("2024-11-20T16:00:00Z"),
      location: "Classrooms",
    },
  ]);

  // Create Fees
  await db.insert(fees).values([
    {
      studentId: student1.id,
      amount: 50000,
      description: "Term 1 Tuition",
      dueDate: "2024-09-01",
      paid: true,
    },
    {
      studentId: student2.id,
      amount: 50000,
      description: "Term 1 Tuition",
      dueDate: "2024-09-01",
      paid: false,
    },
  ]);

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
});