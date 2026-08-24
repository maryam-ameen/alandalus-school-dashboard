import React, { useState } from "react";
import "./CommitteesDashboard.css";

const committees = [
  {
    id: 1,
    title: "اللجنة الإدارية",
    icon: "📋",
    description:
      "متابعة الأعمال والمهام الإدارية وتنظيم أعمال اللجنة.",
    members: [],
    meetings: [],
  },
  {
    id: 2,
    title: "لجنة التحصيل الدراسي",
    icon: "📊",
    description:
      "متابعة مستوى التحصيل الدراسي ووضع الإجراءات التحسينية.",
    members: [],
    meetings: [],
  },
  {
    id: 3,
    title: "لجنة التوجيه والإرشاد",
    icon: "🧭",
    description:
      "متابعة الجوانب الإرشادية والتربوية ودعم الطالبات.",
    members: [],
    meetings: [],
  },
  {
    id: 4,
    title: "لجنة الأمن والسلامة",
    icon: "🛡️",
    description:
      "متابعة إجراءات الأمن والسلامة وخطط الطوارئ والإخلاء.",
    members: [],
    meetings: [],
  },
  {
    id: 5,
    title: "لجنة التميز",
    icon: "🏆",
    description:
      "متابعة التميز والجودة والمبادرات والممارسات المتميزة.",
    members: [],
    meetings: [],
  },
];

function CommitteesDashboard() {
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const [meetingForm, setMeetingForm] = useState({
    number: "",
    day: "الأحد",
    subject: "",
    date: "",
    time: "",
    location: "",
    semester: "الفصل الدراسي الأول",
    status: "قادم",
    link: "",
    notes: "",
    decisions: "",
  });

  /* =========================
     الإحصائيات
  ========================= */

  const totalCommittees = committees.length;

  const totalMembers = committees.reduce(
    (total, committee) => total + committee.members.length,
    0
  );

  const totalMeetings = committees.reduce(
    (total, committee) => total + committee.meetings.length,
    0
  );

  const upcomingMeetings = committees.reduce(
    (total, committee) =>
      total +
      committee.meetings.filter(
        (meeting) => meeting.status === "قادم"
      ).length,
    0
  );

  const completedMeetings = committees.reduce(
    (total, committee) =>
      total +
      committee.meetings.filter(
        (meeting) => meeting.status === "منفذ"
      ).length,
    0
  );

  const pendingMeetings = committees.reduce(
    (total, committee) =>
      total +
      committee.meetings.filter(
        (meeting) => meeting.status === "متأخر"
      ).length,
    0
  );

  /* =========================
     فتح وإغلاق مودال الاجتماع
  ========================= */

  const openMeetingModal = () => {
    setMeetingForm({
      number: "",
      day: "الأحد",
      subject: "",
      date: "",
      time: "",
      location: "",
      semester: "الفصل الدراسي الأول",
      status: "قادم",
      link: "",
      notes: "",
      decisions: "",
    });

    setShowMeetingModal(true);
  };

  const closeMeetingModal = () => {
    setShowMeetingModal(false);
  };

  const handleMeetingChange = (e) => {
    const { name, value } = e.target;

    setMeetingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveMeeting = () => {
    if (!meetingForm.number || !meetingForm.subject) {
      alert("فضلاً أدخلي رقم الاجتماع وموضوع الاجتماع");
      return;
    }

    alert("تم حفظ الاجتماع بنجاح");
    setShowMeetingModal(false);
  };

  return (
    <div className="committees-dashboard" dir="rtl">

      {/* =========================================
          الهيدر
      ========================================= */}

      <header className="committees-header">

        <div className="committees-header-text">

          <span className="committees-kicker">
            متوسطة وثانوية الأندلس بالطائف - بنات
          </span>

          <h1>
            مركز إدارة اللجان
          </h1>

          <p>
            منصة رقمية لتنظيم أعمال اللجان المدرسية
            ومتابعة أعضائها واجتماعاتها وقراراتها.
          </p>

        </div>

        <div className="committees-header-icon">
          👥
        </div>

      </header>


      {/* =========================================
          الرؤية
      ========================================= */}

      <section className="info-card vision-card">

        <div className="info-card-icon">
          🌟
        </div>

        <div>

          <span className="info-card-label">
            رؤيتنا
          </span>

          <h2>
            منظومة تعليمية رائدة، تبني جيلاً يمتلك قدرات تعلم عالمية.
          </h2>

        </div>

      </section>


      {/* =========================================
          الرسالة
      ========================================= */}

      <section className="info-card message-card">

        <div className="info-card-icon">
          💬
        </div>

        <div>

          <span className="info-card-label">
            رسالتنا
          </span>

          <p>
            بناء جيل رائد يحب التعلم يرعاه فريق معد في مؤسسة
            تربوية معاصرة تحكمها قيم أصيلة وتلبي تطلعات المجتمع.
          </p>

        </div>

      </section>


      {/* =========================================
          القيم
      ========================================= */}

      <section className="info-card values-card">

        <div className="info-card-icon">
          💜
        </div>

        <div className="values-content">

          <span className="info-card-label">
            قيمنا
          </span>

          <div className="values-list">

            <span>التعلم</span>
            <span>المسؤولية</span>
            <span>الاستقامة</span>
            <span>الإبداع</span>

          </div>

        </div>

      </section>


      {/* =========================================
          هدف سجل اللجان
      ========================================= */}

      <section className="info-card goal-card">

        <div className="info-card-icon">
          🎯
        </div>

        <div>

          <span className="info-card-label">
            هدف سجل اللجان
          </span>

          <p>
            دعم الخطط التطويرية الهادفة لرفع مستوى الجودة
            العملية التربوية والتعليمية وتشجيع أوجه الإبداع
            والتميز المدرسي.
          </p>

        </div>

      </section>


      {/* =========================================
          آلية التفعيل
      ========================================= */}

      <section className="info-card activation-card">

        <div className="info-card-icon">
          ⚙️
        </div>

        <div>

          <span className="info-card-label">
            آلية التفعيل
          </span>

          <ul className="activation-list">

            <li>
              يتم تشكيل اللجان والفرق المدرسية وعددها خمس لجان.
            </li>

            <li>
              يتم تحديد مهام كل لجنة ومسؤولياتها كما وردت في الدليل التنظيمي.
            </li>

            <li>
              يتم عمل قرارات تكليف للمعلمات باللجان المسؤولة عنها.
            </li>

            <li>
              يتم عقد الاجتماعات الدورية حسب ما هو محدد بجدولها الزمني،
              من اجتماعين إلى ثلاثة اجتماعات لكل لجنة خلال الفصل الدراسي،
              وحسب الحاجة إلى عقد اجتماعات طارئة.
            </li>

          </ul>

        </div>

      </section>


      {/* =========================================
          المستفيدون
      ========================================= */}

      <section className="info-card beneficiaries-card">

        <div className="info-card-icon">
          👥
        </div>

        <div>

          <span className="info-card-label">
            المستفيدون من السجل
          </span>

          <div className="beneficiaries-list">

            <div>
              <strong>1</strong>
              <span>وكيلة</span>
            </div>

            <div>
              <strong>16</strong>
              <span>معلمة</span>
            </div>

            <div>
              <strong>3</strong>
              <span>إداريات</span>
            </div>

            <div>
              <strong>252</strong>
              <span>طالبة</span>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          إحصائيات اللجان
      ========================================= */}

      <section className="committees-stats-section">

        <div className="section-heading">

          <div>
            <span>نظرة سريعة</span>
            <h2>إحصائيات اللجان</h2>
          </div>

        </div>


        <div className="committees-stats">

          <div className="committee-stat-card">
            <span className="stat-icon">📋</span>

            <div>
              <strong>{totalCommittees}</strong>
              <span>اللجان المدرسية</span>
            </div>
          </div>


          <div className="committee-stat-card">
            <span className="stat-icon">👥</span>

            <div>
              <strong>{totalMembers}</strong>
              <span>أعضاء اللجان</span>
            </div>
          </div>


          <div className="committee-stat-card">
            <span className="stat-icon">📅</span>

            <div>
              <strong>{totalMeetings}</strong>
              <span>جميع الاجتماعات</span>
            </div>
          </div>


          <div className="committee-stat-card">
            <span className="stat-icon">🕐</span>

            <div>
              <strong>{upcomingMeetings}</strong>
              <span>الاجتماعات القادمة</span>
            </div>
          </div>


          <div className="committee-stat-card">
            <span className="stat-icon">✅</span>

            <div>
              <strong>{completedMeetings}</strong>
              <span>الاجتماعات المنفذة</span>
            </div>
          </div>


          <div className="committee-stat-card">
            <span className="stat-icon">⌛</span>

            <div>
              <strong>{pendingMeetings}</strong>
              <span>الاجتماعات المتأخرة</span>
            </div>
          </div>

        </div>

      </section>


      {/* =========================================
          اللجان الخمس
      ========================================= */}

      <section className="committees-list-section">

        <div className="section-heading">

          <div>

            <span>
              دليل اللجان
            </span>

            <h2>
              اللجان المدرسية
            </h2>

          </div>

          <div className="committee-count">
            {totalCommittees}
          </div>

        </div>


        <div className="committees-grid">

          {committees.map((committee) => (

            <article
              className="committee-card"
              key={committee.id}
            >

              <div className="committee-card-top">

                <div className="committee-icon">
                  {committee.icon}
                </div>

                <span className="committee-number">
                  0{committee.id}
                </span>

              </div>


              <h3>
                {committee.title}
              </h3>


              <p>
                {committee.description}
              </p>


              <div className="committee-card-info">

                <span>
                  👥 {committee.members.length} أعضاء
                </span>

                <span>
                  📅 {committee.meetings.length} اجتماعات
                </span>

              </div>


              <button
                className="open-committee-button"
                onClick={() =>
                  setSelectedCommittee(committee)
                }
              >
                فتح اللجنة
                <span>←</span>
              </button>

            </article>

          ))}

        </div>

      </section>


      {/* =========================================
          تفاصيل اللجنة
      ========================================= */}

      {selectedCommittee && (

        <div className="committee-details-overlay">

          <div className="committee-details-modal">

            <button
              className="close-details-button"
              onClick={() =>
                setSelectedCommittee(null)
              }
            >
              ×
            </button>


            <div className="committee-details-header">

              <div className="large-committee-icon">
                {selectedCommittee.icon}
              </div>

              <div>

                <span>
                  اللجنة المدرسية
                </span>

                <h2>
                  {selectedCommittee.title}
                </h2>

              </div>

            </div>


            <div className="committee-detail-tabs">

              <button className="active">
                📋 القرار والتشكيل
              </button>

              <button>
                👥 الأعضاء
              </button>

              <button>
                📅 الاجتماعات
              </button>

              <button>
                📊 الإحصائية
              </button>

            </div>


            <div className="committee-detail-content">

              <div className="empty-detail-icon">
                📋
              </div>

              <h3>
                سيتم تجهيز بيانات اللجنة هنا
              </h3>

              <p>
                سيتم إضافة القرار والأعضاء والاجتماعات
                والإحصائيات الخاصة بهذه اللجنة في المرحلة التالية.
              </p>

            </div>

          </div>

        </div>

      )}


      {/* =========================================
          مودال إضافة اجتماع
      ========================================= */}

      {showMeetingModal && (

        <div className="meeting-modal-overlay">

          <div className="meeting-modal">

            <button
              className="meeting-close-button"
              onClick={closeMeetingModal}
            >
              ×
            </button>


            <span className="modal-small-title">
              تنظيم المتابعة
            </span>

            <h2>
              إضافة اجتماع جديد
            </h2>


            <div className="meeting-form-grid">

              <div className="form-field">

                <label>
                  رقم الاجتماع
                </label>

                <input
                  type="text"
                  name="number"
                  value={meetingForm.number}
                  onChange={handleMeetingChange}
                  placeholder="مثال: 1"
                />

              </div>


              <div className="form-field">

                <label>
                  اليوم
                </label>

                <select
                  name="day"
                  value={meetingForm.day}
                  onChange={handleMeetingChange}
                >

                  <option>الأحد</option>
                  <option>الاثنين</option>
                  <option>الثلاثاء</option>
                  <option>الأربعاء</option>
                  <option>الخميس</option>

                </select>

              </div>


              <div className="form-field full">

                <label>
                  موضوع الاجتماع
                </label>

                <input
                  type="text"
                  name="subject"
                  value={meetingForm.subject}
                  onChange={handleMeetingChange}
                  placeholder="اكتبي موضوع الاجتماع"
                />

              </div>


              <div className="form-field">

                <label>
                  التاريخ
                </label>

                <input
                  type="date"
                  name="date"
                  value={meetingForm.date}
                  onChange={handleMeetingChange}
                />

              </div>


              <div className="form-field">

                <label>
                  الوقت
                </label>

                <input
                  type="time"
                  name="time"
                  value={meetingForm.time}
                  onChange={handleMeetingChange}
                />

              </div>


              <div className="form-field">

                <label>
                  مكان الاجتماع
                </label>

                <input
                  type="text"
                  name="location"
                  value={meetingForm.location}
                  onChange={handleMeetingChange}
                  placeholder="مثال: قاعة الاجتماعات"
                />

              </div>


              <div className="form-field">

                <label>
                  الفصل الدراسي
                </label>

                <select
                  name="semester"
                  value={meetingForm.semester}
                  onChange={handleMeetingChange}
                >

                  <option>
                    الفصل الدراسي الأول
                  </option>

                  <option>
                    الفصل الدراسي الثاني
                  </option>


                </select>

              </div>


              <div className="form-field">

                <label>
                  حالة الاجتماع
                </label>

                <select
                  name="status"
                  value={meetingForm.status}
                  onChange={handleMeetingChange}
                >

                  <option value="قادم">
                    قادم
                  </option>

                  <option value="منفذ">
                    منفذ
                  </option>

                  <option value="متأخر">
                    متأخر
                  </option>

                </select>

              </div>


              <div className="form-field">

                <label>
                  رابط المرفق
                </label>

                <input
                  type="url"
                  name="link"
                  value={meetingForm.link}
                  onChange={handleMeetingChange}
                  placeholder="https://"
                />

              </div>


              <div className="form-field full">

                <label>
                  الملاحظات / المحضر
                </label>

                <textarea
                  name="notes"
                  value={meetingForm.notes}
                  onChange={handleMeetingChange}
                  rows="4"
                />

              </div>


              <div className="form-field full">

                <label>
                  التوصيات والقرارات
                </label>

                <textarea
                  name="decisions"
                  value={meetingForm.decisions}
                  onChange={handleMeetingChange}
                  rows="4"
                />

              </div>

            </div>


            <div className="meeting-modal-actions">

              <button
                className="save-meeting-button"
                onClick={saveMeeting}
              >
                حفظ الاجتماع
              </button>

              <button
                className="cancel-meeting-button"
                onClick={closeMeetingModal}
              >
                إلغاء
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default CommitteesDashboard;