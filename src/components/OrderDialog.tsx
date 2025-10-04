import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useAuth } from "./AuthContext";
import { MapPin, Phone, User, Package, Truck } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { MarketplaceItem } from "./MarketplacePost";

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: MarketplaceItem | null;
}

export function OrderDialog({ isOpen, onClose, item }: OrderDialogProps) {
  const { user, placeOrder, isLoading } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update delivery address when user or dialog opens
  useEffect(() => {
    if (user?.address && isOpen && !deliveryAddress) {
      setDeliveryAddress(user.address);
    }
  }, [user?.address, isOpen]);



  const handleSubmit = async () => {
    if (!user || !item) {
      toast.error("Missing user or item information");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    if (isNaN(item.price) || item.price <= 0) {
      toast.error("Invalid item price");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ensure all customer details are properly captured
      const orderData = {
        productId: item.id,
        productTitle: item.title,
        dealerName: item.dealer,
        dealerId: item.dealerId || 'dealer-1', // Fallback to dealer-1 if not specified
        dealerPhone: '+91 98765 43210', // In real app, this would come from dealer profile
        dealerAddress: item.location,
        buyerId: user.id,
        buyerName: user.name || 'Unknown Customer',
        buyerPhone: user.phone || 'Phone not provided',
        buyerAddress: deliveryAddress.trim(),
        price: item.price,
        quantity: quantity,
        productImage: item.images[0] || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop',
        specialInstructions: specialInstructions.trim() || undefined
      };

      // Log the order data for debugging
      console.log('Placing order with customer details:', {
        customer: {
          name: orderData.buyerName,
          phone: orderData.buyerPhone,
          address: orderData.buyerAddress
        },
        dealer: {
          id: orderData.dealerId,
          name: orderData.dealerName
        }
      });

      placeOrder(orderData);

      toast.success("Order placed successfully! The dealer will contact you soon.");
      handleClose();
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setDeliveryAddress(user?.address || '');
    setSpecialInstructions('');
    setIsSubmitting(false);
    onClose();
  };

  if (!item) return null;

  const totalPrice = item.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Place Order
          </DialogTitle>
          <DialogDescription>
            Review your order details and provide delivery information.
          </DialogDescription>
        </DialogHeader>

        {/* Show loading state if context is not ready */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing order system...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="space-y-6">
              {/* Product Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex gap-4">
                  <img 
                    src={item.images[0] || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=300&fit=crop'} 
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">{item.condition}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                      <Badge variant="outline">Cash on Delivery</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dealer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {item.dealer}</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Order Details</h4>
                
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special delivery instructions or notes for the dealer"
                    rows={2}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4 bg-green-50">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span>₹{item.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{totalPrice}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    * Payment will be collected on delivery (Cash on Delivery)
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={!deliveryAddress.trim() || isSubmitting || isLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order - ₹${totalPrice}`}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}