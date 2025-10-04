import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  MapPin, 
  Clock, 
  Truck, 
  Camera,
  X,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "./AuthContext";

interface ScrapUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

const scrapCategories = [
  'Plastic Bottles',
  'Metal Cans',
  'Paper/Cardboard',
  'Electronics',
  'Glass',
  'Textiles',
  'Mixed Metals',
  'Other'
];

const timeSlots = [
  'Morning (9AM - 12PM)',
  'Noon (12PM - 4PM)',
  'Evening (4PM - 7PM)'
];

export function ScrapUpload({ isOpen, onClose }: ScrapUploadProps) {
  const { createScrapListing } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedDealers, setSelectedDealers] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    category: '',
    weight: '',
    condition: '',
    description: '',
    pickupType: 'doorstep',
    timeSlot: '',
    address: '',
    location: 'mumbai'
  });

  // Mock nearby dealers
  const nearbyDealers = [
    { id: '1', name: 'Green Recyclers', distance: '0.8 km', rating: 4.8, speciality: 'Plastic & Metal' },
    { id: '2', name: 'Eco Scrap Hub', distance: '1.2 km', rating: 4.6, speciality: 'Electronics' },
    { id: '3', name: 'Metal Works', distance: '1.5 km', rating: 4.9, speciality: 'All Metals' },
    { id: '4', name: 'Paper Plus', distance: '2.1 km', rating: 4.5, speciality: 'Paper & Cardboard' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...imageUrls]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDealerSelection = (dealerId: string) => {
    setSelectedDealers(prev => 
      prev.includes(dealerId) 
        ? prev.filter(id => id !== dealerId)
        : [...prev, dealerId]
    );
  };

  const handleSubmit = () => {
    if (currentStep === 1) {
      if (!formData.category || !formData.weight || !formData.condition) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedDealers.length === 0) {
        toast.error('Please select at least one dealer');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.timeSlot || !formData.address) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Create the scrap listing
      createScrapListing({
        category: formData.category,
        weight: formData.weight,
        condition: formData.condition,
        description: formData.description,
        pickupType: formData.pickupType,
        timeSlot: formData.timeSlot,
        address: formData.address,
        location: formData.location,
        images: uploadedImages,
        selectedDealers: selectedDealers
      });
      
      toast.success('Scrap listing created successfully!');
      onClose();
      setCurrentStep(1);
      setFormData({
        category: '',
        weight: '',
        condition: '',
        description: '',
        pickupType: 'doorstep',
        timeSlot: '',
        address: '',
        location: 'mumbai'
      });
      setUploadedImages([]);
      setSelectedDealers([]);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Upload Your Scrap
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Step {currentStep} of 3 - Complete the process to list your scrap for collection
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step 1: Scrap Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Material Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {scrapCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight">Approximate Weight *</Label>
                <Input
                  id="weight"
                  placeholder="e.g., 5 kg"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Additional details about your scrap materials..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Upload Pictures</Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                  </div>
                </label>
              </div>

              {/* Display uploaded images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Dealers */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select Nearby Dealers</h3>
              <p className="text-sm text-gray-600">Choose one or more dealers to send your scrap listing</p>
            </div>

            <div className="space-y-3">
              {nearbyDealers.map(dealer => (
                <Card 
                  key={dealer.id} 
                  className={`cursor-pointer transition-all ${
                    selectedDealers.includes(dealer.id) 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleDealerSelection(dealer.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{dealer.name}</h4>
                          {selectedDealers.includes(dealer.id) && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {dealer.distance}
                          </span>
                          <span>⭐ {dealer.rating}</span>
                          <Badge variant="outline" className="text-xs">
                            {dealer.speciality}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500">
              Selected: {selectedDealers.length} dealer(s)
            </div>
          </div>
        )}

        {/* Step 3: Pickup Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Pickup Details</h3>
              <p className="text-sm text-gray-600">Choose your preferred pickup method and time</p>
            </div>

            <div>
              <Label>Pickup Type</Label>
              <RadioGroup
                value={formData.pickupType}
                onValueChange={(value) => setFormData({...formData, pickupType: value})}
                className="flex flex-col space-y-3 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doorstep" id="doorstep" />
                  <Label htmlFor="doorstep" className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Doorstep Pickup
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dropoff" id="dropoff" />
                  <Label htmlFor="dropoff" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Drop-off at Shop
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="timeSlot">Preferred Time *</Label>
              <Select value={formData.timeSlot} onValueChange={(value) => setFormData({...formData, timeSlot: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address for pickup..."
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Summary */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-green-700">
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Weight:</strong> {formData.weight}</p>
                  <p><strong>Dealers:</strong> {selectedDealers.length} selected</p>
                  <p><strong>Pickup:</strong> {formData.pickupType === 'doorstep' ? 'Doorstep Pickup' : 'Drop-off at Shop'}</p>
                  <p><strong>Time:</strong> {formData.timeSlot}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={goBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600"
          >
            {currentStep === 3 ? 'Confirm Booking' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}