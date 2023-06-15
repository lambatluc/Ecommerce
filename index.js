const express = require('express');
const dbConnect = require('./config/dbConnect');
const app= express()
const dotenv= require('dotenv').config()
const PORT= process.env.PORT || 4000;
const authRoute=require("./routers/authRoute");
const bodyParser = require('body-parser');
const { errorHandler } = require('./middlewares/errorHandler');

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/api/user/',  authRoute);


app.use(notFound)
app.request(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});