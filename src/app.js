const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('express-handlebars');
const db = require('./db');

const AccountRouter = require('./routers/AccountRouter');
const ProductRouter = require('./routers/ProductRouter');
const CartRouter = require('./routers/CartRouter');
const OrderRouter = require('./routers/OrderRouter');
const AdminRouter = require('./routers/AdminRouter');

const app = express();

app.use(cookieParser('nguyentheanh'))
app.use(session({
    secret: "nguyentheanh",
    resave: true,
    saveUninitialized: true
}))

app.engine('handlebars', hbs.engine({
    defaultLayout: 'main',
    helpers: {
        formatPrice: (price) => {
            return price.toLocaleString('vi-VN') + "đ"; 
        },

        totalPrice: (products) => {
            let total = 0;
            products.forEach(p => total += p.price);
            return total;
        },

        colorOrderStatus: (status) => {
            if(status === "Chờ xác nhận")
                return "danger";
            else if(status === "Đang vận chuyển")
                return "warning";
            else
                return "success";
        },

        isProductOutOfStock: (quantity) => {
            return quantity === 0 ? '<span class="alert alert-danger">Hết hàng</span>' : "";
        }
    }
}));
app.set('view engine', 'handlebars');

// Điều chỉnh lại kích thước của request
app.use(express.json({limit: '2mb'}));

app.use(express.json());   
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))

app.get("/", (req, res) => {
    res.redirect("/product")
})

app.use('/account', AccountRouter);
app.use('/product', ProductRouter);
app.use('/cart', CartRouter);
app.use('/order', OrderRouter);
app.use('/admin', AdminRouter);

// Xử lý lỗi 404 và 500
app.use((req, res) => {
    res.status(404) 
    res.render('404', {layout: null})
})

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500);
    res.render('500', {layout: null});
});

app.listen(3000, () => {
    db.connect((error) => {
        if(error)
            throw new Error("Có lỗi khi kết nối MySQL: " + error.sqlMessage);

        console.log('Đã kết nối đến MySQL');
        console.log("Mở trang web tại: http://localhost:3000");
    })
})