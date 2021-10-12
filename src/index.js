const express     = require('express');
const mongoose    = require('mongoose');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const { db }      = require('./config/keys'); // ключ для подключения mongoDB

//* ==============================
//  устанавливаю соединение с БД
//* ==============================

mongoose.Promise = global.Promise;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log(`Соединение с базой данных установленно...`)
  },
  error => {
    console.log("Соединение с базой данных не может быть установленно по причине : " + error)
  }
)

//* ==============================
//  создаю сервер
//* ==============================

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// API's //

const initAPI = require('./routes/init.route');
const authAPI = require('./routes/auth.route');
const userAPI = require('./routes/user.route');
//const groupAPI = require('./routes/group.route');
//const projectAPI = require('./routes/project.route');
//const projectGroupAPI = require('./routes/projectGroup.route');
const taskAPI = require('./routes/task.route');
const departmentsAPI = require('./routes/departments.route');

app.use('/init', initAPI);
app.use('/auth', authAPI);
app.use('/user', userAPI);
//app.use('/group', groupAPI);
//app.use('/project', projectAPI);
//app.use('/projectGroup', projectGroupAPI);
app.use('/task', taskAPI);
app.use('/departments', departmentsAPI);

//app.use(express.static(__dirname + '/public/upload'));

//----------

const server = require('http').createServer(app);

// auth //

const passport = require("passport");

// Use the passport Middleware 
app.use(passport.initialize());

// Bring in the Passport Strategy
require('./config/passport')(passport);

// Create port
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('Connected to port ' + PORT)
})