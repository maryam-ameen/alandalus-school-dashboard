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

const emptyTask = {
  task: "",
  assigned_to: "",
  due_date: "",
  status: "لم تبدأ",
};

/* =========================================================
   Signature Pad
========================================================= */

const SignaturePad = ({ value, onSave, disabled = false }) => {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!value) return;

    const image = new Image();

    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x:
        (event.clientX - rect.left) *
        (canvas.width / rect.width),

      y:
        (event.clientY - rect.top) *
        (canvas.height / rect.height),
    };
  };

  const startDrawing = (event) => {
    if (disabled) return;

    event.preventDefault();

    const point = getPoint(event);

    drawingRef.current = true;
    lastPointRef.current = point;

    canvasRef.current.setPointerCapture?.(
      event.pointerId
    );
  };

  const draw = (event) => {
    if (disabled || !drawingRef.current) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const point = getPoint(event);

    ctx.beginPath();

    ctx.moveTo(
      lastPointRef.current.x,
      lastPointRef.current.y
    );

    ctx.lineTo(point.x, point.y);

    ctx.strokeStyle = "#174ea6";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();

    lastPointRef.current = point;
  };

  const stopDrawing = () => {
    if (disabled || !drawingRef.current) return;

    drawingRef.current = false;

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

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

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

  const [attendance, setAttendance] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showMinutes, setShowMinutes] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingMeeting, setEditingMeeting] =
    useState(null);

  const [meeting, setMeeting] =
    useState(emptyMeeting);

  const [agendaItems, setAgendaItems] =
    useState([""]);

  const [decisionItems, setDecisionItems] =
    useState([""]);

  const [newTask, setNewTask] =
    useState(emptyTask);

  /* =========================================================
     Initial Load
  ========================================================= */

  useEffect(() => {
    loadMeetings();
    loadMembers();
  }, []);

  /* =========================================================
     Meetings
  ========================================================= */

  const loadMeetings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      alert(
        "حدث خطأ أثناء تحميل الاجتماعات:\n\n" +
          error.message
      );

      setLoading(false);
      return;
    }

    setMeetings(data || []);
    setLoading(false);
  };

  /* =========================================================
     Members
     IMPORTANT:
     أعضاء الاجتماعات موجودون في meeting_members
     id = bigint
  ========================================================= */

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("meeting_members")
      .select(
        "id, name, job_title, is_active, created_at"
      )
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Load members error:",
        error
      );

      alert(
        "حدث خطأ أثناء تحميل العضوات:\n\n" +
          error.message
      );

      setMembers([]);
      return;
    }

    setMembers(data || []);
  };

  /* =========================================================
     General Meeting Change
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMeeting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     Arabic Day
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
     Agenda
  ========================================================= */

  const addAgendaItem = () => {
    setAgendaItems((prev) => [
      ...prev,
      "",
    ]);
  };

  const updateAgendaItem = (
    index,
    value
  ) => {
    setAgendaItems((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
      )
    );
  };

  const removeAgendaItem = (index) => {
    setAgendaItems((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      return updated.length
        ? updated
        : [""];
    });
  };

  /* =========================================================
     Decisions
  ========================================================= */

  const addDecisionItem = () => {
    setDecisionItems((prev) => [
      ...prev,
      "",
    ]);
  };

  const updateDecisionItem = (
    index,
    value
  ) => {
    setDecisionItems((prev) =>
      prev.map((item, i) =>
        i === index ? value : item
      )
    );
  };

  const removeDecisionItem = (
    index
  ) => {
    setDecisionItems((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      return updated.length
        ? updated
        : [""];
    });
  };

  /* =========================================================
     Add Meeting
  ========================================================= */

  const handleAddMeeting = async () => {
    if (
      !meeting.number.trim() ||
      !meeting.date ||
      !meeting.topic.trim()
    ) {
      alert(
        "فضلاً أكملِ رقم الاجتماع والتاريخ وموضوع الاجتماع"
      );

      return;
    }

    setSaving(true);

    const payload = {
      meeting_number: Number(
        meeting.number
      ),

      meeting_date: meeting.date,

      meeting_time:
        meeting.time || null,

      meeting_place:
        meeting.place || null,

      meeting_status:
        meeting.status,

      subject:
        meeting.topic,

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
    };

    const { data, error } =
      await supabase
        .from("meetings")
        .insert([payload])
        .select()
        .single();

    if (error) {
      console.error(error);

      alert(
        "حدث خطأ أثناء حفظ الاجتماع:\n\n" +
          error.message
      );

      setSaving(false);
      return;
    }

    setMeetings((prev) => [
      data,
      ...prev,
    ]);

    setMeeting(emptyMeeting);
    setAgendaItems([""]);
    setDecisionItems([""]);

    setShowModal(false);
    setSaving(false);
  };

  /* =========================================================
     Open Meeting
  ========================================================= */

  const handleOpenMeeting = async (
    item
  ) => {
    setEditingMeeting(item);

    setMeeting({
      number:
        item.meeting_number?.toString() ||
        "",

      date:
        item.meeting_date || "",

      day:
        getArabicDay(
          item.meeting_date
        ),

      topic:
        item.subject || "",

      time:
        item.meeting_time || "",

      place:
        item.meeting_place || "",

      status:
        item.meeting_status ||
        "قادم",
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

    setNewTask(emptyTask);

    await Promise.all([
      loadAttendance(item.id),
      loadSignatures(item.id),
      loadTasks(item.id),
    ]);

    setShowMinutes(true);
  };

  /* =========================================================
     Update Meeting
  ========================================================= */

  const handleUpdateMeeting =
    async () => {
      if (!editingMeeting) return;

      setSaving(true);

      const payload = {
        meeting_number: Number(
          meeting.number
        ),

        meeting_date:
          meeting.date,

        meeting_time:
          meeting.time || null,

        meeting_place:
          meeting.place || null,

        meeting_status:
          meeting.status,

        subject:
          meeting.topic,

        notes:
          agendaItems
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
            .join("\n") || null,

        recommendations:
          decisionItems
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
            .join("\n") || null,

        updated_at:
          new Date().toISOString(),
      };

      const { data, error } =
        await supabase
          .from("meetings")
          .update(payload)
          .eq(
            "id",
            editingMeeting.id
          )
          .select()
          .single();

      if (error) {
        console.error(error);

        alert(
          "حدث خطأ أثناء تحديث المحضر:\n\n" +
            error.message
        );

        setSaving(false);
        return;
      }

      setMeetings((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? data
            : item
        )
      );

      setEditingMeeting(data);

      alert(
        "تم حفظ التعديلات بنجاح ✓"
      );

      setSaving(false);
    };

  /* =========================================================
     Delete Meeting
  ========================================================= */

  const handleDelete = async (
    id
  ) => {
    if (
      !window.confirm(
        "هل تريدين حذف هذا الاجتماع؟"
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("meetings")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(error);

      alert(
        "حدث خطأ أثناء حذف الاجتماع:\n\n" +
          error.message
      );

      return;
    }

    setMeetings((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    if (
      editingMeeting?.id === id
    ) {
      setShowMinutes(false);
      setEditingMeeting(null);
    }
  };

  /* =========================================================
     Attendance
     meeting_attendance:
       meeting_id = uuid
       member_id = bigint
       attendance_status = text
  ========================================================= */

  const loadAttendance = async (
    meetingId
  ) => {
    const { data, error } =
      await supabase
        .from("meeting_attendance")
        .select(
          "id, meeting_id, member_id, attendance_status, created_at"
        )
        .eq(
          "meeting_id",
          meetingId
        );

    if (error) {
      console.error(
        "Load attendance error:",
        error
      );

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
     Is Attended
  ========================================================= */

  const isAttended = (
    memberId
  ) => {
    return attendance.some(
      (item) =>
        Number(item.member_id) ===
          Number(memberId) &&
        item.attendance_status ===
          "حاضر"
    );
  };

  /* =========================================================
     Toggle Attendance
  ========================================================= */

  const toggleAttendance =
    async (memberId) => {
      if (!editingMeeting) {
        alert(
          "لم يتم تحديد الاجتماع"
        );

        return;
      }

      const numericMemberId =
        Number(memberId);

      const current =
        attendance.find(
          (item) =>
            Number(
              item.member_id
            ) === numericMemberId
        );

      const currentlyPresent =
        current?.attendance_status ===
        "حاضر";

      const newStatus =
        currentlyPresent
          ? "غائب"
          : "حاضر";

      const payload = {
        meeting_id:
          editingMeeting.id,

        member_id:
          numericMemberId,

        attendance_status:
          newStatus,
      };

      const { data, error } =
        await supabase
          .from(
            "meeting_attendance"
          )
          .upsert(
            payload,
            {
              onConflict:
                "meeting_id,member_id",
            }
          )
          .select()
          .single();

      if (error) {
        console.error(
          "Attendance error:",
          error
        );

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
        const exists =
          prev.some(
            (item) =>
              Number(
                item.member_id
              ) === numericMemberId
          );

        if (exists) {
          return prev.map(
            (item) =>
              Number(
                item.member_id
              ) === numericMemberId
                ? data
                : item
          );
        }

        return [
          ...prev,
          data,
        ];
      });

      /* إذا أصبحت غائبة نحذف التوقيع */

      if (
        newStatus !== "حاضر"
      ) {
        const {
          error:
            signatureDeleteError,
        } = await supabase
          .from(
            "meeting_signatures"
          )
          .delete()
          .eq(
            "meeting_id",
            editingMeeting.id
          )
          .eq(
            "member_id",
            numericMemberId
          );

        if (
          signatureDeleteError
        ) {
          console.error(
            "Signature delete error:",
            signatureDeleteError
          );
        }

        setSignatures((prev) =>
          prev.filter(
            (item) =>
              Number(
                item.member_id
              ) !== numericMemberId
          )
        );
      }
    };

  /* =========================================================
     Signatures
     meeting_signatures:
       id = uuid
       meeting_id = uuid
       member_id = bigint
       signature_data = text
       signature = text
  ========================================================= */

  const loadSignatures = async (
    meetingId
  ) => {
    const { data, error } =
      await supabase
        .from(
          "meeting_signatures"
        )
        .select(
          `
            id,
            meeting_id,
            member_id,
            signer_name,
            signature_data,
            signed_at,
            created_at,
            signature
          `
        )
        .eq(
          "meeting_id",
          meetingId
        );

    if (error) {
      console.error(
        "Load signatures error:",
        error
      );

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
     Get Signature
  ========================================================= */

  const getSignature = (
    memberId
  ) => {
    const item =
      signatures.find(
        (signature) =>
          Number(
            signature.member_id
          ) === Number(memberId)
      );

    return (
      item?.signature_data ||
      item?.signature ||
      ""
    );
  };

  /* =========================================================
     Save Signature
  ========================================================= */

  const saveSignature = async (
    memberId,
    signature
  ) => {
    if (!editingMeeting) {
      alert(
        "لم يتم تحديد الاجتماع"
      );

      return;
    }

    const numericMemberId =
      Number(memberId);

    /* لا يسمح بالتوقيع إلا للحاضرة */

    if (
      !isAttended(
        numericMemberId
      )
    ) {
      alert(
        "حددي الحاضرة أولًا، وبعدها يصبح التوقيع متاحًا."
      );

      return;
    }

    /* حذف التوقيع */

    if (!signature) {
      const { error } =
        await supabase
          .from(
            "meeting_signatures"
          )
          .delete()
          .eq(
            "meeting_id",
            editingMeeting.id
          )
          .eq(
            "member_id",
            numericMemberId
          );

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
          (item) =>
            Number(
              item.member_id
            ) !== numericMemberId
        )
      );

      return;
    }

    const member =
      members.find(
        (item) =>
          Number(item.id) ===
          numericMemberId
      );

    const payload = {
      meeting_id:
        editingMeeting.id,

      member_id:
        numericMemberId,

      signer_name:
        member?.name || null,

      signature_data:
        signature,

      signature:
        signature,

      signed_at:
        new Date().toISOString(),
    };

    const { data, error } =
      await supabase
        .from(
          "meeting_signatures"
        )
        .upsert(
          payload,
          {
            onConflict:
              "meeting_id,member_id",
          }
        )
        .select()
        .single();

    if (error) {
      console.error(
        "Signature error:",
        error
      );

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
      const exists =
        prev.some(
          (item) =>
            Number(
              item.member_id
            ) === numericMemberId
        );

      if (exists) {
        return prev.map(
          (item) =>
            Number(
              item.member_id
            ) === numericMemberId
              ? data
              : item
        );
      }

      return [
        ...prev,
        data,
      ];
    });
  };

  /* =========================================================
     Tasks
  ========================================================= */

  const loadTasks = async (
    meetingId
  ) => {
    const { data, error } =
      await supabase
        .from("meeting_tasks")
        .select("*")
        .eq(
          "meeting_id",
          meetingId
        )
        .order("created_at", {
          ascending: true,
        });

    if (error) {
      console.error(error);
      setTasks([]);
      return;
    }

    setTasks(data || []);
  };

  const addTask = async () => {
    if (!editingMeeting) return;

    if (!newTask.task.trim()) {
      alert(
        "اكتبي المهمة أولًا"
      );

      return;
    }

    const assignedValue =
      newTask.assigned_to
        ? Number(
            newTask.assigned_to
          )
        : null;

    const { data, error } =
      await supabase
        .from("meeting_tasks")
        .insert([
          {
            meeting_id:
              editingMeeting.id,

            task:
              newTask.task.trim(),

            assigned_to:
              assignedValue,

            due_date:
              newTask.due_date ||
              null,

            status:
              newTask.status,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(error);

      alert(
        "حدث خطأ أثناء إضافة المهمة:\n\n" +
          error.message
      );

      return;
    }

    setTasks((prev) => [
      ...prev,
      data,
    ]);

    setNewTask(emptyTask);
  };

  const deleteTask = async (
    taskId
  ) => {
    const { error } =
      await supabase
        .from("meeting_tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
      console.error(error);

      alert(
        "حدث خطأ أثناء حذف المهمة"
      );

      return;
    }

    setTasks((prev) =>
      prev.filter(
        (item) =>
          item.id !== taskId
      )
    );
  };

  const getMemberName = (
    memberId
  ) => {
    const member =
      members.find(
        (item) =>
          Number(item.id) ===
          Number(memberId)
      );

    return (
      member?.name ||
      "غير محدد"
    );
  };

  /* =========================================================
     Print
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
            تنظيم محاضر الاجتماعات ومتابعة
            القرارات والتوصيات والحضور
            والتوقيعات والتكليفات في مكان واحد.
          </p>
        </div>
      </header>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="meetings-stats">
        <div className="meeting-stat-card">
          <span>
            إجمالي الاجتماعات
          </span>

          <strong>
            {meetings.length}
          </strong>

          <div className="stat-icon">
            📋
          </div>
        </div>

        <div className="meeting-stat-card">
          <span>
            الاجتماعات القادمة
          </span>

          <strong>
            {
              meetings.filter(
                (item) =>
                  item.meeting_status ===
                  "قادم"
              ).length
            }
          </strong>

          <div className="stat-icon">
            🕐
          </div>
        </div>

        <div className="meeting-stat-card">
          <span>
            الاجتماعات المنفذة
          </span>

          <strong>
            {
              meetings.filter(
                (item) =>
                  item.meeting_status ===
                  "منفذ"
              ).length
            }
          </strong>

          <div className="stat-icon">
            ✓
          </div>
        </div>

        <div className="meeting-stat-card">
          <span>
            محاضر الاجتماعات
          </span>

          <strong>
            {meetings.length}
          </strong>

          <div className="stat-icon">
            📄
          </div>
        </div>
      </section>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <section className="meetings-toolbar">
        <div>
          <h2>
            سجل الاجتماعات
          </h2>

          <p>
            أضيفي الاجتماعات وتابعي
            محاضرها وقراراتها بسهولة.
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
            <h3>
              جاري تحميل الاجتماعات...
            </h3>
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
              ابدئي بإضافة أول اجتماع
              للمدرسة.
            </p>

            <button
              onClick={() => {
                setMeeting(
                  emptyMeeting
                );

                setAgendaItems([
                  "",
                ]);

                setDecisionItems([
                  "",
                ]);

                setEditingMeeting(
                  null
                );

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
                      item.meeting_status ===
                      "منفذ"
                        ? "completed"
                        : ""
                    }`}
                  >
                    {item.meeting_status}
                  </span>
                </div>

                <div className="meeting-details">
                  <span>
                    📅{" "}
                    {item.meeting_date}
                  </span>

                  <span>
                    {getArabicDay(
                      item.meeting_date
                    )}
                  </span>

                  {item.meeting_time && (
                    <span>
                      🕐{" "}
                      {
                        item.meeting_time
                      }
                    </span>
                  )}

                  {item.meeting_place && (
                    <span>
                      📍{" "}
                      {
                        item.meeting_place
                      }
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
                          (
                            note,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                            >
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
                    handleOpenMeeting(
                      item
                    )
                  }
                >
                  فتح المحضر
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      item.id
                    )
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
                  value={
                    meeting.number
                  }
                  onChange={
                    handleChange
                  }
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
                  value={
                    meeting.topic
                  }
                  onChange={
                    handleChange
                  }
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
                  value={
                    meeting.date
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  الوقت
                </label>

                <input
                  type="time"
                  name="time"
                  value={
                    meeting.time
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  مكان الاجتماع
                </label>

                <input
                  type="text"
                  name="place"
                  value={
                    meeting.place
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="مثال: قاعة الاجتماعات"
                />
              </div>

              <div className="form-group">
                <label>
                  حالة الاجتماع
                </label>

                <select
                  name="status"
                  value={
                    meeting.status
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="قادم">
                    قادم
                  </option>

                  <option value="منفذ">
                    منفذ
                  </option>
                </select>
              </div>

              <div className="form-group full agenda-editor">
                <label>
                  بنود الاجتماع
                </label>

                <div className="bullet-items">
                  {agendaItems.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="bullet-item"
                        key={`agenda-${index}`}
                      >
                        <span className="bullet-dot">
                          •
                        </span>

                        <input
                          type="text"
                          value={
                            item
                          }
                          onChange={(
                            event
                          ) =>
                            updateAgendaItem(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                          placeholder={`البند ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() =>
                            removeAgendaItem(
                              index
                            )
                          }
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
                  onClick={
                    addAgendaItem
                  }
                >
                  ＋ إضافة بند
                </button>
              </div>

              <div className="form-group full agenda-editor">
                <label>
                  التوصيات والقرارات
                </label>

                <div className="bullet-items">
                  {decisionItems.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="bullet-item"
                        key={`decision-${index}`}
                      >
                        <span className="bullet-dot">
                          •
                        </span>

                        <input
                          type="text"
                          value={
                            item
                          }
                          onChange={(
                            event
                          ) =>
                            updateDecisionItem(
                              index,
                              event
                                .target
                                .value
                            )
                          }
                          placeholder={`التوصية / القرار ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() =>
                            removeDecisionItem(
                              index
                            )
                          }
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
                  onClick={
                    addDecisionItem
                  }
                >
                  ＋ إضافة توصية / قرار
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="save-meeting-btn"
                onClick={
                  handleAddMeeting
                }
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

      {showMinutes &&
        editingMeeting && (
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
                    {
                      meeting.number
                    }
                  </h2>
                </div>

                <div className="minutes-header-actions">
                  <button
                    onClick={
                      handlePrint
                    }
                    className="print-btn"
                  >
                    🖨️ طباعة المحضر
                  </button>

                  <button
                    onClick={() =>
                      setShowMinutes(
                        false
                      )
                    }
                    className="modal-close"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* =================================================
                  Meeting Info
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
                      value={
                        meeting.number
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      التاريخ
                    </label>

                    <input
                      type="date"
                      name="date"
                      value={
                        meeting.date
                      }
                      onChange={
                        handleChange
                      }
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
                      value={
                        meeting.time
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      المكان
                    </label>

                    <input
                      type="text"
                      name="place"
                      value={
                        meeting.place
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      الحالة
                    </label>

                    <select
                      name="status"
                      value={
                        meeting.status
                      }
                      onChange={
                        handleChange
                      }
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
                      value={
                        meeting.topic
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  Agenda
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
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="bullet-item"
                          key={`minutes-agenda-${index}`}
                        >
                          <span className="bullet-dot">
                            •
                          </span>

                          <input
                            type="text"
                            value={
                              item
                            }
                            onChange={(
                              event
                            ) =>
                              updateAgendaItem(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                          />

                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() =>
                              removeAgendaItem(
                                index
                              )
                            }
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
                    onClick={
                      addAgendaItem
                    }
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
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="bullet-item"
                          key={`minutes-decision-${index}`}
                        >
                          <span className="bullet-dot">
                            •
                          </span>

                          <input
                            type="text"
                            value={
                              item
                            }
                            onChange={(
                              event
                            ) =>
                              updateDecisionItem(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                          />

                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() =>
                              removeDecisionItem(
                                index
                              )
                            }
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
                    onClick={
                      addDecisionItem
                    }
                  >
                    ＋ إضافة توصية / قرار
                  </button>
                </div>
              </section>

              {/* =================================================
                  Tasks
              ================================================= */}

              <section className="minutes-section">
                <h3>
                  📌 التكليفات والمهام
                </h3>

                <div className="task-form">
                  <input
                    type="text"
                    placeholder="اكتبي المهمة أو التكليف"
                    value={
                      newTask.task
                    }
                    onChange={(
                      event
                    ) =>
                      setNewTask({
                        ...newTask,
                        task:
                          event
                            .target
                            .value,
                      })
                    }
                  />

                  <select
                    value={
                      newTask.assigned_to
                    }
                    onChange={(
                      event
                    ) =>
                      setNewTask({
                        ...newTask,
                        assigned_to:
                          event
                            .target
                            .value,
                      })
                    }
                  >
                    <option value="">
                      المكلفة بالمهمة
                    </option>

                    {members.map(
                      (member) => (
                        <option
                          key={
                            member.id
                          }
                          value={
                            member.id
                          }
                        >
                          {
                            member.name
                          }
                        </option>
                      )
                    )}
                  </select>

                  <input
                    type="date"
                    value={
                      newTask.due_date
                    }
                    onChange={(
                      event
                    ) =>
                      setNewTask({
                        ...newTask,
                        due_date:
                          event
                            .target
                            .value,
                      })
                    }
                  />

                  <select
                    value={
                      newTask.status
                    }
                    onChange={(
                      event
                    ) =>
                      setNewTask({
                        ...newTask,
                        status:
                          event
                            .target
                            .value,
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
                    className="add-task-btn"
                    onClick={
                      addTask
                    }
                  >
                    ＋ إضافة
                  </button>
                </div>

                {tasks.length > 0 && (
                  <div className="tasks-list">
                    {tasks.map(
                      (task) => (
                        <div
                          className="task-item"
                          key={
                            task.id
                          }
                        >
                          <div>
                            <strong>
                              {
                                task.task
                              }
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
                                {
                                  task.due_date
                                }
                              </small>
                            )}
                          </div>

                          <span>
                            {
                              task.status
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              deleteTask(
                                task.id
                              )
                            }
                          >
                            🗑
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* =================================================
                  ATTENDANCE + SIGNATURE
                  نفس الصف
              ================================================= */}

              <section className="minutes-section attendance-signatures-section">
                <div className="section-heading-row">
                  <div>
                    <h3>
                      ✍️ الحضور والتوقيعات
                    </h3>

                    <p>
                      حددي الحاضرة أولًا، وبعدها
                      يصبح التوقيع متاحًا لها.
                    </p>
                  </div>

                  <div className="attendance-count">
                    حاضرون:{" "}
                    <strong>
                      {
                        attendance.filter(
                          (item) =>
                            item.attendance_status ===
                            "حاضر"
                        ).length
                      }
                    </strong>{" "}
                    /{" "}
                    {members.length}
                  </div>
                </div>

                {members.length === 0 ? (
                  <div className="no-members-message">
                    لا توجد عضوات في جدول
                    meeting_members
                  </div>
                ) : (
                  <div className="attendance-table">
                    <div className="attendance-table-header">
                      <div>
                        الحضور
                      </div>

                      <div>
                        الاسم
                      </div>

                      <div>
                        الوظيفة
                      </div>

                      <div>
                        التوقيع
                      </div>
                    </div>

                    {members.map(
                      (member) => {
                        const attended =
                          isAttended(
                            member.id
                          );

                        const signature =
                          getSignature(
                            member.id
                          );

                        return (
                          <div
                            className={`attendance-row ${
                              attended
                                ? "row-present"
                                : "row-absent"
                            }`}
                            key={
                              member.id
                            }
                          >
                            {/* الحضور */}

                            <div className="attendance-cell attendance-cell-check">
                              <label
                                className={`attendance-toggle ${
                                  attended
                                    ? "checked"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    attended
                                  }
                                  onChange={() =>
                                    toggleAttendance(
                                      member.id
                                    )
                                  }
                                />

                                <span className="custom-check">
                                  {attended
                                    ? "✓"
                                    : ""}
                                </span>

                                <span>
                                  {attended
                                    ? "حاضرة"
                                    : "غائبة"}
                                </span>
                              </label>
                            </div>

                            {/* الاسم */}

                            <div className="attendance-cell member-name-cell">
                              <strong>
                                {
                                  member.name
                                }
                              </strong>
                            </div>

                            {/* الوظيفة */}

                            <div className="attendance-cell member-job-cell">
                              <span>
                                {
                                  member.job_title ||
                                  "—"
                                }
                              </span>
                            </div>

                            {/* التوقيع */}

                            <div className="attendance-cell signature-cell">
                              <SignaturePad
                                value={
                                  signature
                                }
                                disabled={
                                  !attended
                                }
                                onSave={(
                                  value
                                ) =>
                                  saveSignature(
                                    member.id,
                                    value
                                  )
                                }
                              />

                              {!attended && (
                                <small className="signature-disabled-text">
                                  سجلي الحضور أولًا
                                </small>
                              )}

                              {attended &&
                                signature && (
                                  <span className="signature-saved">
                                    ✓ تم حفظ التوقيع
                                  </span>
                                )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </section>

              {/* =================================================
                  Footer
              ================================================= */}

              <div className="minutes-footer">
                <button
                  type="button"
                  className="save-meeting-btn"
                  onClick={
                    handleUpdateMeeting
                  }
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
                    setShowMinutes(
                      false
                    )
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