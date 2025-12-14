import PDFDocument from "pdfkit";

export const generateTicketPDF = ({
  appointmentId,
  serviceName,
  appointmentDate
}) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    // ===== CONTENIDO DEL TICKET =====
    doc.fontSize(18).text("Ticket de Cita", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Folio de cita: ${appointmentId}`);
    doc.moveDown(0.5);

    doc.text(`Servicio: ${serviceName}`);
    doc.moveDown(0.5);

    doc.text(`Fecha de la cita: ${appointmentDate}`);
    doc.moveDown();

    doc.text("Gracias por agendar con nosotros.", { align: "center" });

    doc.end();
  });
};
