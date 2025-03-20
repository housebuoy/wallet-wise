
import { DashboardLayout } from "@/components/DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 mb-4">View and analyze your financial reports.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Income Summary</h3>
              <p className="text-gray-500">View your income trends over time.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Expense Analysis</h3>
              <p className="text-gray-500">Analyze your spending patterns.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Budget Performance</h3>
              <p className="text-gray-500">Track how well you're staying within budget.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Custom Reports</h3>
              <p className="text-gray-500">Create customized financial reports.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
