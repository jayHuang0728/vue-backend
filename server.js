const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const _ = require('lodash');

const { PORT = 8081, CUSTOMVAR_HOSTNAME = "localhost" } = process.env;

// const [PORT = 3000, HOST = `localhost`] = [process.env.PORT, process.env.CUSTOMVAR_HOSTNAME];

const app = express();
app.listen(PORT, () => console.log(`app started at http://${CUSTOMVAR_HOSTNAME}:${PORT}`));

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors());

app.use('/', express.static(__dirname + '/views'));

// show index
app.route('/')
    .get((req, res) => {
        res.render('index');
    

const lessons = [];

const imgPath = path.resolve(__dirname, 'img');

if (!fs.existsSync(imgPath)) {
  fs.mkdirSync(imgPath);
}

app.use('/img', express.static(imgPath));

const saveImage = dataURL => {
  if (dataURL.indexOf('http') === 0) {
    return dataURL;
  }
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
  const hash = crypto.createHash('md5').update(base64Data).digest("hex");
  const filename = `${hash}.png`;
  fs.writeFileSync(path.resolve(imgPath, filename), base64Data, 'base64');
  // return `https://${CUSTOMVAR_HOSTNAME}:${PORT}/img/${filename}`;
  return `https://${CUSTOMVAR_HOSTNAME}/img/${filename}`;
}

app.route('/show')
  .post((req, res) => {
    const image = saveImage(req.body.image);
    const data = _.omit(req.body, 'image');
    const id = lessons.length;
    const lesson = _.assign(data, { id, image });
    lessons.push(lesson);
    res.json({ id });
  })
  .get((req, res) => {
    res.json(lessons);
  });

app.route('/show/:id')
  .get((req, res) => {
    res.json(lessons.find(n => n.id == req.params.id));
  })
  .put((req, res) => {
    const image = saveImage(req.body.image);
    const data = _.omit(req.body, 'image');
    const id = req.params.id;
    const lesson = _.find(lessons, { id });
    if (!lesson) {
      res.json({ success: false });
    }
    else {
      _.assign(lesson, data, { image });
      res.json({ success: true });
    }
  });
