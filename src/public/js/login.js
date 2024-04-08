let checkbox = document.getElementById("show-password");
let username = document.getElementById("username");
let password = document.getElementById("password");

checkbox.addEventListener("click", () => {
    if(checkbox.checked === true) 
        password.setAttribute("type", "text");    
    else 
        password.setAttribute("type", "password");    
})

function login() {
    fetch("/account/login", {
        method: "post",
        body: new URLSearchParams({
            username: username.value,
            password: password.value
        })
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 100)
            document.location.href = "/admin/"; // admin đăng nhập
        else if(json.code === 0)
            document.location.href = "/"; // customer đăng nhập
        else
            toastr.error(json.message, "Thông báo")
    })
}