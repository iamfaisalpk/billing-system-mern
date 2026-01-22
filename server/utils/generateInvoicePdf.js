import PDFDocument from "pdfkit";

const generateInvoicePdf = (invoice, customer, res) => {
    const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    doc
        .rect(0, 0, 612, 140)
        .fill("#4f46e5");

    doc
        .rect(0, 0, 612, 120)
        .fillOpacity(0.9)
        .fill("#6366f1");

    doc
        .fillOpacity(1)
        .fillColor("#ffffff")
        .fontSize(28)
        .font('Helvetica-Bold')
        .text("MY ERP SYSTEM", 50, 45);

    doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor("#e0e7ff")
        .text("Professional Business Solutions", 50, 80);

    doc
        .roundedRect(380, 35, 170, 75, 5)
        .fillOpacity(0.2)
        .fill("#ffffff");

    doc
        .fillOpacity(1)
        .fillColor("#ffffff")
        .fontSize(24)
        .font('Helvetica-Bold')
        .text("INVOICE", 390, 45, { width: 150 });

    doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor("#e0e7ff")
        .text(`Invoice No: ${invoice.invoiceNumber}`, 390, 75, { width: 150 });

    doc
        .text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })}`, 390, 92, { width: 150 });

    doc.fillColor("#000000");

    const customerBoxY = 170;

    doc
        .roundedRect(50, customerBoxY, 250, 100, 5)
        .fillOpacity(0.05)
        .fill("#4f46e5");

    doc
        .fillOpacity(1)
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor("#6b7280")
        .text("BILL TO:", 60, customerBoxY + 15);

    doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor("#1f2937")
        .text(customer.name, 60, customerBoxY + 35);

    doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor("#4b5563")
        .text(customer.email || "", 60, customerBoxY + 53)
        .text(customer.phone || "", 60, customerBoxY + 68)
        .text(customer.address || "", 60, customerBoxY + 83);

    if (invoice.status) {
        const statusX = 320;
        doc
            .roundedRect(statusX, customerBoxY, 230, 45, 5)
            .fillOpacity(0.05)
            .fill("#10b981");

        doc
            .fillOpacity(1)
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor("#6b7280")
            .text("STATUS:", statusX + 10, customerBoxY + 12);

        const statusColor = invoice.status === 'PAID' ? '#10b981' :
            invoice.status === 'PENDING' ? '#f59e0b' : '#ef4444';

        doc
            .fontSize(12)
            .fillColor(statusColor)
            .text(invoice.status, statusX + 10, customerBoxY + 28);
    }

    const tableTop = 310;

    doc
        .rect(50, tableTop, 500, 35)
        .fill("#4f46e5");

    doc
        .rect(50, tableTop, 500, 35)
        .fillOpacity(0.9)
        .fill("#6366f1");

    const itemX = 60;
    const descX = 180;
    const qtyX = 340;
    const priceX = 410;
    const totalX = 480;

    doc
        .fillOpacity(1)
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor("#ffffff")
        .text("ITEM", itemX, tableTop + 12)
        .text("QTY", qtyX, tableTop + 12)
        .text("PRICE", priceX, tableTop + 12)
        .text("AMOUNT", totalX, tableTop + 12);

    let y = tableTop + 50;
    doc.fontSize(10).font('Helvetica').fillColor("#374151");

    invoice.items.forEach((item, index) => {
        if (y > 680) {
            doc.addPage();
            y = 50;
        }

        if (index % 2 === 0) {
            doc
                .rect(50, y - 8, 500, 28)
                .fillOpacity(0.03)
                .fill("#4f46e5");
        }

        doc
            .fillOpacity(1)
            .font('Helvetica-Bold')
            .fillColor("#1f2937")
            .text(item.name, itemX, y, { width: 150 });

        doc
            .font('Helvetica')
            .fillColor("#6b7280")
            .text(item.quantity.toString(), qtyX, y)
            .text(`₹${item.price.toFixed(2)}`, priceX, y)
            .fillColor("#1f2937")
            .text(`₹${item.total.toFixed(2)}`, totalX, y);

        y += 28;

        doc
            .moveTo(50, y)
            .lineTo(550, y)
            .strokeOpacity(0.1)
            .stroke("#4f46e5");

        y += 5;
    });

    const totalsStartY = y + 20;

    doc
        .roundedRect(320, totalsStartY, 230, 90, 5)
        .fillOpacity(0.03)
        .fill("#4f46e5");

    doc.fillOpacity(1);

    doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor("#6b7280")
        .text("Subtotal:", 340, totalsStartY + 15, { width: 100, align: "left" });

    doc
        .fillColor("#374151")
        .text(`₹${invoice.subTotal.toFixed(2)}`, 450, totalsStartY + 15, {
            width: 90,
            align: "right"
        });

    if (invoice.tax) {
        doc
            .fillColor("#6b7280")
            .text("Tax:", 340, totalsStartY + 35, { width: 100, align: "left" });

        doc
            .fillColor("#374151")
            .text(`₹${invoice.tax.toFixed(2)}`, 450, totalsStartY + 35, {
                width: 90,
                align: "right"
            });
    }

    const totalY = invoice.tax ? totalsStartY + 55 : totalsStartY + 35;

    doc
        .moveTo(340, totalY)
        .lineTo(540, totalY)
        .strokeOpacity(0.2)
        .stroke("#4f46e5");

    doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor("#4f46e5")
        .text("Grand Total:", 340, totalY + 10, { width: 100, align: "left" });

    doc
        .fontSize(16)
        .text(`₹${invoice.grandTotal.toFixed(2)}`, 450, totalY + 10, {
            width: 90,
            align: "right"
        });

    const footerY = 750;

    doc
        .moveTo(50, footerY)
        .lineTo(550, footerY)
        .strokeOpacity(0.1)
        .stroke("#4f46e5");

    doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor("#9ca3af")
        .text(
            "Thank you for your business!",
            50,
            footerY + 15,
            { align: "center", width: 500 }
        );

    doc
        .fontSize(8)
        .fillColor("#d1d5db")
        .text(
            "This is a computer-generated invoice and does not require a signature.",
            50,
            footerY + 30,
            { align: "center", width: 500 }
        );

    doc.end();
};

export default generateInvoicePdf;