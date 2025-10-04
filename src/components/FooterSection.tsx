import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { LegalPages } from "./LegalPages";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MessageCircle 
} from "lucide-react";

export function FooterSection() {
  const [legalPageOpen, setLegalPageOpen] = useState(false);
  const [legalPageType, setLegalPageType] = useState<'terms' | 'privacy'>('terms');

  const openLegalPage = (type: 'terms' | 'privacy') => {
    setLegalPageType(type);
    setLegalPageOpen(true);
  };
  return (
    <footer className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Help Desk Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Help Desk
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Need assistance? We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">support@akriwala.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+91 12345 67890</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="border border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input 
                        placeholder="Your first name" 
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input 
                        placeholder="Your last name" 
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea 
                      placeholder="How can we help you?" 
                      rows={4}
                      className="rounded-lg"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                © 2025 Akriwala. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <button 
                onClick={() => openLegalPage('terms')}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => openLegalPage('privacy')}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      <LegalPages 
        isOpen={legalPageOpen}
        onClose={() => setLegalPageOpen(false)}
        page={legalPageType}
      />
    </footer>
  );
}