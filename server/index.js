require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require("./db");
const path = require("path");
const fileUpload = require("express-fileupload");
const models = require("./models/models");
const router = require("./routes/index");
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
	try {
		await sequelize.authenticate();
    	await sequelize.sync();
		app.listen(PORT, () => console.log(`\nServer started on PORT = ${PORT}`));
	} catch(e) {
		console.log(e);
	}
}

start();