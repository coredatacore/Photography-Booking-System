import React from 'react';
import { ArrowRight, Star, Camera } from 'lucide-react';

export const Home = () => {
  const featuredWork = [
    { id: 1, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80', title: 'Wedding Photography' },
    { id: 2, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80', title: 'Portrait Sessions' },
    { id: 3, url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80', title: 'Commercial Lifestyle' }
  ];

  const testimonials = [
    { id: 1, name: 'Sarah & James', text: 'Photography Booking System captured our wedding day perfectly. The attention to detail and artistic vision was beyond our expectations.' },
    { id: 2, name: 'Emily Chen', text: 'Absolutely thrilled with my portrait session! The team made me feel so comfortable and the results are stunning.' },
    { id: 3, name: 'Michael Thompson', text: 'Professional, creative, and delivered on time. The corporate headshots elevated our entire brand.' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-dark/60 to-dark"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-light mb-6 leading-tight flex flex-col items-center justify-center text-center">
            <span className="w-full text-center">Capturing Moments,</span>
            <span className="text-primary italic mt-2 w-full text-center">Creating Legacies</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-10 max-w-2xl mx-auto">
            Premium photography services tailored for those who appreciate the art of visual storytelling.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/booking" className="w-full sm:w-auto px-8 py-3 bg-primary text-dark font-semibold rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Book a Session <ArrowRight size={20} />
            </a>
            <a href="/portfolio" className="w-full sm:w-auto px-8 py-3 border border-primary text-primary font-semibold rounded hover:bg-primary/10 transition-colors flex items-center justify-center">
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-24 bg-dark-paper">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Featured Work</h2>
            <div className="w-24 h-1 bg-primary mx-auto opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWork.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-xl font-serif text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-light/80 flex items-center gap-2">
                      <Camera size={16} /> View Gallery
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/portfolio" className="inline-flex items-center gap-2 text-primary hover:text-light transition-colors font-semibold">
              Explore Full Portfolio <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Client Love</h2>
            <div className="w-24 h-1 bg-primary mx-auto opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-dark-paper p-8 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-secondary italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-serif font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <h4 className="font-serif text-light">{testimonial.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
