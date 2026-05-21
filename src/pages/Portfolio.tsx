import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const categories = ['All', 'Wedding', 'Portrait', 'Commercial'];

const portfolioItems = [
  { id: 1, category: 'Wedding', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80', title: 'The Vows' },
  { id: 2, category: 'Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80', title: 'Studio Session' },
  { id: 3, category: 'Commercial', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80', title: 'Brand Campaign' },
  { id: 4, category: 'Wedding', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80', title: 'First Dance' },
  { id: 5, category: 'Portrait', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80', title: 'Outdoor Portrait' },
  { id: 6, category: 'Wedding', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80', title: 'The Rings' },
  { id: 7, category: 'Commercial', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', title: 'Office Lifestyle' },
  { id: 8, category: 'Portrait', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80', title: 'Fashion Editorial' },
  { id: 9, category: 'Wedding', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80', title: 'Bridal Party' },
];

export const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Portfolio</h1>
          <p className="text-secondary max-w-2xl mx-auto mb-8">
            Explore our collection of captured moments across various styles and occasions.
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 md:px-6 py-2 rounded-full border transition-colors text-sm md:text-base ${
                  activeCategory === category 
                    ? 'border-primary bg-primary text-dark font-semibold' 
                    : 'border-primary/30 text-light hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Gallery */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative group overflow-hidden rounded-lg cursor-pointer bg-dark-paper"
              onClick={() => setSelectedImage(item.url)}
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center p-4">
                  <ZoomIn className="text-primary mx-auto mb-2" size={32} />
                  <h3 className="text-xl font-serif text-light">{item.title}</h3>
                  <p className="text-sm text-primary uppercase tracking-wider mt-1">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-sm p-4">
          <button 
            className="absolute top-6 right-6 text-light hover:text-primary transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};
