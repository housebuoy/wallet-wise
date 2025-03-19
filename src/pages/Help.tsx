
import { DashboardLayout } from "@/components/DashboardLayout";
import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";

const Help = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <HelpCircle className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-1">How do I create a budget?</h3>
                <p className="text-gray-500">
                  You can create a budget by navigating to the Budget section and clicking on "Create New Budget" button.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-1">How to link my bank account?</h3>
                <p className="text-gray-500">
                  Go to Settings {'>'}  Linked Accounts and follow the instructions to connect your bank account securely.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-1">Is my financial data secure?</h3>
                <p className="text-gray-500">
                  We use bank-level encryption to protect your data. We never store your bank credentials and use secure connections for all communications.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-1">How do I share an account with someone?</h3>
                <p className="text-gray-500">
                  Navigate to Shared Accounts, click "Create New Shared Account" and enter the email addresses of people you want to share with.
                </p>
              </div>
            </div>
            
            <button className="mt-4 text-blue-500 hover:underline">
              View all FAQs
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Contact Support</h2>
            </div>
            
            <p className="text-gray-500 mb-4">
              Need help with something specific? Our support team is ready to assist you.
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="What can we help you with?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describe your issue in detail..."
                />
              </div>
              
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Submit Request
              </button>
            </form>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Knowledge Base</h2>
            </div>
            
            <p className="text-gray-500 mb-4">
              Browse our extensive collection of tutorials and guides.
            </p>
            
            <div className="space-y-2">
              <a href="#" className="block text-blue-500 hover:underline">Getting Started with WalletWise</a>
              <a href="#" className="block text-blue-500 hover:underline">Budgeting 101: Creating Your First Budget</a>
              <a href="#" className="block text-blue-500 hover:underline">Understanding Financial Reports</a>
              <a href="#" className="block text-blue-500 hover:underline">Setting and Achieving Savings Goals</a>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Email Support</h2>
            </div>
            
            <p className="text-gray-500 mb-4">
              You can also reach our support team via email.
            </p>
            
            <a href="mailto:support@walletwise.com" className="text-blue-500 hover:underline">
              support@walletwise.com
            </a>
            
            <p className="mt-4 text-gray-500">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
