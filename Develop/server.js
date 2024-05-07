const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path"); // import the path module

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
// HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// API routes
app.get("/api/notes", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = uuidv4(); // Generate unique ID
    notes.push(newNote);
    fs.writeFile("db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.json(newNote);
    });
  });
});

// DELETE /api/notes/:id route to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let notes = JSON.parse(data);
    // Filter out the note with the specified ID
    notes = notes.filter((note) => note.id !== noteId);
    fs.writeFile("db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.sendStatus(204); // No Content - indicates successful deletion
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.info(`Server Started on http://localhost:${PORT}`);
});
