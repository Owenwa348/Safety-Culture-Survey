export const questions = [
  // ชุดที่ 1: Leadership & Commitment
  {
    id: 1,
    category: "Leadership & Commitment",
    th: "ผู้บริหารให้ความสำคัญในการสื่อสารด้าน SSHE กับผู้ปฏิบัติงานอย่างไร?",
    en: "How does management prioritize communication on SSHE with operators?",
    levels: [
      { th: "ผู้บริหารสื่อสารเรื่องความปลอดภัยโดยบอกพนักงานเพียงว่า “อย่าสร้างปัญหา” “ทำยังไงก็ได้อย่าให้มีอุบัติเหตุ”", en: "Management only communicates HSE issues by telling workers not to cause problems" },
      { th: "หลังเกิดอุบัติเหตุ “เรื่องความปลอดภัยจะเป็นประเด็นร้อน” มีการสื่อสารเรื่องความปลอดภัยมากมายจากผู้บริหารมายังพนักงาน แต่พอนานไปทุกอย่างก็จะ “เงียบหายไปเหมือนไฟไหม้ฟาง”", en: "After incidents ‘flavor of the month’ HSE messages are passed down from top management. Any interest gets less over time as things get ‘back to normal’. " },
      { th: "ผู้บริหารให้ข้อมูลมากมายและคิดแผนงานใหม่ๆ ออกมาบ่อยครั้ง ผู้บริหารเป็นฝ่ายพูดมากกว่าฟัง", en: "Management shares a lot of information with workers and has frequent HSE initiatives. Management does a lot of talking but is not really listening." },
      { th: "มีการสื่อสารแบบสองทางเรื่องความปลอดภัยในการทำงาน ทั้งถามและบอกควบคู่กันไป", en: "There is a two-way process of communication about HSE issues in place. Asking as well as telling goes on." },
      { th: "มีการสื่อสารเรื่องความปลอดภัยแบบสองทางที่ชัดเจนและสม่ำเสมอ ผู้บริหารเป็นฝ่ายได้รับข้อมูลมากกว่าให้ข้อมูล ทุกคนในองค์กรรับทราบข้อมูลอุบัติเหตุ", en: "There is frequent and clear two way communication about HSE issues in which management gets more information back than they provide. Everyone knows when there is an incident." },
    ],
  },
  {
    id: 2,
    category: "Leadership & Commitment",
    th: "ระดับความมุ่งมั่นด้าน SSHE และความห่วงใยของผู้ปฏิบัติงานและผู้บริหารเป็นอย่างไร?",
    en: "What is the level of SSHE commitment and concern of both workers and management?",
    levels: [
      { th: "ไม่มีความมุ่งมั่น", en: "No commitment" },
      { th: "มีบ้างเป็นบางครั้ง", en: "Occasional commitment" },
      { th: "มีความพยายามแต่ไม่ต่อเนื่อง", en: "Effort but inconsistent" },
      { th: "มีความร่วมมือที่ดี", en: "Good cooperation" },
      { th: "แสดงออกถึงความมุ่งมั่นสูง", en: "High level of commitment" },
    ],
  },
  {
    id: 3,
    category: "Leadership & Commitment",
    th: "ผลตอบแทนความสำเร็จด้านความปลอดภัยฯ เป็นอย่างไร?",
    en: "What are the rewards for safety success like?",
    levels: [
      { th: "ไม่มีการให้รางวัล", en: "No rewards" },
      { th: "รางวัลมีเป็นครั้งคราว", en: "Occasional rewards" },
      { th: "มีรางวัลแต่ไม่จูงใจ", en: "Rewards but not motivating" },
      { th: "มีรางวัลที่จูงใจ", en: "Motivating rewards" },
      { th: "มีระบบรางวัลที่ดีและสม่ำเสมอ", en: "Good and consistent reward system" },
    ],
  },

  // ชุดที่ 2: Policy & Strategic Objectives
  {
    id: 4,
    category: "Policy & Strategic Objectives",
    th: "คุณคิดว่าผู้ที่ทำให้เกิดอุบัติเหตุในมุมมองผู้บริหารเป็นอย่างไร?",
    en: "Who is considered to cause accidents from management’s perspective?",
    levels: [
      { th: "ความผิดของพนักงานทั้งหมด", en: "All worker's fault" },
      { th: "ส่วนใหญ่เป็นความผิดพนักงาน", en: "Mainly worker's fault" },
      { th: "ปัจจัยทั้งระบบ", en: "System factors" },
      { th: "ความรับผิดชอบร่วมกัน", en: "Shared responsibility" },
      { th: "มองเป็นปัญหาของระบบโดยรวม", en: "Holistic system view" },
    ],
  },
  {
    id: 5,
    category: "Policy & Strategic Objectives",
    th: "การให้ความสำคัญระหว่างเรื่องของ 'SSHE' และ 'ผลผลิตหรือกำไร' ของบริษัทฯ เป็นอย่างไร?",
    en: "How is the balance between SSHE and productivity/profit?",
    levels: [
      { th: "เน้นผลผลิตมากกว่า SSHE", en: "Focus on production over SSHE" },
      { th: "เน้นผลผลิตแต่ใส่ใจ SSHE บ้าง", en: "Production priority but some SSHE care" },
      { th: "สมดุลกันระหว่าง SSHE กับผลผลิต", en: "Balanced SSHE and production" },
      { th: "ให้ความสำคัญ SSHE ก่อนผลผลิต", en: "SSHE prioritized over production" },
      { th: "SSHE เป็นวาระแรกเสมอ", en: "SSHE always top priority" },
    ],
  },
  {
    id: 6,
    category: "Policy & Strategic Objectives",
    th: "ความเข้าใจและการทำ SSHE moments ก่อนประชุมหรือก่อนเริ่มงานเป็นอย่างไร?",
    en: "What is the understanding and execution of SSHE moments like?",
    levels: [
      { th: "ไม่มีการทำ SSHE moments", en: "No SSHE moments" },
      { th: "มีบ้างเป็นบางครั้ง", en: "Occasional SSHE moments" },
      { th: "ทำสม่ำเสมอแต่ไม่เข้าใจจุดประสงค์", en: "Regular but poorly understood" },
      { th: "ทำสม่ำเสมอและเข้าใจดี", en: "Regular and well understood" },
      { th: "เป็นวัฒนธรรมองค์กร", en: "Part of organizational culture" },
    ],
  },

  // ชุดที่ 3: Resources & Documentation
  {
    id: 7,
    category: "Resources & Documentation",
    th: "บริษัทฯ มีการจัดการผู้รับเหมาอย่างไร?",
    en: "How does the company manage contractors?",
    levels: [
      { th: "ไม่ควบคุม", en: "No control" },
      { th: "ควบคุมเบื้องต้น", en: "Basic control" },
      { th: "มีนโยบายแต่ขาดการติดตาม", en: "Policy without monitoring" },
      { th: "ควบคุมอย่างมีประสิทธิภาพ", en: "Effective control" },
      { th: "ควบคุมและพัฒนาผู้รับเหมาอย่างต่อเนื่อง", en: "Continuous contractor development" },
    ],
  },
  {
    id: 8,
    category: "Resources & Documentation",
    th: "ผู้ปฏิบัติงานสนใจเรื่องของขีดความสามารถในการทำงานและการฝึกอบรมอย่างไร?",
    en: "How interested are workers in capability and training?",
    levels: [
      { th: "ไม่มีความสนใจ", en: "No interest" },
      { th: "สนใจเพียงบางส่วน", en: "Some interest" },
      { th: "สนใจแต่ขาดโอกาส", en: "Interested but lacks opportunity" },
      { th: "เข้าร่วมการฝึกอบรมสม่ำเสมอ", en: "Regular training participation" },
      { th: "กระตือรือร้นและแสวงหาความรู้ใหม่เสมอ", en: "Eager and proactive learning" },
    ],
  },
  {
    id: 9,
    category: "Resources & Documentation",
    th: "คุณคิดว่าหน่วยงาน SSHE ในบริษัทมีขนาดและสถานภาพเป็นอย่างไร?",
    en: "How is the size and status of the SSHE department?",
    levels: [
      { th: "ไม่มีหน่วยงานเฉพาะ", en: "No dedicated department" },
      { th: "มีแต่ขนาดเล็กมาก", en: "Very small department" },
      { th: "ขนาดเพียงพอแต่ขาดศักยภาพ", en: "Adequate size but low capacity" },
      { th: "ขนาดและศักยภาพดี", en: "Good size and capacity" },
      { th: "เป็นหน่วยงานที่มีความสำคัญสูงสุด", en: "Highly significant department" },
    ],
  },

  // ชุดที่ 4: Risk Assessment & Management
  {
    id: 10,
    category: "Risk Assessment & Management",
    th: "การวางแผนการทำงานและแนวทางในการบริหารจัดการด้าน SSHE เป็นอย่างไร?",
    en: "How is the planning and management of SSHE carried out?",
    levels: [
      { th: "ไม่มีการวางแผน", en: "No planning" },
      { th: "มีแผนแต่ไม่ปฏิบัติจริง", en: "Plans exist but not executed" },
      { th: "แผนถูกนำมาใช้บ้าง", en: "Plans partially executed" },
      { th: "แผนถูกใช้อย่างดี", en: "Plans well executed" },
      { th: "แผนมีการปรับปรุงต่อเนื่อง", en: "Plans continuously improved" },
    ],
  },
  {
    id: 11,
    category: "Risk Assessment & Management",
    th: "มีการใช้เทคนิค SSHE ต่างๆ ในการทำงานอย่างไร?",
    en: "How are SSHE techniques used in work?",
    levels: [
      { th: "ไม่มีการใช้เทคนิค SSHE", en: "No SSHE techniques used" },
      { th: "ใช้เป็นบางครั้ง", en: "Occasional use" },
      { th: "ใช้สม่ำเสมอแต่ไม่ครบถ้วน", en: "Regular but incomplete" },
      { th: "ใช้ครบและถูกต้อง", en: "Complete and correct use" },
      { th: "ใช้เป็นวัฒนธรรมองค์กร", en: "Part of organizational culture" },
    ],
  },

  // ชุดที่ 5: Implementation & Operation Control
  {
    id: 12,
    category: "Implementation & Operation Control",
    th: "จุดประสงค์ของการมีขั้นตอนปฏิบัติงานมุ่งเน้นด้าน SSHE คืออะไร?",
    en: "What is the purpose of SSHE procedures?",
    levels: [
      { th: "ไม่ทราบจุดประสงค์", en: "Unaware of purpose" },
      { th: "เข้าใจบางส่วน", en: "Partial understanding" },
      { th: "เข้าใจแต่ไม่ปฏิบัติ", en: "Understands but not applied" },
      { th: "เข้าใจและปฏิบัติตาม", en: "Understands and follows" },
      { th: "เข้าใจอย่างลึกซึ้งและพัฒนาต่อเนื่อง", en: "Deep understanding and continuous improvement" },
    ],
  },

  // ชุดที่ 6: Monitoring & Measurement
  {
    id: 13,
    category: "Monitoring & Measurement",
    th: "ระบบการรายงาน การสอบสวน และการวิเคราะห์อุบัติเหตุเป็นอย่างไร?",
    en: "How is the accident reporting, investigation, and analysis system?",
    levels: [
      { th: "ไม่มีระบบ", en: "No system" },
      { th: "มีระบบแต่ไม่สมบูรณ์", en: "Incomplete system" },
      { th: "ระบบทำงานแต่ขาดการวิเคราะห์", en: "System works but lacks analysis" },
      { th: "ระบบทำงานครบถ้วน", en: "Complete system" },
      { th: "มีการวิเคราะห์และปรับปรุงอย่างต่อเนื่อง", en: "Continuous analysis and improvement" },
    ],
  },
  {
    id: 14,
    category: "Monitoring & Measurement",
    th: "ระบบการสังเกตและรายงานสภาพการณ์และพฤติกรรมด้าน SSHE เป็นอย่างไร?",
    en: "How is the SSHE observation and reporting system?",
    levels: [
      { th: "ไม่มีการสังเกตหรือรายงาน", en: "No observation/reporting" },
      { th: "มีแต่ไม่สม่ำเสมอ", en: "Irregular observation" },
      { th: "สม่ำเสมอแต่ไม่วิเคราะห์", en: "Regular but no analysis" },
      { th: "ครบถ้วนและมีการวิเคราะห์", en: "Complete with analysis" },
      { th: "ใช้ข้อมูลพัฒนาระบบต่อเนื่อง", en: "Continuous system improvement" },
    ],
  },
  {
    id: 15,
    category: "Monitoring & Measurement",
    th: "เกิดอะไรขึ้นหลังจากการเกิดอุบัติเหตุ? / มีขั้นตอนในการติดตามและแก้ไขปัญหาอย่างไร?",
    en: "What happens after an accident? How is follow-up handled?",
    levels: [
      { th: "ไม่มีการติดตาม", en: "No follow-up" },
      { th: "มีติดตามบางกรณี", en: "Occasional follow-up" },
      { th: "มีติดตามแต่ไม่สม่ำเสมอ", en: "Inconsistent follow-up" },
      { th: "ติดตามทุกกรณี", en: "Regular follow-up" },
      { th: "ติดตามพร้อมการแก้ไขอย่างต่อเนื่อง", en: "Follow-up with continuous correction" },
    ],
  },
  {
    id: 16,
    category: "Monitoring & Measurement",
    th: "ใครเป็นผู้ตรวจสอบด้าน SSHE ในการทำงานประจำวัน?",
    en: "Who checks SSHE in daily work?",
    levels: [
      { th: "ไม่มีผู้ตรวจสอบ", en: "No checker" },
      { th: "หัวหน้าทีมตรวจสอบบางครั้ง", en: "Team leader checks occasionally" },
      { th: "หัวหน้าทีมตรวจสอบประจำ", en: "Regular checking by team leader" },
      { th: "ทีมงานร่วมตรวจสอบ", en: "Team jointly checks" },
      { th: "พนักงานทุกคนมีส่วนร่วมในการตรวจสอบ", en: "All staff participate in checking" },
    ],
  },
  {
    id: 17,
    category: "Monitoring & Measurement",
    th: "บรรยากาศในการประชุมด้านความปลอดภัยฯเป็นอย่างไร?",
    en: "What is the atmosphere in safety meetings like?",
    levels: [
      { th: "ไม่มีการประชุม", en: "No meetings" },
      { th: "ประชุมไม่สม่ำเสมอ", en: "Irregular meetings" },
      { th: "ประชุมสม่ำเสมอแต่ไม่เปิดกว้าง", en: "Regular but not open" },
      { th: "ประชุมเปิดกว้างและมีส่วนร่วม", en: "Open and participative meetings" },
      { th: "ประชุมเป็นเวทีเสนอและพัฒนาต่อเนื่อง", en: "Meetings as a platform for development" },
    ],
  },
  {
    id: 18,
    category: "Monitoring & Measurement",
    th: "ความเข้าใจเรื่องพฤติกรรมพื้นฐานด้านความปลอดภัยฯ เป็นอย่างไร?",
    en: "What is the understanding of basic safety behaviors (BBS, etc.)?",
    levels: [
      { th: "ไม่มีความเข้าใจ", en: "No understanding" },
      { th: "เข้าใจเพียงเล็กน้อย", en: "Minimal understanding" },
      { th: "เข้าใจแต่ไม่ปฏิบัติ", en: "Understands but not practiced" },
      { th: "เข้าใจและปฏิบัติ", en: "Understands and practices" },
      { th: "เข้าใจลึกซึ้งและเป็นวัฒนธรรม", en: "Deep understanding and cultural practice" },
    ],
  },

  // ชุดที่ 7: Review & Audit
  {
    id: 19,
    category: "Review & Audit",
    th: "มีการตรวจสอบและทบทวนด้าน SSHE อย่างไร?",
    en: "How is SSHE review and auditing conducted?",
    levels: [
      { th: "ไม่มีการตรวจสอบ", en: "No review" },
      { th: "มีแต่ไม่สม่ำเสมอ", en: "Irregular review" },
      { th: "สม่ำเสมอแต่ขาดการวิเคราะห์", en: "Regular but lacks analysis" },
      { th: "ตรวจสอบและวิเคราะห์ครบถ้วน", en: "Complete with analysis" },
      { th: "ตรวจสอบพร้อมพัฒนาอย่างต่อเนื่อง", en: "Review with continuous improvement" },
    ],
  },
  {
    id: 20,
    category: "Review & Audit",
    th: "มีการเปรียบเทียบผลการดำเนินงานด้านความปลอดภัยฯ และสถิติอุบัติเหตุกับบริษัทอื่นๆ หรือไม่ อย่างไร?",
    en: "Are safety performance and accident stats compared with other companies?",
    levels: [
      { th: "ไม่มีการเปรียบเทียบ", en: "No comparison" },
      { th: "เปรียบเทียบแต่ไม่ต่อเนื่อง", en: "Occasional comparison" },
      { th: "เปรียบเทียบกับบริษัทภายในกลุ่ม", en: "Compared with internal companies" },
      { th: "เปรียบเทียบกับบริษัทในอุตสาหกรรมเดียวกัน", en: "Compared with industry peers" },
      { th: "เปรียบเทียบระดับประเทศ/สากล", en: "Compared nationally/internationally" },
    ],
  },
];
