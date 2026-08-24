import background from "./assets/background.jpg";
import logo from "./assets/logo.png";
import { useMemo, useState } from "react";

import CommitteesDashboard from "./boards/CommitteesDashboard.jsx";
import MeetingsDashboard from "./boards/meeting/MeetingsDashboard.jsx";
import TeacherDashboard from "./boards/teacher/teacherDashboard.jsx";

import "./App.css";

const initialBoards = [
  {
    title: "الخطة التشغيلية",
    description: "متابعة الخطة التشغيلية وأعمالها",
    icon: "📈",
  },
  {
    title: "اللجان وفرق العمل",
    description: "إدارة اللجان وفرق العمل المدرسية",
    icon: "👥",
  },
  {
    title: "متابعة المعلمات",
    description: "اجتماع فردي للمعلمات ومتابعتهن خلال العام",
    icon: "📁",
  },
  {
    title: "الاجتماعات",
    description: "تنظيم الاجتماعات ومحاضرها ومتابعتها",
    icon: "📝",
  },
  {
    title: "الاختبارات",
    description: "إدارة الاختبارات ومتابعتها",
    icon: "📊",
  },
  {
    title: "الشراكات",
    description: "إدارة الشراكات ومتابعتها",
    icon: "🤝",
  },
  {
    title: "الأمن والسلامة",
    description: "متابعة الأمن والسلامة المدرسية",
    icon: "🛡️",
  },
  {
    title: "النشاط الطلابي",
    description: "إدارة ومتابعة النشاط الطلابي",
    icon: "🎯",
  },
  {
    title: "الإشراف والمناوبة",
    description: "تنظيم الإشراف والمناوبات المدرسية",
    icon: "👩🏻‍🏫",
  },
  {
    title: "التعاميم",
    description: "حفظ وتنظيم التعاميم والتعليمات",
    icon: "📢",
  },
  {
    title: "المسائلات",
    description: "إدارة المسائلات ومتابعتها",
    icon: "📄",
  },
  {
    title: "منصة إعداد",
    description: "الوصول إلى منصة إعداد ومتابعة أعمالها",
    icon: "💻",
  },
  {
    title: "التواصل مع أولياء الأمور",
    description: "تنظيم ومتابعة التواصل مع أولياء الأمور",
    icon: "💬",
  },
  {
    title: "الزيارات الصفية",
    description: "تسجيل ومتابعة الزيارات الصفية",
    icon: "📋",
  },
  {
    title: "الإرشاد الطلابي",
    description: "متابعة أعمال الإرشاد الطلابي",
    icon: "🌷",
  },
  {
    title: "التطوير المهني",
    description: "متابعة التطوير المهني",
    icon: "📚",
  },
  {
    title: "معامل الأندلس",
    description: "متابعة المعامل وأداء التجارب العملية",
    icon: "⚠️",
  },
];

const BOARD_ICONS = [
  "💡",
  "📁",
  "🎯",
  "🤝",
  "🔍",
  "📅",
  "👩‍🏫",
  "🏫",
  "⭐",
  "📊",
  "📢",
  "🛡️",
  "📄",
  "📈",
  "👥",
  "📝",
  "📚",
  "💻",
];

const users = [
  {
    id: 1,
    name: "أ/خيرية الخالدي",
    role: "مديرة المدرسة",
    icon: "👩🏻‍💼",
    password: "1234",
  },
  {
    id: 2,
    name: "أ/شيماء القرشي",
    role: "وكيلة المرحلة الثانوية",
    icon: "👩🏻‍💼",
    password: "1234",
  },
  {
    id: 3,
    name: "أ/ نجلاء السريحي",
    role: "وكيلة المرحلة المتوسطة",
    icon: "👩🏻‍💼",
    password: "1234",
  },
  {
    id: 4,
    name: "أ/ صفية الشريف",
    role: "المرشدة الطلابية",
    icon: "👩🏻‍💼",
    password: "1234",
  },
  {
    id: 5,
    name: "منى",
    role: "رائدة النشاط",
    icon: "👩🏻‍💼",
    password: "1234",
  },
];

function App() {
  // =========================
  // تسجيل الدخول
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // =========================
  // اللوحات
  // =========================

  const [boards, setBoards] = useState(initialBoards);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // =========================
  // المفضلة
  // =========================

  const [favorites, setFavorites] = useState([]);

  // =========================
  // السحب والترتيب
  // =========================

  const [draggedIndex, setDraggedIndex] = useState(null);

  // =========================
  // التعديل
  // =========================

  const [editingIndex, setEditingIndex] = useState(null);

  const [editBoard, setEditBoard] = useState({
    title: "",
    description: "",
    icon: "",
  });

  // =========================
  // الحذف
  // =========================

  const [deleteIndex, setDeleteIndex] = useState(null);

  // =========================
  // اللوحة المفتوحة
  // =========================

  const [activeBoard, setActiveBoard] = useState(null);

  // =========================
  // إضافة لوحة جديدة
  // =========================

  const [showAddModal, setShowAddModal] = useState(false);

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [newBoardIcon, setNewBoardIcon] = useState("📁");

  // =========================
  // تسجيل الدخول
  // =========================

  const handleLogin = (e) => {
    e.preventDefault();

    if (!selectedUserId || !password.trim()) {
      alert("فضلاً اختاري المستخدم وأدخلي كلمة المرور");
      return;
    }

    const user = users.find(
      (item) => item.id === Number(selectedUserId)
    );

    if (!user) {
      alert("المستخدم غير موجود");
      return;
    }

    if (password !== user.password) {
      alert("كلمة المرور غير صحيحة");
      return;
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    setPassword("");
  };

  // =========================
  // تسجيل الخروج
  // =========================

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedUserId("");
    setPassword("");
    setSearch("");
    setFilter("all");
    setActiveBoard(null);
  };

  // =========================
  // المفضلة
  // =========================

  const toggleFavorite = (boardTitle) => {
    setFavorites((prev) => {
      if (prev.includes(boardTitle)) {
        return prev.filter((title) => title !== boardTitle);
      }

      return [...prev, boardTitle];
    });
  };

  const isFavorite = (boardTitle) => {
    return favorites.includes(boardTitle);
  };

  // =========================
  // حذف لوحة
  // =========================

  const handleDelete = (index) => {
    const confirmed = window.confirm(
      "هل أنتِ متأكدة من حذف هذه اللوحة؟"
    );

    if (!confirmed) return;

    const boardToDelete = boards[index];

    setBoards((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setFavorites((prev) =>
      prev.filter(
        (title) => title !== boardToDelete.title
      )
    );
  };

  // =========================
  // بدء تعديل
  // =========================

  const startEdit = (index) => {
    setEditingIndex(index);

    setEditBoard({
      title: boards[index].title,
      description: boards[index].description,
      icon: boards[index].icon,
    });
  };

  // =========================
  // حفظ التعديل
  // =========================

  const saveEdit = () => {
    if (!editBoard.title.trim()) {
      alert("اسم اللوحة لا يمكن أن يكون فارغًا");
      return;
    }

    const oldTitle = boards[editingIndex]?.title;

    setBoards((prev) =>
      prev.map((board, index) =>
        index === editingIndex
          ? {
              title: editBoard.title.trim(),
              description:
                editBoard.description ||
                "لوحة إدارية ومتابعة",
              icon: editBoard.icon || "📋",
            }
          : board
      )
    );

    if (
      oldTitle &&
      favorites.includes(oldTitle) &&
      oldTitle !== editBoard.title.trim()
    ) {
      setFavorites((prev) =>
        prev.map((title) =>
          title === oldTitle
            ? editBoard.title.trim()
            : title
        )
      );
    }

    setEditingIndex(null);

    setEditBoard({
      title: "",
      description: "",
      icon: "",
    });
  };

  // =========================
  // فتح اللوحة
  // =========================

  const handleOpenBoard = (board) => {
    if (!board) return;

    const boardTitle = board.title?.trim();

    // لوحة اللجان
    if (boardTitle === "اللجان وفرق العمل") {
      setActiveBoard(board);
      return;
    }

    // لوحة الاجتماعات
    if (boardTitle === "الاجتماعات") {
      setActiveBoard(board);
      return;
    }

    // لوحة متابعة المعلمات
    if (boardTitle === "متابعة المعلمات") {
      setActiveBoard(board);
      return;
    }

    // جميع اللوحات الأخرى
    alert(`سيتم فتح لوحة: ${boardTitle}`);
  };

  // =========================
  // إضافة لوحة
  // =========================

  const handleAddBoard = () => {
    setNewBoardTitle("");
    setNewBoardDescription("");
    setNewBoardIcon("📁");
    setShowAddModal(true);
  };

  const saveNewBoard = () => {
    if (!newBoardTitle.trim()) {
      alert("فضلاً اكتبي اسم اللوحة");
      return;
    }

    setBoards((prev) => [
      ...prev,
      {
        title: newBoardTitle.trim(),
        description:
          newBoardDescription.trim() ||
          "لوحة إدارية ومتابعة",
        icon: newBoardIcon,
      },
    ]);

    setShowAddModal(false);

    setNewBoardTitle("");
    setNewBoardDescription("");
    setNewBoardIcon("📁");
  };

  // =========================
  // البحث + الفلترة
  // =========================

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      const matchesSearch = board.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "favorites" &&
          favorites.includes(board.title));

      return matchesSearch && matchesFilter;
    });
  }, [boards, search, filter, favorites]);

  // =========================
  // السحب والترتيب
  // =========================

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (
      draggedIndex === null ||
      draggedIndex === targetIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    const updatedBoards = [...boards];

    const [movedBoard] =
      updatedBoards.splice(
        draggedIndex,
        1
      );

    updatedBoards.splice(
      targetIndex,
      0,
      movedBoard
    );

    setBoards(updatedBoards);
    setDraggedIndex(null);
  };

  // =========================
  // التاريخ
  // =========================

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString("ar-SA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // =========================
  // تسجيل الدخول
  // =========================

  if (!isLoggedIn) {
    return (
      <div
        className="login-page"
        style={{
          backgroundImage: `url(${background})`,
        }}
        dir="rtl"
      >
        <div className="login-card">

          <img
            src={logo}
            alt="شعار مدارس الأندلس الأهلية"
            className="login-logo"
          />

          <h1>
            منصة الإدارة المدرسية
          </h1>

          <p className="login-subtitle">
            تسجيل الدخول إلى منصة الإدارة المدرسية
          </p>

          <form onSubmit={handleLogin}>

            <div className="login-field">

              <label>
                اختاري المستخدم
              </label>

              <select
                value={selectedUserId}
                onChange={(e) =>
                  setSelectedUserId(e.target.value)
                }
              >

                <option value="">
                  اختاري المستخدم
                </option>

                {users.map((user) => (

                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name} — {user.role}
                  </option>

                ))}

              </select>

            </div>

            <div className="login-field">

              <label>
                كلمة المرور
              </label>

              <input
                type="password"
                placeholder="أدخلي كلمة المرور"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="login-button"
            >
              دخول
            </button>

          </form>

        </div>
      </div>
    );
  }

  // =====================================================
  // فتح اللوحات الداخلية
  // =====================================================

  if (activeBoard?.title === "اللجان وفرق العمل") {
  return <CommitteesDashboard />;
}

if (activeBoard?.title === "الاجتماعات") {
  return <MeetingsDashboard />;
}

if (activeBoard?.title === "متابعة المعلمات") {
  return (
    <TeacherDashboard
      board={activeBoard}
      onClose={() => setActiveBoard(null)}
    />
  );
}

  // =====================================================
  // الصفحة الرئيسية
  // =====================================================

  return (
    <div
      className="app"
      dir="rtl"
    >

      {/* =========================
          الهيدر
      ========================= */}

      <header className="top-header">

        <div className="user-box">

          <div className="notification-icon">
            🔔
            <span></span>
          </div>

          <div className="user-divider"></div>

          <div className="user-info">

            <strong>
              مرحبًا، {currentUser?.name}
            </strong>

            <span>
              {currentUser?.role}
            </span>

          </div>

          <div className="user-avatar">
            {currentUser?.icon || "👩🏻‍💼"}
          </div>

        </div>

        <button
          className="logout-icon-button"
          onClick={handleLogout}
          title="تسجيل الخروج"
          aria-label="تسجيل الخروج"
        >
          ↪
        </button>

      </header>

      {/* =========================
          الهيرو
      ========================= */}

      <section className="hero-section">

        <img
          src={logo}
          alt="شعار مدارس الأندلس الأهلية"
          className="main-logo"
        />

        <div className="welcome-block">

          <div className="school-info">

            <h2>
              متوسطة وثانوية الأندلس الأهلية بالطائف – بنات
            </h2>

            <span>
              ◆ ◇ ◆ ـــــ مديرة المدرسة: خيرية الخالدي ـــــ ◆ ◇ ◆
            </span>

          </div>

          <h1>
            👋 مرحبًا بك، {currentUser?.name}
          </h1>

          <p>
            اختصري وقتك وأنجزي أعمالك الإدارية من مكان واحد
          </p>

        </div>

      </section>

      {/* =========================
          الإحصائيات
      ========================= */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon calendar-icon">
            📅
          </div>

          <div className="stat-content">

            <strong>
              {formattedDate}
            </strong>

            <span>
              آخر تحديث
            </span>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon search-icon">
            🔎
          </div>

          <div className="stat-content">

            <strong>
              {filteredBoards.length}
            </strong>

            <span>
              نتائج البحث
            </span>

          </div>

        </div>

        <button
          className={`stat-card stat-button ${
            filter === "favorites"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setFilter(
              filter === "favorites"
                ? "all"
                : "favorites"
            )
          }
        >

          <div className="stat-icon favorite-icon">
            ⭐
          </div>

          <div className="stat-content">

            <strong>
              {favorites.length}
            </strong>

            <span>
              المفضلة
            </span>

          </div>

        </button>

        <div className="stat-card">

          <div className="stat-icon folder-icon">
            📁
          </div>

          <div className="stat-content">

            <strong>
              {boards.length}
            </strong>

            <span>
              إجمالي اللوحات
            </span>

          </div>

        </div>

      </section>

      {/* =========================
          المحتوى
      ========================= */}

      <main className="main-content">

        <section className="boards-section">

          <div className="section-heading">

            <div>

              <h2>
                لوحات الإدارة
              </h2>

              <p>
                جميع أعمالك الإدارية في مكان واحد
              </p>

            </div>

            <button
              className="add-board-button"
              onClick={handleAddBoard}
            >
              <span>
                +
              </span>

              إضافة لوحة جديدة
            </button>

          </div>

          {/* =========================
              شريط البحث
          ========================= */}

          <div className="toolbar">

            <select
              className="filter-select"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
            >

              <option value="all">
                الكل
              </option>

              <option value="favorites">
                المفضلة
              </option>

            </select>

            <div className="search-box">

              <input
                type="text"
                placeholder="ابحثي عن لوحة..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <span>
                ⌕
              </span>

            </div>

          </div>

          {/* =========================
              اللوحات
          ========================= */}

          <div className="boards-grid">

            {filteredBoards.map((board) => {

              const realIndex =
                boards.findIndex(
                  (item) => item === board
                );

              return (

                <article
                  className="board-card"
                  key={`${board.title}-${realIndex}`}
                  draggable
                  onDragStart={() =>
                    handleDragStart(realIndex)
                  }
                  onDragOver={handleDragOver}
                  onDrop={() =>
                    handleDrop(realIndex)
                  }
                >

                  <div className="board-top">

                    <button
                      className={`favorite-card-button ${
                        isFavorite(board.title)
                          ? "is-favorite"
                          : ""
                      }`}
                      onClick={() =>
                        toggleFavorite(
                          board.title
                        )
                      }
                      title={
                        isFavorite(board.title)
                          ? "إزالة من المفضلة"
                          : "إضافة للمفضلة"
                      }
                    >
                      ⭐
                    </button>

                    <div className="drag-label">

                      اسحب للترتيب

                      <span>
                        ⋮⋮
                      </span>

                    </div>

                  </div>

                  <div className="board-icon">
                    {board.icon}
                  </div>

                  <div className="board-content">

                    <h3>
                      {board.title}
                    </h3>

                    <p>
                      {board.description}
                    </p>

                  </div>

                  <div className="card-actions">

                    <button
                      className="delete-button"
                      onClick={() =>
                        setDeleteIndex(realIndex)
                      }
                    >
                      🗑️ حذف
                    </button>

                    <button
                      className="edit-button"
                      onClick={() =>
                        startEdit(realIndex)
                      }
                    >
                      ✏ تعديل
                    </button>

                  </div>

                  <button
                    type="button"
                    className="open-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBoard(board);
                    }}
                  >
                    فتح اللوحة
                  </button>

                </article>

              );
            })}

          </div>

          {filteredBoards.length === 0 && (

            <div className="empty">
              لا توجد لوحة بهذا الاسم 🔎
            </div>

          )}

        </section>

      </main>

      {/* =========================
          نافذة التعديل
      ========================= */}

      {editingIndex !== null && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              تعديل اللوحة
            </h2>

            <input
              value={editBoard.title}
              onChange={(e) =>
                setEditBoard({
                  ...editBoard,
                  title: e.target.value,
                })
              }
              placeholder="اسم اللوحة"
            />

            <input
              value={editBoard.description}
              onChange={(e) =>
                setEditBoard({
                  ...editBoard,
                  description: e.target.value,
                })
              }
              placeholder="الوصف"
            />

            <input
              value={editBoard.icon}
              onChange={(e) =>
                setEditBoard({
                  ...editBoard,
                  icon: e.target.value,
                })
              }
              placeholder="الأيقونة"
            />

            <div className="modal-actions">

              <button
                className="save-button"
                onClick={saveEdit}
              >
                حفظ التعديل
              </button>

              <button
                className="cancel-button"
                onClick={() => {

                  setEditingIndex(null);

                  setEditBoard({
                    title: "",
                    description: "",
                    icon: "",
                  });

                }}
              >
                إلغاء
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          حذف اللوحة
      ========================= */}

      {deleteIndex !== null && (

        <div className="modal-overlay">

          <div className="modal-box delete-modal">

            <h2>
              حذف اللوحة
            </h2>

            <p>
              هل أنتِ متأكدة من حذف اللوحة؟
            </p>

            <strong>
              {boards[deleteIndex]?.title}
            </strong>

            <div className="modal-actions">

              <button
                className="cancel-modal-button"
                onClick={() =>
                  setDeleteIndex(null)
                }
              >
                إلغاء
              </button>

              <button
                className="confirm-delete-button"
                onClick={() => {

                  handleDelete(deleteIndex);
                  setDeleteIndex(null);

                }}
              >
                نعم، حذف
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          إضافة لوحة جديدة
      ========================= */}

      {showAddModal && (

        <div className="modal-overlay">

          <div className="add-board-modal">

            <div className="modal-header">

              <h2>
                إضافة لوحة جديدة
              </h2>

              <button
                className="modal-close"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>

            </div>

            <div className="add-board-form">

              <div className="form-group">

                <label>
                  اسم اللوحة
                </label>

                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) =>
                    setNewBoardTitle(
                      e.target.value
                    )
                  }
                  placeholder="اكتبي اسم اللوحة"
                />

              </div>

              <div className="form-group">

                <label>
                  وصف اللوحة
                </label>

                <textarea
                  value={newBoardDescription}
                  onChange={(e) =>
                    setNewBoardDescription(
                      e.target.value
                    )
                  }
                  placeholder="اكتبي وصفًا مختصرًا للوحة"
                  rows="3"
                />

              </div>

              <div className="form-group">

                <label>
                  اختاري رمز اللوحة
                </label>

                <div className="icon-picker">

                  {BOARD_ICONS.map((icon) => (

                    <button
                      type="button"
                      key={icon}
                      className={`icon-option ${
                        newBoardIcon === icon
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setNewBoardIcon(icon)
                      }
                    >
                      {icon}
                    </button>

                  ))}

                </div>

              </div>

            </div>

            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                إلغاء
              </button>

              <button
                className="save-button"
                onClick={saveNewBoard}
              >
                إضافة اللوحة
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;