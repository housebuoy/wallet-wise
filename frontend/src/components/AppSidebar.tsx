import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/firebaseConfig"; // Ensure correct import path
import {FaChevronUp} from "react-icons/fa";
import { onAuthStateChanged, User, signOut  } from "firebase/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home,
  CreditCard,
  LineChart,
  PiggyBank,
  UserRound,
  Settings,
  HelpCircle,
  BarChartBig,
  LogOut,
  QrCode,
  Users
} from "lucide-react";

export const AppSidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);
  
  const logout = async () => {
    await signOut(auth);
    navigate("/")
  };

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      title: "Transactions",
      icon: CreditCard,
      path: "/transactions",
    },
    {
      title: "Budget",
      icon: BarChartBig,
      path: "/budget",
    },
    {
      title: "Savings Goals",
      icon: PiggyBank,
      path: "/savings",
    },
    {
      title: "Shared Accounts",
      icon: Users,
      path: "/shared-accounts",
    },
    {
      title: "Payments",
      icon: QrCode,
      path: "/payments",
    },
    {
      title: "Reports",
      icon: LineChart,
      path: "/reports",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      path: "/help",
    },
  ];

  // Check if the current path is the specified path or starts with it (for nested routes)
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar>
      <div className="p-4">
        <div className="text-xl font-bold text-walletwise-purple">WalletWise</div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={isActive(item.path) ? "bg-primary/10 text-primary" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-walletwise-red"
                  onClick={() => logout()}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>      
      <button onClick={()=> navigate("/settings")} className="border-t border-gray-200 px-2 py-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100">
        <Avatar>
          <AvatarImage src={user?.photoURL || "https://via.placeholder.com/100"} alt="User" />
          <AvatarFallback className="font-semibold">{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{user ? user.displayName : "John Doe"}</span>
          <span className="text-sm text-gray-500 truncate max-w-[150px] block">{user ? user.email : "johndoe@example.com"}</span>
        </div>        
        <FaChevronUp className="text-sm" />
      </button>
    </Sidebar>
  );
};
