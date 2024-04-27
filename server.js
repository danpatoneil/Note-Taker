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
// app.use('/api', api)

app.post('/', (req, res)=>{
    res.json('Post received');
})


app.get('/', (req, res) => {
    res.json(db);
})

app.get('/api/notes', (req, res) => {
    const data = fs.readFileSync('./db/db.json', 'utf-8');
    res.json(JSON.parse(data));
})

app.delete('/api/notes/:id', (req, res) => {
    console.log('delete')
    const data = fs.readFileSync('./db/db.json', 'utf-8');
    console.log(data);
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
})
