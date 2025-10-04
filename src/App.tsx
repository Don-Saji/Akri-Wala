import { useState } from 'react';
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { FooterSection } from "./components/FooterSection";
import { Dashboard } from "./components/Dashboard";
import { AuthModal } from "./components/AuthModal";
import { ScrapUpload } from "./components/ScrapUpload";
import { MarketplacePost, MarketplaceItem } from "./components/MarketplacePost";
import { LocationMap } from "./components/LocationMap";
import { MyOrders } from "./components/MyOrders";
import { Settings } from "./components/Settings";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { Button } from "./components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type AppView = 'home' | 'dashboard' | 'map' | 'orders' | 'settings';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [marketplacePostOpen, setMarketplacePostOpen] = useState(false);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const { user } = useAuth();

  const showAuth = (type: 'login' | 'signup') => {
    setAuthModalTab(type);
    setAuthModalOpen(true);
  };

  const showDashboard = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      showAuth('login');
    }
  };

  const showHome = () => {
    setCurrentView('home');
  };

  const showMap = () => {
    setCurrentView('map');
  };

  const showOrders = () => {
    if (user) {
      setCurrentView('orders');
    } else {
      showAuth('login');
    }
  };

  const showSettings = () => {
    if (user) {
      setCurrentView('settings');
    } else {
      showAuth('login');
    }
  };

  const showUpload = () => {
    if (user) {
      setUploadModalOpen(true);
    } else {
      showAuth('login');
    }
  };

  const showMarketplacePost = () => {
    if (user && user.userType === 'dealer') {
      setMarketplacePostOpen(true);
    } else {
      showAuth('login');
    }
  };

  const handleMarketplaceItemSubmit = (item: MarketplaceItem) => {
    setMarketplaceItems(prev => [item, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div>
            <div className="bg-white border-b border-gray-200 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button 
                  variant="ghost" 
                  onClick={showHome}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </div>
            <Dashboard 
              onShowUpload={showUpload} 
              onShowMap={showMap} 
              onShowMarketplacePost={showMarketplacePost}
              marketplaceItems={marketplaceItems}
            />
          </div>
        );
      
      case 'map':
        return (
          <div className="min-h-screen bg-[#FAF9F6] pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={showHome}
                  className="flex items-center gap-2 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
                <h1 className="text-3xl font-bold text-black">Find Nearby Dealers</h1>
                <p className="text-gray-600 mt-2">Locate scrap dealers in your area</p>
              </div>
              <LocationMap />
            </div>
          </div>
        );
      
      case 'orders':
        return (
          <div>
            <div className="bg-white border-b border-gray-200 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button 
                  variant="ghost" 
                  onClick={showHome}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </div>
            <MyOrders />
          </div>
        );

      case 'settings':
        return (
          <div>
            <div className="bg-white border-b border-gray-200 py-4">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Button 
                  variant="ghost" 
                  onClick={showHome}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </div>
            <Settings />
          </div>
        );
      
      default:
        return (
          <main>
            <HeroSection onShowAuth={showAuth} onShowDashboard={showDashboard} />
            <HowItWorksSection />
            <FooterSection />
            
            {/* Floating Action Buttons */}
            {user && (
              <div className="fixed bottom-6 right-6 space-y-3 z-40">
                <Button 
                  onClick={showMap}
                  className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                  title="Find Nearby Dealers"
                >
                  <MapPin className="w-6 h-6" />
                </Button>
                {user.userType === 'user' && (
                  <Button 
                    onClick={showUpload}
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                    title="Upload Scrap"
                  >
                    <div className="text-2xl">+</div>
                  </Button>
                )}
              </div>
            )}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation 
        onShowDashboard={showDashboard}
        onShowUpload={showUpload}
        onShowOrders={showOrders}
        onShowSettings={showSettings}
      />
      
      {renderContent()}

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      <ScrapUpload 
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      <MarketplacePost 
        isOpen={marketplacePostOpen}
        onClose={() => setMarketplacePostOpen(false)}
        onSubmit={handleMarketplaceItemSubmit}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}