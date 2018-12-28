require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const helmet = require('helmet');
const chalk = require('chalk');

app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(compression());
app.use(mongoSanitize());
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/api/v1/user', require('./routes/userRoutes'));

//-----Database Connection----------
try {
  mongoose.connect(`${process.env.stagingDatabase}`, { useNewUrlParser: true, 'useCreateIndex':true }).catch((err) => {
   if(err) console.error(chalk.red(' [ ✗ ] '), err)
}) 
 console.log(chalk.green(' [ ✓ ]'), `Connected to Database : ${process.env.stagingDatabase}`); 
} catch (error) {
    return console.error(chalk.red(' [ ✗ ] '), error);
}
//---------------------------------------

 app.listen(process.env.PORT, () => {
     console.log(chalk.blue(' [ ✓ ] '), 'Running on port : ' + process.env.PORT);
});
