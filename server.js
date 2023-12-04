const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import the uuid module

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('/develop/public'));

// Routes

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/develop/public/index.html'));
});

// Notes route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/develop/public/note.html'));
});

// API Routes

// GET notes route
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('/develop/db/db.json', 'utf8'));
  res.json(notes);
});

// POST new note route
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Generate a unique ID
  const notes = JSON.parse(fs.readFileSync('/develop/db/db.json', 'utf8'));
  notes.push(newNote);
  fs.writeFileSync('/develop/db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

// DELETE note route
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync('/develop/db/db.json', 'utf8'));
  notes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync('/develop/db/db.json', JSON.stringify(notes));
  res.json({ success: true });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
