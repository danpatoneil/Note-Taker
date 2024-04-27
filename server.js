const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');
const uuid = require('uuid'); //I used uuid for a unique identifier for my file system

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.post('/', (req, res)=>{
    res.json('Post received');
})

app.get('/', (req, res) => {
    res.json(db);
})

//reads and returns the db
app.get('/api/notes', (req, res) => {
    const data = fs.readFileSync('./db/db.json', 'utf-8');
    res.json(JSON.parse(data));
})

//deletes the record with the specified id from the db
app.delete('/api/notes/:id', (req, res) => {
    const data = fs.readFileSync('./db/db.json', 'utf-8');
    let dbData = JSON.parse(data);
    const filteredNotes = dbData.filter((note) => {
        return note.id !== req.params.id;
    } )
    fs.writeFileSync('./db/db.json', JSON.stringify(filteredNotes));
    res.json(`ID ${req.params.id} was deleted`);
})


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})


app.post('/api/notes', (req, res)=>{
    const { title, text } = req.body;
    const note = {
        title,
        text,
        "id": uuid.v4(),
    }
    db.push(note);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        err ? console.error(err):res.json(`${note.title} added to task list`);
    })
})
//a get request to anything not specified above will simply redirect to the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
})
