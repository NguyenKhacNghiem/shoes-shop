const express = require('express');
const db = require("../db");
const Router = express.Router();

Router.post("/checkout", async (req, res) => {
    let isOutOfStock = await checkQuantity(req.session.cartId);

    if(isOutOfStock !== null)
        return res.json({code: 1, message: `${isOutOfStock.name} chỉ còn ${isOutOfStock.quantity} sản phẩm`});

    let currentDate = new Date();
    let day = currentDate.getDate().toString().padStart(2, '0');
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    let year = currentDate.getFullYear().toString();
    let hours = currentDate.getHours().toString().padStart(2, '0');
    let minutes = currentDate.getMinutes().toString().padStart(2, '0');
    let seconds = currentDate.getSeconds().toString().padStart(2, '0');

    let id = day + month + year + hours + minutes + seconds; // ddmmyyyyhhmmss
    let username = req.session.username;
    let totalPrice = req.body.totalPrice;
    let date = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    let status = "Chờ xác nhận";

    let sql = "insert into `order` values(?,?,?,?,?)";
    let params = [id, username, totalPrice, date, status];

    db.query(sql, params, async (error, results, fields) => {
        if(error) 
            return res.json({code: 1, message: "Thanh toán thất bại"});
        
        await createOrderDetail(req.session.cartId, id);
        await updateQuantity(req.session.cartId);
        
        // Sau khi thanh toán thành công thì xóa hết sản phẩm trong giỏ hàng
        db.query("delete from productcart where cart_id = ?", req.session.cartId, (error, results, fields) => {
            if(error) 
                return res.json({code: 1, message: "Thanh toán thất bại"});

            res.json({code: 0, message: "Thanh toán thành công"});
        })
    }) 
})

Router.get("/invoice/:id", (req, res) => {
    if(!req.session.username || req.session.username === "admin")
        return res.redirect("/account/login");

    let orderId = req.params.id;

    db.query("select * from customer where username = ?", req.session.username, (error, results, fields) => {
        if (error)
            throw new Error(error.message);

        let invoice = {
            fullname: results[0].fullname,
            phone: results[0].phone,
            address: results[0].address,
        }

        db.query("select * from `order` where id = ?", orderId, (error, results, fields) => {
            if (error)
                throw new Error(error.message);

            invoice.id = orderId;
            invoice.totalPrice = results[0].total_price;

            let sql = `select p.name as name, po.size as size, po.quantity as quantity, p.price * po.quantity as price
                       from product p, productorder po
                       where p.id = po.product_id and po.order_id = ?`
                       
            db.query(sql, orderId, (error, results, fields) => {
                if (error)
                    throw new Error( error.message);
                
                let products = []
                results.forEach(r => {
                    products.push({
                        name: r.name,
                        size: r.size,
                        quantity: r.quantity,
                        price: r.price
                    });
                })
                invoice.products = products;

                res.render('invoice', {layout: null, invoice});
            })
        })
    })
});

Router.get("/", (req, res) => {
    if(!req.session.username || req.session.username === "admin")
        return res.redirect("/account/login");
    
    db.query("select * from `order` where username = ?", req.session.username, (error, results, fields) => {
        if(error)
            throw new Error(error.sqlMessage);
        
        res.render("order", {username: req.session.username, orders: results});
    })
})

Router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let results = await queryAsync("select * from productorder where order_id = ?", id);

        let result = [];
        
        for (const r of results) {
            let productResults = await queryAsync("select name, image, price from product where id = ?", r.product_id);
            let productInfo = productResults[0];

            result.push({
                id: r.product_id,
                image: productInfo.image,
                name: productInfo.name,
                size: r.size,
                quantity: r.quantity,
                price: productInfo.price * r.quantity
            });

        }

        return res.json({code: 0, message: "Xem chi tiết hóa đơn thành công", result: result});
    } 
    catch (error) {
        return res.json({code: 1, message: "Xem chi tiết hóa đơn thất bại"});
    }
});

// Tạo chi tiết hóa đơn
async function createOrderDetail(cartId, orderId) {
    try {
        let results = await queryAsync("select product_id, size, quantity from productcart where cart_id = ?", cartId);
        
        for(const r of results) 
            await queryAsync("insert into productorder values(?,?,?,?)", [r.product_id, orderId, r.size, r.quantity]);
    } 
    catch (error) {
        throw new Error(error.message);
    }
}

// Kiểm tra sản phẩm có đủ số lượng bán không
async function checkQuantity(cartId) {
    try {
        let results = await queryAsync("select product_id from productcart where cart_id = ?", cartId);
        
        let sql = `select p.quantity as totalQuantity, sum(pc.quantity) as currentQuantity, name
                    from productcart pc, product p 
                    where product_id = ? and cart_id = ? and pc.product_id = p.id`;

        for(const r of results) {
            let results2 = await queryAsync(sql, [r.product_id, cartId]);

            if(results2[0].totalQuantity < results2[0].currentQuantity) {
                // không đủ số lượng để bán
                return {
                    name: results2[0].name,
                    quantity: results2[0].totalQuantity
                }; 
            }
        }

        return null; // đủ số lượng để bán
    } 
    catch (error) {
        throw new Error(error.message);
    }
}

// Cập nhật lại số lượng sản phẩm sau khi thanh toán thành công
async function updateQuantity(cartId) {
    try {
        let sql = `select product_id, sum(quantity) as quantity
                    from productcart 
                    where cart_id = ?
                    group by product_id`;

        let results = await queryAsync(sql, cartId);
        
        sql = "update product set quantity = quantity - ? where id = ?";

        for(const r of results) 
            await queryAsync(sql, [r.quantity, r.product_id]);
    } 
    catch (error) {
        throw new Error(error.message);
    }
}

function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (error, results, fields) => {
            if (error)
                reject(error);
            else
                resolve(results);
        });
    });
}

module.exports = Router;