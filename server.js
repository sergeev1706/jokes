
import express from 'express';
import expressHandlebars from 'express-handlebars';

import { jokes } from './content/jokes.js';
import bodyParser from 'body-parser';

import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

const handlebars =
  expressHandlebars.create({
    defaultLayout: 'index',
    extname: 'hbs',
    helpers: {
      format_text: function (joke) {
        return joke.text;
      },
      format_topic: function (joke) {
        return joke.topic;
      },
      format_id: function (joke) {
        return joke.id;
      }
    }
  });

const app = express();

app.engine('hbs',
  handlebars.engine);
app.set('view engine', 'hbs');

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));

let secret = 'qwerty';
app.use(cookieParser(secret));
app.use(expressSession({

  secret: secret,
}));

app.use(flash());

function getUnicueList() {

  let topics = [];
  jokes.map(el => topics.push(el.topic));
  let unicuTopics = [... new Set(topics)];

  return unicuTopics;
}

function getMassage(param) {
  let wrapper = param;

  let massage = '';
  if (wrapper[0] !== undefined) {
    massage = wrapper[0];
  }
  wrapper = [];
  return massage;
}

// --------------- pagination -------------

let page = 1; // номер выводимой страницы
let countElem = 3; // количество выводимых анекдотов на странице
let countPages; // количество страниц

// ----------------------------------------

// главная список с пагинацией
app.get('/list/page/:num', (req, res) => {
  page = req.params.num;

  let start = (page - 1) * countElem;
  let end = page * countElem;
  let outputRecords = jokes.slice(start, end);

  countPages = Math.ceil(jokes.length / countElem);

  let pages = [];;
  for (let i = 0; i < countPages; i++) {
    pages.push(i + 1);
  }

  res.render('list', {
    title: `список анекдотов страница ${page}`,
    jokes: outputRecords,
    pages: pages,
    topics: getUnicueList(),
  })
})

app.get('/list/:cat', (req, res) => {
  let category = req.params.cat;

  let result = [];

  jokes.map(el => {
    if (el.topic === category) result.push(el);
  })

  res.render('list', {
    title: `список анекдотов категории ${category}`,
    jokes: result,
    topics: getUnicueList(),
  })
})

app.get('/admin', (req, res) => {

  res.render('admin', {
    title: 'страница администратора',
    jokes: jokes,
    topics: getUnicueList(),
  });
});

// добавление анекдота
app.post('/admin', (req, res) => {

  req.flash('joke', 'вы добавили анекдот');

  let topic;
  if (req.body.newCat) {
    topic = req.body.newCat;
  } else {
    topic = req.body.topic;
  }

  jokes.push({
    id: Date.now(),
    text: req.body.text,
    topic: topic,
  });

  res.render('admin', {
    title: 'страница администратора',
    jokes: jokes,
    topics: getUnicueList(),
    massage: getMassage(req.flash('joke')),
  });
})

// удаление анекдота
app.get('/delete/:id', (req, res) => {
  jokes.map((el, ind) => {
    if (el.id == req.params.id) jokes.splice(ind, 1);
  })

  req.flash('joke', 'вы удалили анекдот');

  res.render('admin', {
    title: 'страница администратора',
    jokes: jokes,
    topics: getUnicueList(),
    massage: getMassage(req.flash('joke')),
  });
})

// изменение анекдота
app.get('/update/:id', (req, res) => {

  let joke;
  jokes.map(el => {
    if (el.id == req.params.id) {
      joke = el;
    }
  })

  res.render('update', {
    joke: joke,
  })
})

app.post('/update/:id', (req, res) => {

  jokes.map(el => {
    if (el.id == req.params.id) {
      el.topic = req.body.topic;
      el.text = req.body.text;
    }
  })

  req.flash('joke', 'вы изменили анекдот')

  res.render('admin', {
    title: 'страница администратора',
    jokes: jokes,
    topics: getUnicueList(),
    massage: getMassage(req.flash('joke')),
  });
})

app.use((req, res) => {
  res.status(404).send('not found');
});

app.listen(3000, () => console.log('running...'));