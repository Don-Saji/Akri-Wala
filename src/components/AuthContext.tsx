import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'user' | 'dealer';
  address?: string;
  profilePicture?: string;
}

export interface ScrapListing {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  category: string;
  weight: string;
  condition: string;
  description?: string;
  pickupType: 'doorstep' | 'dropoff';
  timeSlot: string;
  address: string;
  location: string;
  images: string[];
  selectedDealers: string[];
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  offers: number;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  scrapListingId: string;
  dealerId: string;
  dealerName: string;
  dealerPhone: string;
  userId: string;
  pricePerKg: number;
  totalAmount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  dealerName: string;
  dealerId: string;
  dealerPhone: string;
  dealerAddress: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  price: number;
  quantity: number;
  productImage: string;
  specialInstructions?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  rating?: number;
}

interface PlaceOrderParams {
  productId: string;
  productTitle: string;
  dealerName: string;
  dealerId: string;
  dealerPhone: string;
  dealerAddress: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  price: number;
  quantity: number;
  productImage: string;
  specialInstructions?: string;
}

interface CreateScrapListingParams {
  category: string;
  weight: string;
  condition: string;
  description?: string;
  pickupType: 'doorstep' | 'dropoff';
  timeSlot: string;
  address: string;
  location: string;
  images: string[];
  selectedDealers: string[];
}

interface CreateOfferParams {
  scrapListingId: string;
  pricePerKg: number;
  totalAmount: number;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'user' | 'dealer') => Promise<boolean>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  orders: Order[];
  getUserOrders: (userId: string) => Order[];
  getDealerOrders: (dealerId: string) => Order[];
  placeOrder: (orderParams: PlaceOrderParams) => void;
  scrapListings: ScrapListing[];
  getUserScrapListings: (userId: string) => ScrapListing[];
  getDealerScrapListings: (dealerId: string) => ScrapListing[];
  getAllAvailableScrapListings: () => ScrapListing[];
  createScrapListing: (params: CreateScrapListingParams) => void;
  offers: Offer[];
  getOffersForScrapListing: (scrapListingId: string) => Offer[];
  getOffersForUser: (userId: string) => Offer[];
  getOffersFromDealer: (dealerId: string) => Offer[];
  createOffer: (params: CreateOfferParams) => void;
  updateOfferStatus: (offerId: string, status: 'accepted' | 'rejected') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [scrapListings, setScrapListings] = useState<ScrapListing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('akriwala_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('akriwala_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Initialize with some mock orders for demo including recent pending ones
      const mockOrders: Order[] = [
        {
          id: 'order-1',
          productId: 'item-1',
          productTitle: 'High-Quality Aluminum Scrap',
          dealerName: 'Green Recyclers',
          dealerId: 'dealer-1',
          dealerPhone: '+91 98765 43210',
          dealerAddress: 'Shop 45, Scrap Market, Mumbai',
          buyerId: 'user-1',
          buyerName: 'John User',
          buyerPhone: '+91 98765 43210',
          buyerAddress: '123 Green Street, Mumbai',
          price: 45,
          quantity: 10,
          productImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop',
          status: 'delivered',
          orderDate: '2024-01-15',
          expectedDelivery: '2024-01-20',
          rating: 5
        },
        {
          id: 'order-2',
          productId: 'item-2',
          productTitle: 'Copper Wire Collection',
          dealerName: 'Metal Masters',
          dealerId: 'dealer-2',
          dealerPhone: '+91 87654 32109',
          dealerAddress: 'Unit 12, Industrial Area, Delhi',
          buyerId: 'user-1',
          buyerName: 'John User',
          buyerPhone: '+91 98765 43210',
          buyerAddress: '123 Green Street, Mumbai',
          price: 120,
          quantity: 5,
          productImage: 'https://images.unsplash.com/photo-1590578239789-7b5e33b9b3d9?w=400&h=300&fit=crop',
          status: 'shipped',
          orderDate: '2024-01-18',
          expectedDelivery: '2024-01-25'
        },
        // Add a recent pending order for demo
        {
          id: 'demo-order-123',
          productId: 'demo-item',
          productTitle: 'Recycled Plastic Products',
          dealerName: 'Green Recyclers',
          dealerId: 'dealer-1',
          dealerPhone: '+91 98765 43210',
          dealerAddress: 'Shop 45, Scrap Market, Mumbai',
          buyerId: 'demo-user',
          buyerName: 'Demo Customer',
          buyerPhone: '+91 99999 88888',
          buyerAddress: '456 Demo Street, Test City, Example State 123456',
          price: 500,
          quantity: 1,
          productImage: 'https://images.unsplash.com/photo-1695712551582-c14c80d2ecbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZWN5Y2xlZCUyMHBsYXN0aWMlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTk1OTE2Mjl8MA&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop',
          status: 'pending',
          orderDate: '2024-10-04',
          expectedDelivery: '2024-10-11',
          specialInstructions: 'Please call before delivery. Handle with care.'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('akriwala_orders', JSON.stringify(mockOrders));
    }

    // Load offers from localStorage
    const storedOffers = localStorage.getItem('akriwala_offers');
    if (storedOffers) {
      setOffers(JSON.parse(storedOffers));
    } else {
      // Initialize with some mock offers for demo
      const mockOffers: Offer[] = [
        {
          id: 'offer-1',
          scrapListingId: 'scrap-1',
          dealerId: 'dealer-1',
          dealerName: 'Green Recyclers',
          dealerPhone: '+91 98765 43210',
          userId: 'user-1',
          pricePerKg: 12,
          totalAmount: 60,
          message: 'Good quality plastic bottles. Fair price offered.',
          status: 'pending',
          createdAt: '2024-10-04',
          updatedAt: '2024-10-04'
        },
        {
          id: 'offer-2',
          scrapListingId: 'scrap-3',
          dealerId: 'dealer-2',
          dealerName: 'Eco Scrap Hub',
          dealerPhone: '+91 87654 32109',
          userId: 'user-demo',
          pricePerKg: 8,
          totalAmount: 64,
          message: 'We specialize in paper recycling. Competitive rates.',
          status: 'pending',
          createdAt: '2024-10-04',
          updatedAt: '2024-10-04'
        }
      ];
      setOffers(mockOffers);
      localStorage.setItem('akriwala_offers', JSON.stringify(mockOffers));
    }

    // Load scrap listings from localStorage
    const storedScrapListings = localStorage.getItem('akriwala_scrap_listings');
    if (storedScrapListings) {
      setScrapListings(JSON.parse(storedScrapListings));
    } else {
      // Initialize with some mock scrap listings for demo
      const mockScrapListings: ScrapListing[] = [
        {
          id: 'scrap-1',
          userId: 'user-1',
          userName: 'John User',
          userPhone: '+91 98765 43210',
          userAddress: '123 Green Street, Mumbai',
          category: 'Plastic Bottles',
          weight: '5 kg',
          condition: 'good',
          description: 'Collection of clean plastic bottles from home',
          pickupType: 'doorstep',
          timeSlot: 'Morning (9AM - 12PM)',
          address: '123 Green Street, Mumbai',
          location: 'mumbai',
          images: ['https://images.unsplash.com/photo-1706468808971-ee72122572b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwYm90dGxlc3xlbnwxfHx8fDE3NTk1OTE2MjN8MA&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop'],
          selectedDealers: ['1', '2'],
          status: 'pending',
          offers: 2,
          createdAt: '2024-10-03',
          updatedAt: '2024-10-03'
        },
        {
          id: 'scrap-2',
          userId: 'user-1',
          userName: 'John User',
          userPhone: '+91 98765 43210',
          userAddress: '456 Blue Avenue, Delhi',
          category: 'Metal Cans',
          weight: '3 kg',
          condition: 'excellent',
          description: 'Aluminum cans collected from office',
          pickupType: 'doorstep',
          timeSlot: 'Evening (4PM - 7PM)',
          address: '456 Blue Avenue, Delhi',
          location: 'delhi',
          images: ['https://images.unsplash.com/photo-1625662276901-4a7ec44fbeed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtZXRhbCUyMHNjcmFwJTIwcmVjeWNsaW5nfGVufDF8fHx8MTc1OTU5MTYyNnww&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop'],
          selectedDealers: ['1'],
          status: 'accepted',
          offers: 1,
          createdAt: '2024-10-02',
          updatedAt: '2024-10-04'
        },
        {
          id: 'scrap-3',
          userId: 'user-demo',
          userName: 'Sarah Green',
          userPhone: '+91 87654 32109',
          userAddress: '789 Eco Street, Bangalore',
          category: 'Paper/Cardboard',
          weight: '8 kg',
          condition: 'good',
          description: 'Office paper waste and cardboard boxes',
          pickupType: 'doorstep',
          timeSlot: 'Noon (12PM - 4PM)',
          address: '789 Eco Street, Bangalore',
          location: 'bangalore',
          images: ['https://images.unsplash.com/photo-1594736797933-d0301ba94d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMHJlY3ljbGluZ3xlbnwxfHx8fDE3NTk1OTE2Mjl8MA&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop'],
          selectedDealers: ['2', '3'],
          status: 'pending',
          offers: 0,
          createdAt: '2024-10-04',
          updatedAt: '2024-10-04'
        },
        {
          id: 'scrap-4',
          userId: 'user-demo2',
          userName: 'Mike Johnson',
          userPhone: '+91 76543 21098',
          userAddress: '321 Tech Park, Pune',
          category: 'Electronics',
          weight: '2 kg',
          condition: 'fair',
          description: 'Old mobile phones and chargers',
          pickupType: 'dropoff',
          timeSlot: 'Evening (4PM - 7PM)',
          address: '321 Tech Park, Pune',
          location: 'pune',
          images: ['https://images.unsplash.com/photo-1601821985885-de8f8e9c4df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwcmVjeWNsaW5nfGVufDF8fHx8MTc1OTU5MTYzMHww&ixlib=rb-4.1.0&q=80&w=200&h=150&fit=crop'],
          selectedDealers: ['2'],
          status: 'pending',
          offers: 1,
          createdAt: '2024-10-04',
          updatedAt: '2024-10-04'
        }
      ];
      setScrapListings(mockScrapListings);
      localStorage.setItem('akriwala_scrap_listings', JSON.stringify(mockScrapListings));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'user' | 'dealer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - Check against predefined test accounts and stored accounts
      const predefinedAccounts = [
        // Test user accounts
        { email: 'user@test.com', password: 'user123', userType: 'user', name: 'John User' },
        { email: 'test.user@gmail.com', password: 'test123', userType: 'user', name: 'Test User' },
        { email: 'user1@example.com', password: 'password', userType: 'user', name: 'User One' },
        
        // Test dealer accounts
        { email: 'dealer@test.com', password: 'dealer123', userType: 'dealer', name: 'Green Recyclers' },
        { email: 'test.dealer@gmail.com', password: 'test123', userType: 'dealer', name: 'Test Dealer' },
        { email: 'dealer1@example.com', password: 'password', userType: 'dealer', name: 'Dealer One' },
      ];
      
      // Get stored accounts from signup
      const storedAccounts = JSON.parse(localStorage.getItem('akriwala_accounts') || '[]');
      
      // Combine both account sources
      const allValidAccounts = [...predefinedAccounts, ...storedAccounts];
      
      // Find matching account
      const validAccount = allValidAccounts.find(
        account => account.email === email && 
                  account.password === password && 
                  account.userType === userType
      );
      
      if (!validAccount) {
        setIsLoading(false);
        return false; // Invalid credentials
      }
      
      // Create user object for valid account with consistent dealer IDs
      const predefinedDealerIds: Record<string, string> = {
        'dealer@test.com': 'dealer-1',
        'test.dealer@gmail.com': 'dealer-2', 
        'dealer1@example.com': 'dealer-3'
      };
      
      const dealerId = validAccount.userType === 'dealer' 
        ? (predefinedDealerIds[validAccount.email] || `dealer-${Math.random().toString(36).substr(2, 9)}`)
        : Math.random().toString(36).substr(2, 9);
      
      const mockUser: User = {
        id: dealerId,
        name: validAccount.name,
        email: validAccount.email,
        phone: '+91 98765 43210',
        userType: validAccount.userType,
        address: validAccount.userType === 'user' ? '123 Green Street, Mumbai' : 'Shop 45, Scrap Market, Mumbai'
      };
      
      setUser(mockUser);
      localStorage.setItem('akriwala_user', JSON.stringify(mockUser));
      
      // Request notification permission for dealers (optional)
      try {
        if (mockUser.userType === 'dealer' && 'Notification' in window) {
          if (Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {
              console.log('Notification permission denied');
            });
          }
        }
      } catch (error) {
        console.log('Notification not supported');
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists (simple validation)
      const existingAccounts = JSON.parse(localStorage.getItem('akriwala_accounts') || '[]');
      const emailExists = existingAccounts.some((account: any) => account.email === userData.email);
      
      if (emailExists) {
        setIsLoading(false);
        return false; // Email already exists
      }
      
      // Create new user
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      // Store account credentials for future login
      const newAccount = {
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        name: userData.name
      };
      
      existingAccounts.push(newAccount);
      localStorage.setItem('akriwala_accounts', JSON.stringify(existingAccounts));
      
      setUser(newUser);
      localStorage.setItem('akriwala_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('akriwala_user');
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.buyerId === userId);
  };

  const getDealerOrders = (dealerId: string): Order[] => {
    return orders.filter(order => order.dealerId === dealerId);
  };

  const placeOrder = (orderParams: PlaceOrderParams): void => {
    // Ensure all customer details are properly captured
    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...orderParams,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };

    // Validate that all required customer information is present
    if (!newOrder.buyerName || !newOrder.buyerPhone || !newOrder.buyerAddress) {
      console.warn('Order placed with incomplete customer information:', newOrder);
    }

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('akriwala_orders', JSON.stringify(updatedOrders));
    
    // Set notification flag for dealer
    const notificationKey = `dealer_new_order_${newOrder.dealerId}`;
    localStorage.setItem(notificationKey, 'true');
    
    // Trigger browser notification if dealer is online (optional)
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order Received!', {
          body: `New order for ${newOrder.productTitle} from ${newOrder.buyerName}`
        });
      }
    } catch (error) {
      console.log('Notification not supported or failed');
    }
    
    // Log for debugging
    console.log('New order placed and dealer notified:', {
      orderId: newOrder.id,
      customer: {
        name: newOrder.buyerName,
        phone: newOrder.buyerPhone,
        address: newOrder.buyerAddress
      },
      dealer: {
        id: newOrder.dealerId,
        name: newOrder.dealerName
      }
    });
  };

  const getUserScrapListings = (userId: string): ScrapListing[] => {
    return scrapListings.filter(listing => listing.userId === userId);
  };

  const getDealerScrapListings = (dealerId: string): ScrapListing[] => {
    return scrapListings.filter(listing => listing.selectedDealers.includes(dealerId));
  };

  const getAllAvailableScrapListings = (): ScrapListing[] => {
    // Return all scrap listings from users, regardless of selected dealers
    // This allows dealers to browse all available scrap and make offers
    return scrapListings.filter(listing => listing.status === 'pending' || listing.status === 'accepted');
  };

  const createScrapListing = (params: CreateScrapListingParams): void => {
    if (!user) {
      console.error('User must be logged in to create scrap listing');
      return;
    }

    const newListing: ScrapListing = {
      id: `scrap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      userAddress: user.address || '',
      ...params,
      status: 'pending',
      offers: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedListings = [newListing, ...scrapListings];
    setScrapListings(updatedListings);
    localStorage.setItem('akriwala_scrap_listings', JSON.stringify(updatedListings));
    
    console.log('New scrap listing created:', {
      listingId: newListing.id,
      user: {
        name: newListing.userName,
        phone: newListing.userPhone
      },
      scrap: {
        category: newListing.category,
        weight: newListing.weight,
        condition: newListing.condition
      },
      selectedDealers: newListing.selectedDealers
    });
  };

  const getOffersForScrapListing = (scrapListingId: string): Offer[] => {
    return offers.filter(offer => offer.scrapListingId === scrapListingId);
  };

  const getOffersForUser = (userId: string): Offer[] => {
    return offers.filter(offer => offer.userId === userId);
  };

  const getOffersFromDealer = (dealerId: string): Offer[] => {
    return offers.filter(offer => offer.dealerId === dealerId);
  };

  const createOffer = (params: CreateOfferParams): void => {
    if (!user || user.userType !== 'dealer') {
      console.error('Only dealers can create offers');
      return;
    }

    // Find the scrap listing to get user info
    const scrapListing = scrapListings.find(listing => listing.id === params.scrapListingId);
    if (!scrapListing) {
      console.error('Scrap listing not found');
      return;
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      scrapListingId: params.scrapListingId,
      dealerId: user.id,
      dealerName: user.name,
      dealerPhone: user.phone,
      userId: scrapListing.userId,
      pricePerKg: params.pricePerKg,
      totalAmount: params.totalAmount,
      message: params.message,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedOffers = [newOffer, ...offers];
    setOffers(updatedOffers);
    localStorage.setItem('akriwala_offers', JSON.stringify(updatedOffers));

    // Update the scrap listing's offer count
    const updatedListings = scrapListings.map(listing => 
      listing.id === params.scrapListingId 
        ? { ...listing, offers: listing.offers + 1, updatedAt: new Date().toISOString().split('T')[0] }
        : listing
    );
    setScrapListings(updatedListings);
    localStorage.setItem('akriwala_scrap_listings', JSON.stringify(updatedListings));

    console.log('New offer created:', {
      offerId: newOffer.id,
      dealer: {
        name: newOffer.dealerName,
        phone: newOffer.dealerPhone
      },
      scrapListing: {
        id: scrapListing.id,
        category: scrapListing.category,
        weight: scrapListing.weight
      },
      offer: {
        pricePerKg: newOffer.pricePerKg,
        totalAmount: newOffer.totalAmount
      }
    });
  };

  const updateOfferStatus = (offerId: string, status: 'accepted' | 'rejected'): void => {
    const updatedOffers = offers.map(offer => 
      offer.id === offerId 
        ? { ...offer, status, updatedAt: new Date().toISOString().split('T')[0] }
        : offer
    );
    setOffers(updatedOffers);
    localStorage.setItem('akriwala_offers', JSON.stringify(updatedOffers));

    // If accepted, update the scrap listing status
    if (status === 'accepted') {
      const offer = offers.find(o => o.id === offerId);
      if (offer) {
        const updatedListings = scrapListings.map(listing => 
          listing.id === offer.scrapListingId 
            ? { ...listing, status: 'accepted', updatedAt: new Date().toISOString().split('T')[0] }
            : listing
        );
        setScrapListings(updatedListings);
        localStorage.setItem('akriwala_scrap_listings', JSON.stringify(updatedListings));
      }
    }

    console.log('Offer status updated:', { offerId, status });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading, 
      orders, 
      getUserOrders, 
      getDealerOrders, 
      placeOrder,
      scrapListings,
      getUserScrapListings,
      getDealerScrapListings,
      getAllAvailableScrapListings,
      createScrapListing,
      offers,
      getOffersForScrapListing,
      getOffersForUser,
      getOffersFromDealer,
      createOffer,
      updateOfferStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Alternative hook that returns null instead of throwing for better error handling
export function useAuthSafe() {
  const context = useContext(AuthContext);
  return context || null;
}