import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  LineChart, 
  PiggyBank, 
  Shield, 
  Smartphone,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";


import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

const Index = () => {
  const features = [
    {
      icon: <Wallet className="h-8 w-8 text-walletwise-purple" />,
      title: "Smart Budgeting",
      description: "Set personalized budgets and receive real-time notifications to stay on track with your financial goals."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-walletwise-purple" />,
      title: "Expense Tracking",
      description: "Automatically categorize transactions and gain insights into your spending habits."
    },
    {
      icon: <PiggyBank className="h-8 w-8 text-walletwise-purple" />,
      title: "Savings Goals",
      description: "Create custom savings goals and track your progress with visual indicators."
    },
    {
      icon: <LineChart className="h-8 w-8 text-walletwise-purple" />,
      title: "Financial Reports",
      description: "Access detailed reports and visualizations to understand your financial health."
    },
    {
      icon: <Users className="h-8 w-8 text-walletwise-purple" />,
      title: "Shared Finances",
      description: "Manage family or business budgets with custom permissions for shared access."
    },
    {
      icon: <Shield className="h-8 w-8 text-walletwise-purple" />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with military-grade encryption and secure authentication."
    },
  ];

  const HeroSection = () => {
    const images = [slide1, slide2, slide3];
    const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
  };
    return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-white">
      <Slider {...settings} className="absolute top-0 left-0 w-full h-full overflow-x-hidden overflow-y-hidden">
        {images.map((src, index) => (
            <div key={index} className="w-full min-h-[80vh]">
            <img src={src} alt={`Slide ${index + 1}`} className="w-full h-[80vh] object-cover" />
          </div>
        ))}
      </Slider>
    <div className="absolute top-0 left-0 w-full h-[90vh] bg-black/50"></div>
    <div className="relative z-10 container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Take Control of Your Finances</h1>
    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
      WalletWise helps you track expenses, set budgets, and achieve your financial goals with powerful tools and insights.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link to="/login">
    <Button size="lg" variant="secondary" className="w-full sm:w-auto text-md">
      Get Started
    </Button>
    </Link>
    <Link to="/features">
    <Button
    size="lg"
    variant="outline"
    className="w-full sm:w-auto bg-transparent border-white text-white text-md hover:bg-white hover:text-walletwise-purple"
    >
      Learn More
    </Button>
    </Link>
    </div>
    </div>
    </section>
    );
  };
    return (
    <div>
      <div >
      <Navbar />
    </div>
    {/* Include the HeroSection here */}
    <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 mt-12">Powerful Features to Manage Your Money</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-walletwise-light-purple text-white flex items-center justify-center font-bold text-xl">S</div>
                <div className="ml-4">
                  <p className="font-semibold">Sarah J.</p>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600">"WalletWise has transformed how I manage both my personal and business finances. The insights have helped me save thousands this year!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-walletwise-light-purple text-white flex items-center justify-center font-bold text-xl">M</div>
                <div className="ml-4">
                  <p className="font-semibold">Michael T.</p>
                  <p className="text-sm text-gray-500">Freelance Designer</p>
                </div>
              </div>
              <p className="text-gray-600">"The expense tracking and tax report features are perfect for managing my freelance income. I feel much more in control of my finances now."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-walletwise-light-purple text-white flex items-center justify-center font-bold text-xl">L</div>
                <div className="ml-4">
                  <p className="font-semibold">Lisa R.</p>
                  <p className="text-sm text-gray-500">Recent Graduate</p>
                </div>
              </div>
              <p className="text-gray-600">"As someone just starting my financial journey, WalletWise has been invaluable. The budgeting tools helped me pay off my student loans faster!"</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-walletwise-light-purple text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Your Finances?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives with WalletWise.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">WalletWise</h3>
              <p className="text-gray-400">Smart financial management for everyone</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                  <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                  <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Support</h4>
                <ul className="space-y-2">
                  <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                  <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                  <li><Link to="/security" className="text-gray-400 hover:text-white">Security</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} WalletWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
