import React from 'react';
import './NoteItem.css';

const NoteItem = ({ note, onDelete }) => {
  return (
    <div className="note-item">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note._id)}>Delete</button>
    </div>
  );
};

export default NoteItem;
