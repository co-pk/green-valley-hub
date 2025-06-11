
import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the Green Valley School assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickQuestions = [
    "What are the admission requirements?",
    "What is the tuition fee?",
    "How can I schedule a campus tour?",
    "What programs do you offer?",
    "What are the school hours?"
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('admission') || message.includes('requirements')) {
      return "For admission, you'll need: completed application form, birth certificate, previous school transcripts, immunization records, and two recommendation letters. The application fee is $100. Would you like me to help you with the application process?";
    }
    
    if (message.includes('tuition') || message.includes('fee') || message.includes('cost')) {
      return "Our tuition rates are: Elementary (K-5): $12,000/year, Middle School (6-8): $14,000/year, High School (9-12): $16,000/year. We offer financial aid and payment plans. Would you like information about scholarships?";
    }
    
    if (message.includes('tour') || message.includes('visit')) {
      return "Campus tours are available Monday through Friday. You can schedule one by calling (555) 123-4567 or emailing tours@greenvalley.edu. Tours typically last 1 hour and include visits to classrooms, labs, and facilities.";
    }
    
    if (message.includes('program') || message.includes('academics')) {
      return "We offer comprehensive programs in English & Literature, Mathematics, Sciences, Social Studies, Arts & Design, and Music & Performance. We also have 15+ AP courses and various extracurricular activities. Which program interests you most?";
    }
    
    if (message.includes('hours') || message.includes('schedule')) {
      return "School hours are 8:00 AM to 3:30 PM, Monday through Friday. Office hours are 7:30 AM to 5:00 PM on weekdays, and 9:00 AM to 2:00 PM on Saturdays. We're closed on Sundays.";
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return "You can reach us at: Main Office: (555) 123-4567, Email: info@greenvalley.edu, Address: 123 Education Drive, Green Valley, CA 94025. Is there a specific department you'd like to contact?";
    }
    
    return "Thank you for your question! For specific information, please contact our office at (555) 123-4567 or visit our admissions section. Our staff will be happy to help you. Is there anything else I can assist you with?";
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-valley-green hover:bg-valley-green-dark text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse-green z-50"
      >
        <MessageCircle className="w-6 h-6 mx-auto" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
      <Card className="h-full shadow-2xl border-valley-green/20">
        <CardHeader className="bg-valley-green text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <CardTitle className="text-lg">Green Valley Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-valley-green-dark h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-full">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-valley-green text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm">{message.text}</p>
                      {!message.isBot && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {messages.length === 1 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Quick questions:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="block w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                size="sm"
                className="bg-valley-green hover:bg-valley-green-dark"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
