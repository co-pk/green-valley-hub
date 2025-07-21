import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LogOut } from 'lucide-react';

interface Application {
  studentId: string;
  studentName: string;
  grade: string;
  submittedAt: string;
  parentName: string;
  parentEmail: string;
  phoneNumber?: string;
  address?: string;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  activationCode?: string;
  referenceId?: string;
}

const AdminPortal = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, admin, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated as admin
    if (!isLoading && !isAdmin) {
      navigate('/admin-login');
    } else if (isAdmin) {
      // Fetch applications if authenticated
// Error: The function 'fetchApplications' is not defined in this scope.
// The applications are already being fetched in the second useEffect hook
// This line should be removed as it's redundant
    }
  }, [isAdmin, navigate, isLoading]);

  // Subscribe to pending applications
  useEffect(() => {
    if (!isAdmin || !admin?.uid) return;

    setLoading(true);
    const q = query(
      collection(db, 'students'),
      where('applicationStatus', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const apps: Application[] = [];
        for (const docChange of snapshot.docChanges()) {
          const studentData = docChange.doc.data();
          const parentDoc = await getDoc(doc(db, 'parents', studentData.parentRef));
          const parentData = parentDoc.data();

          apps.push({
            studentId: studentData.studentId,
            studentName: studentData.studentName,
            grade: studentData.grade,
            submittedAt: studentData.createdAt.toDate(),
            parentName: parentData.name,
            parentEmail: parentData.email,
            phoneNumber: studentData.phoneNumber,
            address: studentData.address,
            applicationStatus: studentData.applicationStatus,
            activationCode: studentData.activationCode,
            referenceId: docChange.doc.id
          });
        }
        setApplications(apps);
      } catch (error) {
        console.error('Error processing applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to process applications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('Subscription error:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe to applications',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, admin?.uid]);

  // Handle application approval/rejection
  const handleApplicationDecision = async (studentId: string, approved: boolean) => {
    setLoading(true);
    try {
      const studentRef = doc(db, 'students', studentId);
      const studentDoc = await getDoc(studentRef);

      if (!studentDoc.exists()) {
        throw new Error('Application not found');
      }

      const studentData = studentDoc.data();
      const decision = approved ? 'approved' : 'rejected';
      const updateData: {
        applicationStatus: 'approved' | 'rejected';
        updatedAt: Date;
        updatedBy: string | undefined;
        activationCode?: string;
      } = {
        applicationStatus: decision,
        updatedAt: new Date(),
        updatedBy: admin?.uid
      };

      // Generate activation code for approved applications
      if (approved) {
        updateData.activationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      await updateDoc(studentRef, updateData);

      // Send email notification
      await fetch('/api/admin/send-decision-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: studentData.email,
          studentName: studentData.studentName,
          decision,
          activationCode: approved ? updateData.activationCode : undefined
        })
      });

      toast({
        title: 'Success',
        description: `Application ${decision} successfully`,
      });
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process application',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <p>Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.studentId}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{app.studentName}</p>
                          <p className="text-sm text-muted-foreground">Grade: {app.grade}</p>
                          <p className="text-sm text-muted-foreground">ID: {app.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{app.parentName}</p>
                          <p className="text-sm text-muted-foreground">{app.parentEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{app.phoneNumber}</p>
                          <p className="text-sm text-muted-foreground">{app.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">Submitted: {format(new Date(app.submittedAt), 'PPP')}</p>
                          <p className="text-sm text-muted-foreground">Ref: {app.referenceId}</p>
                          {app.activationCode && (
                            <p className="text-sm text-muted-foreground">Code: {app.activationCode}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApplicationDecision(app.studentId, true)}
                            disabled={loading}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApplicationDecision(app.studentId, false)}
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
      </main>

      <Footer />
    </div>
  );
};

export default AdminPortal;
