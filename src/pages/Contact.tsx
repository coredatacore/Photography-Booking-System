import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Get in Touch</h1>
          <p className="text-secondary max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our packages, 
            pricing, or want to discuss a custom project, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information & Map */}
          <div className="space-y-8">
            <div className="bg-dark-paper p-8 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-serif text-primary mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-light mb-1">Studio Location</h4>
                    <p className="text-secondary">
                      Tomas Claudio Bagsakan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-light mb-1">Phone</h4>
                    <p className="text-secondary">09108220863</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-light mb-1">Email</h4>
                    <p className="text-secondary">booking@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 bg-dark-paper rounded-lg border border-primary/20 overflow-hidden relative group">
              {/* Replace the src below with an actual Google Maps embed iframe if needed */}
              <div className="absolute inset-0 flex items-center justify-center bg-dark-paper/80 z-10">
                <p className="text-primary font-serif text-lg flex items-center gap-2">
                  <MapPin /> Interactive Map Here
                </p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" 
                alt="Map background" 
                className="w-full h-full object-cover opacity-30 grayscale"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-dark-paper p-8 rounded-lg border border-primary/20">
            <h3 className="text-2xl font-serif text-primary mb-6">Send us a Message</h3>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-light mb-2">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="w-full bg-dark border border-primary/30 rounded px-4 py-3 text-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-light mb-2">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="w-full bg-dark border border-primary/30 rounded px-4 py-3 text-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full bg-dark border border-primary/30 rounded px-4 py-3 text-light focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-light mb-2">Subject</label>
                <select 
                  id="subject"
                  className="w-full bg-dark border border-primary/30 rounded px-4 py-3 text-light focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                  <option value="">Select a subject...</option>
                  <option value="wedding">Wedding Photography</option>
                  <option value="portrait">Portrait Session</option>
                  <option value="commercial">Commercial Project</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-light mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full bg-dark border border-primary/30 rounded px-4 py-3 text-light focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us about your project or event..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-primary text-dark font-semibold rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Send Message <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
