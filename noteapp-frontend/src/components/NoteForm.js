import React, { useState, useEffect, useRef } from 'react';
import './NoteForm.css';

function NoteForm({ onAddNote, onUpdateNote, editingNote, cancelEdit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setError('');
      titleInputRef.current?.focus();
    } else {
      setTitle('');
      setContent('');
      setError('');
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required.');
      return;
    }
    if (title.length > 50 || content.length > 500) {
      setError('Title must be under 50 characters. Content under 500.');
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
    };

    if (editingNote) {
      onUpdateNote({ ...editingNote, ...noteData });
    } else {
      onAddNote(noteData);
    }

    setTitle('');
    setContent('');
    setError('');
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Note title (max 50 chars)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={50}
        ref={titleInputRef}
      />
      <textarea
        placeholder="Write your note... (max 500 chars)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={500}
      />
      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="submit">
          {editingNote ? '✅ Update Note' : '➕ Add Note'}
        </button>
        {editingNote && (
          <button
            type="button"
            className="cancel-btn"
            onClick={cancelEdit}
          >
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;