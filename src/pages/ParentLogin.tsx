import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LogIn, User, Lock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { signInParent } from "@/utils/firebase";
import { useParentStore } from "@/store/parent.store";

interface LoginFormData {
  parentId: string;
  password: string;
}

const ParentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { parent } = useParentStore();
  const { setParent } = useParentStore();
  const form = useForm<LoginFormData>({
    defaultValues: {
      parentId: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!data.parentId || !data.password) {
      toast({
        title: "Validation Error",
        description: "Please enter both Parent ID and password.",
        variant: "destructive",
      });
      return;
    }

    const result = await signInParent(data.parentId, data.password);

    if (result.success) {
      toast({
        title: "Welcome!",
        description: "You've successfully logged into your parent portal.",
      });
      setParent(result.parent);
      navigate("/parent-portal");
    } else {
      let description =
        "Your Parent ID or password is incorrect. If you're having trouble, please contact the school administration.";
      if (result.message && result.message.includes("not yet approved")) {
        description =
          "Your account is not approved for login at this time. Please wait for admin approval before you can access the portal.";
      }
      toast({
        title: "Unable to Log In",
        description,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <section className="bg-gradient-to-r from-valley-blue to-valley-green py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Parent Login
              </h1>
              <p className="text-xl text-white/90">
                Access your parent portal to monitor your child's progress
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-valley-blue">
                    Parent Portal Access
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Enter your parent credentials to access your portal
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="parentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent ID</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Enter your parent ID"
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
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-valley-blue hover:bg-valley-blue-dark"
                        size="lg"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Access Parent Portal
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Need help? Contact the parent office at</p>
                    <p className="text-valley-blue font-medium">
                      (555) 123-4568
                    </p>
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

export default ParentLogin;
