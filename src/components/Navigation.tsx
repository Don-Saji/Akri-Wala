import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuth } from "./AuthContext";
import { AuthModal } from "./AuthModal";
import { User, Settings, LogOut, Package, Upload, Bell } from "lucide-react";
import { Badge } from "./ui/badge";

interface NavigationProps {
  onShowDashboard?: () => void;
  onShowUpload?: () => void;
  onShowOrders?: () => void;
  onShowSettings?: () => void;
}

export function Navigation({ onShowDashboard, onShowUpload, onShowOrders, onShowSettings }: NavigationProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const { user, logout, getDealerOrders } = useAuth();

  // Get pending orders count for dealers
  const pendingOrdersCount = user?.userType === 'dealer' && getDealerOrders 
    ? getDealerOrders(user.id).filter(order => order.status === 'pending').length 
    : 0;

  // Check for new notifications (simplified, no polling)
  useEffect(() => {
    if (user?.userType === 'dealer') {
      const notificationKey = `dealer_new_order_${user.id}`;
      const hasNewOrder = localStorage.getItem(notificationKey) === 'true';
      setHasNewNotification(hasNewOrder);
    }
  }, [user?.id, user?.userType]);

  // Clear notification when dashboard is opened
  const handleDashboardClick = () => {
    if (user?.userType === 'dealer') {
      const notificationKey = `dealer_new_order_${user.id}`;
      localStorage.setItem(notificationKey, 'false');
      setHasNewNotification(false);
    }
    onShowDashboard?.();
  };

  const handleLogin = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const handleSignup = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
            
            {/* Brand Name */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-black cursor-pointer" onClick={() => window.location.reload()}>
                Akriwala
              </h1>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {user.userType === 'user' && (
                    <Button 
                      onClick={onShowUpload}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Scrap
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-green-500 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleDashboardClick}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                        {user?.userType === 'dealer' && (pendingOrdersCount > 0 || hasNewNotification) && (
                          <div className="ml-auto flex items-center">
                            {hasNewNotification && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                            )}
                            <Badge className="bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                              {pendingOrdersCount}
                            </Badge>
                          </div>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onShowOrders}>
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onShowSettings}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-600 hover:bg-green-50"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}