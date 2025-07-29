import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Academics from "@/components/Academics";
import News from "@/components/News";
import Staff from "@/components/Staff";
import Admissions from "@/components/Admissions";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Academics />
      <News />
      <Staff />
      <Admissions />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
