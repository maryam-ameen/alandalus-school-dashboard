import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./CommitteesDashboard.css";
import logo from "../../assets/logo.png";
import { supabase } from "../../lib/supabase";

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
   أدوات مساعدة
========================================================= */

const getCommitteeData = (committeeId) => {
  switch (committeeId) {
    case 2:
      return guidanceCommitteeData;

    case 3:
      return academicAchievementCommitteeData;

    case 4:
      return safetyCommitteeData;

    case 5:
      return excellenceCommitteeData;

    default:
      return administrativeCommitteeData;
  }
};

const getArabicDay = (date) => {
  if (!date) return "";

  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const d = new Date(`${date}T00:00:00`);

  return days[d.getDay()];
};

/* =========================================================
   الاجتماعات الافتراضية
========================================================= */

const createDefaultMeetings = () => {
  return [];
};

/* =========================================================
   القرار الافتراضي
========================================================= */

const createDefaultDecision = (committee) => {
  const data = getCommitteeData(committee.id);

  const defaultMembers =
    data.members?.map((member) => ({
      name: member.name || "",
      job: member.job || "",
      role: member.role || "عضوة",
      signature: "",
    })) || [
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
    ];

  return {
    id: null,
    title: committee.title,
    day: "",
    date: "",
    schoolYear: "1448 / 1449",
    description: committee.description || "",
    members: defaultMembers,
  };
};

/* =========================================================
   تحميل القرار
========================================================= */

const loadCommitteeDecision = async (committee) => {
  const defaultDecision =
    createDefaultDecision(committee);

  try {
    const {
      data: decisionRow,
      error: decisionError,
    } = await supabase
      .from("committee_decisions")
      .select("*")
      .eq("title", committee.title)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (decisionError) {
      console.error(
        "خطأ تحميل القرار:",
        decisionError
      );

      return defaultDecision;
    }

    if (!decisionRow) {
      return defaultDecision;
    }

    const {
      data: memberRows,
      error: membersError,
    } = await supabase
      .from("committee_members")
      .select("*")
      .eq(
        "decision_id",
        decisionRow.id
      )
      .order("id", {
        ascending: true,
      });

    if (membersError) {
      console.error(
        "خطأ تحميل أعضاء القرار:",
        membersError
      );
    }

    return {
      id: decisionRow.id,
      title: decisionRow.title || committee.title,
      day: decisionRow.day_name || "",
      date: decisionRow.decision_date || "",
      schoolYear:
        decisionRow.academic_year ||
        "1448 / 1449",
      description:
        decisionRow.description ||
        committee.description ||
        "",
      members:
        memberRows?.length > 0
          ? memberRows.map((member) => ({
              id: member.id,
              name:
                member.member_name ||
                "",
              job:
                member.job_title ||
                "",
              role:
                member.assigned_work ||
                "عضوة",
              signature:
                member.signature ||
                "",
            }))
          : defaultDecision.members,
    };
  } catch (error) {
    console.error(
      "خطأ غير متوقع في تحميل القرار:",
      error
    );

    return defaultDecision;
  }
};

/* =========================================================
   لوحة التوقيع
========================================================= */

function SignaturePad({
  value,
  onChange,
}) {
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
      return {
        x: 0,
        y: 0,
      };
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

    const {
      x,
      y,
    } = getPosition(event);

    drawingRef.current = true;

    ctx.beginPath();

    ctx.moveTo(x, y);

    ctx.lineWidth = 2.5;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.strokeStyle =
      "#39246b";
  };

  const draw = (event) => {
    if (!drawingRef.current) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const {
      x,
      y,
    } = getPosition(event);

    ctx.lineTo(x, y);

    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;

    const canvas = canvasRef.current;

    if (!canvas) return;

    onChange(
      canvas.toDataURL(
        "image/png"
      )
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
        onMouseDown={
          startDrawing
        }
        onMouseMove={draw}
        onMouseUp={
          stopDrawing
        }
        onMouseLeave={
          stopDrawing
        }
        onTouchStart={
          startDrawing
        }
        onTouchMove={draw}
        onTouchEnd={
          stopDrawing
        }
      />

      <div className="committee-signature-line" />

      <button
        type="button"
        className="committee-clear-signature"
        onClick={
          clearSignature
        }
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
  const [
    decision,
    setDecision,
  ] = useState(
    createDefaultDecision(
      committee
    )
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    savedMessage,
    setSavedMessage,
  ] = useState(false);

  /* -------------------------------------------------------
     تحميل القرار
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      const loaded =
        await loadCommitteeDecision(
          committee
        );

      if (mounted) {
        setDecision(loaded);
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [committee.id]);

  /* -------------------------------------------------------
     مزامنة القرار بين جميع الأجهزة
     قاعدة البيانات الجديدة تستخدم title لتمييز اللجنة
  ------------------------------------------------------- */
  useEffect(() => {
    let active = true;

    const channel = supabase
      .channel(`committee-decision-${committee.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "committee_decisions",
          filter: `title=eq.${committee.title}`,
        },
        async () => {
          if (!active || saving) return;

          const refreshed =
            await loadCommitteeDecision(committee);

          if (active) {
            setDecision(refreshed);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [committee.id, committee.title, saving]);

  /* -------------------------------------------------------
     تغيير بيانات القرار
  ------------------------------------------------------- */

  const handleDecisionChange = (
    field,
    value
  ) => {
    setDecision((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* -------------------------------------------------------
     تغيير عضو
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     إضافة عضو
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     حذف عضو
  ------------------------------------------------------- */

  const removeDecisionMember = (
    index
  ) => {
    setDecision((prev) => ({
      ...prev,

      members:
        prev.members.filter(
          (_, i) =>
            i !== index
        ),
    }));
  };

  /* -------------------------------------------------------
     حفظ القرار
  ------------------------------------------------------- */

  const saveDecision = async () => {
    if (saving) return;

    setSaving(true);

    try {
      let decisionId =
        decision.id;

      const decisionPayload = {
        title: committee.title,
        decision_date: decision.date || null,
        day_name:
          decision.day ||
          (decision.date ? getArabicDay(decision.date) : null),
        academic_year:
          decision.schoolYear ||
          "1448 / 1449",
        description:
          decision.description ||
          committee.description ||
          "",
        updated_at: new Date().toISOString(),
      };

      /* ---------------------------------------------------
         تحديث أو إنشاء القرار
      --------------------------------------------------- */

      if (decisionId) {
        const {
          data,
          error,
        } = await supabase
          .from(
            "committee_decisions"
          )
          .update(
            decisionPayload
          )
          .eq(
            "id",
            decisionId
          )
          .eq(
            "title",
            committee.title
          )
          .select()
          .single();

        if (error) {
          throw error;
        }

        decisionId = data.id;
      } else {
        const {
          data,
          error,
        } = await supabase
          .from(
            "committee_decisions"
          )
          .insert([
            decisionPayload,
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        decisionId = data.id;
      }

      /* ---------------------------------------------------
         حذف الأعضاء السابقين
      --------------------------------------------------- */

      const {
        error: deleteMembersError,
      } = await supabase
        .from(
          "committee_members"
        )
        .delete()
        .eq(
          "decision_id",
          decisionId
        );

      if (deleteMembersError) {
        throw deleteMembersError;
      }

      /* ---------------------------------------------------
         إضافة الأعضاء الحالية
      --------------------------------------------------- */

      const membersToInsert =
        decision.members
          .filter(
            (member) =>
              member.name?.trim() ||
              member.job?.trim() ||
              member.role?.trim() ||
              member.signature
          )
          .map(
            (member) => ({
              decision_id:
                decisionId,

              member_name:
                member.name ||
                "",

              job_title:
                member.job ||
                "",

              assigned_work:
                member.role ||
                "عضوة",

              signature:
                member.signature ||
                "",
            })
          );

      if (
        membersToInsert.length >
        0
      ) {
        const {
          error:
            insertMembersError,
        } = await supabase
          .from(
            "committee_members"
          )
          .insert(
            membersToInsert
          );

        if (
          insertMembersError
        ) {
          throw insertMembersError;
        }
      }

      /* ---------------------------------------------------
         إعادة تحميل القرار
      --------------------------------------------------- */

      const refreshed =
        await loadCommitteeDecision(
          committee
        );

      setDecision(
        refreshed
      );

      setSavedMessage(true);

      setTimeout(() => {
        setSavedMessage(false);
      }, 2500);

      alert(
        "تم حفظ بيانات القرار بنجاح ✓"
      );
    } catch (error) {
      console.error(
        "خطأ حفظ القرار:",
        error
      );

      alert(
        "حدث خطأ أثناء حفظ القرار:\n\n" +
          (error.message ||
            "خطأ غير معروف")
      );
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     الطباعة
  ------------------------------------------------------- */

  const printDecision = async () => {
    await saveDecision();

    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (loading) {
    return (
      <section className="committee-content-card">
        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          جاري تحميل بيانات القرار...
        </div>
      </section>
    );
  }

  return (
    <section className="committee-content-card committee-decision-print-area">
      <div className="decision-print-header">
  <img
    src={logo}
    alt="شعار مدارس الأندلس"
    className="decision-print-logo"
  />

  <div className="decision-print-school-name">
    <strong>متوسطة وثانوية الأندلس بالطائف - بنات</strong>
    <span>إدارة المدرسة</span>
  </div>
</div>

<div className="decision-print-title">
  <h2>إقــــرار</h2>

  <h3>
    قرار إداري بشأن تشكيل فريق عمل
    <br />
    {committee.title}
  </h3>

  <p>
    العام الدراسي:
    {" "}
    <strong>
      {decision.schoolYear || "1448 / 1449"}
    </strong>
  </p>
</div>

<div className="decision-print-introduction">
  <p>
    بناءً على ما تقتضيه مصلحة العمل وتنظيم أعمال اللجان
    المدرسية، فقد تقرر تشكيل فريق عمل
    {" "}
    <strong>{committee.title}</strong>
    {" "}
    للعام الدراسي
    {" "}
    <strong>
      {decision.schoolYear || "1448 / 1449"}
    </strong>
    ، وذلك وفق المهام والمسؤوليات المعتمدة بالمدرسة.
  </p>

  <p>
    وقد تم اختيار أعضاء الفريق وتحديد أدوارهم ومسؤولياتهم
    على النحو الآتي:
  </p>
</div>
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
          <span>
            اليوم
          </span>

          <input
            type="text"
            value={
              decision.day
            }
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
          <span>
            التاريخ
          </span>

          <input
            type="date"
            value={
              decision.date
            }
            onChange={(e) =>
              handleDecisionChange(
                "date",
                e.target.value
              )
            }
          />
        </label>

        <label className="committee-decision-field">
          <span>
            العام الدراسي
          </span>

          <input
            type="text"
            value={
              decision.schoolYear
            }
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
              <th>
                الاسم
              </th>

              <th>
                الوصف الوظيفي
              </th>

              <th>
                العمل المكلف به
              </th>

              <th>
                التوقيع
              </th>

              <th className="no-print">
                حذف
              </th>
            </tr>
          </thead>

          <tbody>
            {decision.members.map(
              (
                member,
                index
              ) => (
                <tr
                  key={
                    member.id ||
                    index
                  }
                >
                  <td>
                    <input
                      type="text"
                      value={
                        member.name
                      }
                      onChange={(
                        e
                      ) =>
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
                      value={
                        member.job
                      }
                      onChange={(
                        e
                      ) =>
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
                      value={
                        member.role
                      }
                      onChange={(
                        e
                      ) =>
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
                      onChange={(
                        signature
                      ) =>
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
          onClick={
            addDecisionMember
          }
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
          onClick={
            saveDecision
          }
          disabled={saving}
        >
          {saving
            ? "جاري الحفظ..."
            : "💾 حفظ القرار"}
        </button>

        <button
          type="button"
          className="committee-print-button"
          onClick={
            printDecision
          }
          disabled={saving}
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
   المحضر والحضور والتوقيع
========================================================= */

/*
  جدول الحضور المستخدم في Supabase:
  meeting_attendees
  - id
  - meeting_id
  - name
  - job_title
  - attended
  - signature
*/

const createDefaultAttendee = (meetingId) => ({
  id: null,
  meeting_id: meetingId,
  attendee_name: "",
  job_title: "",
  attended: false,
  signature: "",
  _local: true,
});

/* =========================================================
   تحميل حضور الاجتماع
========================================================= */

const loadMeetingAttendees = async (meetingId) => {
  const { data, error } = await supabase
    .from("meeting_attendees")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("id", { ascending: true });

  if (error) {
    console.error("خطأ تحميل حضور الاجتماع:", error);
    return [];
  }

  return (data || []).map((attendee) => ({
    ...attendee,
    name: attendee.attendee_name || "",
  }));
};

/* =========================================================
   المحضر
========================================================= */

function MeetingEditor({
  committee,
  meeting,
  onClose,
  onSaved,
  onDeleted,
}) {
  const [form, setForm] = useState({
    ...meeting,
    meeting_number: meeting?.meeting_number ?? "",
    meeting_date: meeting?.meeting_date ?? "",
    meeting_time: meeting?.meeting_time ?? "",
    meeting_place: meeting?.meeting_place ?? "",
    meeting_status: meeting?.meeting_status ?? "قادم",
    subject: meeting?.subject ?? "",
    notes: meeting?.notes ?? "",
    discussion: meeting?.discussion ?? "",
    recommendations: meeting?.recommendations ?? "",
    manager_name: meeting?.manager_name ?? "خيرية الخالدي",
    manager_signature: meeting?.manager_signature ?? "",
  });

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingAttendee, setAddingAttendee] = useState(false);

  /* -------------------------------------------------------
     تحميل بيانات الحضور
  ------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!meeting?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const loaded = await loadMeetingAttendees(meeting.id);

      if (!mounted) return;

      setAttendees(loaded);
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [meeting?.id]);

  /* -------------------------------------------------------
     تغيير بيانات المحضر
  ------------------------------------------------------- */

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* -------------------------------------------------------
     حفظ بيانات مديرة المدرسة
  ------------------------------------------------------- */

  const saveManagerName = async () => {
    const managerName = (form.manager_name || "").trim() || "خيرية الخالدي";

    const { data, error } = await supabase
      .from("meetings")
      .update({
        manager_name: managerName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", meeting.id)
      .select("*")
      .single();

    if (error) {
      console.error("خطأ حفظ اسم مديرة المدرسة:", error);
      alert("حدث خطأ أثناء حفظ اسم مديرة المدرسة");
      return;
    }

    setForm((prev) => ({
      ...prev,
      manager_name: data?.manager_name || managerName,
    }));
  };

  const saveManagerSignature = async (signature) => {
    setForm((prev) => ({
      ...prev,
      manager_signature: signature || "",
    }));

    const { data, error } = await supabase
      .from("meetings")
      .update({
        manager_signature: signature || "",
        manager_name: form.manager_name || "خيرية الخالدي",
        updated_at: new Date().toISOString(),
      })
      .eq("id", meeting.id)
      .select("*")
      .single();

    if (error) {
      console.error("خطأ حفظ توقيع مديرة المدرسة:", error);
      alert("حدث خطأ أثناء حفظ توقيع مديرة المدرسة");
      return;
    }

    setForm((prev) => ({
      ...prev,
      manager_signature: data?.manager_signature || signature || "",
      manager_name: data?.manager_name || prev.manager_name || "خيرية الخالدي",
    }));
  };

  /* -------------------------------------------------------
     تغيير بيانات الحاضر
  ------------------------------------------------------- */

  const updateAttendeeLocal = (attendeeId, field, value) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        String(attendee.id) === String(attendeeId)
          ? { ...attendee, [field]: value }
          : attendee
      )
    );
  };

  /* -------------------------------------------------------
     إضافة حاضر جديد
  ------------------------------------------------------- */

  const addAttendee = async () => {
    if (!meeting?.id || addingAttendee) return;

    setAddingAttendee(true);

    try {
      const payload = {
        meeting_id: meeting.id,
        attendee_name: "",
        job_title: "",
        attended: false,
        signature: "",
      };

      const { data, error } = await supabase
        .from("meeting_attendees")
        .insert([payload])
        .select("*")
        .single();

      if (error) throw error;

      setAttendees((prev) => [
  ...prev,
  {
    ...data,
    name: data.attendee_name || "",
  },
]);
    } catch (error) {
      console.error("خطأ إضافة حاضر:", error);
      alert(
        "حدث خطأ أثناء إضافة الحاضر:\n\n" +
          (error.message || "خطأ غير معروف")
      );
    } finally {
      setAddingAttendee(false);
    }
  };

  /* -------------------------------------------------------
     حفظ بيانات حاضر مباشرة عند مغادرة الحقل
  ------------------------------------------------------- */

  const saveAttendeeField = async (attendee) => {
    if (!attendee?.id) return;

    const payload = {
      attendee_name: attendee.name || "",
      job_title: attendee.job_title || "",
      attended: Boolean(attendee.attended),
      signature: attendee.signature || "",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("meeting_attendees")
      .update(payload)
      .eq("id", attendee.id)
      .eq("meeting_id", meeting.id)
      .select("*")
      .single();

    if (error) {
      console.error("خطأ حفظ بيانات الحاضر:", error);
      alert("حدث خطأ أثناء حفظ بيانات الحاضر");
      return;
    }

    setAttendees((prev) =>
  prev.map((item) =>
    String(item.id) === String(attendee.id)
      ? {
          ...data,
          name: data.attendee_name || "",
        }
      : item
  )
);
  };

  /* -------------------------------------------------------
     تسجيل / إلغاء الحضور
  ------------------------------------------------------- */

  const toggleAttendance = async (attendee) => {
    if (!attendee?.id) return;

    const newValue = !Boolean(attendee.attended);

    setAttendees((prev) =>
      prev.map((item) =>
        String(item.id) === String(attendee.id)
          ? { ...item, attended: newValue }
          : item
      )
    );

    const { data, error } = await supabase
      .from("meeting_attendees")
      .update({
        attended: newValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attendee.id)
      .eq("meeting_id", meeting.id)
      .select("*")
      .single();

    if (error) {
      console.error("خطأ حفظ الحضور:", error);
      alert("حدث خطأ أثناء حفظ الحضور");

      setAttendees((prev) =>
        prev.map((item) =>
          String(item.id) === String(attendee.id)
            ? { ...item, attended: Boolean(attendee.attended) }
            : item
        )
      );
      return;
    }

    setAttendees((prev) =>
      prev.map((item) =>
        String(item.id) === String(attendee.id) ? data : item
      )
    );
  };

  /* -------------------------------------------------------
     تسجيل حضور الجميع
  ------------------------------------------------------- */

  const markAllPresent = async () => {
    if (!meeting?.id || attendees.length === 0) return;

    try {
      const { data, error } = await supabase
        .from("meeting_attendees")
        .update({
          attended: true,
          updated_at: new Date().toISOString(),
        })
        .eq("meeting_id", meeting.id)
        .select("*");

      if (error) throw error;

      setAttendees(
  (data || []).map((attendee) => ({
    ...attendee,
    name: attendee.attendee_name || "",
  }))
);
    } catch (error) {
      console.error("خطأ تسجيل حضور الجميع:", error);
      alert("حدث خطأ أثناء تسجيل الحضور");
    }
  };

  /* -------------------------------------------------------
     حفظ التوقيع
  ------------------------------------------------------- */

  const saveSignature = async (attendee, signature) => {
    if (!attendee?.id) return;

    updateAttendeeLocal(attendee.id, "signature", signature);

    const { data, error } = await supabase
      .from("meeting_attendees")
      .update({
        signature: signature || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", attendee.id)
      .eq("meeting_id", meeting.id)
      .select("*")
      .single();

    if (error) {
      console.error("خطأ حفظ التوقيع:", error);
      return;
    }

    setAttendees((prev) =>
      prev.map((item) =>
        String(item.id) === String(attendee.id) ? data : item
      )
    );
  };

  /* -------------------------------------------------------
     حذف حاضر
  ------------------------------------------------------- */

  const deleteAttendee = async (attendeeId) => {
    const confirmed = window.confirm("هل تريدين حذف هذا الحاضر؟");
    if (!confirmed) return;

    const { error } = await supabase
      .from("meeting_attendees")
      .delete()
      .eq("id", attendeeId)
      .eq("meeting_id", meeting.id);

    if (error) {
      console.error("خطأ حذف الحاضر:", error);
      alert("حدث خطأ أثناء حذف الحاضر");
      return;
    }

    setAttendees((prev) =>
      prev.filter(
        (item) => String(item.id) !== String(attendeeId)
      )
    );
  };

  /* -------------------------------------------------------
     حفظ جميع بيانات الحضور
  ------------------------------------------------------- */

  const saveAllAttendees = async () => {
    if (!meeting?.id || attendees.length === 0) return;

    for (const attendee of attendees) {
      if (!attendee.id) continue;

      const { data, error } = await supabase
        .from("meeting_attendees")
        .update({
          attendee_name: attendee.name || "",
          job_title: attendee.job_title || "",
          attended: Boolean(attendee.attended),
          signature: attendee.signature || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", attendee.id)
        .eq("meeting_id", meeting.id)
        .select("*")
        .single();

      if (error) throw error;

      setAttendees((prev) =>
        prev.map((item) =>
          String(item.id) === String(attendee.id) ? data : item
        )
      );
    }
  };

  /* -------------------------------------------------------
     حفظ المحضر
  ------------------------------------------------------- */

  const saveMeeting = async () => {
    if (saving || !meeting?.id) return;

    setSaving(true);

    try {
      const payload = {
        committee_id: committee.id,
        meeting_number: Number(form.meeting_number) || 0,
        meeting_date: form.meeting_date || null,
        meeting_time: form.meeting_time || null,
        meeting_place: form.meeting_place || null,
        meeting_status: form.meeting_status || "قادم",
        subject: form.subject || "",
        notes: form.notes || null,
        discussion: form.discussion || null,
        recommendations: form.recommendations || null,
        manager_name: form.manager_name || "خيرية الخالدي",
        manager_signature: form.manager_signature || "",
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("meetings")
        .update(payload)
        .eq("id", meeting.id)
        .select("*")
        .single();

      if (error) throw error;

      await saveAllAttendees();

      alert("تم حفظ محضر الاجتماع وبيانات الحضور بنجاح ✓");
      onSaved(data);
    } catch (error) {
      console.error("خطأ حفظ المحضر:", error);
      alert(
        "حدث خطأ أثناء حفظ المحضر:\n\n" +
          (error.message || "خطأ غير معروف")
      );
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------
     الطباعة
  ------------------------------------------------------- */

  const printMeeting = async () => {
    await saveMeeting();

    setTimeout(() => {
      window.print();
    }, 400);
  };

  /* -------------------------------------------------------
     حذف الاجتماع
  ------------------------------------------------------- */

  const deleteMeeting = async () => {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من حذف هذا الاجتماع؟"
    );

    if (!confirmed) return;

    try {
      /* حذف الحضور أولاً حتى لا يتأثر الحذف إذا لم يكن هناك CASCADE */
      const { error: attendeesError } = await supabase
        .from("meeting_attendees")
        .delete()
        .eq("meeting_id", meeting.id);

      if (attendeesError) throw attendeesError;

      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meeting.id);

      if (error) throw error;

      alert("تم حذف الاجتماع بنجاح");
      onDeleted(meeting.id);
    } catch (error) {
      console.error("خطأ حذف الاجتماع:", error);
      alert(
        "حدث خطأ أثناء حذف الاجتماع:\n\n" +
          (error.message || "خطأ غير معروف")
      );
    }
  };

  if (loading) {
    return (
      <div className="committee-meeting-editor">
        <div
          style={{
            padding: "50px",
            textAlign: "center",
          }}
        >
          جاري تحميل بيانات المحضر...
        </div>
      </div>
    );
  }

  return (
    <div className="committee-meeting-editor">
      <div className="committee-editor-header">
        <div>
          <span>محضر اجتماع اللجنة</span>

          <h3>
            {form.subject || `الاجتماع رقم ${form.meeting_number}`}
          </h3>
        </div>

        <button type="button" onClick={onClose}>
          ×
        </button>
      </div>

      {/* =================================================
          البيانات الأساسية
      ================================================= */}

      <div className="committee-meeting-form-section">
        <div className="committee-form-section-title">
          <span>01</span>

          <div>
            <small>البيانات الأساسية</small>
            <h4>بيانات الاجتماع</h4>
          </div>
        </div>

        <div className="committee-editor-grid">
          <label>
            <span>رقم الاجتماع</span>
            <input
              type="number"
              value={form.meeting_number || ""}
              onChange={(e) =>
                handleChange("meeting_number", e.target.value)
              }
            />
          </label>

          <label>
            <span>التاريخ</span>
            <input
              type="date"
              value={form.meeting_date || ""}
              onChange={(e) =>
                handleChange("meeting_date", e.target.value)
              }
            />
          </label>

          <label>
            <span>اليوم</span>
            <input
              value={getArabicDay(form.meeting_date)}
              readOnly
            />
          </label>

          <label>
            <span>مكان الاجتماع</span>
            <input
              value={form.meeting_place || ""}
              onChange={(e) =>
                handleChange("meeting_place", e.target.value)
              }
              placeholder="مثال: قاعة الاجتماعات"
            />
          </label>

          <label>
            <span>حالة الاجتماع</span>
            <select
              value={form.meeting_status || "قادم"}
              onChange={(e) =>
                handleChange("meeting_status", e.target.value)
              }
            >
              <option value="قادم">قادم</option>
              <option value="منفذ">منفذ</option>
            </select>
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
            <span>موضوع الاجتماع</span>
            <input
              value={form.subject || ""}
              onChange={(e) =>
                handleChange("subject", e.target.value)
              }
              placeholder="موضوع الاجتماع"
            />
          </label>
        </div>
      </div>

      {/* =================================================
          تفاصيل الاجتماع
      ================================================= */}

      <div className="committee-meeting-form-section">
        <div className="committee-form-section-title">
          <span>02</span>

          <div>
            <small>محاور المحضر</small>
            <h4>تفاصيل الاجتماع</h4>
          </div>
        </div>

        <div className="committee-editor-full">
          <label>
            <span>جدول الأعمال</span>
            <textarea
              value={form.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="اكتبي جدول أعمال الاجتماع..."
            />
          </label>

          <label>
            <span>أبرز ما تمت مناقشته</span>
            <textarea
              value={form.discussion || ""}
              onChange={(e) =>
                handleChange("discussion", e.target.value)
              }
              placeholder="اكتبي أبرز الموضوعات والمناقشات..."
            />
          </label>

          <label>
            <span>القرارات والتوصيات</span>
            <textarea
              value={form.recommendations || ""}
              onChange={(e) =>
                handleChange("recommendations", e.target.value)
              }
              placeholder="اكتبي القرارات والتوصيات..."
            />
          </label>
        </div>
      </div>

      {/* =================================================
          الحضور والتوقيع
      ================================================= */}

      <div className="committee-meeting-form-section committee-attendance-section">
        <div className="committee-form-section-title">
          <span>03</span>

          <div>
            <small>التوثيق</small>
            <h4>سجل الحضور والتوقيع</h4>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginInlineStart: "auto",
            }}
            className="no-print"
          >
            <button
              type="button"
              className="committee-add-attendee-button"
              onClick={markAllPresent}
              disabled={attendees.length === 0}
            >
              ✓ تسجيل حضور الجميع
            </button>

            <button
              type="button"
              className="committee-add-attendee-button"
              onClick={addAttendee}
              disabled={addingAttendee}
            >
              ＋ {addingAttendee ? "جاري الإضافة..." : "إضافة حاضر"}
            </button>
          </div>
        </div>

        {attendees.length === 0 ? (
          <div className="committee-no-attendees">
            <div>👥</div>
            <strong>لا توجد أسماء للحضور في هذا الاجتماع</strong>
            <p>
              اضغطي على «إضافة حاضر» لإضافة الاسم والمسمى الوظيفي ثم تسجيل
              الحضور والتوقيع.
            </p>
          </div>
        ) : (
          <div className="committee-attendance-table-wrapper">
            <table className="committee-attendance-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>اسم الحاضر</th>
                  <th>المسمى الوظيفي</th>
                  <th>الحضور</th>
                  <th>التوقيع</th>
                  <th className="no-print">إجراء</th>
                </tr>
              </thead>

              <tbody>
                {attendees.map((attendee, index) => (
                  <tr key={attendee.id || `attendee-${index}`}>
                    <td>{index + 1}</td>

                    <td>
                      <input
                        type="text"
                        value={attendee.name || ""}
                        onChange={(e) =>
                          updateAttendeeLocal(
                            attendee.id,
                            "name",
                            e.target.value
                          )
                        }
                        onBlur={() => saveAttendeeField(attendee)}
                        placeholder="اسم الحاضر"
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={attendee.job_title || ""}
                        onChange={(e) =>
                          updateAttendeeLocal(
                            attendee.id,
                            "job_title",
                            e.target.value
                          )
                        }
                        onBlur={() => saveAttendeeField(attendee)}
                        placeholder="المسمى الوظيفي"
                      />
                    </td>

                    <td>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(attendee.attended)}
                          onChange={() => toggleAttendance(attendee)}
                        />

                        <span>
                          {attendee.attended ? "حاضر" : "غائب"}
                        </span>
                      </label>
                    </td>

                    <td>
                      {attendee.attended ? (
                        <SignaturePad
                          value={attendee.signature || ""}
                          onChange={(signature) =>
                            saveSignature(attendee, signature)
                          }
                        />
                      ) : (
                        <span>— سجل الحضور أولاً —</span>
                      )}
                    </td>

                    <td className="no-print">
                      <button
                        type="button"
                        className="committee-delete-attendee-button"
                        onClick={() => deleteAttendee(attendee.id)}
                        title="حذف الحاضر"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          اعتماد المحضر
      ================================================= */}

      <div className="committee-minutes-footer">
        <div>
          <span>رئيسة اللجنة</span>
          <strong>مديرة المدرسة</strong>
        </div>

        <div>
          <span>الاسم</span>
          <input
            type="text"
            value={form.manager_name || ""}
            onChange={(e) => handleChange("manager_name", e.target.value)}
            onBlur={saveManagerName}
            placeholder="اسم مديرة المدرسة"
            className="committee-manager-name-input"
          />
        </div>

        <div>
          <span>التوقيع</span>
          <SignaturePad
            value={form.manager_signature || ""}
            onChange={saveManagerSignature}
          />
        </div>
      </div>

      {/* =================================================
          الأزرار
      ================================================= */}

      <div className="committee-editor-actions no-print">
        <button
          type="button"
          className="committee-save-meeting"
          onClick={saveMeeting}
          disabled={saving}
        >
          {saving ? "جاري الحفظ..." : "💾 حفظ المحضر"}
        </button>

        <button
          type="button"
          className="committee-print-meeting"
          onClick={printMeeting}
          disabled={saving}
        >
          🖨️ طباعة محضر الاجتماع
        </button>

        <button
          type="button"
          className="committee-delete-meeting"
          onClick={deleteMeeting}
        >
          🗑️ حذف الاجتماع
        </button>
      </div>
    </div>
  );
}

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

  const [
    meetings,
    setMeetings,
  ] = useState([]);

  const [
    selectedMeeting,
    setSelectedMeeting,
  ] = useState(null);

  const [
    loadingMeetings,
    setLoadingMeetings,
  ] = useState(false);

  const [
    savingMeeting,
    setSavingMeeting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /* =======================================================
     تحميل اجتماعات اللجنة
  ======================================================= */

  const loadMeetings = async (
    committeeId
  ) => {
    setLoadingMeetings(true);
    setErrorMessage("");

    try {
      const {
        data,
        error,
      } = await supabase
        .from("meetings")
        .select("*")
        .eq(
          "committee_id",
          committeeId
        )
        .order(
          "meeting_date",
          {
            ascending: true,
          }
        )
        .order(
          "meeting_number",
          {
            ascending: true,
          }
        );

      if (error) {
        throw error;
      }

      setMeetings(
        data || []
      );
    } catch (error) {
      console.error(
        "خطأ تحميل اجتماعات اللجنة:",
        error
      );

      setMeetings([]);

      setErrorMessage(
        error.message ||
          "تعذر تحميل اجتماعات اللجنة"
      );
    } finally {
      setLoadingMeetings(
        false
      );
    }
  };

  /* =======================================================
     عند اختيار لجنة
  ======================================================= */

  useEffect(() => {
    if (!selectedCommittee) {
      setMeetings([]);
      setSelectedMeeting(
        null
      );
      return;
    }

    loadMeetings(
      selectedCommittee.id
    );
  }, [
    selectedCommittee,
  ]);

  /* =======================================================
     مؤشر الاجتماعات
  ======================================================= */

  const completedMeetings =
    useMemo(() => {
      return meetings.filter(
        (meeting) =>
          meeting.meeting_status ===
          "منفذ"
      ).length;
    }, [meetings]);

  /* =======================================================
     فتح القسم
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
  };

  /* =======================================================
     إغلاق القسم
  ======================================================= */

  const closeSection = () => {
    setSelectedSection(
      null
    );

    setSelectedMeeting(
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
  };

  /* =======================================================
     إضافة اجتماع
  ======================================================= */

  const addMeeting = async () => {
    if (
      !selectedCommittee ||
      savingMeeting
    ) {
      return;
    }

    setSavingMeeting(
      true
    );

    try {
      const nextNumber =
        meetings.length > 0
          ? Math.max(
              ...meetings.map(
                (m) =>
                  Number(
                    m.meeting_number
                  ) || 0
              )
            ) + 1
          : 1;

      const {
        data,
        error,
      } = await supabase
        .from("meetings")
        .insert([
          {
            committee_id:
              selectedCommittee.id,

            meeting_number:
              nextNumber,

            meeting_date:
              null,

            meeting_time:
              null,

            meeting_place:
              null,

            meeting_status:
              "قادم",

            subject:
              `الاجتماع رقم ${nextNumber}`,

            notes:
              null,

            recommendations:
              null,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMeetings(
        (prev) => [
          ...prev,
          data,
        ]
      );

      setSelectedMeeting(
        data
      );

      alert(
        "تمت إضافة الاجتماع بنجاح ✓"
      );
    } catch (error) {
      console.error(
        "خطأ إضافة الاجتماع:",
        error
      );

      alert(
        "حدث خطأ أثناء إضافة الاجتماع:\n\n" +
          (error.message ||
            "خطأ غير معروف")
      );
    } finally {
      setSavingMeeting(
        false
      );
    }
  };

  /* =======================================================
     بعد حفظ اجتماع
  ======================================================= */

  const handleMeetingSaved = (
    updatedMeeting
  ) => {
    setMeetings(
      (prev) =>
        prev.map(
          (meeting) =>
            String(
              meeting.id
            ) ===
            String(
              updatedMeeting.id
            )
              ? updatedMeeting
              : meeting
        )
    );

    setSelectedMeeting(
      updatedMeeting
    );
  };

  /* =======================================================
     بعد حذف اجتماع
  ======================================================= */

  const handleMeetingDeleted = (
    meetingId
  ) => {
    setMeetings(
      (prev) =>
        prev.filter(
          (meeting) =>
            String(
              meeting.id
            ) !==
            String(
              meetingId
            )
        )
    );

    setSelectedMeeting(
      null
    );
  };

  /* =======================================================
     الصفحة الداخلية للجنة
  ======================================================= */

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
              }}
              type="button"
            >
              <span>
                ←
              </span>

              العودة إلى ملف اللجان وفرق العمل
            </button>
          </div>
        </header>

        <div className="committee-page-container">
          <div className="committee-breadcrumb">
            <span>
              اللوحات الرئيسية
            </span>

            <b>
              /
            </b>

            <span>
              ملف اللجان وفرق العمل
            </span>

            <b>
              /
            </b>

            <strong>
              {
                selectedCommittee.title
              }
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
                  <span>
                    →
                  </span>

                  العودة لأقسام اللجنة
                </button>

                <div>
                  <span>
                    {
                      selectedCommittee.title
                    }
                  </span>

                  <h2>
                    {
                      selectedSection.title
                    }
                  </h2>

                  <p>
                    {
                      selectedSection.description
                    }
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
                      <span>
                        01
                      </span>

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
                      {getCommitteeData(
                        selectedCommittee.id
                      ).goals.map(
                        (
                          goal,
                          index
                        ) => (
                          <div
                            className="committee-goal-item"
                            key={
                              index
                            }
                          >
                            <span>
                              {
                                index +
                                1
                              }
                            </span>

                            <p>
                              {
                                goal
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </section>

                  <section className="committee-content-card">
                    <div className="committee-content-card-title">
                      <span>
                        02
                      </span>

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
                      {getCommitteeData(
                        selectedCommittee.id
                      ).formationRules.map(
                        (
                          rule,
                          index
                        ) => (
                          <div
                            key={
                              index
                            }
                            className="committee-rule-item"
                          >
                            <span>
                              {
                                index +
                                1
                              }
                            </span>

                            <p>
                              {
                                rule
                              }
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
                    <span>
                      01
                    </span>

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
                    {getCommitteeData(
                      selectedCommittee.id
                    ).tasks.map(
                      (
                        task,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
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
                            {
                              task
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

              {/* =================================================
                  الاجتماعات
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
                        تسجيل اجتماعات اللجنة وتوثيق الحضور والتوقيعات والقرارات والتوصيات.
                      </p>
                    </div>

                    <div className="committee-meetings-counter">
                      <strong>
                        {
                          completedMeetings
                        }
                      </strong>

                      <span>
                        من{" "}
                        {
                          meetings.length
                        }{" "}
                        اجتماع
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
                      disabled={
                        savingMeeting
                      }
                    >
                      <span>
                        ＋
                      </span>

                      {savingMeeting
                        ? "جاري الإضافة..."
                        : "إضافة اجتماع"}
                    </button>
                  </div>

                  {errorMessage && (
                    <div
                      style={{
                        marginTop:
                          "15px",
                        padding:
                          "14px",
                        borderRadius:
                          "12px",
                        background:
                          "#fff1f1",
                        color:
                          "#a33",
                        textAlign:
                          "center",
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  {loadingMeetings ? (
                    <div className="committee-no-attendees">
                      <div>
                        ⏳
                      </div>

                      <strong>
                        جاري تحميل اجتماعات اللجنة...
                      </strong>
                    </div>
                  ) : meetings.length ===
                    0 ? (
                    <div className="committee-no-attendees">
                      <div>
                        📅
                      </div>

                      <strong>
                        لا توجد اجتماعات لهذه اللجنة بعد
                      </strong>

                      <p>
                        اضغطي على «إضافة اجتماع» لإنشاء أول اجتماع للجنة.
                      </p>
                    </div>
                  ) : (
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
                              meeting.meeting_status ===
                              "منفذ"
                                ? "completed"
                                : ""
                            }`}
                          >
                            <div className="committee-meeting-card-top">
                              <span>
                                {String(
                                  meeting.meeting_number ||
                                    0
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <b
                                className={
                                  meeting.meeting_status ===
                                  "منفذ"
                                    ? "status-done"
                                    : "status-pending"
                                }
                              >
                                {
                                  meeting.meeting_status
                                }
                              </b>
                            </div>

                            <h3>
                              {
                                meeting.subject
                              }
                            </h3>

                            <div className="committee-meeting-meta">
                              <span>
                                📅{" "}
                                {meeting.meeting_date ||
                                  "لم يحدد التاريخ"}
                              </span>

                              <span>
                                📍{" "}
                                {meeting.meeting_place ||
                                  "لم يحدد المكان"}
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
                  )}

                  {/* =================================================
                      محرر المحضر
                  ================================================= */}

                  {selectedMeeting && (
                    <MeetingEditor
                      key={
                        selectedMeeting.id
                      }
                      committee={
                        selectedCommittee
                      }
                      meeting={
                        selectedMeeting
                      }
                      onClose={() =>
                        setSelectedMeeting(
                          null
                        )
                      }
                      onSaved={
                        handleMeetingSaved
                      }
                      onDeleted={
                        handleMeetingDeleted
                      }
                    />
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

            <span>
              ←
            </span>
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
                اختر لجنة
              </strong>

              <p>
                لعرض الاجتماعات المنفذة
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
              {
                committees.length
              }
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
              onClick={() =>
                setSelectedCommittee(
                  committees[0]
                )
              }
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
              onClick={() =>
                setSelectedCommittee(
                  committees[0]
                )
              }
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
              onClick={() =>
                setSelectedCommittee(
                  committees[0]
                )
              }
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