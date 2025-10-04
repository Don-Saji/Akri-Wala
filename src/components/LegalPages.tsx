import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface LegalPagesProps {
  isOpen: boolean;
  onClose: () => void;
  page: 'terms' | 'privacy';
}

export function LegalPages({ isOpen, onClose, page }: LegalPagesProps) {
  const renderContent = () => {
    if (page === 'terms') {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Terms & Conditions</h2>
          
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">1. Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing and using Akriwala, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg">2. Platform Usage</h3>
              <p className="text-gray-700">
                Akriwala is a platform that connects users with scrap dealers for waste collection and recycling services. Users must provide accurate information about their scrap materials.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg">3. User Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate descriptions and weights of scrap materials</li>
                <li>Ensure materials are safe and legally owned</li>
                <li>Be available at the scheduled pickup time</li>
                <li>Pay all agreed amounts for marketplace purchases</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg">4. Dealer Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide fair and competitive pricing</li>
                <li>Maintain proper licensing and certifications</li>
                <li>Ensure safe handling and processing of materials</li>
                <li>Deliver marketplace items as described</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg">5. Payment Terms</h3>
              <p className="text-gray-700">
                All transactions are conducted on a Cash on Delivery (COD) basis. Akriwala does not handle payments directly but facilitates connections between users and dealers.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg">6. Limitation of Liability</h3>
              <p className="text-gray-700">
                Akriwala serves as a connecting platform only. We are not responsible for disputes between users and dealers, quality of materials, or safety incidents during transactions.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg">7. Modifications</h3>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications.
              </p>
            </section>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Privacy Policy</h2>
          
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold text-lg">1. Information We Collect</h3>
              <p className="text-gray-700">
                We collect information you provide directly to us, such as when you create an account, upload scrap listings, or contact customer support.
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>Personal information (name, email, phone number)</li>
                <li>Address and location data</li>
                <li>Scrap material details and photographs</li>
                <li>Transaction history and preferences</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To connect you with nearby dealers</li>
                <li>To process transactions and bookings</li>
                <li>To send service-related communications</li>
                <li>To improve our platform and user experience</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg">3. Information Sharing</h3>
              <p className="text-gray-700">
                We share your information only as necessary to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>With dealers when you submit scrap listings</li>
                <li>With other users for marketplace transactions</li>
                <li>With service providers who assist our operations</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg">4. Location Data</h3>
              <p className="text-gray-700">
                We use your location to show nearby dealers and estimate distances. You can control location sharing through your device settings.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg">5. Data Security</h3>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg">6. Your Rights</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Control location sharing preferences</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg">7. Contact Us</h3>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at privacy@akriwala.com or through our help desk.
              </p>
            </section>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {page === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
          </DialogTitle>
          <DialogDescription>
            {page === 'terms' 
              ? 'Please read our terms and conditions carefully before using Akriwala'
              : 'Learn how we protect and handle your personal information'
            }
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}