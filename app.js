const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const path = require('path');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').mongoConnect;
const User = require('./models/user');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const MONGODBURI = 'mongodb://localhost:27017/Shop';

const app = express();
const store = new MongoDbStore({
    uri: MONGODBURI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
    User.findById('5e4ab0dbf9afc821c403b54c')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getErrorPage);

mongoose
    .connect(MONGODBURI)
    .then(result => {
        User
            .findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Tobe',
                        email: 'tobeakabogu@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

