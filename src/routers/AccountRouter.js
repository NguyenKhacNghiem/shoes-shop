const express = require('express');
const db = require("../db");
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const Router = express.Router();

Router.get("/register", (req, res) => {
    if(req.session.username)
        res.redirect("/")
    else
        res.render("register", {username: req.session.username})
})

let registerValidator = [
    check("fullname").notEmpty().withMessage("Vui lòng nhập họ tên"),
    check("phone").notEmpty().withMessage("Vui lòng nhập số điện thoại").isMobilePhone('any', { strictMode: false }).withMessage("Số điện thoại không hợp lệ"),
    check("username").notEmpty().withMessage("Vui lòng nhập tài khoản"),
    check("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
    check("confirmPassword").custom((value, {req}) => {
        if(value !== req.body.password)
            throw new Error("Xác nhận mật khẩu không chính xác")
            
        return true;
    })
]

Router.post("/register", registerValidator, (req, res) => {
    let result = validationResult(req);

    if(result.errors.length > 0)
        return res.json({code: 1, message: result.errors[0].msg});

    db.query("select * from customer where username = ?", req.body.username, (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);

        if(results.length > 0) 
            return res.json({code: 1, message: "Tài khoản này đã tồn tại"});
        
        db.query("insert into cart(total_price) values(0)", (error, results, fields) => {
            if(error) 
                throw new Error(error.sqlMessage);

            let fullname = req.body.fullname;
            let phone = req.body.phone;
            let username = req.body.username;
            let password = bcrypt.hashSync(req.body.password, 10);
            let cartId = results.insertId;
            
            let sql = 'insert into customer() values(?,?,?,?,?,?)';
            let params = [username, cartId, password, fullname, phone, ""];
    
            db.query(sql, params, (error, results, fields) => {
                if(error) 
                    throw new Error(error.sqlMessage);
                
                res.json({code: 0, message: "Đăng ký tài khoản thành công"});
            })
        })
    });
})

Router.get("/login", (req, res) => {
    if(req.session.username)
        res.redirect("/")
    else
        res.render("login", {username: req.session.username})
})

let loginValidator = [
    check("username").notEmpty().withMessage("Vui lòng nhập tài khoản"),
    check("password").notEmpty().withMessage("Vui lòng nhập mật khẩu")
]

Router.post("/login", loginValidator, (req, res) => {
    let result = validationResult(req);

    if(result.errors.length > 0)
        return res.json({code: 1, message: result.errors[0].msg});

    db.query("select * from customer where username = ?", req.body.username, (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);

        if(results.length <= 0) 
            return res.json({code: 1, message: "Tài khoản không tồn tại"});
        
        if(!bcrypt.compareSync(req.body.password, results[0].password))
            return res.json({code: 1, message: "Mật khẩu không chính xác"});
        
        req.session.username = results[0].username;
        req.session.cartId = results[0].cart_id;
        
        if(req.session.username === "admin")
            res.json({code: 100, message: "Đăng nhập thành công"}); // admin đăng nhập
        else
            res.json({code: 0, message: "Đăng nhập thành công"}); // customer đăng nhập
    });
})

Router.get("/logout", (req, res) => {
    delete req.session.username;
    delete req.session.cartId;
    
    res.render("login", {username: req.session.username})
})

Router.put("/update-address", (req, res) => {
    let address = req.body.address;
    let username = req.session.username;

    db.query("update customer set address = ? where username = ?", [address, username], (error, results, fields) => {
        if(error) 
            throw new Error(error.sqlMessage);

        res.end();
    })
})

module.exports = Router;