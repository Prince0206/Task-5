const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require("mongoose")

const app = express();

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

//mongoose.connect('mongodb://localhost:27017/Database')
var db=mongoose.connection
db.on('error',()=> console.log("Error in connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

// Define your routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const students = []; // In-memory storage for student data

// Create a new student
app.post('/students', (req, res) => {
  const { id, name } = req.body;
  students.push({ id, name });
  res.status(201).json({ message: 'Student created successfully' });
});

// Get all students
app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

  
// Update a student
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  student.name = name;
  res.json({ message: 'Student updated successfully' });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }
  students.splice(index, 1);
  res.json({ message: 'Student deleted successfully' });
});

const { body, validationResult } = require('express-validator');

app.post(
  '/students',
  [
    body('id').notEmpty().isAlphanumeric(),
    body('name').notEmpty().isString(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Create student logic
    // ...
    res.status(201).json({ message: 'Student created successfully' });
  }
);

const db = require('mongoose'); // Your database module

app.post('/students', async (req, res) => {
  const { id, name } = req.body;
  try {
    await db.beginTransaction();
    await db.createStudent(id, name); // Example: Insert into database
    await db.commitTransaction();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    await db.rollbackTransaction();
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
