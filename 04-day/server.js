import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';

const __dirname = import.meta.dirname

const app = express();
const port = process.env.PORT || 4000;

app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('home', {});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
