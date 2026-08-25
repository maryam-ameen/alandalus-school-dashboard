import React, { useEffect, useRef, useState } from "react";
import "./MeetingsDashboard.css";
import { supabase } from "../../lib/supabase";

const emptyMeeting = {
  number: "",
  date: "",
  day: "اليوم",
  topic: "",
  time: "",
  place: "",
  status: "قادم",
};

/* =========================================================
   لوحة التوقيع
========================================================= */

const SignaturePad = ({ value, onSave, disabled = false }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!value) return;

    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = value;
  }, [value]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (event) => {
    if (disabled) return;

    event.preventDefault();

    const point = getPoint(event);

    drawing.current = true;
    lastPoint.current = point;

    canvasRef.current.setPointerCapture?.(event.pointerId);
  };

  const draw = (event) => {
    if (disabled || !drawing.current) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const point = getPoint(event);

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();

    lastPoint.current = point;
  };

  const stopDrawing = () => {
    if (disabled || !drawing.current) return;

    drawing.current = false;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const signature = canvas.toDataURL("image/png");

    onSave(signature);
  };

  const clearSignature = () => {
    if (disabled) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    onSave("");
  };

  return (
    <div className="signature-pad-wrapper">
      <canvas
        ref={canvasRef}
        width={300}
        height={90}
        className={`signature-pad ${
          disabled ? "signature-disabled" : ""
        }`}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
      />

      <button
        type="button"
        className="clear-signature-btn"
        onClick={clearSignature}
        disabled={disabled}
      >
        مسح
      </button>
    </div>
  );
};

/* =========================================================
   Meetings Dashboard
========================================================= */

const MeetingsDashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [members, setMembers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showMinutes, setShowMinutes] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingMeeting, setEditingMeeting] = useState(null);

  const [meeting, setMeeting] = useState(emptyMeeting);

  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const [agendaItems, setAgendaItems] = useState([""]);
  const [decisionItems, setDecisionItems] = useState([""]);

  const [newTask, setNewTask] = useState({
    task: "",
    assigned_to: "",
    due_date: "",
    status: "لم تبدأ",
  });

  /* =========================================================
     تحميل البيانات
  ========================================================= */

  useEffect(() => {
    loadMeetings();
    loadMembers();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: false });

    if (error) {
      console.error("Load meetings error:", error);
      alert("حدث خطأ أثناء تحميل الاجتماعات");
      setLoading(false);
      return;
    }

    setMeetings(data || []);
    setLoading(false);
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("meeting_members")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Load members error:", error);
      alert("حدث خطأ أثناء تحميل قائمة الأعضاء");
      return;
    }

    setMembers(data || []);
  };

  /* =========================================================
     تغيير بيانات الاجتماع
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMeeting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     أيام الأسبوع
  ========================================================= */

  const getArabicDay = (date) => {
    if (!date) return "—";

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
     بنود الاجتماع
  ========================================================= */

  const addAgendaItem = () => {
    setAgendaItems((prev) => [...prev, ""]);
  };

  const updateAgendaItem = (index, value) => {
    setAgendaItems((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const removeAgendaItem = (index) => {
    setAgendaItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      return updated.length ? updated : [""];
    });
  };

  /* =========================================================
     القرارات والتوصيات
  ========================================================= */

  const addDecisionItem = () => {
    setDecisionItems((prev) => [...prev, ""]);
  };

  const updateDecisionItem = (index, value) => {
    setDecisionItems((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const removeDecisionItem = (index) => {
    setDecisionItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      return updated.length ? updated : [""];
    });
  };

  /* =========================================================
     إضافة اجتماع
  ========================================================= */

  const handleAddMeeting = async () => {
    if (
      !meeting.number.trim() ||
      !meeting.date ||
      !meeting.topic.trim()
    ) {
      alert("فضلاً أكملِ رقم الاجتماع والتاريخ وموضوع الاجتماع");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("meetings")
      .insert([
        {
          meeting_number: Number(meeting.number),
          meeting_date: meeting.date,
          meeting_time: meeting.time || null,
          meeting_place: meeting.place || null,
          meeting_status: meeting.status,
          subject: meeting.topic,

          notes:
            agendaItems
              .map((item) => item.trim())
              .filter(Boolean)
              .join("\n") || null,

          recommendations:
            decisionItems
              .map((item) => item.trim())
              .filter(Boolean)
              .join("\n") || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Add meeting error:", error);

      alert(
        "حدث خطأ أثناء حفظ الاجتماع:\n\n" +
          error.message +
          "\n\n" +
          (error.details || "") +
          "\n\n" +
          (error.hint || "")
      );

      setSaving(false);
      return;
    }

    setMeetings((prev) => [data, ...prev]);

    setMeeting(emptyMeeting);
    setAgendaItems([""]);
    setDecisionItems([""]);

    setShowModal(false);
    setSaving(false);
  };

  /* =========================================================
     فتح المحضر
  ========================================================= */

  const handleOpenMeeting = async (item) => {
    setEditingMeeting(item);

    setMeeting({
      number: item.meeting_number?.toString() || "",
      date: item.meeting_date || "",
      day: getArabicDay(item.meeting_date),
      topic: item.subject || "",
      time: item.meeting_time || "",
      place: item.meeting_place || "",
      status: item.meeting_status || "قادم",
    });

    setAgendaItems(
      item.notes
        ? item.notes
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean)
        : [""]
    );

    setDecisionItems(
      item.recommendations
        ? item.recommendations
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean)
        : [""]
    );

    setNewTask({
      task: "",
      assigned_to: "",
      due_date: "",
      status: "لم تبدأ",
    });

    await Promise.all([
      loadAttendance(item.id),
      loadTasks(item.id),
      loadSignatures(item.id),
    ]);

    setShowMinutes(true);
  };

  /* =========================================================
     تحديث الاجتماع
  ========================================================= */

  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return;

    setSaving(true);

    const { data, error } = await supabase
      .from("meetings")
      .update({
        meeting_number: Number(meeting.number),
        meeting_date: meeting.date,
        meeting_time: meeting.time || null,
        meeting_place: meeting.place || null,
        meeting_status: meeting.status,
        subject: meeting.topic,

        notes:
          agendaItems
            .map((item) => item.trim())
            .filter(Boolean)
            .join("\n") || null,

        recommendations:
          decisionItems
            .map((item) => item.trim())
            .filter(Boolean)
            .join("\n") || null,

        updated_at: new Date().toISOString(),
      })
      .eq("id", editingMeeting.id)
      .select()
      .single();

    if (error) {
      console.error("Update meeting error:", error);

      alert(
        "حدث خطأ أثناء تحديث المحضر:\n\n" +
          error.message
      );

      setSaving(false);
      return;
    }

    setMeetings((prev) =>
      prev.map((item) =>
        item.id === data.id ? data : item
      )
    );

    setEditingMeeting(data);

    alert("تم حفظ التعديلات بنجاح ✓");

    setSaving(false);
  };

  /* =========================================================
     حذف الاجتماع
  ========================================================= */

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريدين حذف هذا الاجتماع؟")) {
      return;
    }

    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete meeting error:", error);

      alert("حدث خطأ أثناء حذف الاجتماع");
      return;
    }

    setMeetings((prev) =>
      prev.filter((item) => item.id !== id)
    );

    if (editingMeeting?.id === id) {
      setShowMinutes(false);
      setEditingMeeting(null);
    }
  };

  /* =========================================================
     تحميل الحضور
  ========================================================= */

  const loadAttendance = async (meetingId) => {
    const { data, error } = await supabase
      .from("meeting_attendance")
      .select(`
        id,
        meeting_id,
        member_id,
        attendance_status,
        created_at
      `)
      .eq("meeting_id", meetingId);

    if (error) {
      console.error("Load attendance error:", error);

      alert(
        "حدث خطأ أثناء تحميل الحضور:\n\n" +
          error.message
      );

      setAttendance([]);
      return;
    }

    setAttendance(data || []);
  };

  /* =========================================================
     هل العضوة حاضرة؟
  ========================================================= */

  const isAttended = (memberId) => {
    return attendance.some(
      (item) =>
        item.member_id === memberId &&
        item.attendance_status === "حاضر"
    );
  };

  /* =========================================================
     حفظ / تغيير الحضور
  ========================================================= */

  const toggleAttendance = async (memberId) => {
    if (!editingMeeting) {
      alert("لم يتم تحديد الاجتماع");
      return;
    }

    const current = attendance.find(
      (item) => item.member_id === memberId
    );

    const currentlyPresent =
      current?.attendance_status === "حاضر";

    const newStatus = currentlyPresent
      ? "غائب"
      : "حاضر";

    const { data, error } = await supabase
      .from("meeting_attendance")
      .upsert(
        {
          meeting_id: editingMeeting.id,
          member_id: memberId,
          attendance_status: newStatus,
        },
        {
          onConflict: "meeting_id,member_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Attendance error:", error);

      alert(
        "حدث خطأ أثناء حفظ الحضور:\n\n" +
          error.message +
          "\n\n" +
          (error.details || "") +
          "\n\n" +
          (error.hint || "")
      );

      return;
    }

    setAttendance((prev) => {
      const exists = prev.some(
        (item) => item.member_id === memberId
      );

      if (exists) {
        return prev.map((item) =>
          item.member_id === memberId ? data : item
        );
      }

      return [...prev, data];
    });

    /* حذف التوقيع إذا أصبحت غائبة */

    if (newStatus !== "حاضر") {
      const { error: signatureError } = await supabase
        .from("meeting_signatures")
        .delete()
        .eq("meeting_id", editingMeeting.id)
        .eq("member_id", memberId);

      if (signatureError) {
        console.error(
          "Signature delete error:",
          signatureError
        );
      }

      setSignatures((prev) =>
        prev.filter(
          (item) => item.member_id !== memberId
        )
      );
    }
  };

  /* =========================================================
     تحميل المهام
  ========================================================= */

  const loadTasks = async (meetingId) => {
    const { data, error } = await supabase
      .from("meeting_tasks")
      .select("*")
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Load tasks error:", error);
      setTasks([]);
      return;
    }

    setTasks(data || []);
  };

  /* =========================================================
     إضافة مهمة
  ========================================================= */

  const addTask = async () => {
    if (!editingMeeting) return;

    if (!newTask.task.trim()) {
      alert("اكتبي المهمة أولاً");
      return;
    }

    const { data, error } = await supabase
      .from("meeting_tasks")
      .insert([
        {
          meeting_id: editingMeeting.id,
          task: newTask.task.trim(),

          assigned_to: newTask.assigned_to
            ? Number(newTask.assigned_to)
            : null,

          due_date: newTask.due_date || null,
          status: newTask.status,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Add task error:", error);

      alert(
        "حدث خطأ أثناء إضافة المهمة:\n\n" +
          error.message
      );

      return;
    }

    setTasks((prev) => [...prev, data]);

    setNewTask({
      task: "",
      assigned_to: "",
      due_date: "",
      status: "لم تبدأ",
    });
  };

  /* =========================================================
     حذف مهمة
  ========================================================= */

  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from("meeting_tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Delete task error:", error);

      alert("حدث خطأ أثناء حذف المهمة");
      return;
    }

    setTasks((prev) =>
      prev.filter((item) => item.id !== taskId)
    );
  };

  /* =========================================================
     اسم العضوة
  ========================================================= */

  const getMemberName = (memberId) => {
    const member = members.find(
      (item) => item.id === memberId
    );

    return member?.name || "غير محدد";
  };

  /* =========================================================
     تحميل التوقيعات
  ========================================================= */

  const loadSignatures = async (meetingId) => {
    const { data, error } = await supabase
      .from("meeting_signatures")
      .select(`
        id,
        meeting_id,
        member_id,
        signer_name,
        signature,
        signature_data,
        signed_at,
        created_at
      `)
      .eq("meeting_id", meetingId);

    if (error) {
      console.error("Load signatures error:", error);

      alert(
        "حدث خطأ أثناء تحميل التوقيعات:\n\n" +
          error.message
      );

      setSignatures([]);
      return;
    }

    setSignatures(data || []);
  };

  /* =========================================================
     الحصول على توقيع العضوة
  ========================================================= */

  const getSignature = (memberId) => {
    const item = signatures.find(
      (signature) =>
        signature.member_id === memberId
    );

    return (
      item?.signature_data ||
      item?.signature ||
      ""
    );
  };

  /* =========================================================
     حفظ التوقيع
  ========================================================= */

  const saveSignature = async (
    memberId,
    signature
  ) => {
    if (!editingMeeting) {
      alert("لم يتم تحديد الاجتماع");
      return;
    }

    if (!isAttended(memberId)) {
      alert("يجب تسجيل الحضور أولًا");
      return;
    }

    /* حذف التوقيع */

    if (!signature) {
      const { error } = await supabase
        .from("meeting_signatures")
        .delete()
        .eq("meeting_id", editingMeeting.id)
        .eq("member_id", memberId);

      if (error) {
        console.error(
          "Delete signature error:",
          error
        );

        alert(
          "حدث خطأ أثناء حذف التوقيع:\n\n" +
            error.message
        );

        return;
      }

      setSignatures((prev) =>
        prev.filter(
          (item) => item.member_id !== memberId
        )
      );

      return;
    }

    const member = members.find(
      (item) => item.id === memberId
    );

    const payload = {
      meeting_id: editingMeeting.id,
      member_id: memberId,
      signer_name: member?.name || null,

      signature: signature,
      signature_data: signature,

      signed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("meeting_signatures")
      .upsert(payload, {
        onConflict: "meeting_id,member_id",
      })
      .select()
      .single();

    if (error) {
      console.error("Signature error:", error);

      alert(
        "حدث خطأ أثناء حفظ التوقيع:\n\n" +
          error.message +
          "\n\n" +
          (error.details || "") +
          "\n\n" +
          (error.hint || "")
      );

      return;
    }

    setSignatures((prev) => {
      const exists = prev.some(
        (item) => item.member_id === memberId
      );

      if (exists) {
        return prev.map((item) =>
          item.member_id === memberId
            ? data
            : item
        );
      }

      return [...prev, data];
    });
  };

  /* =========================================================
     الطباعة
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div
      className="meetings-dashboard"
      dir="rtl"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="meetings-header">
        <div>
          <h1>
            اجتماعات متوسطة وثانوية الأندلس الأهلية بالطائف - بنات
          </h1>

          <p>
            تنظيم محاضر الاجتماعات ومتابعة القرارات
            والتوصيات والحضور والتوقيعات والتكليفات
            في مكان واحد.
          </p>
        </div>
      </header>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="meetings-stats">

        <div className="meeting-stat-card">
          <span>إجمالي الاجتماعات</span>
          <strong>{meetings.length}</strong>
          <div className="stat-icon">📋</div>
        </div>

        <div className="meeting-stat-card">
          <span>الاجتماعات القادمة</span>

          <strong>
            {
              meetings.filter(
                (item) =>
                  item.meeting_status === "قادم"
              ).length
            }
          </strong>

          <div className="stat-icon">🕐</div>
        </div>

        <div className="meeting-stat-card">
          <span>الاجتماعات المنفذة</span>

          <strong>
            {
              meetings.filter(
                (item) =>
                  item.meeting_status === "منفذ"
              ).length
            }
          </strong>

          <div className="stat-icon">✓</div>
        </div>

        <div className="meeting-stat-card">
          <span>محاضر الاجتماعات</span>
          <strong>{meetings.length}</strong>
          <div className="stat-icon">📄</div>
        </div>

      </section>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <section className="meetings-toolbar">

        <div>
          <h2>سجل الاجتماعات</h2>

          <p>
            أضيفي الاجتماعات وتابعي محاضرها وقراراتها بسهولة.
          </p>
        </div>

        <button
          className="add-meeting-btn"
          onClick={() => {
            setMeeting(emptyMeeting);
            setAgendaItems([""]);
            setDecisionItems([""]);
            setEditingMeeting(null);
            setShowModal(true);
          }}
        >
          <span>＋</span>
          إضافة اجتماع جديد
        </button>

      </section>

      {/* =====================================================
          MEETINGS LIST
      ===================================================== */}

      <section className="meetings-list">

        {loading ? (

          <div className="empty-meetings">
            <h3>جاري تحميل الاجتماعات...</h3>
          </div>

        ) : meetings.length === 0 ? (

          <div className="empty-meetings">

            <div className="empty-icon">
              📅
            </div>

            <h3>
              لا توجد اجتماعات حتى الآن
            </h3>

            <p>
              ابدئي بإضافة أول اجتماع للمدرسة.
            </p>

            <button
              onClick={() => {
                setMeeting(emptyMeeting);
                setAgendaItems([""]);
                setDecisionItems([""]);
                setShowModal(true);
              }}
            >
              إضافة اجتماع
            </button>

          </div>

        ) : (

          meetings.map((item) => (

            <article
              className="meeting-card"
              key={item.id}
            >

              <div className="meeting-number">

                <span>
                  الاجتماع
                </span>

                <strong>
                  {item.meeting_number}
                </strong>

              </div>

              <div className="meeting-main">

                <div className="meeting-card-top">

                  <h3>
                    {item.subject}
                  </h3>

                  <span
                    className={`meeting-status ${
                      item.meeting_status === "منفذ"
                        ? "completed"
                        : ""
                    }`}
                  >
                    {item.meeting_status}
                  </span>

                </div>

                <div className="meeting-details">

                  <span>
                    📅 {item.meeting_date}
                  </span>

                  <span>
                    {getArabicDay(
                      item.meeting_date
                    )}
                  </span>

                  {item.meeting_time && (
                    <span>
                      🕐 {item.meeting_time}
                    </span>
                  )}

                  {item.meeting_place && (
                    <span>
                      📍 {item.meeting_place}
                    </span>
                  )}

                </div>

                {item.notes && (
                  <div className="meeting-preview">

                    <strong>
                      بنود الاجتماع:
                    </strong>

                    <ul>
                      {item.notes
                        .split("\n")
                        .filter(Boolean)
                        .map(
                          (note, index) => (
                            <li key={index}>
                              {note}
                            </li>
                          )
                        )}
                    </ul>

                  </div>
                )}

              </div>

              <div className="meeting-actions">

                <button
                  className="view-btn"
                  onClick={() =>
                    handleOpenMeeting(item)
                  }
                >
                  فتح المحضر
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  🗑
                </button>

              </div>

            </article>

          ))

        )}

      </section>

      {/* =====================================================
          ADD MEETING MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="meeting-modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="meeting-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setShowModal(false)
              }
            >
              ×
            </button>

            <div className="modal-title">

              <span>📅</span>

              <div>
                <small>
                  تنظيم الاجتماعات
                </small>

                <h2>
                  إضافة اجتماع جديد
                </h2>
              </div>

            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  رقم الاجتماع
                </label>

                <input
                  type="number"
                  name="number"
                  value={meeting.number}
                  onChange={handleChange}
                  placeholder="مثال: 1"
                />

              </div>

              <div className="form-group">

                <label>
                  اليوم
                </label>

                <input
                  type="text"
                  value={getArabicDay(
                    meeting.date
                  )}
                  readOnly
                />

              </div>

              <div className="form-group full">

                <label>
                  موضوع الاجتماع
                </label>

                <input
                  type="text"
                  name="topic"
                  value={meeting.topic}
                  onChange={handleChange}
                  placeholder="اكتبي موضوع الاجتماع"
                />

              </div>

              <div className="form-group">

                <label>
                  التاريخ
                </label>

                <input
                  type="date"
                  name="date"
                  value={meeting.date}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  الوقت
                </label>

                <input
                  type="time"
                  name="time"
                  value={meeting.time}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  مكان الاجتماع
                </label>

                <input
                  type="text"
                  name="place"
                  value={meeting.place}
                  onChange={handleChange}
                  placeholder="مثال: قاعة الاجتماعات"
                />

              </div>

              <div className="form-group">

                <label>
                  حالة الاجتماع
                </label>

                <select
                  name="status"
                  value={meeting.status}
                  onChange={handleChange}
                >
                  <option value="قادم">
                    قادم
                  </option>

                  <option value="منفذ">
                    منفذ
                  </option>
                </select>

              </div>

              {/* بنود الاجتماع */}

              <div className="form-group full agenda-editor">

                <label>
                  بنود الاجتماع
                </label>

                <div className="bullet-items">

                  {agendaItems.map(
                    (item, index) => (

                      <div
                        className="bullet-item"
                        key={`agenda-${index}`}
                      >

                        <span className="bullet-dot">
                          •
                        </span>

                        <input
                          type="text"
                          value={item}
                          onChange={(event) =>
                            updateAgendaItem(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`البند ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeAgendaItem(
                              index
                            )
                          }
                          className="remove-item-btn"
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

                <button
                  type="button"
                  className="add-item-btn"
                  onClick={addAgendaItem}
                >
                  ＋ إضافة بند
                </button>

              </div>

              {/* القرارات */}

              <div className="form-group full agenda-editor">

                <label>
                  التوصيات والقرارات
                </label>

                <div className="bullet-items">

                  {decisionItems.map(
                    (item, index) => (

                      <div
                        className="bullet-item"
                        key={`decision-${index}`}
                      >

                        <span className="bullet-dot">
                          •
                        </span>

                        <input
                          type="text"
                          value={item}
                          onChange={(event) =>
                            updateDecisionItem(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`التوصية / القرار ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeDecisionItem(
                              index
                            )
                          }
                          className="remove-item-btn"
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

                <button
                  type="button"
                  className="add-item-btn"
                  onClick={addDecisionItem}
                >
                  ＋ إضافة توصية / قرار
                </button>

              </div>

            </div>

            <div className="modal-actions">

              <button
                className="save-meeting-btn"
                onClick={handleAddMeeting}
                disabled={saving}
              >
                {saving
                  ? "جاري الحفظ..."
                  : "حفظ الاجتماع"}
              </button>

              <button
                className="cancel-meeting-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                إلغاء
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          MINUTES MODAL
      ===================================================== */}

      {showMinutes && editingMeeting && (

        <div
          className="meeting-modal-overlay minutes-overlay"
          onClick={() =>
            setShowMinutes(false)
          }
        >

          <div
            className="meeting-minutes-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Header */}

            <div className="minutes-header">

              <div>

                <small>
                  محضر الاجتماع
                </small>

                <h2>
                  الاجتماع رقم{" "}
                  {meeting.number}
                </h2>

              </div>

              <div className="minutes-header-actions">

                <button
                  onClick={handlePrint}
                  className="print-btn"
                >
                  🖨️ طباعة المحضر
                </button>

                <button
                  onClick={() =>
                    setShowMinutes(false)
                  }
                  className="modal-close"
                >
                  ×
                </button>

              </div>

            </div>

            {/* =================================================
                بيانات الاجتماع
            ================================================= */}

            <section className="minutes-section">

              <h3>
                📋 بيانات الاجتماع
              </h3>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    رقم الاجتماع
                  </label>

                  <input
                    type="number"
                    name="number"
                    value={meeting.number}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    التاريخ
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={meeting.date}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    اليوم
                  </label>

                  <input
                    type="text"
                    value={getArabicDay(
                      meeting.date
                    )}
                    readOnly
                  />

                </div>

                <div className="form-group">

                  <label>
                    الوقت
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={meeting.time}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    المكان
                  </label>

                  <input
                    type="text"
                    name="place"
                    value={meeting.place}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>
                    الحالة
                  </label>

                  <select
                    name="status"
                    value={meeting.status}
                    onChange={handleChange}
                  >

                    <option value="قادم">
                      قادم
                    </option>

                    <option value="منفذ">
                      منفذ
                    </option>

                  </select>

                </div>

                <div className="form-group full">

                  <label>
                    الموضوع
                  </label>

                  <input
                    type="text"
                    name="topic"
                    value={meeting.topic}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                البنود والتوصيات
            ================================================= */}

            <section className="minutes-section">

              <h3>
                📝 بنود الاجتماع والتوصيات
              </h3>

              <div className="form-group agenda-editor">

                <label>
                  بنود الاجتماع
                </label>

                <div className="bullet-items">

                  {agendaItems.map(
                    (item, index) => (

                      <div
                        className="bullet-item"
                        key={`minutes-agenda-${index}`}
                      >

                        <span className="bullet-dot">
                          •
                        </span>

                        <input
                          type="text"
                          value={item}
                          onChange={(event) =>
                            updateAgendaItem(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`البند ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeAgendaItem(
                              index
                            )
                          }
                          className="remove-item-btn"
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

                <button
                  type="button"
                  className="add-item-btn"
                  onClick={addAgendaItem}
                >
                  ＋ إضافة بند
                </button>

              </div>

              <div className="form-group agenda-editor">

                <label>
                  التوصيات والقرارات
                </label>

                <div className="bullet-items">

                  {decisionItems.map(
                    (item, index) => (

                      <div
                        className="bullet-item"
                        key={`minutes-decision-${index}`}
                      >

                        <span className="bullet-dot">
                          •
                        </span>

                        <input
                          type="text"
                          value={item}
                          onChange={(event) =>
                            updateDecisionItem(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`التوصية / القرار ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeDecisionItem(
                              index
                            )
                          }
                          className="remove-item-btn"
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

                <button
                  type="button"
                  className="add-item-btn"
                  onClick={addDecisionItem}
                >
                  ＋ إضافة توصية / قرار
                </button>

              </div>

            </section>

            {/* =================================================
                المهام
            ================================================= */}

            <section className="minutes-section">

              <h3>
                📌 التكليفات والمهام
              </h3>

              <div className="task-form">

                <input
                  type="text"
                  placeholder="اكتبي المهمة أو التكليف"
                  value={newTask.task}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      task: event.target.value,
                    })
                  }
                />

                <select
                  value={newTask.assigned_to}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      assigned_to:
                        event.target.value,
                    })
                  }
                >

                  <option value="">
                    المكلفة بالمهمة
                  </option>

                  {members.map((member) => (

                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.name}
                    </option>

                  ))}

                </select>

                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      due_date:
                        event.target.value,
                    })
                  }
                />

                <select
                  value={newTask.status}
                  onChange={(event) =>
                    setNewTask({
                      ...newTask,
                      status:
                        event.target.value,
                    })
                  }
                >

                  <option value="لم تبدأ">
                    لم تبدأ
                  </option>

                  <option value="قيد التنفيذ">
                    قيد التنفيذ
                  </option>

                  <option value="مكتملة">
                    مكتملة
                  </option>

                </select>

                <button
                  type="button"
                  onClick={addTask}
                  className="add-task-btn"
                >
                  ＋ إضافة
                </button>

              </div>

              {tasks.length > 0 && (

                <div className="tasks-list">

                  {tasks.map((task) => (

                    <div
                      className="task-item"
                      key={task.id}
                    >

                      <div>

                        <strong>
                          {task.task}
                        </strong>

                        <small>
                          المكلفة:{" "}
                          {getMemberName(
                            task.assigned_to
                          )}
                        </small>

                        {task.due_date && (
                          <small>
                            تاريخ الإنجاز:{" "}
                            {task.due_date}
                          </small>
                        )}

                      </div>

                      <span>
                        {task.status}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                      >
                        🗑
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </section>

            {/* =================================================
                الحضور والتوقيعات
                الترتيب الجديد:
                الحضور | الاسم والوظيفة | التوقيع
            ================================================= */}

            <section className="minutes-section">

              <h3>
                ✍️ الحضور والتوقيعات
              </h3>

              <div className="signatures-list">

                {members.length === 0 ? (

                  <div className="empty-signatures">
                    لا توجد عضوات في جدول الأعضاء
                  </div>

                ) : (

                  members.map((member) => {

                    const attended =
                      isAttended(member.id);

                    const signature =
                      getSignature(member.id);

                    return (

                      <div
                        className={`signature-member ${
                          attended
                            ? "member-attended"
                            : "member-absent"
                        }`}
                        key={member.id}
                      >

                        {/* =================================================
                            1 - الحضور
                        ================================================= */}

                        <div className="attendance-check">

                          <input
                            id={`attendance-${member.id}`}
                            type="checkbox"
                            checked={attended}
                            onChange={() =>
                              toggleAttendance(
                                member.id
                              )
                            }
                          />

                          <label
                            htmlFor={`attendance-${member.id}`}
                          >
                            حضرت
                          </label>

                        </div>

                        {/* =================================================
                            2 - الاسم والوظيفة
                        ================================================= */}

                        <div className="signature-member-info">

                          <strong>
                            {member.name}
                          </strong>

                          {member.job_title && (
                            <small>
                              {member.job_title}
                            </small>
                          )}

                        </div>

                        {/* =================================================
                            3 - التوقيع
                        ================================================= */}

                        <div className="member-signature-area">

                          <div className="signature-title">

                            <span>
                              التوقيع
                            </span>

                            {!attended && (
                              <small>
                                سجلي الحضور أولًا
                              </small>
                            )}

                          </div>

                          <SignaturePad
                            value={signature}
                            disabled={!attended}
                            onSave={(value) =>
                              saveSignature(
                                member.id,
                                value
                              )
                            }
                          />

                        </div>

                      </div>

                    );
                  })

                )}

              </div>

            </section>

            {/* =================================================
                Footer
            ================================================= */}

            <div className="minutes-footer">

              <button
                type="button"
                className="save-meeting-btn"
                onClick={handleUpdateMeeting}
                disabled={saving}
              >
                {saving
                  ? "جاري الحفظ..."
                  : "💾 حفظ التعديلات"}
              </button>

              <button
                type="button"
                className="cancel-meeting-btn"
                onClick={() =>
                  setShowMinutes(false)
                }
              >
                إغلاق
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MeetingsDashboard;