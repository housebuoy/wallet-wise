
import { Navbar } from "@/components/Navbar";
import { Users, Award, Heart, Globe, Lightbulb, CheckCircle } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      image: "https://placehold.co/200x200",
      bio: "Sarah has 15+ years of experience in fintech and previously led product at a major banking institution."
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      image: "https://placehold.co/200x200",
      bio: "Michael is a software engineer with a passion for creating secure, user-friendly financial tools."
    },
    {
      name: "Aisha Patel",
      role: "Head of Product",
      image: "https://placehold.co/200x200",
      bio: "Aisha specializes in user experience and has helped shape WalletWise's intuitive interface."
    },
    {
      name: "David Rodriguez",
      role: "Lead Developer",
      image: "https://placehold.co/200x200",
      bio: "David leads our development team and ensures WalletWise is always at the cutting edge of technology."
    }
  ];

  const values = [
    {
      icon: <Users className="h-12 w-12 text-walletwise-purple" />,
      title: "User-Centered",
      description: "We build our products with our users at the center of every decision."
    },
    {
      icon: <Award className="h-12 w-12 text-walletwise-purple" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from code quality to customer support."
    },
    {
      icon: <Heart className="h-12 w-12 text-walletwise-purple" />,
      title: "Empathy",
      description: "We understand that finances can be stressful and design our tools with empathy."
    },
    {
      icon: <Globe className="h-12 w-12 text-walletwise-purple" />,
      title: "Accessibility",
      description: "We believe financial tools should be accessible to everyone, regardless of background."
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-walletwise-purple" />,
      title: "Innovation",
      description: "We constantly innovate to bring the best financial management tools to our users."
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-walletwise-purple" />,
      title: "Integrity",
      description: "We handle your financial data with the utmost integrity and security."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-walletwise-purple to-walletwise-light-purple text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About WalletWise</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            We're on a mission to make financial management accessible and simple for everyone.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto">
              <p>
                WalletWise was founded in 2020 by Sarah Johnson and Michael Chen, who recognized that many people struggle with managing their finances effectively. Having experienced financial challenges themselves, they set out to create a tool that would make financial management accessible and straightforward for everyone.
              </p>
              <p>
                What started as a simple budgeting app has grown into a comprehensive financial management platform trusted by over 500,000 users worldwide. Our team has expanded from two founders working out of a garage to a diverse team of 30 passionate individuals dedicated to improving financial literacy and empowerment.
              </p>
              <p>
                Today, WalletWise offers a suite of tools for budgeting, expense tracking, savings goals, and investment monitoring. We're proud to have helped our users save over $50 million collectively and achieve their financial goals, from paying off student loans to saving for dream homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-center">
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-center">
                <img src={member.image} alt={member.name} className="rounded-full w-32 h-32 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-walletwise-purple mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-walletwise-light-purple text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us on Our Mission</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of the financial revolution. Start managing your money smarter today.
          </p>
          <div className="flex justify-center">
            <a href="/login" className="bg-white text-walletwise-purple px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
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
                  <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="/blog" className="text-gray-400 hover:text-white">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Support</h4>
                <ul className="space-y-2">
                  <li><a href="/help" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="/security" className="text-gray-400 hover:text-white">Security</a></li>
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

export default AboutUs;
