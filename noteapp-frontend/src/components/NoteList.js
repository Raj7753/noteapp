import React from 'react';
import './NoteList.css';

function NoteList({ notes, onDeleteNote, onEditNote }) {
  return (
    <div className="note-list">
      <h2>📚 Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        notes.map((note) => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-actions">
              <button className="edit-btn" onClick={() => onEditNote(note)}>
                ✏️ Edit
              </button>
              <button className="delete-btn" onClick={() => onDeleteNote(note._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NoteList;
