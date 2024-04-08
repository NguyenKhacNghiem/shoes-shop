function update(operation, quantity, size, productId) {
    if(operation === "up")
        quantity += 1;
    else
        quantity -= 1;

    fetch("/cart/update", {
        method: "put",
        body: JSON.stringify({
            productId: productId,
            size: size,
            quantity: quantity,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 0)
            location.reload();
    })
}

let deletedId;
let deletedSize;

function showDeleteModal(id, name, size) {
    let modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `Xác nhận xóa <b>${name}</b> size <b>${size}</b>?`;

    deletedId = id;
    deletedSize = size;
    $("#deleteModal").modal("show");
}

function closeDeleteModal() {
    $("#deleteModal").modal("hide");
}

function handleDelete() {
    fetch("/cart/delete", {
        method: "delete",
        body: JSON.stringify({
            productId: deletedId,
            size: deletedSize
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 0)
            location.reload();
    })
}

function checkout(totalPrice) {
    totalPrice = parseInt(totalPrice.replaceAll(/[.đ]/g, ""));

    if(totalPrice === 0)
        return toastr.error("Giỏ hàng hiện đang trống", "Thông báo")

    let address = document.getElementById("address");
    if(address.value === "")
        return toastr.error("Vui lòng nhập địa chỉ giao hàng", "Thông báo");

    fetch("/order/checkout", {
        method: "post",
        body: new URLSearchParams({
            totalPrice: totalPrice
        })
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 0) {
            updateAddress();
            
            toastr.success(json.message, "Thông báo")

            setTimeout(() => {
                document.location.href = "/order";
            }, 1500)
        }
        else
            toastr.error(json.message, "Thông báo")
    })
}

function updateAddress() {
    fetch("/account/update-address", {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: document.getElementById("address").value
        })
    })
}