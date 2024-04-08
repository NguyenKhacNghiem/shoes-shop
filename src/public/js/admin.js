$(".custom-file-input").on("change", function() {
    let fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

function showUpdateModal(selectedButton) {
    let selectedProduct = selectedButton.parentNode.parentNode;

    let id = selectedProduct.children[0].innerText;
    let name = selectedProduct.children[1].innerText;
    let color = selectedProduct.children[2].innerText;
    let description = selectedProduct.children[3].innerText;
    let price = selectedProduct.children[4].innerText.replaceAll(/[.đ]/g, "") - 0;
    let image = selectedProduct.children[5].children[0].dataset.image;
    let brand = selectedProduct.children[6].innerText;
    let catalog = selectedProduct.children[7].innerText;
    let quantity = selectedProduct.children[8].innerText - 0;

    $("#id").val(id);
    $("#name").val(name);
    $("#color").val(color);
    $("#description").val(description);
    $("#price").val(price);
    $("#image").siblings(".custom-file-label").addClass("selected").html(image);
    $("#brand").find(`option[value="${brand}"]`).prop("selected", true);
    $("#catalog").find(`option[value="${catalog}"]`).prop("selected", true);
    $("#catalog").find(`option[value="${catalog}"]`).prop("selected", true);
    $("#quantity").val(quantity);

    $("#updateModal").modal("show")
}

function closeUpdateModal() {
    $("#updateModal").modal("hide")
}

async function handleUpdate() {
    let id = $("#id").val();
    let name = $("#name").val();
    let color = $("#color").val();
    let description = $("#description").val();
    let price = $("#price").val();
    let brand = $("#brand").val();
    let catalog = $("#catalog").val();
    let quantity = $("#quantity").val();

    if(name === "" || color === "" || description === "" || price <= 0 || brand === "" || catalog === "" || quantity < 0)
        return toastr.error("Vui lòng nhập đầy đủ thông tin", "Thông báo");

    let image = document.getElementById('image');
    let selectedImage = image.files[0];
    
    // Khi admin muốn cập nhật hình ảnh mới
    let base64 = "";

    if (selectedImage) {
        // Kiểm tra kích thước ảnh
        if(selectedImage.size > 1048576)
            return toastr.error("Vui lòng upload ảnh nhỏ hơn 1MB.", "Thông báo");

        let reader = new FileReader();

        base64 = await new Promise((resolve) => {
            reader.readAsDataURL(selectedImage);

            // Sau khi reader đã đọc hết data
            reader.onload = () => {
                resolve(reader.result);
            };
        });
    }

    fetch('/admin/product/update/', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: parseInt(id),
            name: name,
            color: color,
            description: description,
            price: price,
            brand: brand,
            catalog: catalog,
            quantity: quantity,
            base64: base64,
            imageName: $("#image").siblings(".custom-file-label").addClass("selected").html()
        })
    })
    .then(response => response.json())
    .then(json => {
        if(json.code === 1)
            toastr.error(json.message, "Thông báo");
        else {
            toastr.success(json.message, "Thông báo");

            setTimeout(() => {
                document.location.href = "/admin/"
            }, 1500)
        }
    })
}

let deletedId;

function showDeleteModal(id) {
    deletedId = id;

    $("#modal-body-delete").html(`Xác nhận xóa sản phẩm có <b>mã là ${id}</b>?`);
    $("#deleteModal").modal("show")
}

function closeDeleteModal() {
    $("#deleteModal").modal("hide")
}

function handleDelete() {
    fetch("/admin/product/delete", {
        method: "delete",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: deletedId
        })
    })
    .then(response => response.json())
    .then(json => {
        closeDeleteModal();

        if(json.code === 1) 
            toastr.error(json.message, "Thông báo");
        else {
            toastr.success(json.message, "Thông báo");

            setTimeout(() => {
                document.location.href = "/admin/"
            }, 1500)
        }
    })
}

let addQuantityId;

function showAddQuantityModal(id, quantity) {
    addQuantityId = id;

    $("#current-quantity").html(`Số lượng sản phẩm hiện tại là <b>${quantity}</b>`);
    $("#addQuantityModal").modal("show")
}

function handleAddQuantity() {
    fetch("/admin/product/add-quantity", {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: addQuantityId,
            quantity: document.getElementById("add-quantity").value
        })
    })
    .then(response => response.json())
    .then(json => {
        closeAddQuantityModal();

        if(json.code === 1) 
            toastr.error(json.message, "Thông báo");
        else {
            toastr.success(json.message, "Thông báo");

            setTimeout(() => {
                document.location.href = "/admin/"
            }, 1500)
        }
    })
}

function closeAddQuantityModal() {
    $("#addQuantityModal").modal("hide")
}