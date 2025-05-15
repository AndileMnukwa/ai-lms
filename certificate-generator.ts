import { jsPDF } from "jspdf"
import QRCode from "qrcode"

// Certificate generator
export async function generateCertificate(data: {
  studentName: string
  courseName: string
  completionDate: Date
  certificateId: string
  verificationUrl: string
}) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Set background color
  doc.setFillColor(255, 245, 248) // Light pink background
  doc.rect(0, 0, 297, 210, "F")

  // Add border
  doc.setDrawColor(255, 90, 142) // Primary color
  doc.setLineWidth(3)
  doc.rect(10, 10, 277, 190)

  // Add header
  doc.setFont("helvetica", "bold")
  doc.setTextColor(13, 27, 64) // Secondary color
  doc.setFontSize(30)
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 40, { align: "center" })

  // Add decorative line
  doc.setDrawColor(65, 201, 226) // Accent color
  doc.setLineWidth(1)
  doc.line(74, 45, 223, 45)

  // Add certificate text
  doc.setFont("helvetica", "normal")
  doc.setTextColor(13, 27, 64) // Secondary color
  doc.setFontSize(14)
  doc.text("This is to certify that", 148.5, 70, { align: "center" })

  // Add student name
  doc.setFont("helvetica", "bold")
  doc.setTextColor(255, 90, 142) // Primary color
  doc.setFontSize(24)
  doc.text(data.studentName, 148.5, 85, { align: "center" })

  // Add course completion text
  doc.setFont("helvetica", "normal")
  doc.setTextColor(13, 27, 64) // Secondary color
  doc.setFontSize(14)
  doc.text("has successfully completed the course", 148.5, 100, { align: "center" })

  // Add course name
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text(data.courseName, 148.5, 115, { align: "center" })

  // Add completion date
  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.text(
    `Completed on ${data.completionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    148.5,
    135,
    { align: "center" },
  )

  // Add certificate ID
  doc.setFontSize(10)
  doc.text(`Certificate ID: ${data.certificateId}`, 148.5, 145, { align: "center" })

  // Generate QR code for verification
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data.verificationUrl)
    doc.addImage(qrCodeDataUrl, "PNG", 133.5, 150, 30, 30)
    doc.setFontSize(8)
    doc.text("Scan to verify certificate", 148.5, 185, { align: "center" })
  } catch (error) {
    console.error("Failed to generate QR code:", error)
  }

  // Add signature line
  doc.setDrawColor(13, 27, 64) // Secondary color
  doc.setLineWidth(0.5)
  doc.line(60, 165, 110, 165)
  doc.line(187, 165, 237, 165)

  // Add signature labels
  doc.setFontSize(10)
  doc.text("Course Instructor", 85, 175, { align: "center" })
  doc.text("EduAI LMS Director", 212, 175, { align: "center" })

  // Return the PDF as base64
  return doc.output("datauristring")
}

// Store certificate in database
export async function storeCertificate(
  db: any,
  certificateData: {
    studentId: string
    courseId: string
    certificateId: string
    issuedDate: Date
    pdfUrl: string
    verificationUrl: string
  },
) {
  try {
    const result = await db.collection("certificates").insertOne({
      ...certificateData,
      createdAt: new Date(),
    })

    return result.insertedId
  } catch (error) {
    console.error("Failed to store certificate:", error)
    throw error
  }
}

// Verify certificate
export async function verifyCertificate(db: any, certificateId: string) {
  try {
    const certificate = await db.collection("certificates").findOne({ certificateId })

    if (!certificate) {
      return { valid: false, message: "Certificate not found" }
    }

    return {
      valid: true,
      certificate: {
        studentId: certificate.studentId,
        courseId: certificate.courseId,
        issuedDate: certificate.issuedDate,
      },
    }
  } catch (error) {
    console.error("Failed to verify certificate:", error)
    return { valid: false, message: "Verification error" }
  }
}
