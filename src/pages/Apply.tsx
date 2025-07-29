import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Calendar,
  FileText,
  Users,
  CheckCircle,
  Send,
  Upload,
  Download,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { saveApplicationToDatabase } from "@/utils/firebase";
import { uploadDocumentsToStorage } from "@/utils/firebase";
import {
  generateEightDigitReferenceId,
  generateFourDigitReferenceId,
  generatePassword,
  generatePdfApplication,
} from "@/utils/others";
import {
  createStudentInDatabase,
  createParentInDatabase,
} from "@/utils/firebase";

const Apply = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    parentName: "",
    email: "",
    phone: "",
    grade: "",
    previousSchool: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: "",
    previousGrades: "",
    extracurriculars: "",
    whyGreenValley: "",
    additionalInfo: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [step, setStep] = useState(0);
  const documentTypes = [
    { label: "Ghana Card", key: "ghana_card" },
    { label: "Birth Certificate", key: "birth_certificate" },
    { label: "Transcripts", key: "transcripts" },
  ];
  const [documents, setDocuments] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const steps = [
    "Student Information",
    "Parent/Guardian Information",
    "Academic Information",
    "Additional Information",
    "Payment Information",
    "Document Upload",
  ];

  const validateStep = () => {
    let missing: string[] = [];
    if (step === 0) {
      if (!formData.studentName) missing.push("Student Name");
      if (!formData.dateOfBirth) missing.push("Date of Birth");
      if (!formData.studentEmail) missing.push("Student Email");
      if (!formData.grade) missing.push("Grade");
      if (!formData.address) missing.push("Address");
    } else if (step === 1) {
      if (!formData.parentName) missing.push("Parent Name");
      if (!formData.email) missing.push("Parent Email");
      if (!formData.phone) missing.push("Primary Phone");
    } else if (step === 2) {
      if (!formData.previousSchool) missing.push("Previous School");
      if (!formData.previousGrades) missing.push("Previous Grades");
      if (!formData.extracurriculars) missing.push("Extracurriculars");
    } else if (step === 3) {
      if (!formData.whyGreenValley) missing.push("Why Green Valley");
    } else if (step === 4) {
      if (!formData.paymentMethod) missing.push("Payment Method");
      if (
        formData.paymentMethod === "credit-card" ||
        formData.paymentMethod === "debit-card"
      ) {
        if (!formData.cardholderName) missing.push("Cardholder Name");
        if (!formData.cardNumber) missing.push("Card Number");
        if (!formData.expiryDate) missing.push("Expiry Date");
        if (!formData.cvv) missing.push("CVV");
      }
    } else if (step === 5) {
      if (documents.some((doc) => !doc))
        missing.push("All 3 required documents");
    }
    setErrors(missing);
    return missing.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    } else {
      toast({
        title: "Please complete all required fields",
        description: errors.join(", "),
        variant: "destructive",
      });
    }
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments((prev) => {
        const updated = [...prev];
        updated[index] = e.target.files[0];
        return updated;
      });
    }
  };

  const handleUploadDocuments = async () => {
    setUploading(true);
    const uploadedDocs: { name: string; documentUrl: string }[] = [];
    for (let i = 0; i < documents.length; i++) {
      const file = documents[i];
      if (file) {
        const url = await uploadDocumentsToStorage({
          file,
          studentName: formData.studentName,
        });
        uploadedDocs.push({ name: documentTypes[i].label, documentUrl: url });
      }
    }
    setUploading(false);
    return uploadedDocs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast({
        title: "Submitting...",
        description: "Please wait while we process your application.",
      });
      if (documents.some((doc) => !doc)) {
        toast({
          title: "Document Upload Error",
          description: "Please upload all 3 required documents.",
          variant: "destructive",
        });
        return;
      }
      const documentUrls = await handleUploadDocuments();
      // Generate credentials for student and parent
      const studentId = generateEightDigitReferenceId();
      const parentId = generateEightDigitReferenceId();
      const studentPassword = generatePassword();
      const parentPassword = generatePassword();
      // Save application
      const application = await saveApplicationToDatabase({
        ...formData,
        documentUrls, // array of {name, documentUrl}
        studentId,
        parentId,
      });
      // Save student and parent to Firestore with canLogin: false
      await createStudentInDatabase({
        applicationId: application.id,
        studentId,
        referenceId: generateEightDigitReferenceId(),
        activationCode: generateFourDigitReferenceId(),
        studentName: formData.studentName,
        parentName: formData.parentName,
        parentEmail: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: studentPassword,
        canLogin: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await createParentInDatabase({
        parentId,
        parentName: formData.parentName,
        parentEmail: formData.email,
        phoneNumber: formData.emergencyPhone,
        address: formData.address,
        child: studentId,
        password: parentPassword,
        canLogin: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      // Generate PDF with all info and credentials
      await generatePdfApplication(
        {
          ...formData,
          studentId,
          parentId,
          studentPhone: formData.phone,
          parentPhone: formData.emergencyPhone,
        },
        "/logo.png",
        studentPassword,
        parentPassword
      );
      toast({
        title: "Application Submitted!",
        description:
          "Your application has been submitted successfully. Please check your PDF for credentials.",
      });
      setFormData({
        studentName: "",
        studentEmail: "",
        parentName: "",
        email: "",
        phone: "",
        grade: "",
        previousSchool: "",
        dateOfBirth: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
        medicalConditions: "",
        previousGrades: "",
        extracurriculars: "",
        whyGreenValley: "",
        additionalInfo: "",
        paymentMethod: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      });
      setDocuments([null, null, null]);
      setStep(0);
    } catch (error) {
      console.error("❌ Submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const admissionSteps = [
    {
      icon: FileText,
      title: "Submit Application",
      description:
        "Complete our comprehensive online application form with all required information and documents.",
    },
    {
      icon: Calendar,
      title: "Schedule Interview",
      description:
        "Our admissions team will contact you to schedule a personal interview and campus tour.",
    },
    {
      icon: Users,
      title: "Assessment & Review",
      description:
        "Student assessment, document review, and evaluation of school-family fit.",
    },
    {
      icon: CheckCircle,
      title: "Admission Decision",
      description:
        "Receive your admission decision and complete the enrollment process.",
    },
  ];

  // Render the application form page

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-valley-green to-valley-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Apply to Green Valley School
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Begin your child's journey to academic excellence. Join our
            community of learners and leaders.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Application Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-valley-green">
            Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionSteps.map((step, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow relative"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-valley-green to-valley-blue rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-valley-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg text-valley-green">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-valley-green">
                  Student Application Form
                </CardTitle>
                <p className="text-muted-foreground">
                  Please fill out all required fields marked with an asterisk
                  (*). Ensure all information is accurate and complete.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 0 && (
                    // Student Information fields
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-valley-green">
                        Student Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="studentName">Full Name *</Label>
                          <Input
                            id="studentName"
                            value={formData.studentName}
                            onChange={(e) =>
                              handleInputChange("studentName", e.target.value)
                            }
                            required
                            className="mt-1"
                            placeholder="Enter student's full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) =>
                              handleInputChange("dateOfBirth", e.target.value)
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="studentEmail">
                            Student Email Address *
                          </Label>
                          <Input
                            id="studentEmail"
                            type="email"
                            value={formData.studentEmail}
                            onChange={(e) =>
                              handleInputChange("studentEmail", e.target.value)
                            }
                            required
                            className="mt-1"
                            placeholder="student@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="grade">
                            Grade Level Applying For *
                          </Label>
                          <Select
                            value={formData.grade}
                            onValueChange={(value) =>
                              handleInputChange("grade", value)
                            }
                            required
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select grade level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kindergarten">
                                Kindergarten
                              </SelectItem>
                              <SelectItem value="1st">1st Grade</SelectItem>
                              <SelectItem value="2nd">2nd Grade</SelectItem>
                              <SelectItem value="3rd">3rd Grade</SelectItem>
                              <SelectItem value="4th">4th Grade</SelectItem>
                              <SelectItem value="5th">5th Grade</SelectItem>
                              <SelectItem value="6th">6th Grade</SelectItem>
                              <SelectItem value="7th">7th Grade</SelectItem>
                              <SelectItem value="8th">8th Grade</SelectItem>
                              <SelectItem value="9th">9th Grade</SelectItem>
                              <SelectItem value="10th">10th Grade</SelectItem>
                              <SelectItem value="11th">11th Grade</SelectItem>
                              <SelectItem value="12th">12th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="previousSchool">
                            Previous School
                          </Label>
                          <Input
                            id="previousSchool"
                            value={formData.previousSchool}
                            onChange={(e) =>
                              handleInputChange(
                                "previousSchool",
                                e.target.value
                              )
                            }
                            required
                            className="mt-1"
                            placeholder="Name of previous school"
                          />
                        </div>
                        <div></div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="address">Home Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          required
                          className="mt-1"
                          rows={3}
                          placeholder="Enter complete home address"
                        />
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    // Parent/Guardian Information fields
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-valley-green">
                        Parent/Guardian Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="parentName">
                            Parent/Guardian Name *
                          </Label>
                          <Input
                            id="parentName"
                            value={formData.parentName}
                            onChange={(e) =>
                              handleInputChange("parentName", e.target.value)
                            }
                            required
                            className="mt-1"
                            placeholder="Full name of parent/guardian"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Parent Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            required
                            className="mt-1"
                            placeholder="parent@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="phone">Primary Phone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            required
                            className="mt-1"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyContact">
                            Emergency Contact Name
                          </Label>
                          <Input
                            id="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={(e) =>
                              handleInputChange(
                                "emergencyContact",
                                e.target.value
                              )
                            }
                            className="mt-1"
                            placeholder="Emergency contact person"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="emergencyPhone">
                          Emergency Contact Phone
                        </Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) =>
                            handleInputChange("emergencyPhone", e.target.value)
                          }
                          className="mt-1"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    // Academic Information fields
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-valley-green">
                        Academic Information
                      </h3>
                      <div>
                        <Label htmlFor="previousGrades">
                          Previous Academic Performance
                        </Label>
                        <Textarea
                          id="previousGrades"
                          value={formData.previousGrades}
                          onChange={(e) =>
                            handleInputChange("previousGrades", e.target.value)
                          }
                          required
                          className="mt-1"
                          rows={3}
                          placeholder="Please describe your child's academic performance in previous school(s)"
                        />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="extracurriculars">
                          Extracurricular Activities & Interests
                        </Label>
                        <Textarea
                          id="extracurriculars"
                          value={formData.extracurriculars}
                          onChange={(e) =>
                            handleInputChange(
                              "extracurriculars",
                              e.target.value
                            )
                          }
                          required
                          className="mt-1"
                          rows={3}
                          placeholder="Sports, clubs, hobbies, special talents, etc."
                        />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    // Additional Information fields
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-valley-green">
                        Additional Information
                      </h3>
                      <div>
                        <Label htmlFor="medicalConditions">
                          Medical Conditions or Special Needs
                        </Label>
                        <Textarea
                          id="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={(e) =>
                            handleInputChange(
                              "medicalConditions",
                              e.target.value
                            )
                          }
                          className="mt-1"
                          rows={3}
                          placeholder="Please list any medical conditions, allergies, or special needs we should be aware of"
                        />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="whyGreenValley">
                          Why Green Valley School? *
                        </Label>
                        <Textarea
                          id="whyGreenValley"
                          value={formData.whyGreenValley}
                          onChange={(e) =>
                            handleInputChange("whyGreenValley", e.target.value)
                          }
                          required
                          className="mt-1"
                          rows={4}
                          placeholder="Please tell us why you chose Green Valley School and what you hope your child will gain from our educational program"
                        />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="additionalInfo">
                          Additional Comments
                        </Label>
                        <Textarea
                          id="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={(e) =>
                            handleInputChange("additionalInfo", e.target.value)
                          }
                          className="mt-1"
                          rows={3}
                          placeholder="Any additional information you'd like to share"
                        />
                      </div>
                    </div>
                  )}
                  {step === 4 && (
                    // Payment Information fields
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-valley-green flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Application Fee Payment
                      </h3>
                      <div className="bg-valley-green/5 border border-valley-green/20 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Application Fee:
                          </span>
                          <span className="text-lg font-bold text-valley-green">
                            $100.00
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          This fee covers application processing and is
                          non-refundable.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="paymentMethod">
                            Payment Method *
                          </Label>
                          <Select
                            value={formData.paymentMethod}
                            onValueChange={(value) =>
                              handleInputChange("paymentMethod", value)
                            }
                            required
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit-card">
                                Credit Card
                              </SelectItem>
                              <SelectItem value="debit-card">
                                Debit Card
                              </SelectItem>
                              <SelectItem value="bank-transfer">
                                Bank Transfer
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(formData.paymentMethod === "credit-card" ||
                          formData.paymentMethod === "debit-card") && (
                          <>
                            <div>
                              <Label htmlFor="cardholderName">
                                Cardholder Name *
                              </Label>
                              <Input
                                id="cardholderName"
                                value={formData.cardholderName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cardholderName",
                                    e.target.value
                                  )
                                }
                                required
                                className="mt-1"
                                placeholder="Full name as on card"
                              />
                            </div>

                            <div>
                              <Label htmlFor="cardNumber">Card Number *</Label>
                              <Input
                                id="cardNumber"
                                value={formData.cardNumber}
                                onChange={(e) =>
                                  handleInputChange(
                                    "cardNumber",
                                    e.target.value
                                  )
                                }
                                required
                                className="mt-1"
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate">
                                  Expiry Date *
                                </Label>
                                <Input
                                  id="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "expiryDate",
                                      e.target.value
                                    )
                                  }
                                  required
                                  className="mt-1"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV *</Label>
                                <Input
                                  id="cvv"
                                  value={formData.cvv}
                                  onChange={(e) =>
                                    handleInputChange("cvv", e.target.value)
                                  }
                                  required
                                  className="mt-1"
                                  placeholder="123"
                                  maxLength={4}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {formData.paymentMethod === "bank-transfer" && (
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">
                              Bank Transfer Details
                            </h4>
                            <div className="text-sm text-blue-800 space-y-1">
                              <p>
                                <strong>Bank:</strong> Green Valley Community
                                Bank
                              </p>
                              <p>
                                <strong>Account Name:</strong> Green Valley
                                School
                              </p>
                              <p>
                                <strong>Account Number:</strong> 1234567890
                              </p>
                              <p>
                                <strong>Routing Number:</strong> 987654321
                              </p>
                              <p>
                                <strong>Reference:</strong> Please include
                                student's full name
                              </p>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                              Please allow 2-3 business days for transfer
                              processing.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {step === 5 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-valley-green">
                        Required Documents (Upload all 3)
                      </h3>
                      <div className="flex gap-4 mb-4">
                        {documentTypes.map((doc, idx) => (
                          <label
                            key={doc.key}
                            className="w-24 h-24 border-2 border-dashed border-valley-green flex flex-col items-center justify-center rounded-lg cursor-pointer bg-gray-50 hover:bg-valley-green/10 transition"
                          >
                            {documents[idx] ? (
                              <span className="text-xs text-center px-1">
                                {documents[idx]?.name}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {doc.label}
                              </span>
                            )}
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              className="hidden"
                              onChange={(e) => handleDocumentChange(idx, e)}
                            />
                          </label>
                        ))}
                      </div>
                      {uploading && <p>Uploading documents...</p>}
                    </div>
                  )}
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      onClick={handleBack}
                      disabled={step === 0}
                    >
                      Back
                    </Button>
                    {step < steps.length - 1 ? (
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full bg-valley-green hover:bg-valley-green-dark text-lg py-3"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application & Payment
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">
                  Application Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-valley-green mt-0.5" />
                    <span className="text-sm">
                      Complete online application form
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-valley-green mt-0.5" />
                    <span className="text-sm">Prepare required documents</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-valley-green mt-0.5" />
                    <span className="text-sm">
                      Submit application fee ($100)
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-valley-green mt-0.5" />
                    <span className="text-sm">
                      Schedule campus tour & interview
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Application Opens</span>
                  <span className="text-sm font-semibold">November 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Early Decision Deadline</span>
                  <span className="text-sm font-semibold">January 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Regular Decision Deadline</span>
                  <span className="text-sm font-semibold">March 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Admission Decisions</span>
                  <span className="text-sm font-semibold">April 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Enrollment Deadline</span>
                  <span className="text-sm font-semibold">May 1</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our admissions team is here to help you through the
                  application process.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Admissions Office</strong>
                    <br />
                    Phone: (555) 123-4567
                    <br />
                    Email: admissions@greenvalley.edu
                  </p>
                  <p className="text-sm">
                    <strong>Office Hours</strong>
                    <br />
                    Mon-Fri: 8:00 AM - 5:00 PM
                    <br />
                    Sat: 9:00 AM - 2:00 PM
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule a Visit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-valley-green">
                  Download Forms
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button
                  type="button"
                  className="w-full justify-start"
                  onClick={() => {
                    //generate a pdf here
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Application Form (PDF)
                </Button>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Health Form
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Financial Aid Form
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Apply;
