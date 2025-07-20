import React, { useEffect, useState, useCallback } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import AuthForm from "./components/AuthForm";
import "./App.css";

const API_URL = "http://localhost:5050/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [user, setUser] = useState(() =>
    localStorage.getItem("token") ? {} : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);

  const fetchNotes = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, []);

  const addNote = async (note) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });
      const data = await res.json();
      setNotes((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const updateNote = async (updatedNote) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/${updatedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNote),
      });
      const data = await res.json();
      setNotes((prev) =>
        prev.map((note) => (note._id === data._id ? data : note))
      );
      setEditingNote(null);
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setUser(null);
      setNotes([]);
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({});
      fetchNotes();
    } else {
      setUser(null);
    }
  }, [fetchNotes]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleDesktopSearch = () => {
    setShowDesktopSearch(!showDesktopSearch);
    if (!showDesktopSearch) {
      setTimeout(() => {
        document.getElementById("desktopSearchInput")?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"} ${sidebarOpen ? "sidebar-active" : ""}`}>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={closeSidebar}>
            ×
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="button-group">
          <button onClick={() => {
            setDarkMode(!darkMode);
            closeSidebar();
          }}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          
          {user ? (
            <button onClick={() => {
              handleLogout();
              closeSidebar();
            }}>
              Logout
            </button>
          ) : (
            <button onClick={() => {
              setShowAuthForm(true);
              closeSidebar();
            }}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={closeSidebar}
      />

      {/* Main Content */}
      <div className="top-bar">
        <h1>📝 My Notes</h1>
        <div className="button-group aligned-buttons">
          {user && (
            <>
              {/* Desktop Search Button */}
              <button
                className={`search-toggle-btn ${showDesktopSearch ? 'active' : ''}`}
                onClick={toggleDesktopSearch}
                aria-label="Search notes"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                </svg>
              </button>
              
              {/* Desktop Search Input */}
              <input
                type="text"
                id="desktopSearchInput"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`desktop-search-input ${showDesktopSearch ? 'active' : ''}`}
              />
            </>
          )}
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => setShowAuthForm(true)}>Login</button>
          )}
        </div>
      </div>

      {!user && (
        <>
          <div className="login-prompt">
            <p>Please login to create and manage your notes.</p>
          </div>
          {showAuthForm && (
            <AuthForm
              onAuthSuccess={(user) => {
                setUser(user);
                setShowAuthForm(false);
              }}
            />
          )}
        </>
      )}

      {user && (
        <>
          <NoteForm
            onAddNote={addNote}
            onUpdateNote={updateNote}
            editingNote={editingNote}
            cancelEdit={() => setEditingNote(null)}
          />
          <NoteList
            notes={filteredNotes}
            onDeleteNote={deleteNote}
            onEditNote={setEditingNote}
          />
        </>
      )}
    </div>
  );
}

export default App;