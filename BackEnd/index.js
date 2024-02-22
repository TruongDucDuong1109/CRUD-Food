const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const enqRouter = require('./routes/enqRoute');
const categoryRouter = require('./routes/prodcategoryRoute');
const brandRouter = require('./routes/brandRoute');
const blogcategoryRouter = require('./routes/blogCatRoute');
const blogRouter = require('./routes/blogRoute');
const productRouter = require('./routes/productRoute');
const couponRouter = require('./routes/couponRoute');
const { connect } = require("./config/dbConnect");
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');



app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
connect();

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogcategory', blogcategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/enquiry', enqRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});
