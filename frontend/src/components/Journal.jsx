import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '../styles/Journal.css'; 
import api from '../api';

const Journal = () => {
  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({
    category: 'NOTE',
    symbol: '',
    content: ''
  });

 
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get('/api/journal/'); 
      setEntries(response.data);
    } catch (error) {
      console.error("Błąd pobierania dziennika:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NOWE: Funkcja usuwania
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await api.delete(`/api/journal/${id}/`);
        setEntries(entries.filter(entry => entry.id !== id));
        
        if (editingId === id) handleCancelEdit();
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleEditClick = (entry) => {
    setEditingId(entry.id);
    setFormData({
      category: entry.category,
      symbol: entry.symbol || '',
      content: entry.content
    });
    setDate(new Date(entry.date));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ category: 'NOTE', symbol: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateString = date.toLocaleDateString('en-CA');
      const payload = { ...formData, date: dateString };

      if (editingId) {

        const response = await api.put(`/api/journal/${editingId}/`, payload);

        setEntries(entries.map(item => item.id === editingId ? response.data : item));
        
        handleCancelEdit();
      } else {
        const response = await api.post('/api/journal/', payload);
        setEntries([response.data, ...entries]);
        setFormData({ category: 'NOTE', symbol: '', content: '' });
        fetchEntries();
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry.");
    }
  };

  
  const selectedDateString = date.toLocaleDateString('en-CA');
  const entriesForSelectedDate = entries.filter(entry => entry.date === selectedDateString);

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const tileDateString = date.toLocaleDateString('en-CA');
      const dayEntries = entries.filter(e => e.date === tileDateString);
      
      if (dayEntries.length > 0) {
        return (
          <div className="dot-container">
            {dayEntries.map(entry => (
              <div key={entry.id} className={`dot ${entry.category}`} title={entry.category} />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="journal-container">
      <div className="calendar-section">
        <h2>Investor Journal</h2>
        <Calendar onChange={setDate} value={date} tileContent={getTileContent} />
      </div>

      <div className="details-section">
        <h3>Entries for: {selectedDateString}</h3>
        
        <div className="entries-list">
          {entriesForSelectedDate.length === 0 ? (
            <p>No notes for this day.</p>
          ) : (
            entriesForSelectedDate.map(entry => (
              <div key={entry.id} className={`entry-card ${entry.category}`}>
                <div className="entry-header">
                  <strong>{entry.category}</strong>
                  {entry.symbol && <span> [{entry.symbol}]</span>}
                  
                  <div className="entry-actions">
                    <button onClick={() => handleEditClick(entry)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
                <p>{entry.content}</p>
              </div>
            ))
          )}
        </div>

        <form className="journal-form" onSubmit={handleSubmit}>
          <h4>{editingId ? 'Edit Entry' : 'Add New Entry'}</h4>
          
          <select name="category" value={formData.category} onChange={handleInputChange}>
            <option value="NOTE">Note</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>

          <input 
            type="text" 
            name="symbol" 
            placeholder="Symbol (e.g. BTC) - optional" 
            value={formData.symbol}
            onChange={handleInputChange}
          />

          <textarea 
            name="content" 
            placeholder="Your thoughts..." 
            rows="3" 
            value={formData.content}
            onChange={handleInputChange}
            required
          />

          <div className="form-buttons">
            <button type="submit" className={editingId ? 'btn-update' : 'btn-save'}>
              {editingId ? 'Update Note' : 'Save Note'}
            </button>

            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-cancel">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Journal;