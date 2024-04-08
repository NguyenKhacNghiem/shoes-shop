function printInvoice() {
    // Ẩn button in hóa đơn
    let printInvoice = document.getElementById("printInvoice");
    printInvoice.style.display = "none"

    html2pdf(document.body, {
        // Tên file pdf sẽ là mã hóa đơn
        filename: $("#orderId").text() + ".pdf",
    })

    setTimeout(() => {
        // Hiện lại button in hóa đơn
        printInvoice.style.display = ""
        alert("In hóa đơn thành công");
        window.location.href = "/order";
    }, 1000)
}