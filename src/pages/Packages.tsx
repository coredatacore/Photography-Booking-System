  import React, { useEffect, useState } from 'react';
import { Check, Crown, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

interface PackageData {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
}

export const Packages = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'packages'));
        const pkgs: PackageData[] = [];
        querySnapshot.forEach((doc) => {
          pkgs.push({ id: doc.id, ...doc.data() } as PackageData);
        });
        
        // Sort by price ascending
        pkgs.sort((a, b) => a.price - b.price);
        setPackages(pkgs);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Packages</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Transparent pricing for exceptional photography. Choose the perfect package for your special moments.
          </p>
        </div>

        {/* Pricing Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-secondary text-lg">No packages currently available. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => {
              // Highlight the middle package or the second one
              const isHighlight = index === 1 || packages.length === 1;
              
              return (
                <div 
                  key={pkg.id} 
                  className={`relative rounded-xl p-8 border ${
                    isHighlight 
                      ? 'bg-dark-paper border-primary shadow-[0_0_30px_rgba(212,175,55,0.15)] scale-100 md:scale-105 z-10' 
                      : 'bg-dark border-primary/20 hover:border-primary/50'
                  } transition-all duration-300 flex flex-col`}
                >
                  {isHighlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-dark px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Crown size={16} /> Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-serif text-light mb-2">{pkg.title}</h3>
                    <div className="text-4xl font-bold text-primary mb-4">
                      ₱{pkg.price.toLocaleString('en-PH')}
                    </div>
                    <p className="text-secondary text-sm h-10">{pkg.description}</p>
                  </div>

                  <div className="flex-grow">
                    <ul className="space-y-4 mb-8">
                      {pkg.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-light/90">
                          <Check className="text-primary shrink-0 mt-0.5" size={18} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a 
                    href="/booking" 
                    className={`w-full py-3 rounded text-center font-semibold transition-colors ${
                      isHighlight 
                        ? 'bg-primary text-dark hover:bg-primary/90' 
                        : 'border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    Book {pkg.title}
                  </a>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Custom Package CTA */}
        <div className="mt-20 text-center bg-dark-paper p-8 rounded-lg border border-primary/20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif text-primary mb-4">Looking for something else?</h3>
          <p className="text-secondary mb-6">
            We understand that every event is unique. Contact us to discuss a custom package tailored specifically to your needs.
          </p>
          <a href="/contact" className="inline-block px-8 py-3 border border-primary text-primary font-semibold rounded hover:bg-primary/10 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};
