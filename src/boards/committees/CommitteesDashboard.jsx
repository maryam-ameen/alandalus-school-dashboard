import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./CommitteesDashboard.css";
import logo from "../../assets/logo.png";

/* =========================================================
   بيانات اللجان
========================================================= */

const committees = [
  {
    id: 1,
    title: "اللجنة الإدارية",
    icon: "📋",
    description:
      "إقرار خطة المدرسة التشغيلية ، ومتابعة سير العملية التربوية والتعليمية ، وتشجيع أوجه الابداع والتميز المدرسي بما يعزز التحصيل الدراسي للطالب ويحقق رسالة المدرسة ، ومناقشة التحديات التي تواجه المدرسة واتخاذ التوصيات اللازمة بشأنها للارتقاء بمستوى التعليم والتعلم .",
  },
  {
    id: 2,
    title: "لجنة التوجيه والإرشاد",
    icon: "🧭",
    description:
      "التخطيط لبرامج التوجيه والإرشاد ومتابعة تنفيذها وتقويمها واقتراح البرامج التي تتناسب مع إمكانيات وحاجات المدرسة ، والنظر في قضايا الطلاب .",
  },
  {
    id: 3,
    title: "لجنة التحصيل الدراسي",
    icon: "📊",
    description:
      "ضمان تطبيق اختبارات التحصيل الدراسي بما يسهم في تجويد العمليات التربوية والتعليمية والتنظيمية في المدرسة ، والارتقاء بكفاءة الأداء التحصيلي ونواتج التعلم للمدرسة ، وتدقيق واستخراج النتائج والاجراءات والتعليميات المعتمدة.",
  },
  {
    id: 4,
    title: "لجنة الأمن والسلامة",
    icon: "🛡️",
    description:
      "أدارة ومتابعة عمليات الأمن والسلامة المدرسية وعمليات الإخلاء.",
  },
  {
    id: 5,
    title: "لجنة التميز",
    icon: "🏆",
    description:
      "اعداد الخطة التشغيلية للمدرسة وتشجيع أفضل الممارسات بين منسوبيها لضمان التميز المؤسسي والتخصصي بما يسهم في تجويد العمليات التربوية والتعليمية والتنظيمية في المدرسة ، والارتقاء بكفاءة الأداء المؤسسي.",
  },
];

/* =========================================================
   أقسام اللجنة
========================================================= */

const committeeSections = [
  {
    id: 1,
    icon: "📋",
    title: "الهدف وقواعد تشكيل اللجنة",
    description: "أهداف اللجنة والقواعد المنظمة لتشكيلها.",
  },
  {
    id: 2,
    icon: "📄",
    title: "قرار إداري بشأن تشكيل فريق عمل اللجنة",
    description: "قرار تشكيل فريق عمل اللجنة وفق المهام والمسؤوليات.",
  },
  {
    id: 3,
    icon: "🎯",
    title: "مهام اللجنة",
    description: "المهام والمسؤوليات الخاصة باللجنة.",
  },
  {
    id: 4,
    icon: "📅",
    title: "تنظيم اجتماعات اللجنة",
    description: "تنظيم ومتابعة اجتماعات اللجنة خلال العام الدراسي.",
  },
];

/* =========================================================
   بيانات اللجنة الإدارية
========================================================= */

const administrativeCommitteeData = {
  goals: [
    "إقرار خطة المدرسة التشغيلية، ومتابعة سير العملية التربوية والتعليمية.",
    "تشجيع أوجه الإبداع والتميز المدرسي بما يعزز التحصيل الدراسي للطالب ويحقق رسالة المدرسة.",
    "إقرار الأنشطة والفعاليات.",
    "مناقشة القضايا والظواهر السلوكية واتخاذ التوصيات اللازمة بشأنها للارتقاء بمستوى التعليم والتعلم.",
  ],

  formationRules: [
    "معلمة خبيرة على الأقل.",
    "أمينة متقدمة على الأقل في حال عدم توفر المعلمة الخبيرة.",
    "أو معلمات يتم اختيارهن وفق احتياجات وممارسات المدرسة.",
  ],

  tasks: [
    "مناقشة الخطة التشغيلية للمدرسة واعتمادها.",
    "مناقشة القضايا والموضوعات التي تحتاج إلى دراسة واتخاذ التوصيات المناسبة.",
    "متابعة تنفيذ الخطة التشغيلية والبرامج المرتبطة بها.",
    "متابعة سير العملية التعليمية والتربوية داخل المدرسة.",
    "مناقشة التحديات التي تواجه المدرسة ووضع الحلول المناسبة.",
    "متابعة مستوى التحصيل الدراسي ونواتج التعلم.",
  ],

  members: [
    { name: "", job: "مديرة المدرسة", role: "رئيسة" },
    { name: "", job: "وكيلة شؤون الطالبات", role: "عضوة" },
    { name: "", job: "وكيلة شؤون الطالبات", role: "عضوة" },
    { name: "", job: "الموجهة الطلابية", role: "عضوة" },
    { name: "", job: "رائدة النشاط", role: "عضوة" },
    { name: "", job: "معلمة", role: "عضوة" },
    { name: "", job: "معلمة", role: "عضوة" },
    { name: "", job: "معلمة", role: "عضوة" },
  ],
};

/* =========================================================
   بيانات لجنة التحصيل الدراسي
========================================================= */

const academicAchievementCommitteeData = {
  goals: [
    "ضمان تطبيق اختبارات التحصيل الدراسي بما يسهم في تجويد العمليات التربوية والتعليمية والتنظيمية في المدرسة.",
    "الارتقاء بكفاءة الأداء التحصيلي ونواتج التعلم للمدرسة.",
    "تدقيق واستخراج النتائج وفق اللوائح والإجراءات والتعليمات المعتمدة.",
  ],

  formationRules: [
    "المعلمات يتم اختيارهن من قبل مديرة المدرسة.",
    "تصدر مديرة المدرسة قرارًا بتشكيل اللجنة.",
  ],

  tasks: [
    "متابعة المستوى التحصيلي للطالبات بشكل دوري وتحليله، ودراسة نتائج اختبارات التعلم الدراسي للمسار من جميع الجوانب، وإعداد التقارير اللازمة، ورفعها لمديرة المدرسة متضمنة مع اللجنة الإدارية.",
    "تزويد معلمات المواد الدراسية بالتقرير المعد لتحليل نتائج التحصيل للاختبارات بمختلف أنواعها، والمتعلقة بتخصصهن موادهن، وتوصيات اللجنة بشأنها.",
    "مراجعة نتائج الاختبارات الوطنية الخاصة بالمدرسة وتقديم المقترحات لتعزيز نقاط القوة ومعالجة نقاط الضعف.",
    "اقتراح البرامج التعليمية والأنشطة الطلابية المناسبة لرفع مستوى التحصيل الدراسي للطالبات في خطة المدرسة، وقياس مدى فاعليتها بعد تنفيذها.",
    "تقديم الدعم لتهيئة التعليمية حول المفاهيم والأسس والآليات التي تتبعها الاختبارات الوطنية والدولية، وتوفير جميع متطلبات الطالبات قبل تنفيذ الاختبارات الوطنية والدولية.",
    "تشكيل فرق العمل / اللجان المقترحة للاختبارات التحصيلية والنهائية وتحديد مهام ومسؤوليات جميع أعضائها وفقًا للإجراءات المتبعة.",
    "إعداد جداول الاختبارات التحصيلية وسجلاتها والملفات المتعلقة بالاختبارات في المدرسة.",
    "استلام مفاتيح أوراق الأسئلة والإجابات الخاصة بها وحفظها في الأماكن الآمنة المخصصة لها.",
    "إعداد الكشوفات وأرقام الجلوس للطالبات وتسليمها للفرق الفرعية المسؤولة عن عملية تنظيم الاختبارات.",
    "توضيح التعليمات للتعامل مع الحالات الطارئة (مرضية، مخالفة الأنظمة والتعليمات...) أثناء الاختبارات وتهيئة الأدوات والمكان المناسب.",
    "الإشراف على سير الاختبارات والبرامج التنفيذية المتعلقة بها بمختلف أنواعها بالمدرسة ومتابعتها، والتأكد من مدى سلامتها.",
    "متابعة عمليات التصحيح والمراجعة للاختبارات وتدقيق النتائج في المدرسة، ومتابعة أعمال الفريق المعني بإخراج النتائج وتنظيمها وحفظها.",
    "تقديم المقترحات التطويرية لآلية الاختبار وتنظيمها للجهات المعنية، ومتابعة ومراجعة جميع التعديلات على آلية الاختبارات وتطبيقها.",
    "إعداد وتوثيق تقارير دورية عن أعمال اللجنة والمشكلات التي تواجهها ورفعها إلى مديرة المدرسة لاتخاذ الإجراء اللازم.",
    "اقتراح برامج معالجة التأخر الدراسي واعتماد الحصص الإضافية لها وتكليف المعلمات وأولياء الأمور ببرنامجها.",
    "اقتراح البرامج والأنشطة اللاصفية التي تدعم نواتج التعليم والتعلم.",
    "قياس رضا أولياء الأمور عن التحصيل الدراسي ونتائجه، وإشراكهم في معالجات ضعف التحصيل الدراسي لبناتهم.",
  ],
};

/* =========================================================
   بيانات لجنة الأمن والسلامة
========================================================= */

const safetyCommitteeData = {
  goals: [
    "إدارة ومتابعة عمليات الأمن والسلامة المدرسية وعمليات الإخلاء.",
  ],

  formationRules: [
    "يتم رفع الفريق لمديرة اللجنة.",
    "توزيع الأدوار والمهام بين أعضاء اللجنة بما يحقق متطلبات الأمن والسلامة.",
  ],

  tasks: [
    "تنفيذ البرامج والأنشطة المعتمدة المتعلقة بالأمن والسلامة.",
    "تقويم وضع الأمن والسلامة في المدرسة، وفق الاستمارات والأدوات المعدة لذلك.",
    "تكليف أحد إداري المدرسة بالعمل على متابعة الأمن والسلامة المدرسية وفق الضوابط المعتمدة لذلك، وتكليفه بالمهام المرتبطة بعمليات الأمن والسلامة المدرسية ذات العلاقة.",
    "الرفع بتقارير الأمن والسلامة وإدارة المخاطر إلى اللجنة الإدارية خلال الفترة المخصصة عليها في قرار التشكيل، والرفع الفوري بأي مهددات للأمن والسلامة المدرسية تجاه اللجنة الإدارية.",
    "التنسيق والتعاون مع الجهات المختصة لعقد برامج وورش عمل لمنسوبي المدرسة فيما يخص الأمن والسلامة، والتواصل مع إدارة الأمن والسلامة بإدارة التعليم فيما يخص متطلبات الأمن والسلامة المدرسية.",
    "التأكد من تطبيق قواعد السلامة المكفولة بحماية منسوبي المدرسة خلال تنفيذ الأعمال داخل المدرسة، وبما يتفق مع اللوائح والأنظمة والأدلة التفصيلية للأمن والسلامة والعمليات المتعلقة بها.",
    "التأكد من مراعاة احتياجات الأمن والسلامة للطلاب ذوي الإعاقة في المدارس التي فيها برامج التربية الخاصة.",
  ],
};

/* =========================================================
   بيانات لجنة التوجيه والإرشاد
========================================================= */

const guidanceCommitteeData = {
  goals: [
    "التخطيط لبرامج التوجيه والإرشاد.",
    "متابعة تنفيذ وتقويم البرامج.",
    "اقتراح البرامج التي تتناسب مع إمكانيات وحاجات المدرسة.",
    "النظر في قضايا الطالبات.",
  ],

  formationRules: [
    "تشارك في اجتماع اللجنة وفقًا لمرئيات عضوات اللجنة من يستدعي حضورها دون التصويت على قرارات اللجنة، مثل: وكيلة شؤون الطالبات، طالبة، رائدة النشاط، الموهوبات، معلمة المادة، معلمة الصف.",
  ],

  tasks: [
    "دراسة أوضاع الطالبات المخالفات للأنظمة والتعليمات المدرسية، واتخاذ الإجراءات المناسبة.",
    "دراسة أعذار الطالبات الغائبات عن الاختبارات الفصلية والتحريرية، وإقرار مدى وجاهة العذر المقدم.",
    "إعداد التوصيات المناسبة بشأن حالات الطالبات اللاتي لم يتمكن من تحقيق الحد الأدنى من المهارات، والتوصية بتحويلهن إلى البرامج العلاجية.",
    "متابعة نواتج وأعمال مجالس الحوار الطلابية وتقديم الدعم بما يتوافق مع التنظيمات والتعليمات المعتمدة.",
    "إعداد التقارير الفصلية عن أعمال التوجيه والإرشاد وأعمال اللجنة واعتمادها من مديرة المدرسة.",
    "دراسة حالات الطالبات المحتاجات إلى خدمات وبرامج التوجيه والإرشاد، ومتابعة تنفيذها.",
    "دراسة أوضاع الطالبات المتعثرات دراسيًا ووضع البرامج المناسبة لمساعدتهن.",
    "التنسيق مع الجهات ذات العلاقة داخل المدرسة وخارجها بما يخدم الطالبات ويعالج احتياجاتهن.",
    "دراسة الشراكات مع مؤسسات المجتمع المحلي المحيط بالمدرسة، ومتابعة نتائجها والرفع بها لمديرة المدرسة.",
    "متابعة تنفيذ البرامج الإرشادية والأسابيع الإرشادية وتفعيلها بعد اعتمادها.",
    "الإشراف على تنظيم وتفعيل البرامج الوقائية والعلاجية والإرشادية للطالبات.",
    "التوصية بالإجراءات المناسبة للحالات الطلابية التي تحتاج إلى تدخل من الجهات المختصة.",
  ],
};

/* =========================================================
   بيانات لجنة التميز
========================================================= */

const excellenceCommitteeData = {
  goals: [
    "إعداد الخطة التشغيلية للمدرسة.",
    "تشجيع أفضل الممارسات بين منسوبيها لضمان التميز المؤسسي والتخصصي بما يسهم في تجويد العمليات التربوية والتعليمية والتنظيمية في المدرسة.",
    "الارتقاء بكفاءة الأداء المؤسسي.",
  ],

  formationRules: [
    "تختار مديرة المدرسة العضوات إما:",
    "معلمات خبيرات.",
    "أو معلمات متقدمات في حال عدم توفر الخبيرات.",
    "أو معلمات ممارسات في حال عدم توفر المعلمات الخبيرات والمتقدمات.",
  ],

  tasks: [
    "إعداد الخطة التشغيلية للمدرسة، وربطها بمؤشرات القياس المؤسسي والتخصصي المعتمدة لها.",
    "تشجيع المعلمين على تبادل أفضل الممارسات لرفع المستوى التحصيلي لدى الطلاب، واقتراح التوصيات اللازمة في تطوير طرائق التدريس وأساليب التقويم.",
    "إعداد استطلاعات قياس رضا المستفيدين من خدمات المدرسة، باستثناء استطلاعات التحصيل الدراسي للطلاب، وتحليل النتائج ورفع التوصيات التحسينية.",
    "رصد اتجاهات الطلاب نحو المدرسة وتقديم التوصيات اللازمة لمدير المدرسة.",
    "تقديم الاقتراحات والدعم نحو تحول المدرسة إلى مؤسسة متعلمة ذاتيًا.",
    "دراسة الملاحظات على برامج التعليم والتعلم، وتقديم التوصيات اللازمة بشأنها.",
    "دراسة بيئة المدرسة وتقديم المقترحات التطويرية اللازمة بشأنها.",
    "دراسة الصعوبات والتحديات التي تواجه سير العمل في المدرسة وتقديم التوصيات.",
    "المساهمة في نشر ثقافة التميز في المدرسة، وفي دعم وتشجيع المتميزين من منسوبي المدرسة من هيئة تعليمية وإدارية وطلابية.",
    "إعداد وتطوير معايير جوائز التميز والحوافز لمنسوبي المدرسة.",
    "دراسة تسمية بعض مرافق المدرسة بأسماء أصحاب الإنجازات من منسوبيها.",
    "الإشراف على إدارة عمليات التقويم الذاتي والتدقيق الداخلي في المدرسة والعمل على تحسينها وفق معايير التقويم والاعتماد المعتمدة.",
    "دراسة تقارير تقويم الأداء المؤسسي وتحليلها واستثمار نتائجها في التخطيط لتطوير الأداء.",
    "ترشيح منسوبي المدرسة لجوائز التميز على المستوى المحلي والإقليمي والعالمي والرفع لمدير المدرسة لعرض ما يلزم على اللجنة الإدارية.",
  ],
};

/* =========================================================
   الاجتماعات الافتراضية
========================================================= */

const createDefaultMeetings = (committeeId) => [
  {
    id: `${committeeId}-1`,
    title: "الاجتماع الشهري الأول",
    date: "",
    day: "",
    place: "",
    status: "لم يُنفذ",
    agenda: "",
    discussion: "",
    decisions: "",
    recommendations: "",
    attendees: [],
  },
  {
    id: `${committeeId}-2`,
    title: "الاجتماع الشهري الثاني",
    date: "",
    day: "",
    place: "",
    status: "لم يُنفذ",
    agenda: "",
    discussion: "",
    decisions: "",
    recommendations: "",
    attendees: [],
  },
  {
    id: `${committeeId}-3`,
    title: "الاجتماع الشهري الثالث",
    date: "",
    day: "",
    place: "",
    status: "لم يُنفذ",
    agenda: "",
    discussion: "",
    decisions: "",
    recommendations: "",
    attendees: [],
  },
];

/* =========================================================
   التخزين
========================================================= */

const LEGACY_STORAGE_KEY =
  "alandalus-committee-meetings-v2";

const getMeetingsStorageKey = (committeeId) =>
  `alandalus-committee-meetings-v2-${committeeId}`;

const getDecisionStorageKey = (committeeId) =>
  `alandalus-committee-decision-v2-${committeeId}`;

/* =========================================================
   القرار الإداري
========================================================= */

const createDefaultDecision = (committee) => {
  const isAdministrative = committee.id === 1;

  const defaultMembers = isAdministrative
    ? administrativeCommitteeData.members.map(
        (member) => ({
          name: member.name || "",
          job: member.job || "",
          role: member.role || "عضوة",
          signature: "",
        })
      )
    : [
        {
          name: "",
          job: "مديرة المدرسة",
          role: "رئيسة",
          signature: "",
        },
        {
          name: "",
          job: "وكيلة",
          role: "عضوة",
          signature: "",
        },
        {
          name: "",
          job: "وكيلة",
          role: "عضوة",
          signature: "",
        },
        {
          name: "",
          job: "موجهة طلابية",
          role: "عضوة",
          signature: "",
        },
        {
          name: "",
          job: "رائدة نشاط",
          role: "عضوة",
          signature: "",
        },
        {
          name: "",
          job: "معلمة",
          role: "عضوة",
          signature: "",
        },
        {
          name: "",
          job: "معلمة",
          role: "عضوة",
          signature: "",
        },
        {
          name: "",
          job: "معلمة",
          role: "عضوة",
          signature: "",
        },
      ];

  return {
    day: "",
    date: "",
    schoolYear: "1448 / 1449",
    members: defaultMembers,
  };
};

const loadCommitteeDecision = (committee) => {
  try {
    const saved = localStorage.getItem(
      getDecisionStorageKey(committee.id)
    );

    if (saved) {
      const parsed = JSON.parse(saved);
      const defaultDecision =
        createDefaultDecision(committee);

      return {
        ...defaultDecision,
        ...parsed,
        members:
          parsed.members?.length > 0
            ? parsed.members
            : defaultDecision.members,
      };
    }
  } catch (error) {
    console.error(
      "خطأ في تحميل القرار:",
      error
    );
  }

  return createDefaultDecision(committee);
};

/* =========================================================
   لوحة التوقيع
========================================================= */

function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  const canvasWidth = 240;
  const canvasHeight = 75;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (!value) return;

    const image = new Image();

    image.onload = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    image.src = value;
  }, [value]);

  const getPosition = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect =
      canvas.getBoundingClientRect();

    const touch =
      event.touches &&
      event.touches.length
        ? event.touches[0]
        : null;

    const clientX = touch
      ? touch.clientX
      : event.clientX;

    const clientY = touch
      ? touch.clientY
      : event.clientY;

    return {
      x:
        ((clientX - rect.left) /
          rect.width) *
        canvas.width,

      y:
        ((clientY - rect.top) /
          rect.height) *
        canvas.height,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const { x, y } =
      getPosition(event);

    drawingRef.current = true;

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#39246b";
  };

  const draw = (event) => {
    if (!drawingRef.current) return;

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const { x, y } =
      getPosition(event);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;

    drawingRef.current = false;

    const canvas = canvasRef.current;

    if (!canvas) return;

    onChange(
      canvas.toDataURL("image/png")
    );
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    onChange("");
  };

  return (
    <div className="committee-signature-box">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="committee-signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="committee-signature-line" />

      <button
        type="button"
        className="committee-clear-signature"
        onClick={clearSignature}
      >
        مسح
      </button>
    </div>
  );
}

/* =========================================================
   القرار الإداري
========================================================= */

function CommitteeDecisionSection({
  committee,
}) {
  const [decision, setDecision] =
    useState(() =>
      loadCommitteeDecision(committee)
    );

  const [savedMessage, setSavedMessage] =
    useState(false);

  useEffect(() => {
    setDecision(
      loadCommitteeDecision(committee)
    );

    setSavedMessage(false);
  }, [committee.id]);

  const handleDecisionChange = (
    field,
    value
  ) => {
    setDecision((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMemberChange = (
    index,
    field,
    value
  ) => {
    setDecision((prev) => {
      const members = [
        ...prev.members,
      ];

      members[index] = {
        ...members[index],
        [field]: value,
      };

      return {
        ...prev,
        members,
      };
    });
  };

  const addDecisionMember = () => {
    setDecision((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          name: "",
          job: "",
          role: "عضوة",
          signature: "",
        },
      ],
    }));
  };

  const removeDecisionMember = (
    index
  ) => {
    setDecision((prev) => ({
      ...prev,
      members: prev.members.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const saveDecision = () => {
    localStorage.setItem(
      getDecisionStorageKey(
        committee.id
      ),
      JSON.stringify(decision)
    );

    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  const printDecision = () => {
    localStorage.setItem(
      getDecisionStorageKey(
        committee.id
      ),
      JSON.stringify(decision)
    );

    window.print();
  };

  return (
    <section className="committee-content-card committee-decision-print-area">
      <div className="committee-content-card-title">
        <span>01</span>

        <div>
          <small>
            القرار الإداري
          </small>

          <h3>
            قرار إداري بشأن تشكيل فريق عمل اللجنة
          </h3>
        </div>
      </div>

      <div className="committee-decision-info">
        <label className="committee-decision-field">
          <span>اليوم</span>

          <input
            type="text"
            value={decision.day}
            onChange={(e) =>
              handleDecisionChange(
                "day",
                e.target.value
              )
            }
            placeholder="مثال: الأحد"
          />
        </label>

        <label className="committee-decision-field">
          <span>التاريخ</span>

          <input
            type="date"
            value={decision.date}
            onChange={(e) =>
              handleDecisionChange(
                "date",
                e.target.value
              )
            }
          />
        </label>

        <label className="committee-decision-field">
          <span>العام الدراسي</span>

          <input
            type="text"
            value={decision.schoolYear}
            onChange={(e) =>
              handleDecisionChange(
                "schoolYear",
                e.target.value
              )
            }
          />
        </label>
      </div>

      <p className="committee-decision-text">
        بشأن تشكيل فريق عمل{" "}
        <strong>
          {committee.title}
        </strong>{" "}
        وفق المهام والمسؤوليات المعتمدة بالمدرسة،
        وتحديد أعضاء اللجنة وأدوارهم خلال العام الدراسي.
      </p>

      <div className="committee-table-wrapper">
        <table className="committee-members-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الوصف الوظيفي</th>
              <th>العمل المكلف به</th>
              <th>التوقيع</th>
              <th className="no-print">
                حذف
              </th>
            </tr>
          </thead>

          <tbody>
            {decision.members.map(
              (member, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="اكتبي الاسم"
                      className="committee-member-input"
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={member.job}
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          "job",
                          e.target.value
                        )
                      }
                      className="committee-member-input"
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          "role",
                          e.target.value
                        )
                      }
                      className="committee-member-input"
                    />
                  </td>

                  <td>
                    <SignaturePad
                      value={
                        member.signature
                      }
                      onChange={(signature) =>
                        handleMemberChange(
                          index,
                          "signature",
                          signature
                        )
                      }
                    />
                  </td>

                  <td className="no-print">
                    <button
                      type="button"
                      className="committee-remove-member"
                      onClick={() =>
                        removeDecisionMember(
                          index
                        )
                      }
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="committee-add-member-area no-print">
        <button
          type="button"
          className="committee-add-member-button"
          onClick={addDecisionMember}
        >
          ＋ إضافة عضو
        </button>
      </div>

      <div className="committee-manager-signature">
        <span>
          تعتمد مديرة المدرسة
        </span>

        <strong>
          خيرية الخالدي
        </strong>
      </div>

      <div className="committee-decision-actions no-print">
        <button
          type="button"
          className="committee-save-decision"
          onClick={saveDecision}
        >
          💾 حفظ القرار
        </button>

        <button
          type="button"
          className="committee-print-button"
          onClick={printDecision}
        >
          🖨️ طباعة القرار
        </button>
      </div>

      {savedMessage && (
        <div className="committee-saved-message">
          تم حفظ بيانات القرار بنجاح ✓
        </div>
      )}
    </section>
  );
}

/* =========================================================
   المحضر
========================================================= */

const createDefaultAttendee = () => ({
  id:
    Date.now() +
    Math.random(),

  name: "",

  job: "",

  signature: "",
});

/* =========================================================
   المكوّن الرئيسي
========================================================= */

function CommitteesDashboard() {
  const [
    selectedCommittee,
    setSelectedCommittee,
  ] = useState(null);

  const [
    selectedSection,
    setSelectedSection,
  ] = useState(null);

  /*
    مهم جدًا:
    هذه الحالات موجودة مرة واحدة فقط.
    الاجتماعات تعتمد على اللجنة المختارة.
  */
  const [
    meetings,
    setMeetings,
  ] = useState([]);

  const [
    selectedMeeting,
    setSelectedMeeting,
  ] = useState(null);

  const [
    meetingForm,
    setMeetingForm,
  ] = useState(null);

  /* =======================================================
     تحميل اجتماعات اللجنة الحالية
  ======================================================= */

  useEffect(() => {
    if (!selectedCommittee) {
      setMeetings([]);
      setSelectedMeeting(null);
      setMeetingForm(null);
      return;
    }

    const committeeStorageKey =
      getMeetingsStorageKey(
        selectedCommittee.id
      );

    try {
      const saved =
        localStorage.getItem(
          committeeStorageKey
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMeetings(
            parsed.map(
              (meeting) => ({
                ...meeting,
                attendees:
                  Array.isArray(
                    meeting.attendees
                  )
                    ? meeting.attendees
                    : [],
              })
            )
          );
        } else {
          setMeetings(
            createDefaultMeetings(selectedCommittee.id).map(
              (meeting) => ({
                ...meeting,
                attendees: [],
              })
            )
          );
        }

        setSelectedMeeting(null);
        setMeetingForm(null);

        return;
      }

      /*
        ترحيل الاجتماعات القديمة:
        الاجتماعات القديمة يتم نقلها للجنة الإدارية فقط.
      */

      if (
        selectedCommittee.id === 1
      ) {
        const oldSaved =
          localStorage.getItem(
            LEGACY_STORAGE_KEY
          );

        if (oldSaved) {
          const parsed =
            JSON.parse(oldSaved);

          const migrated =
            Array.isArray(parsed)
              ? parsed.map(
                  (meeting) => ({
                    ...meeting,
                    attendees:
                      Array.isArray(
                        meeting.attendees
                      )
                        ? meeting.attendees
                        : [],
                  })
                )
              : createDefaultMeetings(selectedCommittee.id).map(
                  (meeting) => ({
                    ...meeting,
                    attendees: [],
                  })
                );

          setMeetings(migrated);

          localStorage.setItem(
            committeeStorageKey,
            JSON.stringify(migrated)
          );

          setSelectedMeeting(null);
          setMeetingForm(null);

          return;
        }
      }

      /*
        كل لجنة أخرى تحصل على اجتماعاتها الخاصة.
        نستخدم نسخة جديدة حتى لا تتشارك اللجان نفس البيانات.
      */

      const freshMeetings =
        createDefaultMeetings(selectedCommittee.id).map(
          (meeting) => ({
            ...meeting,
            attendees: [],
          })
        );

      setMeetings(
        freshMeetings
      );

      setSelectedMeeting(null);
      setMeetingForm(null);

    } catch (error) {
      console.error(
        "خطأ في تحميل اجتماعات اللجنة:",
        error
      );

      const freshMeetings =
        createDefaultMeetings(selectedCommittee.id).map(
          (meeting) => ({
            ...meeting,
            attendees: [],
          })
        );

      setMeetings(
        freshMeetings
      );

      setSelectedMeeting(null);
      setMeetingForm(null);
    }
  }, [selectedCommittee]);

  /* =======================================================
     حفظ اجتماعات اللجنة الحالية
  ======================================================= */

  useEffect(() => {
    if (!selectedCommittee) return;

    localStorage.setItem(
      getMeetingsStorageKey(
        selectedCommittee.id
      ),
      JSON.stringify(meetings)
    );
  }, [
    meetings,
    selectedCommittee,
  ]);

  /* =======================================================
     مؤشر الاجتماعات
  ======================================================= */

  const completedMeetings =
    useMemo(() => {
      return meetings.filter(
        (meeting) =>
          meeting.status ===
          "منفذ"
      ).length;
    }, [meetings]);

  /* =======================================================
     بيانات اللجنة الحالية
  ======================================================= */

  const currentCommitteeData =
    selectedCommittee?.id === 2
      ? guidanceCommitteeData
      : selectedCommittee?.id === 3
      ? academicAchievementCommitteeData
      : selectedCommittee?.id === 4
      ? safetyCommitteeData
      : selectedCommittee?.id === 5
      ? excellenceCommitteeData
      : administrativeCommitteeData;

  /* =======================================================
     فتح قسم
  ======================================================= */

  const openSection = (
    section
  ) => {
    setSelectedSection(
      section
    );

    setSelectedMeeting(
      null
    );

    setMeetingForm(
      null
    );
  };

  /* =======================================================
     العودة
  ======================================================= */

  const closeSection = () => {
    setSelectedSection(
      null
    );

    setSelectedMeeting(
      null
    );

    setMeetingForm(
      null
    );
  };

  /* =======================================================
     فتح اجتماع
  ======================================================= */

  const openMeeting = (
    meeting
  ) => {
    setSelectedMeeting(
      meeting
    );

    setMeetingForm({
      ...meeting,
      attendees:
        meeting.attendees || [],
    });
  };

  /* =======================================================
     تغيير بيانات الاجتماع
  ======================================================= */

  const handleMeetingChange = (
    field,
    value
  ) => {
    setMeetingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =======================================================
     تغيير بيانات حاضر
  ======================================================= */

  const handleAttendeeChange = (
    attendeeId,
    field,
    value
  ) => {
    setMeetingForm((prev) => ({
      ...prev,

      attendees:
        prev.attendees.map(
          (attendee) =>
            attendee.id ===
            attendeeId
              ? {
                  ...attendee,
                  [field]:
                    value,
                }
              : attendee
        ),
    }));
  };

  /* =======================================================
     إضافة حاضر
  ======================================================= */

  const addAttendee = () => {
    setMeetingForm((prev) => ({
      ...prev,

      attendees: [
        ...(prev.attendees || []),
        createDefaultAttendee(),
      ],
    }));
  };

  /* =======================================================
     حذف حاضر
  ======================================================= */

  const deleteAttendee = (
    attendeeId
  ) => {
    setMeetingForm((prev) => ({
      ...prev,

      attendees:
        prev.attendees.filter(
          (attendee) =>
            attendee.id !==
            attendeeId
        ),
    }));
  };

  /* =======================================================
     حفظ الاجتماع
  ======================================================= */

  const saveMeeting = () => {
    if (!meetingForm) return;

    const updatedMeeting = {
      ...meetingForm,
      attendees:
        meetingForm.attendees || [],
    };

    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id ===
        updatedMeeting.id
          ? updatedMeeting
          : meeting
      )
    );

    setSelectedMeeting(
      updatedMeeting
    );

    alert(
      "تم حفظ محضر الاجتماع بنجاح ✓"
    );
  };

  /* =======================================================
     إضافة اجتماع
  ======================================================= */

  const addMeeting = () => {
    const newId =
      meetings.length > 0
        ? Math.max(
            ...meetings.map(
              (m) => m.id
            )
          ) + 1
        : 1;

    const newMeeting = {
      id: newId,

      title:
        `الاجتماع رقم ${newId}`,

      date: "",

      day: "",

      place: "",

      status:
        "لم يُنفذ",

      agenda: "",

      discussion: "",

      decisions: "",

      recommendations: "",

      attendees: [],
    };

    setMeetings((prev) => [
      ...prev,
      newMeeting,
    ]);

    setSelectedMeeting(
      newMeeting
    );

    setMeetingForm({
      ...newMeeting,
    });
  };

  /* =======================================================
     حذف اجتماع
  ======================================================= */

  const deleteMeeting = (
    id
  ) => {
    const confirmed =
      window.confirm(
        "هل أنتِ متأكدة من حذف هذا الاجتماع؟"
      );

    if (!confirmed) return;

    setMeetings((prev) =>
      prev.filter(
        (meeting) =>
          meeting.id !== id
      )
    );

    setSelectedMeeting(
      null
    );

    setMeetingForm(
      null
    );
  };

  /* =======================================================
     طباعة المحضر
  ======================================================= */

  const printMeeting = () => {
    if (!meetingForm) return;

    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id ===
        meetingForm.id
          ? meetingForm
          : meeting
      )
    );

    setTimeout(() => {
      window.print();
    }, 100);
  };

  /* =========================================================
     صفحة اللجنة
  ========================================================= */

  if (selectedCommittee) {
    return (
      <div
        className="committee-page"
        dir="rtl"
      >
        <header className="committee-inner-header">
          <div className="committee-inner-header-content">
            <div className="committee-school-brand">
              <img
                src={logo}
                alt="شعار مدارس الأندلس"
                className="committee-school-logo"
              />

              <div className="committee-school-info">
                <span>
                  متوسطة وثانوية الأندلس بالطائف - بنات
                </span>

                <small>
                  ملف مهام واختصاصات اللجان وفرق العمل المدرسية
                </small>
              </div>
            </div>

            <div className="committee-inner-title">
              <h1>
                سجل اللجان وفرق العمل المدرسية
              </h1>
            </div>

            <button
              className="committee-back-button"
              onClick={() => {
                setSelectedCommittee(
                  null
                );

                setSelectedSection(
                  null
                );

                setSelectedMeeting(
                  null
                );

                setMeetingForm(
                  null
                );
              }}
              type="button"
            >
              <span>←</span>
              العودة إلى ملف اللجان وفرق العمل
            </button>
          </div>
        </header>

        <div className="committee-page-container">
          <div className="committee-breadcrumb">
            <span>
              اللوحات الرئيسية
            </span>

            <b>/</b>

            <span>
              ملف اللجان وفرق العمل
            </span>

            <b>/</b>

            <strong>
              {selectedCommittee.title}
            </strong>
          </div>

          {selectedSection ? (
            <section className="committee-section-page">
              <div className="committee-section-page-header">
                <button
                  type="button"
                  className="committee-section-return"
                  onClick={
                    closeSection
                  }
                >
                  <span>→</span>
                  العودة لأقسام اللجنة
                </button>

                <div>
                  <span>
                    {selectedCommittee.title}
                  </span>

                  <h2>
                    {selectedSection.title}
                  </h2>

                  <p>
                    {selectedSection.description}
                  </p>
                </div>
              </div>

              {/* =================================================
                  الأهداف
              ================================================= */}

              {selectedSection.id ===
                1 && (
                <div className="committee-content-stack">
                  <section className="committee-content-card">
                    <div className="committee-content-card-title">
                      <span>01</span>

                      <div>
                        <small>
                          أهداف اللجنة
                        </small>

                        <h3>
                          أهداف اللجنة
                        </h3>
                      </div>
                    </div>

                    <div className="committee-goals-grid">
                      {currentCommitteeData.goals.map(
                        (
                          goal,
                          index
                        ) => (
                          <div
                            className="committee-goal-item"
                            key={index}
                          >
                            <span>
                              {index +
                                1}
                            </span>

                            <p>
                              {goal}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </section>

                  <section className="committee-content-card">
                    <div className="committee-content-card-title">
                      <span>02</span>

                      <div>
                        <small>
                          التشكيل
                        </small>

                        <h3>
                          قواعد تشكيل اللجنة
                        </h3>
                      </div>
                    </div>

                    <div className="committee-rules-list">
                      {currentCommitteeData.formationRules.map(
                        (
                          rule,
                          index
                        ) => (
                          <div
                            key={index}
                            className="committee-rule-item"
                          >
                            <span>
                              {index +
                                1}
                            </span>

                            <p>
                              {rule}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </section>
                </div>
              )}

              {/* =================================================
                  القرار
              ================================================= */}

              {selectedSection.id ===
                2 && (
                <CommitteeDecisionSection
                  key={
                    selectedCommittee.id
                  }
                  committee={
                    selectedCommittee
                  }
                />
              )}

              {/* =================================================
                  المهام
              ================================================= */}

              {selectedSection.id ===
                3 && (
                <section className="committee-content-card">
                  <div className="committee-content-card-title">
                    <span>01</span>

                    <div>
                      <small>
                        المسؤوليات
                      </small>

                      <h3>
                        مهام اللجنة
                      </h3>
                    </div>
                  </div>

                  <div className="committee-tasks-list">
                    {currentCommitteeData.tasks.map(
                      (
                        task,
                        index
                      ) => (
                        <div
                          key={index}
                          className="committee-task-item"
                        >
                          <span>
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <p>
                            {task}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

              {/* =================================================
                  الاجتماعات والمحاضر
              ================================================= */}

              {selectedSection.id ===
                4 && (
                <section className="committee-meetings-page">
                  <div className="committee-meetings-top">
                    <div>
                      <span>
                        متابعة الاجتماعات
                      </span>

                      <h2>
                        اجتماعات اللجنة ومحاضرها
                      </h2>

                      <p>
                        تسجيل اجتماعات اللجنة وتوثيق الحضور
                        والتوقيعات والقرارات والتوصيات.
                      </p>
                    </div>

                    <div className="committee-meetings-counter">
                      <strong>
                        {completedMeetings}
                      </strong>

                      <span>
                        من {meetings.length} اجتماع
                      </span>
                    </div>
                  </div>

                  <div className="committee-meetings-actions">
                    <button
                      type="button"
                      className="committee-add-meeting"
                      onClick={
                        addMeeting
                      }
                    >
                      <span>
                        ＋
                      </span>

                      إضافة اجتماع
                    </button>
                  </div>

                  <div className="committee-meetings-grid">
                    {meetings.map(
                      (
                        meeting
                      ) => (
                        <article
                          key={
                            meeting.id
                          }
                          className={`committee-meeting-card ${
                            meeting.status ===
                            "منفذ"
                              ? "completed"
                              : ""
                          }`}
                        >
                          <div className="committee-meeting-card-top">
                            <span>
                              {String(
                                meeting.id
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <b
                              className={
                                meeting.status ===
                                "منفذ"
                                  ? "status-done"
                                  : "status-pending"
                              }
                            >
                              {
                                meeting.status
                              }
                            </b>
                          </div>

                          <h3>
                            {
                              meeting.title
                            }
                          </h3>

                          <div className="committee-meeting-meta">
                            <span>
                              📅{" "}
                              {meeting.date ||
                                "لم يحدد التاريخ"}
                            </span>

                            <span>
                              📍{" "}
                              {meeting.place ||
                                "لم يحدد المكان"}
                            </span>

                            <span>
                              👥{" "}
                              {
                                meeting.attendees
                                  ?.length || 0
                              }{" "}
                              حاضر
                            </span>
                          </div>

                          <button
                            type="button"
                            className="committee-open-meeting"
                            onClick={() =>
                              openMeeting(
                                meeting
                              )
                            }
                          >
                            فتح المحضر

                            <span>
                              ←
                            </span>
                          </button>
                        </article>
                      )
                    )}
                  </div>

                  {/* =================================================
                      محرر المحضر
                  ================================================= */}

                  {selectedMeeting &&
                    meetingForm && (
                      <div className="committee-meeting-editor">
                        <div className="committee-editor-header">
                          <div>
                            <span>
                              محضر اجتماع اللجنة
                            </span>

                            <h3>
                              {
                                meetingForm.title
                              }
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMeeting(
                                null
                              );

                              setMeetingForm(
                                null
                              );
                            }}
                          >
                            ×
                          </button>
                        </div>

                        {/* بيانات الاجتماع */}

                        <div className="committee-meeting-form-section">
                          <div className="committee-form-section-title">
                            <span>
                              01
                            </span>

                            <div>
                              <small>
                                البيانات الأساسية
                              </small>

                              <h4>
                                بيانات الاجتماع
                              </h4>
                            </div>
                          </div>

                          <div className="committee-editor-grid">
                            <label>
                              <span>
                                اسم الاجتماع
                              </span>

                              <input
                                value={
                                  meetingForm.title
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "title",
                                    e.target
                                      .value
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                التاريخ
                              </span>

                              <input
                                type="date"
                                value={
                                  meetingForm.date
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "date",
                                    e.target
                                      .value
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                اليوم
                              </span>

                              <input
                                value={
                                  meetingForm.day
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "day",
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="مثال: الأحد"
                              />
                            </label>

                            <label>
                              <span>
                                مكان الاجتماع
                              </span>

                              <input
                                value={
                                  meetingForm.place
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "place",
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="مثال: قاعة الاجتماعات"
                              />
                            </label>

                            <label>
                              <span>
                                حالة الاجتماع
                              </span>

                              <select
                                value={
                                  meetingForm.status
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "status",
                                    e.target
                                      .value
                                  )
                                }
                              >
                                <option value="لم يُنفذ">
                                  لم يُنفذ
                                </option>

                                <option value="منفذ">
                                  منفذ
                                </option>
                              </select>
                            </label>
                          </div>
                        </div>

                        {/* محاور الاجتماع */}

                        <div className="committee-meeting-form-section">
                          <div className="committee-form-section-title">
                            <span>
                              02
                            </span>

                            <div>
                              <small>
                                محاور المحضر
                              </small>

                              <h4>
                                تفاصيل الاجتماع
                              </h4>
                            </div>
                          </div>

                          <div className="committee-editor-full">
                            <label>
                              <span>
                                جدول الأعمال
                              </span>

                              <textarea
                                value={
                                  meetingForm.agenda
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "agenda",
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="اكتبي جدول أعمال الاجتماع..."
                              />
                            </label>

                            <label>
                              <span>
                                أبرز ما تمت مناقشته
                              </span>

                              <textarea
                                value={
                                  meetingForm.discussion
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "discussion",
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="اكتبي أبرز الموضوعات والمناقشات..."
                              />
                            </label>

                            <label>
                              <span>
                                القرارات
                              </span>

                              <textarea
                                value={
                                  meetingForm.decisions
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "decisions",
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="اكتبي القرارات..."
                              />
                            </label>

                            <label>
                              <span>
                                التوصيات
                              </span>

                              <textarea
                                value={
                                  meetingForm.recommendations
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMeetingChange(
                                    "recommendations",
                                    e.target
                                      .value
                                  )
                                }
                                placeholder="اكتبي التوصيات..."
                              />
                            </label>
                          </div>
                        </div>

                        {/* الحضور */}

                        <div className="committee-meeting-form-section committee-attendance-section">
                          <div className="committee-form-section-title">
                            <span>
                              03
                            </span>

                            <div>
                              <small>
                                التوثيق
                              </small>

                              <h4>
                                سجل الحضور والتوقيع
                              </h4>
                            </div>

                            <button
                              type="button"
                              className="committee-add-attendee-button no-print"
                              onClick={
                                addAttendee
                              }
                            >
                              ＋ إضافة حاضر
                            </button>
                          </div>

                          {meetingForm.attendees
                            ?.length >
                          0 ? (
                            <div className="committee-attendance-table-wrapper">
                              <table className="committee-attendance-table">
                                <thead>
                                  <tr>
                                    <th>
                                      #
                                    </th>

                                    <th>
                                      اسم الحاضر
                                    </th>

                                    <th>
                                      المسمى الوظيفي
                                    </th>

                                    <th>
                                      التوقيع
                                    </th>

                                    <th className="no-print">
                                      إجراء
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {meetingForm.attendees.map(
                                    (
                                      attendee,
                                      index
                                    ) => (
                                      <tr
                                        key={
                                          attendee.id
                                        }
                                      >
                                        <td>
                                          {index +
                                            1}
                                        </td>

                                        <td>
                                          <input
                                            type="text"
                                            value={
                                              attendee.name
                                            }
                                            onChange={(
                                              e
                                            ) =>
                                              handleAttendeeChange(
                                                attendee.id,
                                                "name",
                                                e.target
                                                  .value
                                              )
                                            }
                                            placeholder="اسم الحاضر"
                                          />
                                        </td>

                                        <td>
                                          <input
                                            type="text"
                                            value={
                                              attendee.job
                                            }
                                            onChange={(
                                              e
                                            ) =>
                                              handleAttendeeChange(
                                                attendee.id,
                                                "job",
                                                e.target
                                                  .value
                                              )
                                            }
                                            placeholder="المسمى الوظيفي"
                                          />
                                        </td>

                                        <td>
                                          <SignaturePad
                                            value={
                                              attendee.signature
                                            }
                                            onChange={(
                                              signature
                                            ) =>
                                              handleAttendeeChange(
                                                attendee.id,
                                                "signature",
                                                signature
                                              )
                                            }
                                          />
                                        </td>

                                        <td className="no-print">
                                          <button
                                            type="button"
                                            className="committee-delete-attendee"
                                            onClick={() =>
                                              deleteAttendee(
                                                attendee.id
                                              )
                                            }
                                          >
                                            🗑️ حذف
                                          </button>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="committee-no-attendees">
                              <div>
                                👥
                              </div>

                              <strong>
                                لم تتم إضافة الحضور بعد
                              </strong>

                              <p>
                                اضغطي على «إضافة حاضر» لإضافة أسماء الحاضرين
                                وتوقيعاتهم.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* اعتماد المحضر */}

                        <div className="committee-minutes-footer">
                          <div>
                            <span>
                              رئيسة اللجنة
                            </span>

                            <strong>
                              مديرة المدرسة
                            </strong>
                          </div>

                          <div>
                            <span>
                              الاسم
                            </span>

                            <strong>
                              خيرية الخالدي
                            </strong>
                          </div>

                          <div>
                            <span>
                              التوقيع
                            </span>

                            <div className="minutes-sign-line" />
                          </div>
                        </div>

                        {/* أزرار */}

                        <div className="committee-editor-actions no-print">
                          <button
                            type="button"
                            className="committee-save-meeting"
                            onClick={
                              saveMeeting
                            }
                          >
                            💾 حفظ المحضر
                          </button>

                          <button
                            type="button"
                            className="committee-print-meeting"
                            onClick={
                              printMeeting
                            }
                          >
                            🖨️ طباعة محضر الاجتماع
                          </button>

                          <button
                            type="button"
                            className="committee-delete-meeting"
                            onClick={() =>
                              deleteMeeting(
                                meetingForm.id
                              )
                            }
                          >
                            🗑️ حذف الاجتماع
                          </button>
                        </div>
                      </div>
                    )}
                </section>
              )}
            </section>
          ) : (
            <>
              <section className="committee-inner-hero">
                <div className="committee-inner-hero-icon">
                  {
                    selectedCommittee.icon
                  }
                </div>

                <div className="committee-inner-hero-content">
                  <span className="committee-inner-label">
                    اللجنة المدرسية
                  </span>

                  <h2>
                    {
                      selectedCommittee.title
                    }
                  </h2>

                  <p>
                    {
                      selectedCommittee.description
                    }
                  </p>
                </div>
              </section>

              <div className="committee-sections-heading">
                <div>
                  <span>
                    ملف اللجنة
                  </span>

                  <h2>
                    أقسام ملف اللجنة
                  </h2>
                </div>

                <div className="committee-sections-count">
                  {
                    committeeSections.length
                  }

                  <small>
                    أقسام
                  </small>
                </div>
              </div>

              <section className="committee-sections-list">
                {committeeSections.map(
                  (
                    section
                  ) => (
                    <button
                      key={
                        section.id
                      }
                      className="committee-section-card"
                      type="button"
                      onClick={() =>
                        openSection(
                          section
                        )
                      }
                    >
                      <div className="committee-section-number">
                        {String(
                          section.id
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="committee-section-icon">
                        {
                          section.icon
                        }
                      </div>

                      <div className="committee-section-text">
                        <span>
                          القسم{" "}
                          {
                            section.id
                          }
                        </span>

                        <h3>
                          {
                            section.title
                          }
                        </h3>

                        <p>
                          {
                            section.description
                          }
                        </p>
                      </div>

                      <div className="committee-section-arrow">
                        ←
                      </div>
                    </button>
                  )
                )}
              </section>

              <div className="committee-bottom-action">
                <button
                  className="committee-back-button bottom"
                  onClick={() =>
                    setSelectedCommittee(
                      null
                    )
                  }
                  type="button"
                >
                  <span>
                    ←
                  </span>

                  العودة إلى ملف اللجان وفرق العمل
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     الصفحة الرئيسية
  ========================================================= */

  return (
    <div
      className="committees-dashboard"
      dir="rtl"
    >
      <header className="committees-header">
        <div className="committees-header-inner">
          <div className="committees-brand">
            <img
              src={logo}
              alt="شعار مدارس الأندلس"
              className="committees-logo"
            />

            <div className="committees-brand-text">
              <span>
                متوسطة وثانوية الأندلس بالطائف - بنات
              </span>

              <small>
                سجل اللجان وفرق العمل المدرسية
              </small>
            </div>
          </div>

          <div className="committees-main-title">
            <h1>
              سجل اللجان وفرق العمل المدرسية
            </h1>

            <p>
              مهام واختصاصات اللجان وفرق العمل المدرسية
            </p>
          </div>

          <button
            className="committees-dashboard-back"
            type="button"
            onClick={() =>
              window.history.back()
            }
          >
            العودة للوحات الرئيسية

            <span>←</span>
          </button>
        </div>
      </header>

      <main className="committees-main">
        <section className="committees-hero">
          <div className="committees-hero-content">
            <h2>
              إدارة اللجان
              <br />
              والفرق
            </h2>

            <p>
              سجل إلكتروني متكامل لتنظيم أعمال اللجان المدرسية،
              وتوثيق تشكيلها وأهدافها ومهامها واجتماعاتها وقراراتها
              ومتابعة أعمالها طوال العام الدراسي.
            </p>

            <div className="committees-hero-points">
              <span>
                ✓ تنظيم وتوثيق أعمال اللجان
              </span>

              <span>
                ✓ متابعة الاجتماعات والمهام
              </span>

              <span>
                ✓ حفظ البيانات بشكل دائم
              </span>

              <p>
                مديرة المدرسة: أ/ خيرية الخالدي
              </p>
            </div>
          </div>

          <div className="committees-hero-visual">
            <div className="hero-document">
              <div className="hero-document-top" />

              <div className="hero-document-line" />

              <div className="hero-document-line short" />

              <div className="hero-document-line" />

              <div className="hero-document-line short" />
            </div>

            <div className="hero-check">
              ✓
            </div>

            <div className="hero-target">
              🎯
            </div>
          </div>
        </section>

        <section className="committees-info-card">
          <div className="info-card-icon">
            🎯
          </div>

          <div className="info-card-content">
            <span>
              الهدف من السجل
            </span>

            <h2>
              توثيق أعمال اللجان المدرسية ومتابعتها
            </h2>

            <p>
              تنظيم أعمال اللجان المدرسية ومتابعتها بما يسهم في
              تحقيق أهداف المدرسة ورفع جودة الأداء من خلال العمل
              الجماعي والتخطيط المنظم والتقويم المستمر.
            </p>
          </div>
        </section>

        <section className="committees-indicators">
          <div className="committee-indicator-card">
            <div className="committee-indicator-icon">
              🗓️
            </div>

            <div className="committee-indicator-content">
              <span>
                مؤشر الاجتماعات
              </span>

              <strong>
                {completedMeetings}
              </strong>

              <p>
                الاجتماعات المنفذة
              </p>
            </div>
          </div>
        </section>

        <div className="committees-section-heading">
          <div>
            <span>
              دليل اللجان
            </span>

            <h2>
              اللجان المدرسية
            </h2>

            <p>
              اختاري اللجنة للدخول إلى ملفها الكامل.
            </p>
          </div>

          <div className="committees-count-badge">
            <strong>
              {committees.length}
            </strong>

            <span>
              لجان
            </span>
          </div>
        </div>

        <section className="committees-grid">
          {committees.map(
            (
              committee
            ) => (
              <article
                key={
                  committee.id
                }
                className="committee-card"
              >
                <div className="committee-card-top">
                  <div className="committee-card-icon">
                    {
                      committee.icon
                    }
                  </div>

                  <span className="committee-card-number">
                    {String(
                      committee.id
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                <div className="committee-card-body">
                  <h3>
                    {
                      committee.title
                    }
                  </h3>

                  <p>
                    {
                      committee.description
                    }
                  </p>
                </div>

                <div className="committee-card-footer">
                  <button
                    type="button"
                    className="committee-open-button"
                    onClick={() =>
                      setSelectedCommittee(
                        committee
                      )
                    }
                  >
                    عرض اللجنة

                    <span>
                      ←
                    </span>
                  </button>
                </div>
              </article>
            )
          )}
        </section>

        <section className="committees-documentation">
          <div className="committees-documentation-heading">
            <div>
              <span>
                مسارات التوثيق
              </span>

              <h2>
                توثيق أعمال اللجان
              </h2>

              <p>
                الوصول السريع إلى أهم أجزاء ملف اللجنة.
              </p>
            </div>
          </div>

          <div className="committees-documentation-grid">
            <button
              type="button"
              className="committee-document-card"
            >
              <div className="committee-document-icon">
                👥
              </div>

              <div className="committee-document-content">
                <span>
                  01
                </span>

                <h3>
                  تشكيل اللجنة
                </h3>

                <p>
                  قرار تشكيل فريق العمل وإضافة أعضاء اللجنة وحفظ بيانات التشكيل.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="committee-document-card"
            >
              <div className="committee-document-icon">
                🎯
              </div>

              <div className="committee-document-content">
                <span>
                  02
                </span>

                <h3>
                  مهام اللجنة
                </h3>

                <p>
                  متابعة مهام اللجنة ومسؤولياتها وأعمالها خلال العام الدراسي.
                </p>
              </div>
            </button>

            <button
              type="button"
              className="committee-document-card"
            >
              <div className="committee-document-icon">
                🗓️
              </div>

              <div className="committee-document-content">
                <span>
                  03
                </span>

                <h3>
                  تنظيم الاجتماعات
                </h3>

                <p>
                  تسجيل الاجتماعات ومتابعة المحاضر والتوصيات والقرارات والتوقيعات.
                </p>
              </div>
            </button>
          </div>
        </section>

        <section className="committees-bottom-note">
          <div className="bottom-note-icon">
            💜
          </div>

          <div>
            <strong>
              سجل اللجان المدرسية
            </strong>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CommitteesDashboard;