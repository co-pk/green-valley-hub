import { jsPDF } from "jspdf";

// Utility functions
export const generateEightDigitReferenceId = () => {
  //should not start with 0
  const referenceId = Math.floor(10000000 + Math.random() * 90000000);
  return referenceId.toString().replace(/^0/, "");
};

export const generateSixDigitActivationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateFourDigitReferenceId = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const generatePassword = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Loads an image from a public path and returns a base64 data URL.
 * @param {string} url - The public path to the image (relative to public/).
 * @returns {Promise<string>} - The base64 data URL of the image.
 */
const getImageBase64FromPublic = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Could not get canvas context");
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = function (err) {
      reject(err);
    };
    img.src = url;
  });
};

/**
 * Generates a PDF for the Green Valley School application, with a header image and title.
 * The image should be placed in the public directory, e.g. /logo.png or /header.png.
 * @param application Application data object
 * @param headerImagePath Path to the header image in the public directory (e.g. "/logo.png")
 */
export const generatePdfApplication = async (
  application: any,
  headerImagePath: string = "/our-logo.png",
  studentPassword?: string,
  parentPassword?: string
) => {
  const pdf = new jsPDF();

  // Load the image from the public directory
  let imageDataUrl: string | null = null;
  try {
    imageDataUrl = await getImageBase64FromPublic(headerImagePath);
  } catch (e) {
    // If image fails to load, just skip the image
    imageDataUrl = null;
  }

  // Header with image and text
  // Draw a white background for the header
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, 210, 40, "F");

  // Add the image if available
  if (imageDataUrl) {
    // Place image at left, max height 30, keep aspect ratio
    pdf.addImage(imageDataUrl, "PNG", 10, 5, 30, 30);
  }

  // Add the header text "GREEN VALLEY APPLICATION"
  pdf.setTextColor(34, 139, 34);
  pdf.setFontSize(22);
  pdf.setFont(undefined, "bold");
  pdf.text("GREEN VALLEY APPLICATION", 55, 20);

  // Optionally, add a subtitle
  pdf.setFontSize(13);
  pdf.setFont(undefined, "normal");
  pdf.text("Student Application Form", 55, 30);

  // Application Details
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  let y = 50;
  const lineHeight = 10;

  const fields = [
    { label: "Student Name", value: application.studentName },
    { label: "Student ID", value: application.studentId },
    { label: "Parent ID", value: application.parentId },
    { label: "Student Email", value: application.studentEmail },
    { label: "Student Phone", value: application.studentPhone },
    { label: "Parent Name", value: application.parentName },
    { label: "Parent Email", value: application.email },
    { label: "Parent Phone", value: application.phone },
    { label: "Grade Applying For", value: application.grade },
    { label: "Previous School", value: application.previousSchool },
    { label: "Date of Birth", value: application.dateOfBirth },
    { label: "Address", value: application.address },
    { label: "Emergency Contact", value: application.emergencyContact },
    { label: "Emergency Phone", value: application.emergencyPhone },
    { label: "Medical Conditions", value: application.medicalConditions },
    { label: "Previous Grades", value: application.previousGrades },
    { label: "Extracurriculars", value: application.extracurriculars },
    { label: "Why Green Valley?", value: application.whyGreenValley },
    { label: "Additional Info", value: application.additionalInfo },
    { label: "Payment Method", value: application.paymentMethod },
    { label: "Cardholder Name", value: application.cardholderName },
    // Add passwords if provided
    studentPassword
      ? { label: "Student Password", value: studentPassword }
      : null,
    parentPassword ? { label: "Parent Password", value: parentPassword } : null,
  ].filter(Boolean);

  fields.forEach((field) => {
    if (field.value) {
      pdf.setFont(undefined, "bold");
      pdf.text(`${field.label}:`, 20, y);
      pdf.setFont(undefined, "normal");
      pdf.text(`${field.value}`, 70, y);
      y += lineHeight;
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    }
  });

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Generated by Green Valley School Admissions Portal", 105, 290, {
    align: "center",
  });

  pdf.save("application.pdf");
  return pdf;
};
