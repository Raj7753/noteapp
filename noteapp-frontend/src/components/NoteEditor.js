import React, { useState } from 'react';
import './NoteEditor.css';

const NoteEditor = ({ onAddNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddNote({ title, content });
      setTitle('');
      setContent('');
    }
  };

  return (
    <div className="note-editor">
      <h2>Create a Note</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default NoteEditor;
