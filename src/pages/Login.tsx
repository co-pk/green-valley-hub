
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormData {
  studentId: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  
  const form = useForm<LoginFormData>({
    defaultValues: {
      studentId: '',
      password: ''
    }
  });

  const onSubmit = (data: LoginFormData) => {
    if (data.studentId && data.password) {
      loginStudent(data.studentId, `Student ${data.studentId}`);
      
      toast({
        title: "Login Successful",
        description: "Welcome! You can now participate in voting.",
      });
      
      navigate('/voting');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both Student ID and password.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-valley-blue to-valley-green py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Login</h1>
              <p className="text-xl text-white/90">
                Access the voting platform with your student credentials
              </p>
            </div>
          </div>
        </section>

        {/* Login Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-valley-green">Student Portal Access</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Enter your student credentials to participate in elections
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Enter your student ID"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="pl-10 pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-valley-green hover:bg-valley-green-dark"
                        size="lg"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In to Vote
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Need help? Contact the student office at</p>
                    <p className="text-valley-green font-medium">(555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
