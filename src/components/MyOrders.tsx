import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth, Order } from "./AuthContext";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Star,
  Phone,
  MapPin
} from "lucide-react";

// Order interface is now imported from AuthContext

export function MyOrders() {
  const { user, getUserOrders, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  // Show loading state while AuthContext is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8">
            <p className="text-gray-600">Please log in to view your orders.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get real orders from AuthContext with error handling
  let userOrders: Order[] = [];
  try {
    userOrders = getUserOrders ? getUserOrders(user.id) : [];
  } catch (error) {
    console.error('Error getting user orders:', error);
    userOrders = [];
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? userOrders 
    : userOrders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">My Orders</h1>
          <p className="text-gray-600">Track your orders from the marketplace</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userOrders.length}</div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userOrders.filter(o => o.status === 'delivered').length}
              </div>
              <p className="text-xs text-gray-600">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {userOrders.filter(o => o.status === 'shipped').length}
              </div>
              <p className="text-xs text-gray-600">On the way</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{userOrders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + order.price, 0)}
              </div>
              <p className="text-xs text-gray-600">Total spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                      {activeTab === 'all' 
                        ? "You haven't placed any orders yet."
                        : `No ${activeTab} orders found.`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Product Image */}
                          <div className="w-full lg:w-32 h-32 flex-shrink-0">
                            <img 
                              src={order.productImage} 
                              alt={order.productTitle}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                              <div>
                                <h3 className="text-lg font-semibold">{order.productTitle}</h3>
                                <p className="text-gray-600">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">Sold by: {order.dealerName}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">₹{order.price}</div>
                                <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                <p>Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p>Expected: {new Date(order.expectedDelivery).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {/* Dealer Contact Info */}
                            <div className="border-t pt-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <span>{order.dealerPhone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{order.dealerAddress}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {order.status === 'delivered' && (
                                <>
                                  {order.rating ? (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      <span className="text-sm">Rated {order.rating}/5</span>
                                    </div>
                                  ) : (
                                    <Button variant="outline" size="sm">
                                      <Star className="w-4 h-4 mr-1" />
                                      Rate Order
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    Buy Again
                                  </Button>
                                </>
                              )}
                              
                              {order.status === 'pending' && (
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  Cancel Order
                                </Button>
                              )}
                              
                              {(order.status === 'shipped' || order.status === 'confirmed') && (
                                <Button variant="outline" size="sm">
                                  Track Order
                                </Button>
                              )}
                              
                              <Button variant="outline" size="sm">
                                Contact Dealer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}