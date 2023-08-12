
import express from 'express';
import expressHandlebars from 'express-handlebars';
import { jokes } from './content/jokes.js';
import bodyParser from 'body-parser';

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

// --------------- pagination -------------

let page = 1; // номер выводимой страницы
let countElem = 3; // количество выводимых анекдотов на странице
let countPages = Math.ceil(jokes.length / countElem); // количество страниц

let pages = []
for (let i = 0; i < countPages; i++) {
  pages.push(i + 1)
}

// ----------------------------------------

app.get('/', (req, res) => {
  res.render('main', { text: 'aaa', title: 'анекдоты главная' });
});

app.get('/admin', (req, res) => {
  res.render('admin', { title: 'страница администратора' });
});

app.post('/admin', (req, res) => {
  console.log(req.body);
  res.render('admin', { title: 'страница администратора' });
})

app.get('/list/page/:num', (req, res) => {
  page = req.params.num;

  let start = (page - 1) * countElem;
  let end = page * countElem
  let outputRecords = jokes.slice(start, end);

  res.render('list', {
    title: 'список анекдотов',
    jokes: outputRecords,
    pages: pages
  })
})

app.use(function (req, res) {
  res.status(404).send('not found');
});

app.listen(3000, () => console.log('running...'));