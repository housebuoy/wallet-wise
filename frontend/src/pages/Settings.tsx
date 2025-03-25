
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, CreditCard, RotateCw, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="bg-white rounded-lg shadow">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                <TabsTrigger 
                  value="account" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="integration" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Integration
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="account" className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" /> Account Settings
              </h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      className="w-full"
                      defaultValue="John"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      className="w-full"
                      defaultValue="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    className="w-full"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    className="w-full"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notification Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Transaction Alerts</p>
                      <p className="text-sm text-gray-500">Receive emails for new transactions</p>
                    </div>
                    <Switch defaultChecked id="transaction-alerts" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Low Balance Alerts</p>
                      <p className="text-sm text-gray-500">Get notified when your balance is low</p>
                    </div>
                    <Switch defaultChecked id="balance-alerts" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bill Payment Reminders</p>
                      <p className="text-sm text-gray-500">Receive reminders before bills are due</p>
                    </div>
                    <Switch defaultChecked id="bill-reminders" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Savings Goal Updates</p>
                      <p className="text-sm text-gray-500">Updates on your savings goal progress</p>
                    </div>
                    <Switch defaultChecked id="savings-updates" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Mobile Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Enable push notifications on mobile</p>
                    </div>
                    <Switch defaultChecked id="push-notifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Alerts</p>
                      <p className="text-sm text-gray-500">Receive text messages for important alerts</p>
                    </div>
                    <Switch id="sms-alerts" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Newsletter</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-gray-500">Get a summary of your week's financial activity</p>
                    </div>
                    <Switch defaultChecked id="weekly-digest" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Financial Tips</p>
                      <p className="text-sm text-gray-500">Receive tips and strategies to improve your finances</p>
                    </div>
                    <Switch defaultChecked id="financial-tips" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" /> Security Settings
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </Label>
                    <Input type="password" className="w-full" />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </Label>
                    <Input type="password" className="w-full" />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </Label>
                    <Input type="password" className="w-full" />
                  </div>
                  
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="enable-2fa" />
                  </div>
                  
                  <Button variant="outline" disabled>Set Up 2FA</Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">Chrome on Windows • IP: 192.168.1.1</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</div>
                    </div>
                    <p className="text-xs text-gray-500">Started: May 15, 2023 at 10:30 AM</p>
                  </div>
                  
                  <Button variant="outline" className="text-red-500">Log Out All Other Devices</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Billing Information
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Plan</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">Free Plan</p>
                        <p className="text-sm text-gray-600">Basic features for personal finance management</p>
                      </div>
                      <Button>Upgrade</Button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-bold mb-2">Basic</p>
                      <p className="text-2xl font-bold mb-1">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <p className="text-sm text-gray-500 mb-4">Free forever</p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-center"><span className="mr-2">✓</span> Expense tracking</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Basic budgeting</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Up to 2 savings goals</li>
                      </ul>
                      <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 border-blue-500 shadow-sm">
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded absolute -mt-6 ml-2">POPULAR</div>
                      <p className="font-bold mb-2">Premium</p>
                      <p className="text-2xl font-bold mb-1">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <p className="text-sm text-gray-500 mb-4">Billed monthly</p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-center"><span className="mr-2">✓</span> Everything in Basic</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Advanced reporting</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Unlimited savings goals</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Bill reminders</li>
                      </ul>
                      <Button className="w-full">Upgrade</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <p className="font-bold mb-2">Business</p>
                      <p className="text-2xl font-bold mb-1">$19.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                      <p className="text-sm text-gray-500 mb-4">Billed monthly</p>
                      <ul className="text-sm space-y-2 mb-4">
                        <li className="flex items-center"><span className="mr-2">✓</span> Everything in Premium</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Business analytics</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> Multiple users</li>
                        <li className="flex items-center"><span className="mr-2">✓</span> API access</li>
                      </ul>
                      <Button variant="outline" className="w-full">Upgrade</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-md mr-3">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">No payment method added</p>
                        <p className="text-sm text-gray-500">Add a card to enable premium features</p>
                      </div>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RotateCw className="h-5 w-5" /> Integrations
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Services</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <LinkIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="font-medium">Google</p>
                        </div>
                        <Switch id="google-integration" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Connect your Google account to import calendar events and sync data.</p>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <LinkIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="font-medium">Dropbox</p>
                        </div>
                        <Switch id="dropbox-integration" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Connect Dropbox to back up your financial data and reports.</p>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <LinkIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="font-medium">Microsoft</p>
                        </div>
                        <Switch id="microsoft-integration" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Connect Microsoft to sync your Outlook calendar and OneDrive.</p>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <LinkIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="font-medium">Slack</p>
                        </div>
                        <Switch id="slack-integration" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Get financial alerts and summaries directly in your Slack workspace.</p>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Access</h3>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Developer API</p>
                      <Button variant="outline" size="sm" disabled>
                        Upgrade to Business
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">Access our API to build custom integrations with your business tools.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-6 border-t flex justify-end">
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
