import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "./AuthContext";
import { MarketplaceItem } from "./MarketplacePost";
import { OrderDialog } from "./OrderDialog";
import { DealerNotifications } from "./DealerNotifications";
import { 
  Upload, 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  User,
  Store,
  ShoppingCart,
  Eye,
  Plus
} from "lucide-react";

interface DashboardProps {
  onShowUpload?: () => void;
  onShowMap?: () => void;
  onShowMarketplacePost?: () => void;
  marketplaceItems?: MarketplaceItem[];
}

export function Dashboard({ onShowUpload, onShowMap, onShowMarketplacePost, marketplaceItems = [] }: DashboardProps) {
  const { user, getUserScrapListings, getDealerScrapListings, getAllAvailableScrapListings } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedScrapListing, setSelectedScrapListing] = useState<any>(null);

  // Get real scrap listings data
  const userListings = user ? getUserScrapListings(user.id).map(listing => ({
    id: listing.id,
    title: `${listing.category} Collection`,
    category: listing.category,
    weight: listing.weight,
    status: listing.status,
    offers: listing.offers,
    image: listing.images[0] || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop',
    condition: listing.condition,
    description: listing.description,
    createdAt: listing.createdAt
  })) : [];

  const dealerListings = user && user.userType === 'dealer' 
    ? getAllAvailableScrapListings().map(listing => ({
        id: listing.id,
        user: listing.userName,
        title: `${listing.category} Collection`,
        category: listing.category,
        weight: listing.weight,
        location: `${listing.location}`,
        postedDate: new Date(listing.createdAt).toLocaleDateString(),
        image: listing.images[0] || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop',
        condition: listing.condition,
        description: listing.description,
        userPhone: listing.userPhone,
        userAddress: listing.userAddress,
        pickupType: listing.pickupType,
        timeSlot: listing.timeSlot,
        status: listing.status
      }))
    : [];

  const defaultMarketplace = [
    {
      id: '1',
      title: 'Recycled Plastic Products',
      price: '₹500',
      dealer: 'Green Recyclers',
      dealerId: 'dealer-1', // Match the predefined dealer ID
      location: '1.2 km away',
      image: 'https://images.unsplash.com/photo-1695712551582-c14c80d2ecbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZWN5Y2xlZCUyMHBsYXN0aWMlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTk1OTE2Mjl8MA&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop'
    },
    {
      id: '2',
      title: 'Aluminum Bottles',
      price: '₹150',
      dealer: 'Metal Works',
      dealerId: 'dealer-2', // Match the predefined dealer ID
      location: '2.1 km away',
      image: 'https://images.unsplash.com/photo-1625662276901-4a7ec44fbeed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZXRhbCUyMHNjcmFwJTIwcmVjeWNsaW5nfGVufDF8fHx8MTc1OTU5MTYyNnww&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop'
    }
  ];

  // Combine user-posted items with default marketplace items
  const marketplace = [
    ...marketplaceItems.map(item => ({
      id: item.id,
      title: item.title,
      price: `₹${item.price}`,
      dealer: item.dealer,
      location: item.location,
      image: item.images[0] || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop',
      description: item.description,
      condition: item.condition,
      category: item.category,
      tags: item.tags,
      createdAt: item.createdAt,
      available: item.available
    })),
    ...defaultMarketplace
  ];

  const handleOrderClick = (item: any) => {
    // Convert the marketplace item to MarketplaceItem format
    const marketplaceItem: MarketplaceItem = {
      id: item.id,
      title: item.title,
      description: item.description || 'Quality recycled product available for purchase.',
      price: typeof item.price === 'string' ? parseFloat(item.price.replace('₹', '').trim()) || 0 : (item.price || 0),
      category: item.category || 'Mixed Materials',
      condition: item.condition || 'Good',
      dealer: item.dealer,
      dealerId: item.dealerId || 'default_dealer',
      location: item.location,
      images: item.image ? [item.image] : ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop'],
      tags: item.tags || [],
      createdAt: item.createdAt || new Date(),
      available: item.available !== undefined ? item.available : true
    };
    
    setSelectedItem(marketplaceItem);
    setOrderDialogOpen(true);
  };

  if (!user) {
    return null;
  }

  const isDealer = user.userType === 'dealer';

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome back, {user.name}!
          </h1>
          <div className="flex items-center gap-2">
            <Badge className={isDealer ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
              {isDealer ? <Store className="w-4 h-4 mr-1" /> : <User className="w-4 h-4 mr-1" />}
              {isDealer ? 'Scrap Dealer' : 'User'}
            </Badge>
            <span className="text-gray-600">•</span>
            <span className="text-gray-600">{user.email}</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${isDealer ? 'grid-cols-5' : 'grid-cols-4'} mb-8`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value={isDealer ? "user-listings" : "my-listings"}>
              {isDealer ? "User Listings" : "My Listings"}
            </TabsTrigger>
            {isDealer && (
              <TabsTrigger value="orders">Orders</TabsTrigger>
            )}
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {isDealer ? "Total Purchases" : "Total Listings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDealer ? dealerListings.length : userListings.length}</div>
                  <p className="text-xs text-gray-600">{isDealer ? `${dealerListings.filter(l => (l as any).status === 'pending').length} available` : '+2 from last month'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {isDealer ? "Active Offers" : "Pending Offers"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDealer ? dealerListings.filter(l => (l as any).status === 'pending').length : userListings.reduce((sum, l) => sum + (l as any).offers, 0)}</div>
                  <p className="text-xs text-gray-600">{isDealer ? 'Pending listings' : '2 new today'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {isDealer ? "Total Spent" : "Total Earnings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDealer ? '₹15,240' : '₹2,450'}</div>
                  <p className="text-xs text-gray-600">{isDealer ? '+₹2,100 this week' : '+₹340 this week'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {isDealer ? "Customer Rating" : "User Rating"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isDealer ? '4.6' : '4.8'}</div>
                  <p className="text-xs text-gray-600">⭐⭐⭐⭐⭐</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isDealer ? (
                    <>
                      <Button 
                        onClick={() => setActiveTab('user-listings')}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                        View New Listings
                      </Button>
                      <Button 
                        onClick={onShowMarketplacePost}
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Post New Item
                      </Button>
                      <Button 
                        onClick={onShowMap}
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Update Location
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={onShowUpload}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                      >
                        <Upload className="w-4 h-4" />
                        Upload New Scrap
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('marketplace')}
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Browse Marketplace
                      </Button>
                      <Button 
                        onClick={onShowMap}
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Find Nearby Dealers
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={isDealer ? "user-listings" : "my-listings"}>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {isDealer ? "Available User Listings" : "My Scrap Listings"}
                </h2>
                {!isDealer && (
                  <Button 
                    onClick={onShowUpload}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Scrap
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(isDealer ? dealerListings : userListings).map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <CardTitle className="text-lg">{listing.title}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{listing.category}</Badge>
                        <Badge variant="outline">{listing.weight}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isDealer ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status:</span>
                            <Badge className={
                              (listing as any).status === 'accepted' 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }>
                              {(listing as any).status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Posted by: {(listing as any).user}</p>
                          <p className="text-sm text-gray-600">📍 {(listing as any).location}</p>
                          <p className="text-sm text-gray-600">🕒 {(listing as any).postedDate}</p>
                          {(listing as any).description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {(listing as any).description}
                            </p>
                          )}
                          <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600">
                            {(listing as any).status === 'pending' ? 'Make Offer' : 'View Details'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status:</span>
                            <Badge className={
                              (listing as any).status === 'accepted' 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }>
                              {(listing as any).status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Offers:</span>
                            <span className="font-semibold">{(listing as any).offers}</span>
                          </div>
                          <Button variant="outline" className="w-full mt-3">
                            View Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Marketplace</h2>
                {isDealer && (
                  <Button 
                    onClick={onShowMarketplacePost}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    List New Product
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplace.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">{item.price}</span>
                        <Badge variant="outline">Cash on Delivery</Badge>
                      </div>
                      {(item as any).category && (
                        <div className="flex gap-2 mb-2">
                          <Badge variant="secondary">{(item as any).category}</Badge>
                          {(item as any).condition && (
                            <Badge variant="outline">{(item as any).condition}</Badge>
                          )}
                        </div>
                      )}
                      {(item as any).tags && (item as any).tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(item as any).tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(item as any).tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(item as any).tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(item as any).description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {(item as any).description}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">Sold by: {item.dealer}</p>
                        <p className="text-sm text-gray-600">📍 {item.location}</p>
                        {(item as any).createdAt && (
                          <p className="text-xs text-gray-500">
                            Posted: {new Date((item as any).createdAt).toLocaleDateString()}
                          </p>
                        )}
                        <Button 
                          className="w-full mt-3 bg-green-500 hover:bg-green-600"
                          onClick={() => handleOrderClick(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {isDealer && (
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <DealerNotifications />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="p-2 bg-gray-50 rounded border">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="p-2 bg-gray-50 rounded border">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="p-2 bg-gray-50 rounded border">{user.phone}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User Type
                    </label>
                    <div className="p-2 bg-gray-50 rounded border capitalize">{user.userType}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="p-2 bg-gray-50 rounded border">{user.address || 'Not provided'}</div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Dialog */}
      <OrderDialog 
        isOpen={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}