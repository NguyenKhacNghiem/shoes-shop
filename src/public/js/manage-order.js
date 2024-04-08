function updateOrderStatus(id, status) {
    fetch('/admin/order/update/', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: id,
            status: status
        })
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 1)
            toastr.error(json.message, "Thông báo");
        else {
            toastr.success(json.message, "Thông báo");

            setTimeout(() => {
                document.location.href = "/admin/order/"
            }, 1500)
        }
    })
}