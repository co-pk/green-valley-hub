import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LogOut } from "lucide-react";
import {
  getApplicationsFromDatabaseInOrder,
  updateApplicationInDatabase,
  createStudentInDatabase,
  createParentInDatabase,
  createPoll,
  addNominationToPoll,
  uploadNominationProfileImage,
  editPollCategory,
  deletePoll,
  editNomination,
  deleteNomination,
} from "@/utils/firebase";
import {
  generateEightDigitReferenceId,
  generateFourDigitReferenceId,
  generatePassword,
  generatePdfApplication,
} from "@/utils/others";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sendSmsMessage } from "@/utils/helpers";
import { uploadFileAndGetPublicUrl } from "@/utils/supabase";

const AdminPortal = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Polls state
  const [polls, setPolls] = useState<any[]>([]);
  const [pollLoading, setPollLoading] = useState(false);
  const [newPollCategory, setNewPollCategory] = useState("");
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [nominationName, setNominationName] = useState("");
  const [nominationImage, setNominationImage] = useState<File | null>(null);
  const [nominationUploading, setNominationUploading] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [editingPollCategory, setEditingPollCategory] = useState("");
  const [editingNominationIdx, setEditingNominationIdx] = useState<
    number | null
  >(null);
  const [editingNominationName, setEditingNominationName] = useState("");
  const [editingNominationImage, setEditingNominationImage] =
    useState<File | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const applications = await getApplicationsFromDatabaseInOrder();
      setApplications(applications);
    };
    fetchApplications();
  }, []);

  // Fetch polls
  useEffect(() => {
    const fetchPolls = async () => {
      setPollLoading(true);
      const snapshot = await getDocs(collection(db, "polls"));
      const pollsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
      setPollLoading(false);
    };
    fetchPolls();
  }, []);

  const handleLogout = async () => {
    try {
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated as admin
    // if (!isLoading && !user) {
    //   navigate("/admin-login");
    // }
  }, [user, navigate, isLoading]);

  const handleApplicationDecision = async (
    studentId: string,
    approved: boolean
  ) => {
    console.log(studentId, approved);
    const application = applications.find((app) => app.studentId === studentId);

    if (application) {
      application.applicationStatus = approved ? "approved" : "rejected";
      await updateApplicationInDatabase(application);
    }
    // Find the student and parent IDs from the application
    const studentDoc = await getDocs(
      query(
        collection(db, "students"),
        where("studentId", "==", application.studentId)
      )
    );
    const parentDoc = await getDocs(
      query(
        collection(db, "parents"),
        where("parentId", "==", application.parentId)
      )
    );
    const studentPassword = generatePassword();
    if (!studentDoc.empty) {
      await updateDoc(doc(db, "students", studentDoc.docs[0].id), {
        canLogin: true,
        password: studentPassword,
      });
    }
    const parentPassword = generatePassword();
    if (!parentDoc.empty) {
      await updateDoc(doc(db, "parents", parentDoc.docs[0].id), {
        canLogin: true,
        password: parentPassword,
      });
    }
    // Generate PDF with all info and passwords

    toast({
      title: "Success",
      description: `Application ${
        approved ? "approved" : "rejected"
      } successfully`,
    });

    // loading the applications again
    if (approved) {
      // If approved, send login credentials to both student and parent
      const studentLoginMsg = `Congratulations! Your application has been approved.\n\nStudent Login Credentials:\nID: ${application.studentId}\nPassword: ${studentPassword} \n\nYou can now log in to your account.`;
      const parentLoginMsg = `Congratulations! Dear ${application.parentName}, Your child's application to Green Valley School has been approved.\n\nParent Login Credentials:\nID: ${application.parentId}\nPassword: ${parentPassword}\n\nYou can now log in to your account.`;

      // Send to student
      await sendSmsMessage(
        application.phone,
        studentLoginMsg,
        "weAfHe3mTtFWoRGGvlWl8a1Kn"
      );
      // Send to parent (if parent phone is available)
      if (application.emergencyPhone) {
        await sendSmsMessage(
          application.emergencyPhone,
          parentLoginMsg,
          "weAfHe3mTtFWoRGGvlWl8a1Kn"
        );
      }
    } else {
      // If rejected, send rejection message
      const rejectionMsg = `We regret to inform you that your application has been rejected. Please re-apply or contact us at admissions@greenvalleyschool.com for further assistance.`;
      await sendSmsMessage(
        application.emergencyPhone,
        rejectionMsg,
        "weAfHe3mTtFWoRGGvlWl8a1Kn"
      );
      if (application.parentPhone) {
        await sendSmsMessage(
          application.parentPhone,
          rejectionMsg,
          "weAfHe3mTtFWoRGGvlWl8a1Kn"
        );
      }
    }
    const newApplications = await getApplicationsFromDatabaseInOrder();
    setApplications(newApplications);
  };

  // Create poll handler
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollCategory)
      return toast({ title: "Category required", variant: "destructive" });
    try {
      const poll = await createPoll({ category: newPollCategory });
      setPolls((prev) => [poll, ...prev]);
      setNewPollCategory("");
      toast({ title: "Poll created" });
    } catch (err) {
      toast({
        title: "Error creating poll",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  // Add nomination handler
  const handleAddNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPollId || !nominationName || !nominationImage) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    setNominationUploading(true);
    try {
      const imageUrl = await uploadFileAndGetPublicUrl(
        nominationImage,
        `polls/${selectedPollId}/nomination-${nominationName}.jpg`
      );
      await addNominationToPoll({
        pollId: selectedPollId,
        name: nominationName,
        profileImageUrl: imageUrl,
      });
      // Refresh polls
      const snapshot = await getDocs(collection(db, "polls"));
      const pollsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
      setNominationName("");
      setNominationImage(null);
      toast({ title: "Nomination added" });
    } catch (err) {
      toast({
        title: "Error adding nomination",
        description: String(err),
        variant: "destructive",
      });
    }
    setNominationUploading(false);
  };

  // Edit poll handler
  const handleEditPoll = async (pollId: string, currentCategory: string) => {
    setEditingPollId(pollId);
    setEditingPollCategory(currentCategory);
  };
  const handleSavePollEdit = async (pollId: string) => {
    try {
      await editPollCategory({ pollId, category: editingPollCategory });
      const snapshot = await getDocs(collection(db, "polls"));
      const pollsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
      setEditingPollId(null);
      setEditingPollCategory("");
      toast({ title: "Poll updated" });
    } catch (err) {
      toast({
        title: "Error updating poll",
        description: String(err),
        variant: "destructive",
      });
    }
  };
  const handleDeletePoll = async (pollId: string) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;
    try {
      await deletePoll(pollId);
      setPolls((prev) => prev.filter((p) => p.id !== pollId));
      toast({ title: "Poll deleted" });
    } catch (err) {
      toast({
        title: "Error deleting poll",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  // Edit nomination handler
  const handleEditNomination = (
    pollId: string,
    idx: number,
    currentName: string
  ) => {
    setEditingPollId(pollId);
    setEditingNominationIdx(idx);
    setEditingNominationName(currentName);
    setEditingNominationImage(null);
  };
  const handleSaveNominationEdit = async (pollId: string, idx: number) => {
    try {
      let imageUrl: string | undefined = undefined;
      if (editingNominationImage) {
        imageUrl = await uploadFileAndGetPublicUrl(
          editingNominationImage,
          `polls/${pollId}/nomination-${idx}.jpg`
        );
      }
      await editNomination({
        pollId,
        nominationIdx: idx,
        name: editingNominationName,
        profileImageUrl: imageUrl,
      });
      const snapshot = await getDocs(collection(db, "polls"));
      const pollsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
      setEditingPollId(null);
      setEditingNominationIdx(null);
      setEditingNominationName("");
      setEditingNominationImage(null);
      toast({ title: "Nomination updated" });
    } catch (err) {
      toast({
        title: "Error updating nomination",
        description: String(err),
        variant: "destructive",
      });
    }
  };
  const handleDeleteNomination = async (pollId: string, idx: number) => {
    if (!window.confirm("Are you sure you want to delete this nomination?"))
      return;
    try {
      await deleteNomination({ pollId, nominationIdx: idx });
      const snapshot = await getDocs(collection(db, "polls"));
      const pollsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
      toast({ title: "Nomination deleted" });
    } catch (err) {
      toast({
        title: "Error deleting nomination",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Applications</TabsTrigger>
            <TabsTrigger value="approved">Approved Applications</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <p>Loading applications...</p>
                  </div>
                ) : applications.filter(
                    (app) => app.applicationStatus !== "approved"
                  ).length === 0 ? (
                  <div className="text-center py-4">
                    <p>No pending applications found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of pending applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Parent Details</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Application Details</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications
                        .filter((app) => app.applicationStatus !== "approved")
                        .map((app) => (
                          <TableRow key={app.studentId}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{app.studentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Grade: {app.grade}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {app.studentId}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{app.parentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {app.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm">{app.emergencyPhone}</p>
                                <p className="text-sm text-muted-foreground">
                                  {app.address}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm">
                                  Submitted:{" "}
                                  {app.createdAt.toDate().toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Ref: {app.referenceId}
                                </p>
                                {app.activationCode && (
                                  <p className="text-sm text-muted-foreground">
                                    Code: {app.activationCode}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {app.documentUrls &&
                                app.documentUrls.length > 0 ? (
                                  app.documentUrls.map((doc: any) => (
                                    <div key={doc.name}>
                                      <a
                                        href={doc.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-sm"
                                      >
                                        {doc.name}
                                      </a>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    No documents
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleApplicationDecision(
                                      app.studentId,
                                      true
                                    )
                                  }
                                  disabled={loading}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleApplicationDecision(
                                      app.studentId,
                                      false
                                    )
                                  }
                                  disabled={loading}
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <p>Loading applications...</p>
                  </div>
                ) : applications.filter(
                    (app) => app.applicationStatus === "approved"
                  ).length === 0 ? (
                  <div className="text-center py-4">
                    <p>No approved applications found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of approved applications</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Details</TableHead>
                        <TableHead>Parent Details</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Application Details</TableHead>
                        <TableHead>Documents</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications
                        .filter((app) => app.applicationStatus === "approved")
                        .map((app) => (
                          <TableRow key={app.studentId}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{app.studentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Grade: {app.grade}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {app.studentId}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{app.parentName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {app.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm">{app.emergencyPhone}</p>
                                <p className="text-sm text-muted-foreground">
                                  {app.address}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="text-sm">
                                  Submitted:{" "}
                                  {app.createdAt.toDate().toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Ref: {app.referenceId}
                                </p>
                                {app.activationCode && (
                                  <p className="text-sm text-muted-foreground">
                                    Code: {app.activationCode}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {app.documentUrls &&
                                app.documentUrls.length > 0 ? (
                                  app.documentUrls.map((doc: any) => (
                                    <div key={doc.name}>
                                      <a
                                        href={doc.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-sm"
                                      >
                                        {doc.name}
                                      </a>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    No documents
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="polls">
            <Card>
              <CardHeader>
                <CardTitle>Poll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePoll} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Poll category (e.g. Best Student)"
                    value={newPollCategory}
                    onChange={(e) => setNewPollCategory(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <Button type="submit">Create Poll</Button>
                </form>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Select Poll to Add Nomination
                  </label>
                  <select
                    value={selectedPollId || ""}
                    onChange={(e) => setSelectedPollId(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">-- Select Poll --</option>
                    {polls.map((poll) => (
                      <option key={poll.id} value={poll.id}>
                        {poll.category}
                      </option>
                    ))}
                  </select>
                </div>
                <form
                  onSubmit={handleAddNomination}
                  className="flex gap-2 mb-4 items-end"
                >
                  <input
                    type="text"
                    placeholder="Student name"
                    value={nominationName}
                    onChange={(e) => setNominationName(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNominationImage(e.target.files?.[0] || null)
                    }
                    className="flex-1"
                  />
                  <Button type="submit" disabled={nominationUploading}>
                    {nominationUploading ? "Uploading..." : "Add Nomination"}
                  </Button>
                </form>
                <div>
                  <h3 className="font-semibold mb-2">Polls</h3>
                  {pollLoading ? (
                    <p>Loading polls...</p>
                  ) : polls.length === 0 ? (
                    <p>No polls found.</p>
                  ) : (
                    polls.map((poll) => (
                      <div key={poll.id} className="mb-4 border rounded p-2">
                        {editingPollId === poll.id ? (
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={editingPollCategory}
                              onChange={(e) =>
                                setEditingPollCategory(e.target.value)
                              }
                              className="border rounded px-2 py-1 flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSavePollEdit(poll.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingPollId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-bold flex-1">
                              {poll.category}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEditPoll(poll.id, poll.category)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletePoll(poll.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mb-1">
                          Nominations:
                        </div>
                        {poll.nominations && poll.nominations.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {poll.nominations.map((nom: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 mb-1"
                              >
                                {editingPollId === poll.id &&
                                editingNominationIdx === idx ? (
                                  <>
                                    <input
                                      type="text"
                                      value={editingNominationName}
                                      onChange={(e) =>
                                        setEditingNominationName(e.target.value)
                                      }
                                      className="border rounded px-2 py-1 flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        setEditingNominationImage(
                                          e.target.files?.[0] || null
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleSaveNominationEdit(poll.id, idx)
                                      }
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => {
                                        setEditingNominationIdx(null);
                                        setEditingNominationName("");
                                        setEditingNominationImage(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {nom.profileImageUrl && (
                                      <img
                                        src={nom.profileImageUrl}
                                        alt={nom.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    )}
                                    <span>{nom.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      Votes: {nom.totalVotes}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleEditNomination(
                                          poll.id,
                                          idx,
                                          nom.name
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteNomination(poll.id, idx)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No nominations
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPortal;
