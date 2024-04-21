const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');

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

// app.delete('/api/notes', (req, res) => {

// })


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(db);
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})
app.post('/api/notes', (req, res)=>{
    console.log(req.body);
    db.push(req.body);
    console.log(db);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        err ? console.error(err):res.json('Post received');
    })
})


app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
})
