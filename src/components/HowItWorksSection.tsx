import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShoppingCart, 
  Eye, 
  Store,
  Truck,
  Camera,
  MessageSquare
} from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to turn your waste into worth, whether you're selling scraps or buying recycled materials.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Users */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-green-100 text-green-700 px-4 py-2 text-lg">
                For Users
              </Badge>
              <h3 className="text-2xl font-bold text-black mt-4">
                Sell Your Scrap Materials
              </h3>
            </div>

            <div className="space-y-4">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-green-600" />
                    </div>
                    Sign Up & Upload Scrap Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">
                    Register as a user and upload details about your recyclable materials:
                  </p>
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                    <li>Material category (Plastic bottles, Metals, etc.)</li>
                    <li>Approximate weight and condition description</li>
                    <li>Upload clear pictures of your items</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    Set Location & Choose Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">
                    Find nearby scrap shops and choose your preferred options:
                  </p>
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                    <li>View nearby scrap dealers on the map</li>
                    <li>Choose pickup type: Doorstep pickup or Drop-off at shop</li>
                    <li>Select preferred time: Morning, Noon, or Evening</li>
                    <li>Add your address and confirm booking</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    Buy from Marketplace
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">
                    Browse and purchase recycled products from nearby dealers. All transactions are Cash on Delivery only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* For Scrap Dealers */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-lg">
                For Scrap Dealers
              </Badge>
              <h3 className="text-2xl font-bold text-black mt-4">
                Buy & Sell Scrap Materials
              </h3>
            </div>

            <div className="space-y-4">
              <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    View & Inspect Listings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">
                    Sign in with your dealer account to access all available scrap listings from users in your area.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    Inspect & Offer Price
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">
                    Inspect the scrap materials and decide on fair pricing based on quality, quantity, and market rates.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-blue-600" />
                    </div>
                    Post Your Own Scraps
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600">
                    List your processed recycled materials for users to purchase. Set competitive prices and manage your inventory.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Cash on Delivery Notice */}
        <div className="mt-12 text-center">
          <Card className="bg-green-50 border-green-200 max-w-2xl mx-auto rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Truck className="w-6 h-6 text-green-600" />
                <h4 className="text-lg font-semibold text-green-800">
                  Cash on Delivery Only
                </h4>
              </div>
              <p className="text-green-700">
                All transactions are processed through Cash on Delivery to ensure security and trust between users and dealers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}