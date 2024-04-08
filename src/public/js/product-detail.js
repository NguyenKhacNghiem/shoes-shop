function addProductToCart(productId) {
    let size = document.querySelector("input[type='radio']:checked").value;

    fetch("/cart/add", {
        method: "post",
        body: new URLSearchParams({
            productId: productId,
            size: size
        })
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 0)
            toastr.success(json.message, "Thông báo")
        else
            toastr.error(json.message, "Thông báo")
    })
}