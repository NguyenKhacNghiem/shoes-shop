function closeModal() {
    $("#modal").modal("hide")
}

function showModal(id) {
    fetch("/order/" + id)
    .then(response => response.json())
    .then(json => {
        if(json.code === 1)
            return toastr.error(json.message, "Thông báo");

        let tbody = document.getElementById("order-detail");
        let trs = "";

        for(let r of json.result) {
            trs += `
                    <tr>
                        <td><img src="/uploads/${r.image}"></td>
                        <td><a href="/product/detail/${r.id}">${r.name}</a></td> 
                        <td>${r.size}</td>
                        <td>${r.quantity}</td>
                        <td>${formatPrice(r.price)}</td>
                    </tr>
                `
        }

        tbody.innerHTML = trs;
        $("#modal").modal("show");
    })
}

function showInvoice(id) {
    window.open("/order/invoice/" + id, '_blank').focus();
}

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + "đ"; 
}