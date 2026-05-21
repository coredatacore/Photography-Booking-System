import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase/config";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Upload, Calendar, MapPin, Clock, FileText, Package } from "lucide-react";

interface PackageData {
  id: string;
  title: string;
  price: number;
}

export const Booking = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [availablePackages, setAvailablePackages] = useState<PackageData[]>([]);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    package: "premium",
    eventType: "wedding",
    eventDate: "",
    time: "",
    location: "",
    notes: "",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'packages'));
        const pkgs: PackageData[] = [];
        querySnapshot.forEach((doc) => {
          pkgs.push({ id: doc.id, ...doc.data() } as PackageData);
        });
        pkgs.sort((a, b) => a.price - b.price);
        setAvailablePackages(pkgs);
        if (pkgs.length > 0 && formData.package === "premium") {
           setFormData(prev => ({ ...prev, package: pkgs[0].id }));
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientEmail) {
      Swal.fire({
        icon: "warning",
        title: "Information Required",
        text: "Please provide your name and email.",
        background: "#1E1E1E",
        color: "#F5F5DC",
        confirmButtonColor: "#D4AF37",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Images
      const imageUrls: string[] = [];
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const imageRef = ref(storage, `bookings/${Date.now()}_${formData.clientName.replace(/\s+/g, '_')}/${file.name}`);
          const snapshot = await uploadBytes(imageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          imageUrls.push(url);
        }
      }

      // 2. Save Document to Firestore
      await addDoc(collection(db, "bookings"), {
        ...formData,
        userEmail: formData.clientEmail,
        inspirationImages: imageUrls,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "Booking Submitted",
        text: "Your booking request has been successfully received. We will contact you soon!",
        background: "#1E1E1E",
        color: "#F5F5DC",
        confirmButtonColor: "#D4AF37",
      });

      // Reset form
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        package: "premium",
        eventType: "wedding",
        eventDate: "",
        time: "",
        location: "",
        notes: "",
      });
      setImages(null);
      // clear file input
      const fileInput = document.getElementById("inspiration-images") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error: any) {
      console.error("Booking error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "An error occurred while submitting your booking.",
        background: "#1E1E1E",
        color: "#F5F5DC",
        confirmButtonColor: "#D4AF37",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Book Your Event</h1>
          <p className="text-secondary/70 text-lg">Let us create an unforgettable experience for you.</p>
        </div>

        <div className="bg-dark-paper rounded-2xl shadow-2xl p-8 md:p-12 border border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Grid for Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Client Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Client Email */}
              <div className="space-y-2 md:col-span-1">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Client Phone */}
              <div className="space-y-2 md:col-span-1">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                  required
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Event Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                  required
                >
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Package */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  <Package className="w-4 h-4 text-primary" />
                  Package
                </label>
                <select
                  name="package"
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                  required
                >
                  <option value="" disabled>Select a package</option>
                  {availablePackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.title} - ₱{pkg.price.toLocaleString('en-PH')}</option>
                  ))}
                  <option value="custom">Custom Package</option>
                </select>
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                  required
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4 text-primary" />
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors [color-scheme:dark]"
                  required
                />
              </div>

            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                Event Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Venue name or full address"
                className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-primary" />
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more about your vision, specific requirements, or questions..."
                className="w-full bg-dark border border-primary/30 text-light rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600 resize-none"
              ></textarea>
            </div>

            {/* Inspiration Images Upload */}
            <div className="space-y-2">
              <label className="text-secondary flex items-center gap-2 text-sm font-medium">
                <Upload className="w-4 h-4 text-primary" />
                Inspiration Images (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/30 border-dashed rounded-lg cursor-pointer bg-dark hover:bg-dark-paper transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-primary/70" />
                    <p className="mb-2 text-sm text-secondary/70">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-secondary/50">PNG, JPG, WEBP (Max 5 images)</p>
                  </div>
                  <input 
                    id="inspiration-images"
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {images && images.length > 0 && (
                <p className="text-sm text-primary mt-2">
                  {images.length} file(s) selected
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-dark font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-dark border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
