let checkbox = document.getElementById("show-password");
let fullname = document.getElementById("fullname");
let phone = document.getElementById("phone");
let username = document.getElementById("username");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm-password");

checkbox.addEventListener("click", () => {
    if(checkbox.checked === true) {
        password.setAttribute("type", "text");
        confirmPassword.setAttribute("type", "text");
    }
    else {
        password.setAttribute("type", "password");
        confirmPassword.setAttribute("type", "password");
    }
})

function register() {
    fetch("/account/register", {
        method: "post",
        body: new URLSearchParams({
            fullname: fullname.value,
            phone: phone.value,
            username: username.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        })
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 0)
            document.location.href = "/account/login";
        else
            toastr.error(json.message, "Thông báo")
    })
}