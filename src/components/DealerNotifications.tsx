import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "./AuthContext";
import { Bell, Phone, MapPin, User, Package, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function DealerNotifications() {
  const { user, getDealerOrders, isLoading, orders } = useAuth();
  const [lastCheckedTime, setLastCheckedTime] = useState<number>(Date.now());
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);

  // Check for new orders since last visit
  const checkForNewOrders = () => {
    if (!user?.id) return;
    
    const storedLastCheck = localStorage.getItem(`dealer_last_check_${user.id}`);
    if (storedLastCheck) {
      setLastCheckedTime(parseInt(storedLastCheck));
    }
    
    // Update last checked time
    const currentTime = Date.now();
    localStorage.setItem(`dealer_last_check_${user.id}`, currentTime.toString());
  };

  // Check for new orders when component mounts
  useEffect(() => {
    if (user?.userType === 'dealer') {
      checkForNewOrders();
      
      // Check for new order notification flag
      const notificationKey = `dealer_new_order_${user.id}`;
      const hasNewOrder = localStorage.getItem(notificationKey) === 'true';
      setShowNewOrderAlert(hasNewOrder);
      
      if (hasNewOrder) {
        // Show toast notification
        toast.success('🔔 New order received! Check your orders below.', {
          duration: 5000
        });
        
        // Clear the notification flag after showing
        setTimeout(() => {
          localStorage.setItem(notificationKey, 'false');
          setShowNewOrderAlert(false);
        }, 5000);
      }
    }
  }, [user?.id, user?.userType]);

  // Show loading state while AuthContext is still loading
  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading notifications...</p>
      </div>
    );
  }
  
  if (!user || user.userType !== 'dealer') {
    return null;
  }

  let dealerOrders: any[] = [];
  try {
    if (user?.id && getDealerOrders) {
      dealerOrders = getDealerOrders(user.id);
    }
  } catch (error) {
    console.error('Error getting dealer orders:', error);
    dealerOrders = [];
  }
  const newOrders = dealerOrders.filter(order => order.status === 'pending');

  const handleAcceptOrder = (orderId: string) => {
    try {
      // Update order status in localStorage
      const storedOrders = JSON.parse(localStorage.getItem('akriwala_orders') || '[]');
      const updatedOrders = storedOrders.map((order: any) => 
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      );
      localStorage.setItem('akriwala_orders', JSON.stringify(updatedOrders));
      
      // Force re-render by updating a dummy state
      window.location.reload();
      
      toast.success("Order accepted! Customer will be notified.");
    } catch (error) {
      toast.error("Failed to accept order. Please try again.");
    }
  };

  const handleRejectOrder = (orderId: string) => {
    try {
      // Update order status in localStorage
      const storedOrders = JSON.parse(localStorage.getItem('akriwala_orders') || '[]');
      const updatedOrders = storedOrders.map((order: any) => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      localStorage.setItem('akriwala_orders', JSON.stringify(updatedOrders));
      
      // Force re-render by updating a dummy state
      window.location.reload();
      
      toast.info("Order rejected. Customer will be notified.");
    } catch (error) {
      toast.error("Failed to reject order. Please try again.");
    }
  };

  const handleMarkShipped = (orderId: string) => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('akriwala_orders') || '[]');
      const updatedOrders = storedOrders.map((order: any) => 
        order.id === orderId ? { ...order, status: 'shipped' } : order
      );
      localStorage.setItem('akriwala_orders', JSON.stringify(updatedOrders));
      window.location.reload();
      toast.success("Order marked as shipped!");
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  const handleMarkDelivered = (orderId: string) => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('akriwala_orders') || '[]');
      const updatedOrders = storedOrders.map((order: any) => 
        order.id === orderId ? { ...order, status: 'delivered' } : order
      );
      localStorage.setItem('akriwala_orders', JSON.stringify(updatedOrders));
      window.location.reload();
      toast.success("Order marked as delivered!");
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent New Order Alert */}
      {(showNewOrderAlert || newOrders.length > 0) && (
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-bold text-orange-800 text-lg">🔔 {newOrders.length > 0 ? 'PENDING ORDERS' : 'NEW ORDER ALERT!'}</h3>
                  <p className="text-orange-700">You have {newOrders.length} pending order{newOrders.length !== 1 ? 's' : ''} requiring attention.</p>
                </div>
              </div>
              {showNewOrderAlert && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowNewOrderAlert(false)}
                  className="border-orange-300 text-orange-700"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Orders Alert */}
      {newOrders.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Bell className="w-5 h-5" />
              New Order Notifications ({newOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              You have {newOrders.length} new order{newOrders.length > 1 ? 's' : ''} requiring your attention.
            </p>
            
            {/* Quick Customer Contact Info for New Orders */}
            <div className="space-y-3">
              {newOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{order.productTitle}</p>
                      <p className="text-sm text-gray-600">Customer: {order.buyerName}</p>
                      <p className="text-sm text-gray-600">Phone: {order.buyerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">₹{order.price * order.quantity}</p>
                      <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
              {newOrders.length > 3 && (
                <p className="text-sm text-orange-600">
                  + {newOrders.length - 3} more order{newOrders.length - 3 > 1 ? 's' : ''} below
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {dealerOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.productTitle}</CardTitle>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                </div>
                <Badge 
                  className={
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Customer Information - Prominently displayed */}
              <div className={`p-4 rounded-lg mb-4 border-2 ${
                order.status === 'pending' 
                  ? 'bg-blue-50 border-blue-300 shadow-md' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium flex items-center gap-2 text-blue-800">
                    <User className="w-5 h-5" />
                    Customer Information
                  </h4>
                  {order.status === 'pending' && (
                    <Badge className="bg-orange-100 text-orange-700 animate-pulse">
                      Action Required
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-white rounded border">
                      <User className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-medium text-gray-700 text-sm">Customer Name</span>
                        <p className="text-gray-900 font-semibold">{order.buyerName || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white rounded border">
                      <Phone className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="font-medium text-gray-700 text-sm">Phone Number</span>
                        <p className="text-gray-900 font-semibold">
                          <a href={`tel:${order.buyerPhone}`} className="hover:text-blue-600 underline">
                            {order.buyerPhone || 'Not provided'}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2 bg-white rounded border">
                      <MapPin className="w-4 h-4 text-red-500 mt-1" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-700 text-sm block">Delivery Address</span>
                        <p className="text-gray-900 text-sm leading-relaxed font-medium">
                          {order.buyerAddress || 'No address provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Action Buttons for Customer Contact */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-blue-200">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`tel:${order.buyerPhone}`, '_self')}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-3 h-3" />
                    Call Customer
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`sms:${order.buyerPhone}`, '_self')}
                    className="flex items-center gap-2"
                  >
                    <span className="w-3 h-3">💬</span>
                    SMS Customer
                  </Button>
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Details
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                    <p><span className="font-medium">Unit Price:</span> ₹{order.price}</p>
                    <p><span className="font-medium text-green-600">Total Amount:</span> ₹{order.price * order.quantity}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {order.specialInstructions && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Special Instructions</h4>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">{order.specialInstructions}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {order.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleAcceptOrder(order.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Accept Order
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleRejectOrder(order.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Reject Order
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`tel:${order.buyerPhone}`, '_self')}
                  >
                    Contact Customer
                  </Button>
                </div>
              )}

              {order.status === 'confirmed' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleMarkShipped(order.id)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Mark as Shipped
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`tel:${order.buyerPhone}`, '_self')}
                  >
                    Contact Customer
                  </Button>
                </div>
              )}

              {order.status === 'shipped' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleMarkDelivered(order.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark as Delivered
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`tel:${order.buyerPhone}`, '_self')}
                  >
                    Contact Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {dealerOrders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500">
                Orders from customers will appear here when they purchase your items from the marketplace.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}