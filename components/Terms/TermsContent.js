"use client";

import React from "react";
import {
  FaGavel,
  FaUserCheck,
  FaExclamationTriangle,
  FaCalendarTimes,
  FaFileContract,
  FaTags,
  FaCreditCard,
  FaUndoAlt,
  FaShieldAlt,
  FaUserLock,
  FaEnvelopeOpenText,
  FaBalanceScale,
  FaPlane,
  FaHotel,
  FaUmbrellaBeach,
  FaMoneyBillWave,
  FaFileSignature,
} from "react-icons/fa";

export default function TermsContent({ lang }) {
  const content = {
    ar: {
      heroTitle: "الشروط والأحكام",
      heroSubtitle: "لشركة التلال والرمال لتنظيم الرحلات السياحية",
      intro:
        'هذا الموقع الإلكتروني هو الموقع الرسمي لـ شركة التلال والرمال لتنظيم الرحلات السياحية (ويشار إليه لاحقًا بـ "الموقع"). تعود ملكية الموقع، ومحتوياته، ومسؤولية تشغيله وإدارته إلى شركة التلال والرمال لتنظيم الرحلات السياحية، وهي شركة مسجلة وتعمل وفق أنظمة وقوانين المملكة العربية السعودية، ويقع مقرها الرئيس في المملكة العربية السعودية.',
      warning:
        'يُرجى قراءة هذه الشروط والأحكام بعناية قبل إتمام أي حجز أو معاملة معنا. يُعد إتمام عملية الحجز أو سداد قيمة الخدمات موافقةً صريحةً وغير مشروطة من العميل على جميع البنود الواردة أدناه.',

      sections: [
        {
          id: 1,
          title: "الاستخدام المصرح به",
          icon: <FaUserCheck size={28} />,
          points: [
            "يشترط أن يكون المستخدم بعمر 18 عامًا فأكثر وبكامل الأهلية القانونية.",
            "يلتزم المستخدم باستخدام الموقع لأغراض شخصية مشروعة فقط.",
            "يُحظر استخدام الموقع في أي أنشطة مخالفة للأنظمة أو الآداب العامة، بما في ذلك نشر محتوى ضار، أو إرسال رسائل غير مرغوب فيها (Spam)، أو تحميل فيروسات أو برمجيات خبيثة، أو التعدي على حقوق الملكية الفكرية.",
          ],
        },
        {
          id: 2,
          title: "الأحكام العامة وإطار العمل",
          icon: <FaBalanceScale size={28} />,
          points: [
            "تخضع كافة الحجوزات والمعاملات للأنظمة واللوائح المعمول بها في المملكة العربية السعودية، بما في ذلك أنظمة وزارة السياحة والهيئة العامة للطيران المدني.",
            "تعمل الشركة بصفتها وسيطًا بين العميل ومزودي الخدمة، وتقتصر مسؤوليتها على تسهيل عملية الحجز والتأكيد.",
            "تعتبر الأسعار المعروضة تقديرية وقابلة للتعديل من قبل مزود الخدمة حتى يتم تأكيد الحجز وإصدار المستندات الرسمية (تذكرة/قسيمة فندقية).",
            "لا يحق للعميل المطالبة باسترداد المبالغ أو الاعتراض على السياسات المتبعة بعد إتمام الحجز إلا وفقاً للشروط المحددة لكل خدمة على حدة.",
          ],
        },
        {
          id: 3,
          title: "أحكام وشروط حجوزات الطيران",
          icon: <FaPlane size={28} />,
          points: [
            "تخضع جميع تذاكر الطيران للسياسات والشروط الخاصة بشركة الطيران الناقلة (الناقل الجوي).",

            "، الاسترجاع أو التعديل  يعتمد علي سياسة الناقل الجوي صراحةً  وقد يترتب عليها رسوم إداريه  ورسوم فرق سعر التذكرة. وكذلك  تذاكر الطيران الغير قابله للاسترجاع أو التعديل يترتب تطبيق شروط وسياسته  الناقل الناقل الجوي",
            "في حال تخلف العميل عن الحضور في الموعد المحدد للمغادرة (No-Show)، يتم تطبيق كامل الشروط والسياسات الجزائية الخاصة بشركة الطيران الناقلة.",
            "يتحمل العميل مسؤولية مطابقة الاسم المدون في التذكرة تماماً مع وثيقة السفر الرسمية (جواز السفر أو الهوية الوطنية).",
            "الشركة غير مسؤولة عن أي تغييرات تطرأ على جداول الرحلات، التأخير، الإلغاء، تغيير مواعيد الإقلاع أو الوصول، أو فقدان/تلف الأمتعة.",
            "تقع المسؤولية الكاملة عن استيفاء معلومات تهمك، بما في ذلك التأشيرات اللازمة، صلاحية جواز السفر، الفحوصات الطبية، ووثائق الدخول إلى دول الوجهة، على عاتق العميل وحده.",
          ],
        },
        {
          id: 4,
          title: "أحكام وشروط حجوزات الفنادق",
          icon: <FaHotel size={28} />,
          points: [
            "تختلف سياسات الإلغاء والتعديل بناءً على الفندق المحدد ونوع الغرفة والتعرفة (Rate Basis) المختارة عند الحجز. بعض الحجوزات غير قابلة للاسترداد نهائياً بعد التأكيد.",
            "تخضع أوقات تسجيل الدخول (Check-in) وتسجيل الخروج (Check-out) للسياسة المتبعة لدى الفندق المعني.",
            "تُعتبر الطلبات الخاصة (كطلبات الأسرّة المزدوجة/المنفردة، تفضيلات الإطلالة، أو تسجيل الدخول المبكر) طلبات تفضيلية وغير مضمونة. ويخضع تنفيذها لمدى توفرها الفعلي لدى الفندق في وقت تسجيل الدخول.",
          ],
        },
        {
          id: 5,
          title: "الرحلات السياحية والباقات المتكاملة",
          icon: <FaUmbrellaBeach size={28} />,
          points: [
            "البرامج السياحية قابلة للتعديل بناءً على الظروف التشغيلية، الأحوال الجوية، أو قرارات الجهات المحلية في بلد الوجهة، مع التزام الشركة بالحفاظ على جوهر ومستوى البرنامج.",
            "في حال إلغاء الرحلة لأسباب قاهرة خارجة عن إرادة الشركة، يتم تطبيق سياسة الاسترداد الخاصة بمزودي الخدمات الرئيسيين (الفنادق والطيران والخدمات الأرضية).",
            "أي تأخير أو عدم التزام بالمواعيد المحددة ضمن البرنامج السياحي ناتج عن العميل لا تتحمل الشركة مسؤوليته المالية أو اللوجستية.",
          ],
        },
        {
          id: 6,
          title: "الأسعار والعروض",
          icon: <FaTags size={28} />,
          points: [
            "الأسعار قابلة للتغيير بناءً على سياسات المورد، أو الضرائب، أو تقلبات أسعار الصرف.",
            "العروض الترويجية (مثل القسائم والكوبونات) غير قابلة للاسترداد النقدي وتخضع لشروط الاستخدام الموضحة عند الإعلان عنها.",
            "يجب سداد كامل المبلغ المستحق مقابل الخدمات قبل الموعد النهائي لتأكيد الحجز (Deadline).",
            "يُبين العرض المقدم للعميل ما إذا كانت الأسعار تشمل أو لا تشمل ضريبة القيمة المضافة (VAT) والضرائب المحلية الأخرى.",
          ],
        },
        {
          id: 7,
          title: "سياسة الدفع",
          icon: <FaCreditCard size={28} />,
          points: [
            "يتم دفع 100% من قيمة الحجز عند التأكيد باستخدام البطاقات البنكية (فيزا/ماستر كارد/مدى) أو التحويل البنكي.",
            "الشركة لا توفر أي محافظ إلكترونية داخل الموقع.",
            'خاصية "احجز الآن وادفع لاحقًا" متاحة فقط في بعض الرحلات المحددة.',
          ],
        },
        {
          id: 8,
          title: "سياسة الاسترجاع والإلغاء",
          icon: <FaUndoAlt size={28} />,
          points: [
            "تخضع إمكانية الإلغاء لسياسات مزودي الخدمة (شركات الطيران والفنادق ومنظمي الرحلات)، ويتم احتساب أي رسوم يفرضونها.",
            "رسوم الخدمات الإدارية والعمولات الخاصة بالشركة غير قابلة للاسترجاع في جميع الأحوال.",
            "قد تستغرق عملية الاسترداد مدة زمنية تتراوح بين 14 إلى 45 يوم عمل، بناءً على إجراءات البنوك ومزودي الخدمة النهائيين.",
            "يتم الاسترجاع بنفس وسيلة الدفع التي استخدمها العميل أصلاً.",
            "في حالة الدفع عبر البطاقات البنكية يتم الإرجاع خلال 48 ساعة من أيام العمل، وقد يستغرق البنك 7 أيام عمل إضافية لمعالجة المبلغ.",
            "على العميل التواصل مع خدمة العملاء عبر البريد الإلكتروني info@altelal-walramal.sa لطلب الاسترجاع.",
          ],
        },
        {
          id: 9,
          title: "حدود المسؤولية والقوة القاهرة",
          icon: <FaShieldAlt size={28} />,
          points: [
            "لا تتحمل الشركة أي مسؤولية عن أضرار أو خسائر ناتجة عن استخدام الموقع، بما في ذلك الأعطال التقنية أو اختراق البيانات أو انقطاع الخدمات.",
            "الشركة غير مسؤولة عن محتوى المواقع الخارجية المرتبطة بالموقع.",
            "لا تتحمل الشركة أي مسؤولية ناتجة عن ظروف القوة القاهرة، والتي تشمل على سبيل المثال لا الحصر: الكوارث الطبيعية، الأحوال الجوية السيئة، القرارات الحكومية، إغلاق الحدود أو المطارات، الأوبئة، الحوارات، أو الاضطرابات الأمنية.",
            "تخضع جميع النزاعات التي قد تنشأ بين الشركة والعميل لأنظمة وقوانين المملكة العربية السعودية، وتكون المحاكم المختصة في المملكة هي الجهة القضائية للفصل في النزاع.",
          ],
        },
        {
          id: 10,
          title: "الخصوصية والسرية",
          icon: <FaUserLock size={28} />,
          points: [
            "تحرص الشركة على حماية بيانات العملاء باستخدام تقنيات حديثة، لكنها لا تضمن الحماية بنسبة 100%.",
            "قد يستخدم الموقع ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم، ويمكن للمستخدم ضبط إعدادات المتصفح لإيقافها.",
            "تُستخدم بيانات العميل الشخصية حصرياً لغرض إتمام وتنفيذ الحجوزات والخدمات المطلوبة.",
            "تلتزم الشركة بحماية سرية بيانات العملاء وفقاً لأنظمة حماية البيانات المعمول بها في المملكة العربية السعودية.",
            "لا تتم مشاركة البيانات مع أطراف ثالثة إلا بالقدر اللازم والضروري لتنفيذ المعاملة.",
          ],
        },
        {
          id: 11,
          title: "الإقرار والموافقة",
          icon: <FaFileSignature size={28} />,
          points: [
            "بإتمام عملية الحجز أو سداد أي مبلغ مالي، يقر العميل بموافقته الكاملة وغير القابلة للنقض على كافة الشروط والأحكام والسياسات الواردة أعلاه.",
            "تمثل هذه الشروط الاتفاقية الكاملة بين العميل والشركة، وتلغي أي اتفاقيات أو بيانات سابقة.",
            "إذا أصبح أي بند من هذه الشروط غير قابل للتنفيذ، فإن ذلك لا يؤثر على باقي البنود.",
          ],
        },
      ],
    },
    en: {
      heroTitle: "Terms & Conditions",
      heroSubtitle: "For Tilal Al Rimal Tourism Company",
      intro:
        'This website is the official website of Tilal Al Rimal Tourism Company (hereinafter referred to as the "Site"). The ownership of the Site, its contents, and the responsibility for its operation and management belong to Tilal Al Rimal Tourism Company, a company registered and operating under the laws and regulations of the Kingdom of Saudi Arabia, with its headquarters located in the Kingdom of Saudi Arabia.',
      warning:
        'Please read these Terms & Conditions carefully before completing any booking or transaction with us. Completing a booking or paying for services constitutes the customer\'s explicit and unconditional acceptance of all the terms below.',

      sections: [
        {
          id: 1,
          title: "Authorized Use",
          icon: <FaUserCheck size={28} />,
          points: [
            "The user must be 18 years of age or older and have full legal capacity.",
            "The user agrees to use the Site for lawful personal purposes only.",
            "It is prohibited to use the Site for any activities that violate regulations or public morals, including posting harmful content, sending spam, uploading viruses or malware, or infringing on intellectual property rights.",
          ],
        },
        {
          id: 2,
          title: "General Provisions and Framework",
          icon: <FaBalanceScale size={28} />,
          points: [
            "All bookings and transactions are subject to the regulations and laws in force in the Kingdom of Saudi Arabia, including the regulations of the Ministry of Tourism and the General Authority of Civil Aviation.",
            "The Company acts as an intermediary between the customer and service providers, and its responsibility is limited to facilitating the booking and confirmation process.",
            "Displayed prices are estimated and subject to modification by the service provider until the booking is confirmed and official documents (ticket/hotel voucher) are issued.",
            "The customer has no right to claim refunds or object to the policies in place after completing the booking except according to the specific terms for each service.",
          ],
        },
        {
          id: 3,
          title: "Airline Booking Terms",
          icon: <FaPlane size={28} />,
          points: [
            "All flight tickets are subject to the policies and conditions of the operating airline (air carrier).",
            "Refunds or modifications are subject to the airline's explicit policy and may incur administrative fees and fare differences. Similarly, non-refundable or non-modification tickets are subject to the airline's terms and conditions.",
            "In case of customer no-show at the scheduled departure time, all penalties and conditions of the operating airline will be applied.",
            "The customer is fully responsible for matching the name on the ticket exactly with the official travel document (passport or national ID).",
            "The Company is not responsible for any changes in flight schedules, delays, cancellations, changes in departure or arrival times, or loss/damage of baggage.",
            "Full responsibility for fulfilling travel requirements, including necessary visas, passport validity, medical checks, and entry documents to destination countries, rests solely with the customer.",
          ],
        },
        {
          id: 4,
          title: "Hotel Booking Terms",
          icon: <FaHotel size={28} />,
          points: [
            "Cancellation and modification policies vary based on the specific hotel, room type, and rate basis chosen at booking. Some bookings are completely non-refundable after confirmation.",
            "Check-in and check-out times are subject to the policy of the respective hotel.",
            "Special requests (such as double/single bed requests, view preferences, or early check-in) are preference requests and not guaranteed. Their fulfillment depends on actual availability at the hotel at check-in time.",
          ],
        },
        {
          id: 5,
          title: "Tourism Trips and Packages",
          icon: <FaUmbrellaBeach size={28} />,
          points: [
            "Tour programs are subject to modification based on operational conditions, weather, or decisions by local authorities in the destination country, with the Company committed to maintaining the essence and level of the program.",
            "In case of trip cancellation due to force majeure beyond the Company's control, the refund policies of the main service providers (hotels, airlines, and ground services) will be applied.",
            "Any delay or non-compliance with the scheduled times within the tourist program resulting from the customer is not the Company's financial or logistical responsibility.",
          ],
        },
        {
          id: 6,
          title: "Prices & Offers",
          icon: <FaTags size={28} />,
          points: [
            "Prices are subject to change based on supplier policies, taxes, or exchange rate fluctuations.",
            "Promotional offers (such as vouchers and coupons) are not redeemable for cash and are subject to the terms of use explained when announced.",
            "Full payment for services must be made before the booking confirmation deadline.",
            "The offer presented to the customer clarifies whether prices include or exclude Value Added Tax (VAT) and other local taxes.",
          ],
        },
        {
          id: 7,
          title: "Payment Policy",
          icon: <FaCreditCard size={28} />,
          points: [
            "100% of the booking value is paid upon confirmation using bank cards (Visa/Mastercard/Mada) or bank transfer.",
            "The Company does not provide any electronic wallets within the Site.",
            "The 'Book Now, Pay Later' feature is available only for specific trips.",
          ],
        },
        {
          id: 8,
          title: "Refund & Cancellation Policy",
          icon: <FaUndoAlt size={28} />,
          points: [
            "Cancellation possibility is subject to service providers' policies (airlines, hotels, and tour operators), and any fees they impose will be calculated.",
            "The Company's administrative service fees and commissions are non-refundable under all circumstances.",
            "The refund process may take between 14 to 45 working days, depending on bank procedures and final service providers.",
            "Refunds are made using the same payment method originally used by the customer.",
            "In the case of payment via bank cards, the return is made within 48 hours of working days, and the bank may take an additional 7 working days to process the amount.",
            "The customer must contact customer service via email info@altelal-walramal.sa to request a refund.",
          ],
        },
        {
          id: 9,
          title: "Limitation of Liability & Force Majeure",
          icon: <FaShieldAlt size={28} />,
          points: [
            "The Company bears no responsibility for damages or losses resulting from the use of the Site, including technical failures, data breaches, or service interruptions.",
            "The Company is not responsible for the content of external websites linked to the Site.",
            "The Company is not liable for any circumstances resulting from force majeure, including but not limited to: natural disasters, bad weather, government decisions, border or airport closures, epidemics, wars, or security disturbances.",
            "All disputes that may arise between the Company and the customer are subject to the regulations and laws of the Kingdom of Saudi Arabia, and the competent courts in the Kingdom are the judicial authority for dispute resolution.",
          ],
        },
        {
          id: 10,
          title: "Privacy & Confidentiality",
          icon: <FaUserLock size={28} />,
          points: [
            "The Company is keen to protect customer data using modern technologies, but does not guarantee 100% protection.",
            "The Site may use Cookies to improve the user experience, and the user can adjust browser settings to stop them.",
            "Customer's personal data is used exclusively for the purpose of completing and implementing the requested bookings and services.",
            "The Company is committed to protecting the confidentiality of customer data in accordance with data protection regulations in force in the Kingdom of Saudi Arabia.",
            "Data is not shared with third parties except to the extent necessary and essential for transaction implementation.",
          ],
        },
        {
          id: 11,
          title: "Acknowledgement & Acceptance",
          icon: <FaFileSignature size={28} />,
          points: [
            "By completing the booking process or paying any financial amount, the customer acknowledges their full and irrevocable acceptance of all the above terms, conditions, and policies.",
            "These terms represent the entire agreement between the customer and the Company and supersede any previous agreements or statements.",
            "If any provision of these terms becomes unenforceable, this does not affect the remaining provisions.",
          ],
        },
      ],
    },
    zh: {
      heroTitle: "条款与条件",
      heroSubtitle: "阿尔蒂拉尔·阿尔里马尔旅游公司",
      intro:
        '本网站是阿尔蒂拉尔·阿尔里马尔旅游公司（以下简称"本公司"）的官方网站。网站所有权、内容及运营管理责任均属于阿尔蒂拉尔·阿尔里马尔旅游公司。该公司根据沙特阿拉伯王国法律法规注册并运营，总部位于沙特阿拉伯王国。',
      warning:
        '在进行任何预订或交易前，请仔细阅读本条款与条件。完成预订或支付服务费用即表示客户明确且无条件接受以下所有条款。',

      sections: [
        {
          id: 1,
          title: "授权使用",
          icon: <FaUserCheck size={28} />,
          points: [
            "用户必须年满18周岁并具备完全法律行为能力。",
            "用户同意仅将本网站用于合法的个人目的。",
            "禁止使用本网站从事任何违反法规或公共道德的活动，包括发布有害内容、发送垃圾邮件、上传病毒或恶意软件、侵犯知识产权等。",
          ],
        },
        {
          id: 2,
          title: "总则与框架",
          icon: <FaBalanceScale size={28} />,
          points: [
            "所有预订和交易均受沙特阿拉伯王国现行法律法规约束，包括旅游部及民航总局的相关规定。",
            "本公司作为客户与服务提供商之间的中介，责任仅限于促进预订及确认流程。",
            "所示价格为预估价格，在确认预订并签发正式文件（机票/酒店凭证）前，服务提供商可对其进行修改。",
            "除各服务特定条款另有规定外，客户在完成预订后无权要求退款或反对所执行的条款。",
          ],
        },
        {
          id: 3,
          title: "机票预订条款",
          icon: <FaPlane size={28} />,
          points: [
            "所有机票均受承运航空公司（航空承运人）的政策和条件约束。",
            "退款或改签需严格遵守航空公司的明确政策，并可能产生行政费用及票价差额。同理，不可退款或不可改签的机票均适用该航空公司的条款与条件。",
            "若客户未在预定起飞时间出现（No-Show），将适用承运航空公司的全部罚则与条件。",
            "客户全权负责确保机票上的姓名与官方旅行证件（护照或国民身份证）完全一致。",
            "本公司对航班时刻变更、延误、取消、起降时间调整、行李丢失/损坏不承担任何责任。",
            "满足旅行要求（包括必要签证、护照有效期、体检、目的地国家入境文件）的全部责任完全由客户自行承担。",
          ],
        },
        {
          id: 4,
          title: "酒店预订条款",
          icon: <FaHotel size={28} />,
          points: [
            "取消和修改政策因具体酒店、房型和预订时选择的费率而异。部分预订在确认后完全不可退款。",
            "入住和退房时间受相关酒店政策的约束。",
            "特殊要求（如双床/大床、景观偏好、提前入住等）仅为偏好性请求，不保证满足。能否实现取决于入住时酒店的实际可用情况。",
          ],
        },
        {
          id: 5,
          title: "旅游行程与套餐",
          icon: <FaUmbrellaBeach size={28} />,
          points: [
            "旅游行程可能根据运营条件、天气或目的地国家地方当局的决定进行调整，本公司承诺保持行程的实质和标准。",
            "若因超出本公司控制的不可抗力因素取消行程，将适用主要服务提供商（酒店、航空公司和地接服务）的退款政策。",
            "因客户原因导致的任何延误或未能遵守行程安排的时间，本公司不承担财务或后勤责任。",
          ],
        },
        {
          id: 6,
          title: "价格与优惠",
          icon: <FaTags size={28} />,
          points: [
            "价格可能因供应商政策、税费或汇率波动而变化。",
            "促销优惠（如代金券、优惠券）不可兑换现金，并受公布时说明的使用条款约束。",
            "必须在预订确认截止日期前全额支付服务费用。",
            "向客户提供的报价将明确价格是否包含增值税及其他地方税费。",
          ],
        },
        {
          id: 7,
          title: "付款政策",
          icon: <FaCreditCard size={28} />,
          points: [
            "预订确认时需支付100%的预订费用，支付方式为银行卡（Visa/Mastercard/Mada）或银行转账。",
            "本公司不在网站内提供任何电子钱包。",
            "“先预订后付款”功能仅适用于特定行程。",
          ],
        },
        {
          id: 8,
          title: "退款与取消政策",
          icon: <FaUndoAlt size={28} />,
          points: [
            "取消的可能性取决于服务提供商（航空公司、酒店、旅游运营商）的政策，并将计算其施加的任何费用。",
            "本公司的行政服务费及佣金在任何情况下均不予退还。",
            "退款流程可能需要14至45个工作日，具体取决于银行程序及最终服务提供商。",
            "退款将使用客户最初使用的相同付款方式进行。",
            "若通过银行卡支付，退款将在48个工作小时内处理，银行可能需要额外7个工作日到账。",
            "客户须通过电子邮件 info@altelal-walramal.sa 联系客服申请退款。",
          ],
        },
        {
          id: 9,
          title: "责任限制与不可抗力",
          icon: <FaShieldAlt size={28} />,
          points: [
            "本公司对因使用本网站而造成的损害或损失不承担任何责任，包括技术故障、数据泄露或服务中断。",
            "本公司对与本网站链接的外部网站内容不承担责任。",
            "本公司对不可抗力情况造成的任何后果不承担责任，包括但不限于：自然灾害、恶劣天气、政府决定、边境或机场关闭、流行病、战争或安全动乱。",
            "本公司与客户之间可能产生的所有争议均受沙特阿拉伯王国法律法规管辖，王国主管法院为争议裁决的司法机构。",
          ],
        },
        {
          id: 10,
          title: "隐私与保密",
          icon: <FaUserLock size={28} />,
          points: [
            "本公司致力于使用现代技术保护客户数据，但不保证100%的安全性。",
            "本网站可能使用Cookie以提升用户体验，用户可通过调整浏览器设置禁用Cookie。",
            "客户的个人数据仅用于完成和执行所要求的预订及服务。",
            "本公司承诺根据沙特阿拉伯王国现行数据保护法规保护客户数据的机密性。",
            "除非为执行交易所必需，否则不会与第三方共享数据。",
          ],
        },
        {
          id: 11,
          title: "确认与接受",
          icon: <FaFileSignature size={28} />,
          points: [
            "通过完成预订流程或支付任何款项，客户确认其完全且不可撤销地接受上述所有条款、条件及政策。",
            "本条款构成客户与本公司之间的完整协议，并取代任何先前的协议或声明。",
            "若本条款任何规定不可执行，不影响其余规定的效力。",
          ],
        },
      ],
    },

  };

  // add a Chinese (zh) fallback that reuses English sections but provides Chinese strings
  content.zh = content.zh || {
    ...content.en,
    heroTitle: "条款与条件",
    heroSubtitle: "Tilal Al Rimal 公司的条款与条件",
    intro: "本网站为 Tilal Al Rimal 旅游公司的官方网站。在完成任何预订或交易前，请仔细阅读这些条款与条件。完成预订或支付服务费用即表示客户明确且无条件地接受以下所有条款。",
    warning: "请在完成任何预订或交易之前仔细阅读这些条款和条件。完成预订或付款即表示客户明确且无条件地接受以下所有条款。",
  };

  const t = content[lang] || content.ar;
  const isRTL = lang === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="terms-page">
      {/* Hero Header */}
      <section className="terms-hero">
        <div className="hero-overlay"></div>
        <div className="container position-relative z-2">
          <div className="text-center text-white">
            <div className="hero-icon mb-4">
              <FaGavel size={50} />
            </div>
            <h1 className="display-4 fw-bold mb-3 animate-fade-in">
              {t.heroTitle}
            </h1>
            <p className="lead animate-fade-in-delay">{t.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* Intro Content */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-card">
            <p className="lead text-center m-0">{t.intro}</p>
            <div className="warning-note mt-4">
              <FaExclamationTriangle className="me-2" />
              <strong>{t.warning}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Grid */}
      <section className="terms-content py-5">
        <div className="container">
          <div className="row g-4">
            {t.sections.map((section) => (
              <div key={section.id} className="col-lg-6">
                <div className="term-card">
                  <div className="term-header">
                    <div className="term-icon">{section.icon}</div>
                    <h3 className="term-title">{section.title}</h3>
                  </div>
                  <ul className="term-points">
                    {section.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .terms-page {
          background: #f8f9fa;
          font-family: "Tajawal", sans-serif;
          min-height: 100vh;
        }

        /* Hero Section */
        .terms-hero {
          position: relative;
          padding: 120px 0 80px;
          background-image: url("/bg.webp"),
            linear-gradient(135deg, #2c3e50 0%, #8a7779 100%);
          background-size: cover;
          background-position: center;
          margin-bottom: 50px;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .hero-icon {
          background: rgba(255, 255, 255, 0.2);
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        /* Animations */
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.3s both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Intro Card */
        .intro-section {
          margin-top: -60px;
          position: relative;
          z-index: 3;
          margin-bottom: 40px;
        }

        .intro-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          color: #5d6d7e;
          border-bottom: 4px solid #8a7779;
        }

        .warning-note {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          color: #856404;
          display: flex;
          align-items: flex-start;
        }

        /* Terms Cards */
        .term-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          height: 100%;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
        }

        .term-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
          border-color: #8a7779;
        }

        .term-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .term-icon {
          color: #8a7779;
          background: rgba(138, 119, 121, 0.1);
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .term-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .term-points {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .term-points li {
          position: relative;
          padding-inline-start: 20px;
          margin-bottom: 12px;
          color: #5d6d7e;
          line-height: 1.6;
        }

        .term-points li::before {
          content: "•";
          color: #8a7779;
          font-weight: bold;
          position: absolute;
          inset-inline-start: 0;
          font-size: 1.2em;
          top: -2px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .terms-hero {
            padding: 100px 0 60px;
          }
          .display-4 {
            font-size: 2.2rem;
          }
          .intro-card {
            padding: 25px;
          }
          .term-card {
            padding: 20px;
          }
          .term-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          .term-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
