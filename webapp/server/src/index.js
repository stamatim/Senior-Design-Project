import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose, { connection } from 'mongoose';
import cors from 'cors';
import config from './config';
import Middlewares from './api/middlewares'
import Authentication from './api/authentication'
import ItemProcessor from './api/item_processing'
import Status from './api/status'
import UserRouter from './components/user/router'

if(!process.env.JWT_SECRET) {
    const err = new Error('No JWT_SECRET in env variable, check instructions: https://github.com/amazingandyyy/mern#prepare-your-secret');
    console.error(err);
}

const app = express();
const path = require('path') // for selecting correct path

// Initialize mongoose connection to MongoDB database
mongoose.connect(config.mongoose.uri, { useUnifiedTopology: true, useNewUrlParser: true })
.catch(err=>console.error(err));

mongoose.Promise = global.Promise;

// App Setup
app.use(cors()); // enable cross-origin resource sharing
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Link to front-end static build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

// app.get('*', (req, res) => {
//     // send index.html to client
//     res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
// })

// Test routes
app.get('/ping', (req, res) => res.send('pong'))
app.get('/user/:name', (req, res) => res.send('Your name is ' + req.params.name + `\n`))

// User Signup
app.get('signup', (req, res) => {
    res.send('GET request to login page')
})
app.post('/signup', Authentication.signup)

// User Login
app.get('/login', (req, res) => {
    res.send('GET request to login page.')
})
app.post('/login', Authentication.login)

app.get('/auth-ping', Middlewares.loginRequired, (req, res) => res.send('connected'))
app.use('/user', Middlewares.loginRequired, UserRouter)

// Item processing
app.post('/process_item', ItemProcessor.process_item)
app.post('/add_item', ItemProcessor.add_new)
app.put('/update_item', ItemProcessor.update_existing)
app.delete('/delete_item', ItemProcessor.remove_existing)
app.get('/items/get_all', ItemProcessor.get_all)
app.get('/items/:productId', ItemProcessor.get_by_id)

app.post('/status', (req, res) => {
    Status.setStatus(req.body.status);
    try {
        res.json({ message: 'status received' });
    } catch (err) {
        res.json({ message: err });
    }
});

app.get('/status', (req, res) => {
    try {
        res.json({ message: Status.getStatus() });
    } catch (err) {
        res.json({ message: err });
    }
});

// Client page routes
// app.get('/dashboard', (req, res) => res.send("Dashboard (Home)"))
// app.get('/inventory', (req, res) => res.send("Inventory"))
// app.get('/metrics', (req, res) => res.send("Metrics"))
// app.get('/fleet-management', (req, res) => res.send("Fleet Management"))


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use((err, req, res, next) => {
    console.log('Error:', err.message);
    res.status(422).json(err.message);
});

// Server Setup
const port = process.env.PORT || 5000
http.createServer(app).listen(port, () => {
    console.log(`\x1b[32m`, `Server listening on: ${port}`, `\x1b[0m`)
});

// Database
const mongo_connection = mongoose.connection;
mongo_connection.once('open', () => {
    console.log(`\x1b[32m`, `Connection to MongoDB database successfully established!`, `\x1b[0m`)
})