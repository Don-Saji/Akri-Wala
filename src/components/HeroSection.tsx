import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./AuthContext";

interface HeroSectionProps {
  onShowAuth?: (type: 'login' | 'signup') => void;
  onShowDashboard?: () => void;
}

export function HeroSection({ onShowAuth, onShowDashboard }: HeroSectionProps) {
  const { user } = useAuth();
  
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (user) {
      onShowDashboard?.();
    } else {
      onShowAuth?.('signup');
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1682309614473-1b006ce453c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3JhcCUyMHJlY3ljbGluZyUyMHdhc3RlJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NTk1OTEyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Scrap collection and recycling"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                Turn Your Waste Into Worth – Join Akriwala
              </h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Akriwala connects local users with nearby scrap dealers to recycle waste efficiently. 
                Upload your recyclables, find nearby shops, and contribute to a cleaner future.
              </p>
              <blockquote className="text-xl italic text-green-600 border-l-4 border-green-500 pl-4 py-2">
                "A Wasteless World Begins With You."
              </blockquote>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl"
                size="lg"
                onClick={handleGetStarted}
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl"
                size="lg"
                onClick={scrollToHowItWorks}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}