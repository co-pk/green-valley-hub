
import { useState } from 'react';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Academics', href: '/#academics' },
    { name: 'News', href: '/#news' },
    { name: 'Staff', href: '/#staff' },
    { name: 'Admissions', href: '/#admissions' },
    { name: 'Contact', href: '/#contact' },
  ];

  const isApplyPage = location.pathname === '/apply';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-valley-green rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-valley-green">Green Valley School</h1>
              <p className="text-xs text-muted-foreground">Excellence in Education</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-valley-green transition-colors"
              >
                {item.name}
              </a>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Portals</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="w-full">Admin Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/student-portal" className="w-full">Student Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/parent-portal" className="w-full">Parent Portal</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild className="bg-valley-green hover:bg-valley-green-dark">
              <Link to="/apply">
                Apply Now
              </Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-valley-green transition-colors px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Link
                to="/admin"
                className="text-sm font-medium text-foreground hover:text-valley-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Portal
              </Link>
              <Link
                to="/student-portal"
                className="text-sm font-medium text-foreground hover:text-valley-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Student Portal
              </Link>
              <Link
                to="/parent-portal"
                className="text-sm font-medium text-foreground hover:text-valley-green transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Parent Portal
              </Link>
              <div className="px-4">
                <Button asChild className="w-full bg-valley-green hover:bg-valley-green-dark">
                  <Link to="/apply" onClick={() => setIsMenuOpen(false)}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
