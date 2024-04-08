const express = require('express');
const db = require("../db");
const Router = express.Router();

Router.get("/", (req, res) => {
    if(!req.session.username || req.session.username === "admin")
        return res.redirect("/account/login");

    let cartId = req.session.cartId; 
    let sql = `select id, image, name, size, pc.quantity, price*pc.quantity as price
               from product p, productcart pc
               where id = product_id and cart_id = ?
               `;

    db.query(sql, cartId, (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);

        db.query("select address from customer where username = ?", req.session.username, (error, results2, fields) => {
            if(error) 
                throw new Error(error.sqlMessage);

            res.render("cart", {username: req.session.username, products: results, address: results2[0].address})
        })
    })
})

Router.post("/add", (req, res) => {
    let cartId = req.session.cartId;
    let productId = req.body.productId;
    let size = req.body.size;

    db.query("select quantity from product where id = ?", productId, (error, results, fields) => {
        if(error) 
            return res.json({code: 1, message: "Thêm sản phẩm vào giỏ hàng thất bại."})

        let quantity = results[0].quantity;
        
        if(quantity === 0)
            return res.json({code: 1, message: "Sản phẩm này hiện đã hết hàng."});
        
        let sql = "select * from productcart where product_id = ? and cart_id = ? and size = ?";
        let params = [productId, cartId, size];
    
        db.query(sql, params, (error, results, fields) => {
            if(error) 
                throw new Error(error.sqlMessage);
    
            if(results.length > 0) 
                sql = "update productcart set quantity = quantity + 1 where product_id = ? and cart_id = ? and size = ?";
            
            else 
                sql = "insert into productcart values(?,?,?,1)";
            
            db.query(sql, params, (error, results, fields) => {
                if(error) 
                    throw new Error(error.sqlMessage);
                
                res.json({code: 0, message: "Thêm sản phẩm vào giỏ hàng thành công."})
            })
        })
    })
})

Router.put("/update", (req, res) => {
    let {productId, size, quantity} = req.body;
    let sql = "update productcart set quantity = ? where product_id = ? and cart_id = ? and size = ?";
    let params = [quantity, productId, req.session.cartId, size];

    db.query(sql, params, (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);
        
        res.json({code: 0, message: "Cập nhật giỏ hàng thành công."});
    })
})

Router.delete("/delete", (req, res) => {
    let {productId, size} = req.body;
    let sql = "delete from productcart where product_id = ? and cart_id = ? and size = ?";
    let params = [productId, req.session.cartId, size];

    db.query(sql, params, (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);
        
        res.json({code: 0, message: "Xóa sản phẩm trong giỏ hàng thành công."});
    })
})

module.exports = Router;