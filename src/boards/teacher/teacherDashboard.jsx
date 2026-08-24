import React, { useMemo, useState } from "react";
import "./TeacherDashboard.css";

const TEACHER_DATA = [
  {
    specialty: "رياضيات",
    supervisor: "شادية الشربيني",
    teachers: [
      "الاء عمر سليم القرشي",
      "عبير سعد حسين أبو زنيفر",
      "سامية القطراوي",
      "الجوهرة العتيبي",
      "أميرة الشاذلي",
    ],
  },
  {
    specialty: "لغة عربية",
    supervisor: "مها السلمي",
    teachers: [
      "منى المالكي",
      "خديجة سعيد عبدالله القحطاني",
      "دلال أحمد جميل المالكي",
      "منى مرعي علي القرني",
    ],
  },
  {
    specialty: "لغة إنجليزية",
    supervisor: "رشا موسى",
    teachers: [
      "رزاز جميل امين السروجي",
      "بشرى القرشي",
      "عزوف الحريتي",
    ],
  },
  {
    specialty: "علوم",
    supervisor: "عبير العزب",
    teachers: [
      "تهاني طالع محمد الثبيتي",
      "سارة حامد حميد السفياني",
    ],
  },
  {
    specialty: "أحياء",
    supervisor: "عبير العزب",
    teachers: [
      "سارة سالم الشهري",
      "مشاعل إبراهيم مربد المعلوي",
    ],
  },
  {
    specialty: "فيزياء",
    supervisor: "عبير العزب",
    teachers: [
      "روان سلمان عواض الثبيتي",
    ],
  },
  {
    specialty: "كيمياء",
    supervisor: "عبير العزب",
    teachers: [
      "مرام عبدالرحمن رده الثبيتي",
      "فاطمة العرابي",
    ],
  },
  {
    specialty: "تربية إسلامية",
    supervisor: "مها السلمي",
    teachers: [
      "عزة جزاء نوار العتيبي",
      "أسماء زيد محمد الحارثي",
    ],
  },
  {
    specialty: "اجتماعيات",
    supervisor: "مها السلمي",
    teachers: [
      "عايدة جميل عبدالله الشريف",
    ],
  },
  {
    specialty: "تربية بدنية",
    supervisor: "شادية الشربيني",
    teachers: [
      "عبير مانع حمد ال سالم",
    ],
  },
  {
    specialty: "حاسب آلي",
    supervisor: "شادية الشربيني",
    teachers: [
      "أفنان عبدالرحمن عايض الحارثي",
      "وسن عبدالعزيز غازي الثمالي",
    ],
  },
];

const TABS = [
  {
    id: "meeting",
    label: "الاجتماع الأول",
    icon: "🤝",
  },
  {
    id: "followup",
    label: "المتابعة",
    icon: "📋",
  },
  {
    id: "visits",
    label: "الزيارات الصفية",
    icon: "🏫",
  },
  {
    id: "initiatives",
    label: "المبادرات",
    icon: "💡",
  },
  {
    id: "activity",
    label: "خطة النشاط",
    icon: "🎯",
  },
  {
    id: "recommendations",
    label: "التوصيات",
    icon: "📝",
  },
  {
    id: "indicator",
    label: "مؤشر التحسن",
    icon: "📈",
  },
];

const EMPTY_MEETING = {
  date: "",
  strengths: "",
  improvements: "",
  recommendations: "",
  expected: "",
  managerNotes: "",
  deputyNotes: "",
  supervisorNotes: "",
};

const EMPTY_FOLLOWUP = {
  date: "",
  type: "متابعة عامة",
  note: "",
  recommendation: "",
  action: "",
  score: 0,
  person: "المديرة",
};

const EMPTY_VISIT = {
  date: "",
  subject: "",
  note: "",
  recommendation: "",
  score: 0,
};

const EMPTY_INITIATIVE = {
  date: "",
  name: "",
  description: "",
  role: "",
  score: 0,
};

const EMPTY_ACTIVITY = {
  date: "",
  activity: "",
  role: "",
  note: "",
  score: 0,
};

const EMPTY_RECOMMENDATION = {
  date: "",
  recommendation: "",
  action: "",
  status: "لم تطبق",
  score: 0,
};

const makeTeacher = (name, specialty, supervisor) => ({
  id: `${specialty}-${name}`,
  name,
  specialty,
  supervisor,

  meeting: {
    ...EMPTY_MEETING,
  },

  followups: [],
  visits: [],
  initiatives: [],
  activities: [],
  recommendations: [],
});

const buildTeachers = () => {
  return TEACHER_DATA.flatMap((group) =>
    group.teachers.map((name) =>
      makeTeacher(
        name,
        group.specialty,
        group.supervisor
      )
    )
  );
};

const initialTeachers = buildTeachers();

function TeacherDashboard({ board, onClose }) {
  const [teachers, setTeachers] = useState(initialTeachers);

  const [selectedSpecialty, setSelectedSpecialty] =
    useState(null);

  const [selectedTeacherId, setSelectedTeacherId] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("meeting");

  const [search, setSearch] = useState("");

  const [showMeetingPrint, setShowMeetingPrint] =
    useState(false);

  const [showAddFollowup, setShowAddFollowup] =
    useState(false);

  const [showAddVisit, setShowAddVisit] =
    useState(false);

  const [showAddInitiative, setShowAddInitiative] =
    useState(false);

  const [showAddActivity, setShowAddActivity] =
    useState(false);

  const [showAddRecommendation, setShowAddRecommendation] =
    useState(false);

  const [followupForm, setFollowupForm] =
    useState(EMPTY_FOLLOWUP);

  const [visitForm, setVisitForm] =
    useState(EMPTY_VISIT);

  const [initiativeForm, setInitiativeForm] =
    useState(EMPTY_INITIATIVE);

  const [activityForm, setActivityForm] =
    useState(EMPTY_ACTIVITY);

  const [recommendationForm, setRecommendationForm] =
    useState(EMPTY_RECOMMENDATION);

  const [meetingSaved, setMeetingSaved] =
    useState(false);

  const selectedTeacher = useMemo(() => {
    return teachers.find(
      (teacher) =>
        teacher.id === selectedTeacherId
    );
  }, [teachers, selectedTeacherId]);

  const currentSpecialtyTeachers = useMemo(() => {
    if (!selectedSpecialty) return [];

    return teachers.filter(
      (teacher) =>
        teacher.specialty === selectedSpecialty
    );
  }, [teachers, selectedSpecialty]);

  const filteredTeachers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return currentSpecialtyTeachers;
    }

    return currentSpecialtyTeachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(value)
    );
  }, [currentSpecialtyTeachers, search]);

  const getTeacherScore = (teacher) => {
    const scores = [];

    const meeting = teacher.meeting;

    if (meeting.managerNotes.trim()) {
      scores.push(75);
    }

    if (meeting.supervisorNotes.trim()) {
      scores.push(75);
    }

    teacher.followups.forEach((item) => {
      if (Number(item.score) > 0) {
        scores.push(Number(item.score));
      }
    });

    teacher.visits.forEach((item) => {
      if (Number(item.score) > 0) {
        scores.push(Number(item.score));
      }
    });

    teacher.initiatives.forEach((item) => {
      if (Number(item.score) > 0) {
        scores.push(Number(item.score));
      }
    });

    teacher.activities.forEach((item) => {
      if (Number(item.score) > 0) {
        scores.push(Number(item.score));
      }
    });

    teacher.recommendations.forEach((item) => {
      if (Number(item.score) > 0) {
        scores.push(Number(item.score));
      }
    });

    if (scores.length === 0) {
      return 0;
    }

    const total = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    return Math.round(total / scores.length);
  };

  const getImprovementLabel = (score) => {
    if (score === 0) {
      return "لم يبدأ التقييم";
    }

    if (score < 50) {
      return "بحاجة إلى متابعة";
    }

    if (score < 70) {
      return "تحسن أولي";
    }

    if (score < 85) {
      return "تحسن جيد";
    }

    return "تحسن متميز";
  };

  const getScoreClass = (score) => {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "average";
    if (score > 0) return "weak";

    return "empty";
  };

  const updateTeacher = (teacherId, updater) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === teacherId
          ? updater(teacher)
          : teacher
      )
    );
  };

  const updateMeetingField = (
    field,
    value
  ) => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        meeting: {
          ...teacher.meeting,
          [field]: value,
        },
      })
    );

    setMeetingSaved(false);
  };

  const saveMeeting = () => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        meeting: {
          ...teacher.meeting,
        },
      })
    );

    setMeetingSaved(true);

    setTimeout(() => {
      setMeetingSaved(false);
    }, 2500);
  };

  const openTeacher = (teacher) => {
    setSelectedTeacherId(teacher.id);
    setActiveTab("meeting");
    setMeetingSaved(false);
  };

  const closeTeacher = () => {
    setSelectedTeacherId(null);
    setActiveTab("meeting");
  };

  const backToSpecialties = () => {
    setSelectedSpecialty(null);
    setSelectedTeacherId(null);
    setSearch("");
  };

  const resetFollowup = () => {
    setFollowupForm({
      ...EMPTY_FOLLOWUP,
    });
  };

  const resetVisit = () => {
    setVisitForm({
      ...EMPTY_VISIT,
    });
  };

  const resetInitiative = () => {
    setInitiativeForm({
      ...EMPTY_INITIATIVE,
    });
  };

  const resetActivity = () => {
    setActivityForm({
      ...EMPTY_ACTIVITY,
    });
  };

  const resetRecommendation = () => {
    setRecommendationForm({
      ...EMPTY_RECOMMENDATION,
    });
  };

  const addFollowup = () => {
    if (
      !selectedTeacher ||
      !followupForm.date ||
      !followupForm.note.trim()
    ) {
      alert(
        "فضلاً أدخلي التاريخ والملاحظة"
      );
      return;
    }

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        followups: [
          ...teacher.followups,
          {
            ...followupForm,
            id: Date.now(),
          },
        ],
      })
    );

    setShowAddFollowup(false);
    resetFollowup();
  };

  const addVisit = () => {
    if (
      !selectedTeacher ||
      !visitForm.date ||
      !visitForm.subject.trim()
    ) {
      alert(
        "فضلاً أدخلي تاريخ الزيارة وموضوعها"
      );
      return;
    }

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        visits: [
          ...teacher.visits,
          {
            ...visitForm,
            id: Date.now(),
          },
        ],
      })
    );

    setShowAddVisit(false);
    resetVisit();
  };

  const addInitiative = () => {
    if (
      !selectedTeacher ||
      !initiativeForm.date ||
      !initiativeForm.name.trim()
    ) {
      alert(
        "فضلاً أدخلي تاريخ المبادرة واسمها"
      );
      return;
    }

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        initiatives: [
          ...teacher.initiatives,
          {
            ...initiativeForm,
            id: Date.now(),
          },
        ],
      })
    );

    setShowAddInitiative(false);
    resetInitiative();
  };

  const addActivity = () => {
    if (
      !selectedTeacher ||
      !activityForm.date ||
      !activityForm.activity.trim()
    ) {
      alert(
        "فضلاً أدخلي التاريخ واسم النشاط"
      );
      return;
    }

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        activities: [
          ...teacher.activities,
          {
            ...activityForm,
            id: Date.now(),
          },
        ],
      })
    );

    setShowAddActivity(false);
    resetActivity();
  };

  const addRecommendation = () => {
    if (
      !selectedTeacher ||
      !recommendationForm.date ||
      !recommendationForm.recommendation.trim()
    ) {
      alert(
        "فضلاً أدخلي التاريخ والتوصية"
      );
      return;
    }

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        recommendations: [
          ...teacher.recommendations,
          {
            ...recommendationForm,
            id: Date.now(),
          },
        ],
      })
    );

    setShowAddRecommendation(false);
    resetRecommendation();
  };

  const deleteFollowup = (id) => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        followups:
          teacher.followups.filter(
            (item) => item.id !== id
          ),
      })
    );
  };

  const deleteVisit = (id) => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        visits:
          teacher.visits.filter(
            (item) => item.id !== id
          ),
      })
    );
  };

  const deleteInitiative = (id) => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        initiatives:
          teacher.initiatives.filter(
            (item) => item.id !== id
          ),
      })
    );
  };

  const deleteActivity = (id) => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        activities:
          teacher.activities.filter(
            (item) => item.id !== id
          ),
      })
    );
  };

  const deleteRecommendation = (id) => {
    if (!selectedTeacher) return;

    updateTeacher(
      selectedTeacher.id,
      (teacher) => ({
        ...teacher,
        recommendations:
          teacher.recommendations.filter(
            (item) => item.id !== id
          ),
      })
    );
  };

  const totalTeachers = teachers.length;

  const averageScore = useMemo(() => {
    const scores = teachers
      .map(getTeacherScore)
      .filter((score) => score > 0);

    if (!scores.length) return 0;

    return Math.round(
      scores.reduce(
        (sum, score) => sum + score,
        0
      ) / scores.length
    );
  }, [teachers]);

  const specialtiesCount =
    TEACHER_DATA.length;

  return (
    <div
      className="teacher-dashboard"
      dir="rtl"
    >
      {/* ========================================
          رأس اللوحة
      ======================================== */}

      <header className="teacher-dashboard-header">
        <div className="teacher-header-right">
          <button
            className="teacher-back-button"
            onClick={onClose}
          >
            ← العودة للوحات
          </button>

          <div>
            <span className="teacher-header-small">
              إدارة الأداء والمتابعة
            </span>

            <h1>
              لوحة متابعة المعلمات
            </h1>

            <p>
              متابعة فردية للمعلمة من بداية
              العام وحتى نهاية العام الدراسي
            </p>
          </div>
        </div>

        <div className="teacher-header-stat">
          <strong>
            {totalTeachers}
          </strong>
          <span>
            معلمة
          </span>
        </div>
      </header>

      {/* ========================================
          الإحصائيات
      ======================================== */}

      <section className="teacher-overview-stats">
        <div className="teacher-overview-card">
          <div className="overview-icon">
            👩‍🏫
          </div>

          <div>
            <strong>
              {totalTeachers}
            </strong>
            <span>
              إجمالي المعلمات
            </span>
          </div>
        </div>

        <div className="teacher-overview-card">
          <div className="overview-icon">
            📚
          </div>

          <div>
            <strong>
              {specialtiesCount}
            </strong>
            <span>
              التخصصات
            </span>
          </div>
        </div>

        <div className="teacher-overview-card">
          <div className="overview-icon">
            👩‍💼
          </div>

          <div>
            <strong>
              {new Set(
                TEACHER_DATA.map(
                  (item) =>
                    item.supervisor
                )
              ).size}
            </strong>

            <span>
              المشرفات
            </span>
          </div>
        </div>

        <div className="teacher-overview-card">
          <div className="overview-icon">
            📈
          </div>

          <div>
            <strong>
              {averageScore || "—"}
              {averageScore ? "%" : ""}
            </strong>

            <span>
              متوسط التحسن
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          صفحة التخصصات
      ======================================== */}

      {!selectedSpecialty &&
        !selectedTeacher && (
          <main className="teacher-main-content">
            <div className="teacher-section-title">
              <div>
                <span>
                  الأقسام والتخصصات
                </span>

                <h2>
                  اختاري التخصص
                </h2>

                <p>
                  كل تخصص مرتبط بالمشرفة
                  المختصة ومعلماته.
                </p>
              </div>
            </div>

            <div className="specialties-grid">
              {TEACHER_DATA.map(
                (group) => {
                  const groupTeachers =
                    teachers.filter(
                      (teacher) =>
                        teacher.specialty ===
                        group.specialty
                    );

                  return (
                    <button
                      key={group.specialty}
                      className="specialty-card"
                      onClick={() => {
                        setSelectedSpecialty(
                          group.specialty
                        );
                        setSearch("");
                      }}
                    >
                      <div className="specialty-card-top">
                        <span className="specialty-icon">
                          📚
                        </span>

                        <span className="specialty-count">
                          {groupTeachers.length}
                        </span>
                      </div>

                      <h3>
                        {group.specialty}
                      </h3>

                      <p>
                        المشرفة:
                        <strong>
                          {group.supervisor}
                        </strong>
                      </p>

                      <div className="specialty-card-footer">
                        <span>
                          فتح القسم
                        </span>

                        <span>
                          ←
                        </span>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </main>
        )}

      {/* ========================================
          قائمة المعلمات
      ======================================== */}

      {selectedSpecialty &&
        !selectedTeacher && (
          <main className="teacher-main-content">
            <div className="teacher-list-header">
              <div>
                <button
                  className="small-back-button"
                  onClick={backToSpecialties}
                >
                  ← جميع التخصصات
                </button>

                <span className="teacher-section-label">
                  قسم
                </span>

                <h2>
                  {selectedSpecialty}
                </h2>

                <p>
                  المشرفة:
                  <strong>
                    {
                      TEACHER_DATA.find(
                        (item) =>
                          item.specialty ===
                          selectedSpecialty
                      )?.supervisor
                    }
                  </strong>
                </p>
              </div>

              <div className="teacher-search">
                <span>
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="ابحثي عن معلمة..."
                />
              </div>
            </div>

            <div className="teacher-cards-grid">
              {filteredTeachers.map(
                (teacher) => {
                  const score =
                    getTeacherScore(
                      teacher
                    );

                  return (
                    <article
                      className="teacher-card"
                      key={teacher.id}
                    >
                      <div className="teacher-card-top">
                        <div className="teacher-avatar">
                          👩🏻‍🏫
                        </div>

                        <div className="teacher-card-score">
                          <strong
                            className={getScoreClass(
                              score
                            )}
                          >
                            {score
                              ? `${score}%`
                              : "—"}
                          </strong>

                          <span>
                            مؤشر التحسن
                          </span>
                        </div>
                      </div>

                      <div className="teacher-card-body">
                        <h3>
                          {teacher.name}
                        </h3>

                        <p>
                          {teacher.specialty}
                        </p>

                        <span className="teacher-supervisor">
                          المشرفة:
                          {" "}
                          {teacher.supervisor}
                        </span>
                      </div>

                      <div className="teacher-progress">
                        <div className="teacher-progress-head">
                          <span>
                            {getImprovementLabel(
                              score
                            )}
                          </span>

                          <span>
                            {score}%
                          </span>
                        </div>

                        <div className="teacher-progress-bar">
                          <div
                            style={{
                              width: `${score}%`,
                            }}
                            className={getScoreClass(
                              score
                            )}
                          />
                        </div>
                      </div>

                      <button
                        className="open-teacher-button"
                        onClick={() =>
                          openTeacher(
                            teacher
                          )
                        }
                      >
                        فتح ملف المعلمة
                        <span>
                          ←
                        </span>
                      </button>
                    </article>
                  );
                }
              )}
            </div>

            {filteredTeachers.length ===
              0 && (
              <div className="teacher-empty">
                لا توجد معلمة بهذا الاسم.
              </div>
            )}
          </main>
        )}

      {/* ========================================
          ملف المعلمة
      ======================================== */}

      {selectedTeacher && (
        <main className="teacher-profile-page">
          <div className="teacher-profile-top">
            <div>
              <button
                className="small-back-button"
                onClick={closeTeacher}
              >
                ← العودة للمعلمات
              </button>

              <div className="teacher-profile-identity">
                <div className="teacher-profile-avatar">
                  👩🏻‍🏫
                </div>

                <div>
                  <span>
                    ملف متابعة المعلمة
                  </span>

                  <h2>
                    {selectedTeacher.name}
                  </h2>

                  <p>
                    {selectedTeacher.specialty}
                    {" "}
                    • المشرفة:
                    {" "}
                    {
                      selectedTeacher.supervisor
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="teacher-profile-score">
              <span>
                مؤشر التحسن
              </span>

              <strong
                className={getScoreClass(
                  getTeacherScore(
                    selectedTeacher
                  )
                )}
              >
                {getTeacherScore(
                  selectedTeacher
                )}
                %
              </strong>

              <small>
                {getImprovementLabel(
                  getTeacherScore(
                    selectedTeacher
                  )
                )}
              </small>
            </div>
          </div>

          {/* ====================================
              التبويبات
          ==================================== */}

          <div className="teacher-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={
                  activeTab === tab.id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab(tab.id)
                }
              >
                <span>
                  {tab.icon}
                </span>

                {tab.label}
              </button>
            ))}
          </div>

          {/* ====================================
              الاجتماع الأول
          ==================================== */}

          {activeTab === "meeting" && (
            <section className="teacher-panel">
              <div className="panel-heading">
                <div>
                  <span>
                    بداية العام الدراسي
                  </span>

                  <h3>
                    الاجتماع الفردي الأول
                  </h3>

                  <p>
                    تحديد نقاط القوة،
                   التوصيات والمأمول من
                    المعلمة.
                  </p>
                </div>

                <div className="panel-actions">
                  <button
                    className="print-meeting-button"
                    onClick={() =>
                      setShowMeetingPrint(
                        true
                      )
                    }
                  >
                    🖨️ طباعة المحضر
                  </button>

                  <button
                    className="save-panel-button"
                    onClick={saveMeeting}
                  >
                    💾 حفظ الاجتماع
                  </button>
                </div>
              </div>

              {meetingSaved && (
                <div className="success-message">
                  ✓ تم حفظ بيانات الاجتماع
                </div>
              )}

              <div className="meeting-form">
                <div className="form-field">
                  <label>
                    تاريخ الاجتماع
                  </label>

                  <input
                    type="date"
                    value={
                      selectedTeacher
                        .meeting.date
                    }
                    onChange={(e) =>
                      updateMeetingField(
                        "date",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-field">
                  <label>
                    التخصص
                  </label>

                  <input
                    value={
                      selectedTeacher.specialty
                    }
                    readOnly
                  />
                </div>

                <div className="form-field">
                  <label>
                    المشرفة المختصة
                  </label>

                  <input
                    value={
                      selectedTeacher.supervisor
                    }
                    readOnly
                  />
                </div>

                <div className="form-field full">
                  <label>
                    أبرز نقاط القوة
                  </label>

                  <textarea
                    value={
                      selectedTeacher.meeting
                        .strengths
                    }
                    onChange={(e) =>
                      updateMeetingField(
                        "strengths",
                        e.target.value
                      )
                    }
                    placeholder="اكتبي أبرز نقاط القوة والتميز لدى المعلمة..."
                  />
                </div>


                <div className="form-field full">
                  <label>
                    التوصيات
                  </label>

                  <textarea
                    value={
                      selectedTeacher.meeting
                        .recommendations
                    }
                    onChange={(e) =>
                      updateMeetingField(
                        "recommendations",
                        e.target.value
                      )
                    }
                    placeholder="اكتبي التوصيات المتفق عليها..."
                  />
                </div>

                <div className="form-field full">
                  <label>
                    المأمول من المعلمة خلال العام
                  </label>

                  <textarea
                    value={
                      selectedTeacher.meeting
                        .expected
                    }
                    onChange={(e) =>
                      updateMeetingField(
                        "expected",
                        e.target.value
                      )
                    }
                    placeholder="ما المأمول تحقيقه بنهاية العام؟"
                  />
                </div>
              </div>

              <div className="evaluation-box">
                <h4>
                  📝 ملاحظات فريق التقييم
                </h4>

                <div className="evaluation-grid">
                  <div className="form-field">
                    <label>
                      ملاحظات المديرة
                    </label>

                    <textarea
                      value={
                        selectedTeacher
                          .meeting
                          .managerNotes
                      }
                      onChange={(e) =>
                        updateMeetingField(
                          "managerNotes",
                          e.target.value
                        )
                      }
                      placeholder="ملاحظات المديرة..."
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      ملاحظات الوكيلة
                    </label>

                    <textarea
                      value={
                        selectedTeacher
                          .meeting
                          .deputyNotes
                      }
                      onChange={(e) =>
                        updateMeetingField(
                          "deputyNotes",
                          e.target.value
                        )
                      }
                      placeholder="ملاحظات الوكيلة..."
                    />
                  </div>

                  <div className="form-field">
                    <label>
                      ملاحظات المشرفة
                    </label>

                    <textarea
                      value={
                        selectedTeacher
                          .meeting
                          .supervisorNotes
                      }
                      onChange={(e) =>
                        updateMeetingField(
                          "supervisorNotes",
                          e.target.value
                        )
                      }
                      placeholder="ملاحظات المشرفة المختصة..."
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ====================================
              المتابعة
          ==================================== */}

          {activeTab === "followup" && (
            <section className="teacher-panel">
              <div className="panel-heading">
                <div>
                  <span>
                    متابعة مستمرة
                  </span>

                  <h3>
                    سجل المتابعة
                  </h3>

                  <p>
                    توثيق كل متابعة أو مبادرة
                    أو توصية خلال العام.
                  </p>
                </div>

                <button
                  className="primary-action-button"
                  onClick={() =>
                    setShowAddFollowup(true)
                  }
                >
                  ＋ إضافة متابعة
                </button>
              </div>

              {selectedTeacher.followups.length ===
              0 ? (
                <EmptyState
                  icon="📋"
                  title="لا توجد متابعات بعد"
                  text="ابدئي بتسجيل أول متابعة للمعلمة."
                  buttonText="إضافة متابعة"
                  onClick={() =>
                    setShowAddFollowup(true)
                  }
                />
              ) : (
                <div className="records-list">
                  {selectedTeacher.followups.map(
                    (item) => (
                      <RecordCard
                        key={item.id}
                        title={item.type}
                        date={item.date}
                        score={item.score}
                        onDelete={() =>
                          deleteFollowup(
                            item.id
                          )
                        }
                      >
                        <p>
                          <strong>
                            الملاحظة:
                          </strong>{" "}
                          {item.note}
                        </p>

                        {item.recommendation && (
                          <p>
                            <strong>
                              التوصية:
                            </strong>{" "}
                            {
                              item.recommendation
                            }
                          </p>
                        )}

                        {item.action && (
                          <p>
                            <strong>
                              الإجراء:
                            </strong>{" "}
                            {item.action}
                          </p>
                        )}

                        <small>
                          المتابع:
                          {" "}
                          {item.person}
                        </small>
                      </RecordCard>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* ====================================
              الزيارات الصفية
          ==================================== */}

          {activeTab === "visits" && (
            <section className="teacher-panel">
              <div className="panel-heading">
                <div>
                  <span>
                    الزيارات والملاحظات
                  </span>

                  <h3>
                    الزيارات الصفية
                  </h3>

                  <p>
                    توثيق نتائج الزيارات الصفية
                    وأثرها على التحسن.
                  </p>
                </div>

                <button
                  className="primary-action-button"
                  onClick={() =>
                    setShowAddVisit(true)
                  }
                >
                  ＋ إضافة زيارة
                </button>
              </div>

              {selectedTeacher.visits.length ===
              0 ? (
                <EmptyState
                  icon="🏫"
                  title="لا توجد زيارات صفية"
                  text="سجلي الزيارة الصفية الأولى."
                  buttonText="إضافة زيارة"
                  onClick={() =>
                    setShowAddVisit(true)
                  }
                />
              ) : (
                <div className="records-list">
                  {selectedTeacher.visits.map(
                    (item) => (
                      <RecordCard
                        key={item.id}
                        title={
                          item.subject
                        }
                        date={item.date}
                        score={item.score}
                        onDelete={() =>
                          deleteVisit(
                            item.id
                          )
                        }
                      >
                        <p>
                          {item.note}
                        </p>

                        {item.recommendation && (
                          <p>
                            <strong>
                              التوصية:
                            </strong>{" "}
                            {
                              item.recommendation
                            }
                          </p>
                        )}
                      </RecordCard>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* ====================================
              المبادرات
          ==================================== */}

          {activeTab === "initiatives" && (
            <section className="teacher-panel">
              <div className="panel-heading">
                <div>
                  <span>
                    التميز والمشاركة
                  </span>

                  <h3>
                    المبادرات
                  </h3>

                  <p>
                    تسجيل المبادرات التي
                    شاركت أو قادتها المعلمة.
                  </p>
                </div>

                <button
                  className="primary-action-button"
                  onClick={() =>
                    setShowAddInitiative(
                      true
                    )
                  }
                >
                  ＋ إضافة مبادرة
                </button>
              </div>

              {selectedTeacher.initiatives
                .length === 0 ? (
                <EmptyState
                  icon="💡"
                  title="لا توجد مبادرات"
                  text="سجلي المبادرات والإنجازات المميزة."
                  buttonText="إضافة مبادرة"
                  onClick={() =>
                    setShowAddInitiative(
                      true
                    )
                  }
                />
              ) : (
                <div className="records-list">
                  {selectedTeacher.initiatives.map(
                    (item) => (
                      <RecordCard
                        key={item.id}
                        title={
                          item.name
                        }
                        date={item.date}
                        score={item.score}
                        onDelete={() =>
                          deleteInitiative(
                            item.id
                          )
                        }
                      >
                        <p>
                          {item.description}
                        </p>

                        {item.role && (
                          <p>
                            <strong>
                              الدور:
                            </strong>{" "}
                            {item.role}
                          </p>
                        )}
                      </RecordCard>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* ====================================
              النشاط
          ==================================== */}

          {activeTab === "activity" && (
            <section className="teacher-panel">
              <div className="panel-heading">
                <div>
                  <span>
                    المشاركة المدرسية
                  </span>

                  <h3>
                    خطة النشاط
                  </h3>

                  <p>
                    متابعة مشاركة المعلمة في
                    النشاط الطلابي والبرامج.
                  </p>
                </div>

                <button
                  className="primary-action-button"
                  onClick={() =>
                    setShowAddActivity(true)
                  }
                >
                  ＋ إضافة مشاركة
                </button>
              </div>

              {selectedTeacher.activities
                .length === 0 ? (
                <EmptyState
                  icon="🎯"
                  title="لا توجد مشاركات"
                  text="أضيفي مشاركات المعلمة في النشاط."
                  buttonText="إضافة مشاركة"
                  onClick={() =>
                    setShowAddActivity(true)
                  }
                />
              ) : (
                <div className="records-list">
                  {selectedTeacher.activities.map(
                    (item) => (
                      <RecordCard
                        key={item.id}
                        title={
                          item.activity
                        }
                        date={item.date}
                        score={item.score}
                        onDelete={() =>
                          deleteActivity(
                            item.id
                          )
                        }
                      >
                        <p>
                          {item.note}
                        </p>

                        {item.role && (
                          <p>
                            <strong>
                              الدور:
                            </strong>{" "}
                            {item.role}
                          </p>
                        )}
                      </RecordCard>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* ====================================
              التوصيات
          ==================================== */}

          {activeTab === "recommendations" && (
            <section className="teacher-panel">
              <div className="panel-heading">
                <div>
                  <span>
                    تطبيق التوصيات
                  </span>

                  <h3>
                    متابعة التوصيات
                  </h3>

                  <p>
                    هل تم تطبيق التوصيات؟ وما
                    أثرها على أداء المعلمة؟
                  </p>
                </div>

                <button
                  className="primary-action-button"
                  onClick={() =>
                    setShowAddRecommendation(
                      true
                    )
                  }
                >
                  ＋ إضافة توصية
                </button>
              </div>

              {selectedTeacher
                .recommendations.length ===
              0 ? (
                <EmptyState
                  icon="📝"
                  title="لا توجد توصيات"
                  text="أضيفي التوصيات التي تم الاتفاق عليها."
                  buttonText="إضافة توصية"
                  onClick={() =>
                    setShowAddRecommendation(
                      true
                    )
                  }
                />
              ) : (
                <div className="records-list">
                  {selectedTeacher.recommendations.map(
                    (item) => (
                      <RecordCard
                        key={item.id}
                        title={
                          item.recommendation
                        }
                        date={item.date}
                        score={item.score}
                        status={
                          item.status
                        }
                        onDelete={() =>
                          deleteRecommendation(
                            item.id
                          )
                        }
                      >
                        {item.action && (
                          <p>
                            <strong>
                              الإجراء:
                            </strong>{" "}
                            {item.action}
                          </p>
                        )}
                      </RecordCard>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* ====================================
              المؤشر
          ==================================== */}

          {activeTab === "indicator" && (
            <section className="teacher-panel">
              <div className="indicator-main">
                <div className="indicator-circle">
                  <strong>
                    {getTeacherScore(
                      selectedTeacher
                    )}
                    %
                  </strong>

                  <span>
                    مؤشر التحسن
                  </span>
                </div>

                <div className="indicator-details">
                  <span>
                    مستوى التحسن
                  </span>

                  <h3>
                    {getImprovementLabel(
                      getTeacherScore(
                        selectedTeacher
                      )
                    )}
                  </h3>

                  <p>
                    يتغير المؤشر تدريجيًا مع
                    إضافة الزيارات والمبادرات
                    والمتابعات وتطبيق
                    التوصيات.
                  </p>

                  <div className="large-progress">
                    <div
                      className={getScoreClass(
                        getTeacherScore(
                          selectedTeacher
                        )
                      )}
                      style={{
                        width: `${getTeacherScore(
                          selectedTeacher
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="indicator-components">
                <IndicatorItem
                  title="الاجتماع الفردي"
                  value={
                    selectedTeacher.meeting
                      .managerNotes
                      ? 75
                      : 0
                  }
                  icon="🤝"
                />

                <IndicatorItem
                  title="المتابعات"
                  value={
                    selectedTeacher
                      .followups.length
                      ? 75
                      : 0
                  }
                  icon="📋"
                />

                <IndicatorItem
                  title="الزيارات الصفية"
                  value={
                    selectedTeacher
                      .visits.length
                      ? 80
                      : 0
                  }
                  icon="🏫"
                />

                <IndicatorItem
                  title="المبادرات"
                  value={
                    selectedTeacher
                      .initiatives.length
                      ? 85
                      : 0
                  }
                  icon="💡"
                />

                <IndicatorItem
                  title="خطة النشاط"
                  value={
                    selectedTeacher
                      .activities.length
                      ? 80
                      : 0
                  }
                  icon="🎯"
                />

                <IndicatorItem
                  title="تطبيق التوصيات"
                  value={
                    selectedTeacher
                      .recommendations
                      .some(
                        (item) =>
                          item.status ===
                          "مطبقة"
                      )
                      ? 90
                      : 0
                  }
                  icon="✓"
                />
              </div>
            </section>
          )}
        </main>
      )}

      {/* ========================================
          نافذة إضافة متابعة
      ======================================== */}

      {showAddFollowup && (
        <FormModal
          title="إضافة متابعة"
          onClose={() => {
            setShowAddFollowup(false);
            resetFollowup();
          }}
          onSave={addFollowup}
        >
          <FormInput
            label="التاريخ"
            type="date"
            value={followupForm.date}
            onChange={(value) =>
              setFollowupForm({
                ...followupForm,
                date: value,
              })
            }
          />

          <FormSelect
            label="نوع المتابعة"
            value={followupForm.type}
            onChange={(value) =>
              setFollowupForm({
                ...followupForm,
                type: value,
              })
            }
            options={[
              "متابعة عامة",
              "متابعة توصية",
              "متابعة مبادرة",
              "متابعة أداء",
            ]}
          />

          <FormTextarea
            label="الملاحظة"
            value={followupForm.note}
            onChange={(value) =>
              setFollowupForm({
                ...followupForm,
                note: value,
              })
            }
          />

          <FormTextarea
            label="التوصية"
            value={
              followupForm.recommendation
            }
            onChange={(value) =>
              setFollowupForm({
                ...followupForm,
                recommendation:
                  value,
              })
            }
          />

          <FormTextarea
            label="الإجراء"
            value={followupForm.action}
            onChange={(value) =>
              setFollowupForm({
                ...followupForm,
                action: value,
              })
            }
          />

          <FormSelect
            label="مستوى التحسن"
            value={String(
              followupForm.score
            )}
            onChange={(value) =>
              setFollowupForm({
                ...followupForm,
                score: Number(value),
              })
            }
            options={[
              "0",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100",
            ]}
          />
        </FormModal>
      )}

      {/* ========================================
          نافذة زيارة صفية
      ======================================== */}

      {showAddVisit && (
        <FormModal
          title="إضافة زيارة صفية"
          onClose={() => {
            setShowAddVisit(false);
            resetVisit();
          }}
          onSave={addVisit}
        >
          <FormInput
            label="تاريخ الزيارة"
            type="date"
            value={visitForm.date}
            onChange={(value) =>
              setVisitForm({
                ...visitForm,
                date: value,
              })
            }
          />

          <FormInput
            label="موضوع الزيارة"
            value={visitForm.subject}
            onChange={(value) =>
              setVisitForm({
                ...visitForm,
                subject: value,
              })
            }
          />

          <FormTextarea
            label="الملاحظات"
            value={visitForm.note}
            onChange={(value) =>
              setVisitForm({
                ...visitForm,
                note: value,
              })
            }
          />

          <FormTextarea
            label="التوصية"
            value={
              visitForm.recommendation
            }
            onChange={(value) =>
              setVisitForm({
                ...visitForm,
                recommendation:
                  value,
              })
            }
          />

          <FormSelect
            label="التقييم"
            value={String(
              visitForm.score
            )}
            onChange={(value) =>
              setVisitForm({
                ...visitForm,
                score: Number(value),
              })
            }
            options={[
              "0",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100",
            ]}
          />
        </FormModal>
      )}

      {/* ========================================
          نافذة المبادرة
      ======================================== */}

      {showAddInitiative && (
        <FormModal
          title="إضافة مبادرة"
          onClose={() => {
            setShowAddInitiative(false);
            resetInitiative();
          }}
          onSave={addInitiative}
        >
          <FormInput
            label="التاريخ"
            type="date"
            value={
              initiativeForm.date
            }
            onChange={(value) =>
              setInitiativeForm({
                ...initiativeForm,
                date: value,
              })
            }
          />

          <FormInput
            label="اسم المبادرة"
            value={
              initiativeForm.name
            }
            onChange={(value) =>
              setInitiativeForm({
                ...initiativeForm,
                name: value,
              })
            }
          />

          <FormTextarea
            label="وصف المبادرة"
            value={
              initiativeForm.description
            }
            onChange={(value) =>
              setInitiativeForm({
                ...initiativeForm,
                description:
                  value,
              })
            }
          />

          <FormInput
            label="دور المعلمة"
            value={
              initiativeForm.role
            }
            onChange={(value) =>
              setInitiativeForm({
                ...initiativeForm,
                role: value,
              })
            }
          />

          <FormSelect
            label="التقييم"
            value={String(
              initiativeForm.score
            )}
            onChange={(value) =>
              setInitiativeForm({
                ...initiativeForm,
                score: Number(value),
              })
            }
            options={[
              "0",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100",
            ]}
          />
        </FormModal>
      )}

      {/* ========================================
          نافذة النشاط
      ======================================== */}

      {showAddActivity && (
        <FormModal
          title="إضافة مشاركة في النشاط"
          onClose={() => {
            setShowAddActivity(false);
            resetActivity();
          }}
          onSave={addActivity}
        >
          <FormInput
            label="التاريخ"
            type="date"
            value={
              activityForm.date
            }
            onChange={(value) =>
              setActivityForm({
                ...activityForm,
                date: value,
              })
            }
          />

          <FormInput
            label="اسم النشاط"
            value={
              activityForm.activity
            }
            onChange={(value) =>
              setActivityForm({
                ...activityForm,
                activity: value,
              })
            }
          />

          <FormInput
            label="دور المعلمة"
            value={
              activityForm.role
            }
            onChange={(value) =>
              setActivityForm({
                ...activityForm,
                role: value,
              })
            }
          />

          <FormTextarea
            label="ملاحظات"
            value={
              activityForm.note
            }
            onChange={(value) =>
              setActivityForm({
                ...activityForm,
                note: value,
              })
            }
          />

          <FormSelect
            label="التقييم"
            value={String(
              activityForm.score
            )}
            onChange={(value) =>
              setActivityForm({
                ...activityForm,
                score: Number(value),
              })
            }
            options={[
              "0",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100",
            ]}
          />
        </FormModal>
      )}

      {/* ========================================
          نافذة التوصية
      ======================================== */}

      {showAddRecommendation && (
        <FormModal
          title="إضافة توصية"
          onClose={() => {
            setShowAddRecommendation(
              false
            );
            resetRecommendation();
          }}
          onSave={addRecommendation}
        >
          <FormInput
            label="التاريخ"
            type="date"
            value={
              recommendationForm.date
            }
            onChange={(value) =>
              setRecommendationForm({
                ...recommendationForm,
                date: value,
              })
            }
          />

          <FormTextarea
            label="التوصية"
            value={
              recommendationForm.recommendation
            }
            onChange={(value) =>
              setRecommendationForm({
                ...recommendationForm,
                recommendation:
                  value,
              })
            }
          />

          <FormTextarea
            label="الإجراء المتخذ"
            value={
              recommendationForm.action
            }
            onChange={(value) =>
              setRecommendationForm({
                ...recommendationForm,
                action: value,
              })
            }
          />

          <FormSelect
            label="الحالة"
            value={
              recommendationForm.status
            }
            onChange={(value) =>
              setRecommendationForm({
                ...recommendationForm,
                status: value,
              })
            }
            options={[
              "لم تطبق",
              "قيد التطبيق",
              "مطبقة",
            ]}
          />

          <FormSelect
            label="أثر التوصية / التقييم"
            value={String(
              recommendationForm.score
            )}
            onChange={(value) =>
              setRecommendationForm({
                ...recommendationForm,
                score: Number(value),
              })
            }
            options={[
              "0",
              "50",
              "60",
              "70",
              "80",
              "90",
              "100",
            ]}
          />
        </FormModal>
      )}

      {/* ========================================
          محضر الاجتماع للطباعة
      ======================================== */}

      {showMeetingPrint &&
        selectedTeacher && (
          <div className="print-modal-overlay">
            <div className="print-preview-modal">
              <div className="print-preview-actions">
                <button
                  onClick={() =>
                    window.print()
                  }
                  className="print-now-button"
                >
                  🖨️ طباعة
                </button>

                <button
                  onClick={() =>
                    setShowMeetingPrint(
                      false
                    )
                  }
                  className="close-preview-button"
                >
                  إغلاق
                </button>
              </div>

              <div
                className="meeting-print-page"
                id="teacher-meeting-print"
              >
                <div className="print-school-header">
                  <div>
                    <strong>
                      مدارس الأندلس الأهلية
                    </strong>

                    <span>
                      متوسطة وثانوية الأندلس
                      الأهلية بالطائف - بنات
                    </span>
                  </div>

                  <div className="print-logo-placeholder">
                    الأندلس
                  </div>
                </div>

                <div className="print-title">
                  <h1>
                    محضر اجتماع فردي
                    لمتابعة المعلمة
                  </h1>

                  <p>
                    العام الدراسي
                  </p>
                </div>

                <div className="print-info-grid">
                  <div>
                    <strong>
                      اسم المعلمة:
                    </strong>

                    <span>
                      {
                        selectedTeacher.name
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      التخصص:
                    </strong>

                    <span>
                      {
                        selectedTeacher.specialty
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      المشرفة:
                    </strong>

                    <span>
                      {
                        selectedTeacher.supervisor
                      }
                    </span>
                  </div>

                  <div>
                    <strong>
                      تاريخ الاجتماع:
                    </strong>

                    <span>
                      {
                        selectedTeacher
                          .meeting.date ||
                        "ــــــــــــ"
                      }
                    </span>
                  </div>
                </div>

                <PrintSection
                  title="أبرز نقاط القوة"
                  text={
                    selectedTeacher.meeting
                      .strengths
                  }
                />

          
                <PrintSection
                  title="التوصيات"
                  text={
                    selectedTeacher.meeting
                      .recommendations
                  }
                />

                <PrintSection
                  title="المأمول خلال العام"
                  text={
                    selectedTeacher.meeting
                      .expected
                  }
                />

                <div className="print-evaluation-section">
                  <h3>
                    التقييم والمتابعة
                  </h3>

                  <div className="print-evaluation-grid">
                    <div>
                      <strong>
                        المديرة
                      </strong>

                      <p>
                        {
                          selectedTeacher
                            .meeting
                            .managerNotes ||
                          "ــــــــــــــــــــــــــــــــ"
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        الوكيلة
                      </strong>

                      <p>
                        {
                          selectedTeacher
                            .meeting
                            .deputyNotes ||
                          "ــــــــــــــــــــــــــــــــ"
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        المشرفة
                      </strong>

                      <p>
                        {
                          selectedTeacher
                            .meeting
                            .supervisorNotes ||
                          "ــــــــــــــــــــــــــــــــ"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="print-signatures">
                  <div>
                    <strong>
                      مديرة المدرسة
                    </strong>
                    <span>
                      خيرية الخالدي
                    </span>
                    <div />
                  </div>

                  <div>
                    <strong>
                      المشرفة المختصة
                    </strong>

                    <span>
                      {
                        selectedTeacher.supervisor
                      }
                    </span>

                    <div />
                  </div>

                  <div>
                    <strong>
                      المعلمة
                    </strong>

                    <span>
                      {
                        selectedTeacher.name
                      }
                    </span>

                    <div />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

/* =====================================================
   المكونات المساعدة
===================================================== */

function EmptyState({
  icon,
  title,
  text,
  buttonText,
  onClick,
}) {
  return (
    <div className="teacher-empty-state">
      <div>
        {icon}
      </div>

      <h4>
        {title}
      </h4>

      <p>
        {text}
      </p>

      <button
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

function RecordCard({
  title,
  date,
  score,
  status,
  onDelete,
  children,
}) {
  return (
    <article className="record-card">
      <div className="record-card-head">
        <div>
          <h4>
            {title}
          </h4>

          <span>
            📅 {date}
          </span>
        </div>

        <div className="record-card-actions">
          {status && (
            <span
              className={`record-status ${
                status === "مطبقة"
                  ? "done"
                  : ""
              }`}
            >
              {status}
            </span>
          )}

          {Number(score) > 0 && (
            <span className="record-score">
              {score}%
            </span>
          )}

          <button
            onClick={onDelete}
            title="حذف"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="record-card-content">
        {children}
      </div>
    </article>
  );
}

function IndicatorItem({
  title,
  value,
  icon,
}) {
  return (
    <div className="indicator-item">
      <div className="indicator-item-icon">
        {icon}
      </div>

      <div className="indicator-item-info">
        <div>
          <strong>
            {title}
          </strong>

          <span>
            {value}%
          </span>
        </div>

        <div className="mini-progress">
          <div
            style={{
              width: `${value}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function FormModal({
  title,
  children,
  onClose,
  onSave,
}) {
  return (
    <div
      className="teacher-form-modal-overlay"
      onClick={onClose}
    >
      <div
        className="teacher-form-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="teacher-form-modal-head">
          <div>
            <span>
              توثيق المتابعة
            </span>

            <h3>
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="teacher-form-modal-body">
          {children}
        </div>

        <div className="teacher-form-modal-footer">
          <button
            className="secondary-modal-button"
            onClick={onClose}
          >
            إلغاء
          </button>

          <button
            className="primary-modal-button"
            onClick={onSave}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="modal-form-field">
      <label>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
}) {
  return (
    <div className="modal-form-field full">
      <label>
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={4}
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="modal-form-field">
      <label>
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
            {label.includes("التقييم") &&
              option !== "0"
              ? "%"
              : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

function PrintSection({
  title,
  text,
}) {
  return (
    <section className="print-section">
      <h3>
        {title}
      </h3>

      <div>
        {text?.trim()
          ? text
          : "لم يتم تسجيل بيانات."}
      </div>
    </section>
  );
}

export default TeacherDashboard;