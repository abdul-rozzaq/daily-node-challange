import express, { Application } from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import ApisController from './controllers/apis.ts';
import { addNewPage, getAllPages } from './services/apis.service.ts';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();


const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, '..', 'views'));


app.use('/apis', ApisController);

app.post("/", addNewPage)
app.get("/", getAllPages)







app.listen(8080, () => console.log('Server is running on http://localhost:8080'));
