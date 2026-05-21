import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Calendar, Clock, MapPin, Package, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

interface BookingData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  package: string;
  eventDate: string;
  time: string;
  location: string;
  status: string;
  notes?: string;
  userEmail: string;
  createdAt: any;
}

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      // Fetch packages first to map IDs to titles
      const packagesRef = collection(db, "packages");
      const packagesSnapshot = await getDocs(packagesRef);
      const packageMap: Record<string, string> = {};
      packagesSnapshot.forEach((doc) => {
        packageMap[doc.id] = doc.data().title;
      });

      const bookingsRef = collection(db, "bookings");
      // Using query to potentially order by createdAt if index exists, but fetching all for now
      const q = query(bookingsRef);
      const snapshot = await getDocs(q);
      
      const fetchedBookings: BookingData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Replace package ID with actual package title if it exists
        const displayPackage = packageMap[data.package] || data.package;
        fetchedBookings.push({ id: doc.id, ...data, package: displayPackage } as BookingData);
      });

      // Sort locally by eventDate descending
      fetchedBookings.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch bookings.",
        background: "#1E1E1E",
        color: "#F5F5DC",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Booking has been ${newStatus}.`,
        background: "#1E1E1E",
        color: "#F5F5DC",
        confirmButtonColor: "#D4AF37",
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update booking status.",
        background: "#1E1E1E",
        color: "#F5F5DC",
        confirmButtonColor: "#D4AF37",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "approved": 
      case "confirmed": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "completed": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "rejected":
      case "cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-secondary bg-secondary/10 border-secondary/20";
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Manage Bookings</h1>
          <p className="text-secondary/70">Review and update client booking requests.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-dark-paper text-light placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-dark-paper p-12 rounded-xl border border-zinc-800/50 text-center">
          <Calendar className="w-16 h-16 text-primary/50 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-light mb-2">No bookings found</h2>
          <p className="text-secondary/70">Try adjusting your search or wait for new bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-dark-paper p-6 rounded-xl border border-zinc-800/50 shadow-lg hover:border-primary/30 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-serif text-light capitalize mb-1">
                    {booking.eventType} Event
                  </h3>
                  <p className="text-sm text-secondary/70">
                    {booking.clientName || "Guest"} - {booking.clientEmail || booking.userEmail}
                  </p>
                  {booking.clientPhone && (
                    <p className="text-xs text-secondary/50 mt-1">{booking.clientPhone}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 flex-grow">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-light text-sm">
                    <div className="bg-dark p-2 rounded-lg border border-primary/10">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span>{new Date(booking.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-light text-sm">
                    <div className="bg-dark p-2 rounded-lg border border-primary/10">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span>{booking.time}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-light text-sm">
                    <div className="bg-dark p-2 rounded-lg border border-primary/10">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="truncate">{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-light text-sm">
                    <div className="bg-dark p-2 rounded-lg border border-primary/10">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <span className="capitalize">{booking.package}</span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mb-6 bg-dark p-4 rounded-lg border border-zinc-800/50">
                  <p className="text-light text-sm line-clamp-2"><span className="text-primary font-medium">Notes:</span> {booking.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/50 flex justify-end gap-3 mt-auto">
                {booking.status === "pending" && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, "rejected")}
                      className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(booking.id, "approved")}
                      className="px-4 py-2 text-sm font-medium bg-primary text-dark hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                  </>
                )}
                {booking.status === "approved" && (
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                    className="px-4 py-2 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
