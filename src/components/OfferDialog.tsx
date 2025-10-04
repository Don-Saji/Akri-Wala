import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  DollarSign, 
  Package, 
  User, 
  MapPin, 
  Clock,
  Calculator
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "./AuthContext";

interface ScrapListing {
  id: string;
  user: string;
  title: string;
  category: string;
  weight: string;
  location: string;
  postedDate: string;
  image: string;
  condition: string;
  description?: string;
  userPhone: string;
  userAddress: string;
  pickupType: string;
  timeSlot: string;
  status: string;
}

interface OfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  scrapListing: ScrapListing | null;
}

export function OfferDialog({ isOpen, onClose, scrapListing }: OfferDialogProps) {
  const { createOffer } = useAuth();
  const [formData, setFormData] = useState({
    pricePerKg: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract numeric weight value for calculations
  const getWeightInKg = (weightStr: string): number => {
    const match = weightStr.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const weightInKg = scrapListing ? getWeightInKg(scrapListing.weight) : 0;
  const pricePerKg = parseFloat(formData.pricePerKg) || 0;
  const totalAmount = Math.round(weightInKg * pricePerKg);

  const handleSubmit = async () => {
    if (!scrapListing) return;

    if (!formData.pricePerKg || pricePerKg <= 0) {
      toast.error('Please enter a valid price per kg');
      return;
    }

    setIsSubmitting(true);

    try {
      createOffer({
        scrapListingId: scrapListing.id,
        pricePerKg: pricePerKg,
        totalAmount: totalAmount,
        message: formData.message
      });

      toast.success('Offer submitted successfully!');
      onClose();
      
      // Reset form
      setFormData({
        pricePerKg: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to submit offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      pricePerKg: '',
      message: ''
    });
  };

  if (!scrapListing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Make an Offer
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Submit your offer for this scrap listing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scrap Details Card */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img 
                  src={scrapListing.image} 
                  alt={scrapListing.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{scrapListing.title}</h3>
                  <div className="flex gap-2 mt-1 mb-2">
                    <Badge variant="outline">{scrapListing.category}</Badge>
                    <Badge variant="outline">{scrapListing.weight}</Badge>
                    <Badge variant="outline">{scrapListing.condition}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {scrapListing.user}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {scrapListing.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {scrapListing.postedDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {scrapListing.pickupType}
                    </div>
                  </div>
                  {scrapListing.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {scrapListing.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offer Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="pricePerKg">Price per Kg (₹) *</Label>
              <div className="relative mt-1">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="pricePerKg"
                  type="number"
                  placeholder="Enter price per kg"
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData({...formData, pricePerKg: e.target.value})}
                  className="pl-10"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Price calculation */}
            {pricePerKg > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Price Calculation</h4>
                  </div>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>{weightInKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per kg:</span>
                      <span>₹{pricePerKg}</span>
                    </div>
                    <hr className="border-green-300" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message to the user about your offer..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.pricePerKg || pricePerKg <= 0}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}