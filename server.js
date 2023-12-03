// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Set up middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // Routes
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/views/index.html'));
// });

// app.get('/notes', (req, res) => {
//   res.sendFile(path.join(__dirname, '/views/notes.html'));
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'notes.json');

// Read notes from the file
const readNotesFromFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
};

// Write notes to the file
const writeNotesToFile = async (notes) => {
  await fs.writeFile(dataFilePath, JSON.stringify(notes), 'utf8');
};

// API endpoint to get all notes
app.get('/api/notes', async (req, res) => {
  const notes = await readNotesFromFile();
  res.json(notes);
});

// API endpoint to save a new note
app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  const notes = await readNotesFromFile();
  newNote.id = notes.length + 1;
  notes.push(newNote);
  await writeNotesToFile(notes);
  res.json(newNote);
});

// API endpoint to delete a note
app.delete('/api/notes/:id', async (req, res) => {
  const noteId = parseInt(req.params.id);
  let notes = await readNotesFromFile();
  notes = notes.filter((note) => note.id !== noteId);
  await writeNotesToFile(notes);
  res.json({ success: true });
});

// Serve static files
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

