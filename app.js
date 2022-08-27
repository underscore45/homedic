const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const bodyParser = require('body-parser');
const getTimestamp = require('./timestamp');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/words', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const connected_db = 'dict';
const url = 'mongodb://localhost:27017/' + connected_db;
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.set('useFindAndModify', false);

const routes = require('./dictRoutes');

// Load the database and spit out a console message
mongoose.connect(url, { useNewUrlParser : true });
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('We are connected with mongoose ! ' + getTimestamp());
    console.log('Database name: ' + connected_db);
});

routes(app);

app.listen(port, () => console.log(`Listening on port ${port}`));
