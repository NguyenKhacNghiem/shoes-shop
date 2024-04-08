const express = require('express');
const fs = require('fs');
const db = require("../db");
const Router = express.Router();

// Quản lý sản phẩm
Router.get("/", (req, res) => {
    if(!req.session.username || req.session.username !== "admin")
        return res.redirect("/account/login");

    db.query("select * from product where deleted = 0", (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);

        res.render("admin", {layout: "admin", products: results});
    })
})

Router.get("/product/add", (req, res) => {
    if(!req.session.username || req.session.username !== "admin")
        return res.redirect("/account/login");

    res.render("add-product", {layout: "admin"})
})

Router.post("/product/add", (req, res) => {
    let {name, color, description, price, brand, catalog, quantity, base64, imageName} = req.body;

    base64 = base64.replace(/^data:image\/\w+;base64,/, '');
    let buffer = Buffer.from(base64, 'base64');

    fs.writeFile(`./public/uploads/${imageName}`, buffer, (error) => {
        if (error)
            return res.json({code: 1, message: "Thêm sản phẩm thất bại"});
    })

    let sql = "insert into product(name, color, description, price, image, brand, catalog, deleted, quantity) values(?,?,?,?,?,?,?,?,?)";
    let params = [name, color, description, price, imageName, brand, catalog, 0, quantity];

    db.query(sql, params, (error, results, fields) => {
        if (error)
            return res.json({code: 1, message: "Thêm sản phẩm thất bại"});

        res.json({code: 0, message: "Thêm sản phẩm thành công"})
    })
})

Router.put("/product/update", (req, res) => {
    let {id, name, color, description, price, brand, catalog, quantity, base64, imageName} = req.body;
    
    // Khi admin muốn cập nhật hình ảnh mới
    if(base64 !== "") {
        base64 = base64.replace(/^data:image\/\w+;base64,/, '');
        let buffer = Buffer.from(base64, 'base64');

        fs.writeFile(`./public/uploads/${imageName}`, buffer, (error) => {
            if (error)
                return res.json({code: 1, message: "Cập nhật sản phẩm thất bại"});
        })
    }

    let sql = "update product set name = ?, color = ?, description = ?, price = ?, brand = ?, catalog = ?, quantity = ?, image = ? where id = ?";
    let params = [name, color, description, price, brand, catalog, quantity, imageName, id];

    db.query(sql, params, (error, results, fields) => {
        if(error) 
            return res.json({code: 1, message: "Cập nhật sản phẩm thất bại"});
        
        res.json({code: 0, message: "Cập nhật sản phẩm thành công"})
    })
})

Router.delete("/product/delete", (req, res) => {
    let id = req.body.id;

    db.query("update product set deleted = 1 where id = ?", id, (error, results, fields) => {
        if(error) 
            res.json({code: 1, message: "Xóa sản phẩm thất bại"});
        
        res.json({code: 0, message: "Xóa sản phẩm thành công."});
    })
})

Router.put("/product/add-quantity", (req, res) => {
    let {id, quantity} = req.body;

    if(quantity < 0)
        return res.json({code: 1, message: "Số lượng thêm vào phải lớn hơn 0"});

    let sql = "update product set quantity = quantity + ? where id = ?";
    let params = [quantity, id];

    db.query(sql, params, (error, results, fields) => {
        if(error) 
            return res.json({code: 1, message: "Thêm số lượng sản phẩm thất bại"});
        
        res.json({code: 0, message: "Thêm số lượng sản phẩm thành công"})
    })
})

// Quản lý khách hàng
Router.get("/customer/", (req, res) => {
    if(!req.session.username || req.session.username !== "admin")
        return res.redirect("/account/login");

    db.query("select username, fullname, phone, address from customer where username != 'admin'", (error, results, fields) => {
        if(error)
            throw new Error(error.sqlMessage);
        
        res.render("manage-customer", {layout: "admin", customers: results});
    })
})

// Quản lý đơn hàng
Router.get("/order/", (req, res) => {
    if(!req.session.username || req.session.username !== "admin")
        return res.redirect("/account/login");
    
    db.query("select * from `order`", (error, results, fields) => {
        if(error)
            throw new Error(error.sqlMessage);
        
        res.render("manage-order", {layout: "admin", orders: results});
    })
})

Router.put("/order/update", (req, res) => {
    let id = req.body.id;
    let status = req.body.status;

    if(status === "Chờ xác nhận")
        status = "Đang vận chuyển";
    else if(status === "Đang vận chuyển")
        status = "Hoàn thành";
    else
        status = "Chờ xác nhận";
    
    let sql = "update `order` set status = ? where id = ?";
    let params = [status, id];
    
    db.query(sql, params, (error, results, fields) => {
        if(error) 
            return res.json({code: 1, message: "Cập nhật trạng thái đơn hàng thất bại"});
        
        res.json({code: 0, message: "Cập nhật trạng thái đơn hàng thành công"})
    })
})

module.exports = Router;