import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { MapPin, Navigation, Phone, Star, Clock, AlertCircle, MapPinOff } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Dealer {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  speciality: string[];
  openHours: string;
  latitude: number;
  longitude: number;
}

interface LocationMapProps {
  userLocation?: { lat: number; lng: number };
  onDealerSelect?: (dealer: Dealer) => void;
}

export function LocationMap({ userLocation, onDealerSelect }: LocationMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyDealers, setNearbyDealers] = useState<Dealer[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  // Mock dealers data - in real app, this would come from API
  const mockDealers: Dealer[] = [
    {
      id: '1',
      name: 'Green Recyclers',
      address: '123 Green Street, Andheri West, Mumbai',
      distance: '0.8 km',
      rating: 4.8,
      phone: '+91 98765 43210',
      speciality: ['Plastic', 'Metal', 'Paper'],
      openHours: '9:00 AM - 7:00 PM',
      latitude: 19.1367,
      longitude: 72.8206
    },
    {
      id: '2',
      name: 'Eco Scrap Hub',
      address: '456 Recycle Road, Bandra East, Mumbai',
      distance: '1.2 km',
      rating: 4.6,
      phone: '+91 98765 43211',
      speciality: ['Electronics', 'Batteries'],
      openHours: '10:00 AM - 6:00 PM',
      latitude: 19.0596,
      longitude: 72.8295
    },
    {
      id: '3',
      name: 'Metal Works',
      address: '789 Industrial Area, Kurla West, Mumbai',
      distance: '1.5 km',
      rating: 4.9,
      phone: '+91 98765 43212',
      speciality: ['All Metals', 'Aluminum', 'Steel'],
      openHours: '8:00 AM - 8:00 PM',
      latitude: 19.0728,
      longitude: 72.8826
    },
    {
      id: '4',
      name: 'Paper Plus',
      address: '321 Paper Lane, Santacruz West, Mumbai',
      distance: '2.1 km',
      rating: 4.5,
      phone: '+91 98765 43213',
      speciality: ['Paper', 'Cardboard', 'Books'],
      openHours: '9:30 AM - 6:30 PM',
      latitude: 19.0896,
      longitude: 72.8336
    },
    {
      id: '5',
      name: 'Universal Recyclers',
      address: '654 Universal Complex, Malad West, Mumbai',
      distance: '2.8 km',
      rating: 4.7,
      phone: '+91 98765 43214',
      speciality: ['Mixed Materials', 'Plastic', 'Glass'],
      openHours: '9:00 AM - 7:30 PM',
      latitude: 19.1864,
      longitude: 72.8493
    }
  ];

  useEffect(() => {
    setNearbyDealers(mockDealers);
    
    // Get user's current location
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
          setLocationPermissionDenied(false);
          setIsLoadingLocation(false);
          toast.success("Location detected successfully!");
        },
        (error) => {
          setIsLoadingLocation(false);
          let errorMessage = 'Unknown error occurred';
          let isPermissionDenied = false;
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied';
              isPermissionDenied = true;
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = error.message || 'Unknown error occurred';
          }
          
          setLocationError(errorMessage);
          setLocationPermissionDenied(isPermissionDenied);
          
          // Use default Mumbai coordinates
          setCurrentLocation({
            lat: 19.0760,
            lng: 72.8777
          });
          
          if (isPermissionDenied) {
            toast.error("Location access denied. Showing dealers near Mumbai.", {
              description: "To get personalized results, please enable location access in your browser."
            });
          } else {
            toast.warning(`Unable to get your location: ${errorMessage}`, {
              description: "Showing dealers near Mumbai as fallback."
            });
          }
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
      toast.error("Geolocation not supported", {
        description: "Your browser doesn't support location services."
      });
      // Use default Mumbai coordinates
      setCurrentLocation({
        lat: 19.0760,
        lng: 72.8777
      });
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      setLocationError(null);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
          setLocationPermissionDenied(false);
          setIsLoadingLocation(false);
          toast.success("Location updated successfully!");
        },
        (error) => {
          setIsLoadingLocation(false);
          let errorMessage = 'Unable to get your location';
          let isPermissionDenied = false;
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location access in your browser settings.';
              isPermissionDenied = true;
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = `Unable to get location: ${error.message || 'Unknown error'}`;
          }
          
          setLocationError(errorMessage);
          setLocationPermissionDenied(isPermissionDenied);
          
          if (isPermissionDenied) {
            toast.error("Location access denied", {
              description: "Please enable location access in your browser settings to get personalized results."
            });
          } else {
            toast.error("Location unavailable", {
              description: errorMessage
            });
          }
        }
      );
    } else {
      toast.error("Geolocation not supported", {
        description: "Your browser doesn't support location services."
      });
    }
  };

  const openInMaps = (dealer: Dealer) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Location Error Alert */}
      {locationError && (
        <Alert className={locationPermissionDenied ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}>
          <AlertCircle className={`h-4 w-4 ${locationPermissionDenied ? "text-amber-600" : "text-red-600"}`} />
          <AlertDescription className={locationPermissionDenied ? "text-amber-800" : "text-red-800"}>
            <div className="space-y-2">
              <p className="font-medium">
                {locationPermissionDenied ? "Location Access Required" : "Location Error"}
              </p>
              <p className="text-sm">
                {locationPermissionDenied 
                  ? "To show nearby dealers accurately, please enable location access in your browser. Currently showing dealers near Mumbai as a fallback."
                  : `${locationError}. Showing dealers near Mumbai as a fallback.`
                }
              </p>
              {locationPermissionDenied && (
                <div className="text-xs text-amber-700 mt-2 space-y-1">
                  <p><strong>Chrome/Edge:</strong> Click the location icon in the address bar → Allow</p>
                  <p><strong>Firefox:</strong> Click the shield icon → Permissions → Location → Allow</p>
                  <p><strong>Safari:</strong> Go to Settings → Websites → Location → Allow</p>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Nearby Scrap Dealers
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="flex items-center gap-2"
            >
              {isLoadingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Getting Location...
                </>
              ) : locationError ? (
                <>
                  <MapPinOff className="w-4 h-4" />
                  Retry Location
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Update Location
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Map Visualization */}
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center relative border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-600">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Interactive Map</p>
              <p className="text-sm">
                {locationError 
                  ? "Showing dealers near Mumbai (fallback location)"
                  : "Showing dealers near your location"
                }
              </p>
              {currentLocation && (
                <p className="text-xs mt-2">
                  {locationError 
                    ? `Fallback: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)} (Mumbai)`
                    : `Current: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                  }
                </p>
              )}
            </div>
            
            {/* Mock Map Points */}
            <div className="absolute inset-0 pointer-events-none">
              {nearbyDealers.slice(0, 3).map((dealer, index) => (
                <div
                  key={dealer.id}
                  className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`
                  }}
                >
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
              ))}
              
              {/* User Location */}
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dealers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Available Dealers ({nearbyDealers.length})
          </h3>
          {locationError && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
              {locationPermissionDenied ? "Location Access Needed" : "Using Fallback Location"}
            </Badge>
          )}
        </div>
        
        <div className="grid gap-4">
          {nearbyDealers.map((dealer) => (
            <Card key={dealer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{dealer.name}</h4>
                    <p className="text-gray-600 text-sm">{dealer.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{dealer.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dealer.distance}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{dealer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{dealer.openHours}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Specializes in:</p>
                  <div className="flex flex-wrap gap-2">
                    {dealer.speciality.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => onDealerSelect?.(dealer)}
                  >
                    Contact Dealer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => openInMaps(dealer)}
                    className="flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}