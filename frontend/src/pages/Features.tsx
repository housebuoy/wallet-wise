
import { Navbar } from "@/components/Navbar";
import { CreditCard, LineChart, PiggyBank, Shield, Smartphone, TrendingUp, Users, Wallet } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Wallet className="h-12 w-12 text-walletwise-purple" />,
      title: "Smart Budgeting",
      description: "Set personalized budgets and receive real-time notifications to stay on track with your financial goals. Our intelligent algorithms learn from your spending habits to suggest realistic budget categories tailored to your lifestyle."
    },
    {
      icon: <CreditCard className="h-12 w-12 text-walletwise-purple" />,
      title: "Expense Tracking",
      description: "Automatically categorize transactions and gain insights into your spending habits. Connect your bank accounts and credit cards to automatically import and categorize your expenses, saving you time and ensuring nothing slips through the cracks."
    },
    {
      icon: <PiggyBank className="h-12 w-12 text-walletwise-purple" />,
      title: "Savings Goals",
      description: "Create custom savings goals and track your progress with visual indicators. Whether you're saving for a vacation, a down payment, or an emergency fund, our visual progress trackers help keep you motivated and on target."
    },
    {
      icon: <LineChart className="h-12 w-12 text-walletwise-purple" />,
      title: "Financial Reports",
      description: "Access detailed reports and visualizations to understand your financial health. Get monthly, quarterly, and annual reports that break down your income, expenses, and savings with beautiful, easy-to-understand charts and graphs."
    },
    {
      icon: <Users className="h-12 w-12 text-walletwise-purple" />,
      title: "Shared Finances",
      description: "Manage family or business budgets with custom permissions for shared access. Invite family members or business partners to view or manage specific accounts while maintaining privacy for others."
    },
    {
      icon: <Shield className="h-12 w-12 text-walletwise-purple" />,
      title: "Bank-Level Security",
      description: "Your financial data is protected with military-grade encryption and secure authentication. We use the same encryption standards as major financial institutions, ensuring your sensitive information remains private and secure."
    },
    {
      icon: <Smartphone className="h-12 w-12 text-walletwise-purple" />,
      title: "Mobile App",
      description: "Track your finances on the go with our mobile app for iOS and Android. Capture receipts with your camera, check your budget before making purchases, and receive instant notifications about your account activity."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-walletwise-purple" />,
      title: "Investment Tracking",
      description: "Monitor your investments and track your portfolio's performance over time. Connect your investment accounts to see your complete financial picture in one place, including stocks, bonds, cryptocurrencies, and retirement accounts."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-walletwise-purple to-walletwise-light-purple text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">WalletWise Features</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover all the powerful tools that make managing your finances simple and effective.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-walletwise-light-purple text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial lives with WalletWise.
          </p>
          <div className="flex justify-center">
            <a href="/login" className="bg-white text-walletwise-purple px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Get Started Today
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

export default Features;
