import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Users, Calendar, CreditCard, TrendingUp, Package, Loader2 } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch clients
        const usersRef = collection(db, "users");
        const clientsQuery = query(usersRef, where("role", "==", "client"));
        const clientsSnapshot = await getDocs(clientsQuery);
        const totalClients = clientsSnapshot.size;

        // Fetch packages to map prices for revenue calculation
        const packagesRef = collection(db, "packages");
        const packagesSnapshot = await getDocs(packagesRef);
        const packagePrices: Record<string, number> = {
          essential: 5000,
          premium: 12000,
          luxury: 25000,
        };
        
        packagesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.price) {
            packagePrices[doc.id] = Number(data.price);
            if (data.title) {
              const firstWord = data.title.toLowerCase().split(' ')[0];
              packagePrices[firstWord] = Number(data.price);
            }
          }
        });

        // Fetch bookings
        const bookingsRef = collection(db, "bookings");
        const bookingsQuery = query(bookingsRef, orderBy("createdAt", "desc"));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        let totalBookings = 0;
        let pendingBookings = 0;
        let totalRevenue = 0;
        const bookingsList: any[] = [];
        
        bookingsSnapshot.forEach((doc) => {
          totalBookings++;
          const data = doc.data();
          if (data.status === "pending") {
            pendingBookings++;
          }

          // Calculate revenue based on approved bookings and their package
          if (data.status === "approved" || data.status === "completed") {
            let price = 0;
            if (data.package) {
              // data.package could be the doc.id OR the old lowercase name
              price = packagePrices[data.package] || packagePrices[data.package.toLowerCase().split(' ')[0]] || 0;
            }
            totalRevenue += price;
          }

          if (bookingsList.length < 5) {
            bookingsList.push({ id: doc.id, ...data });
          }
        });

        // Fetch payments (for recent transactions list only)
        const paymentsRef = collection(db, "payments");
        const paymentsQuery = query(paymentsRef, orderBy("createdAt", "desc"));
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const paymentsList: any[] = [];
        
        paymentsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (paymentsList.length < 5) {
            paymentsList.push({ id: doc.id, ...data });
          }
        });

        setRecentBookings(bookingsList);
        setRecentPayments(paymentsList);

        setStats({
          totalBookings,
          totalClients,
          totalRevenue,
          pendingBookings,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Package,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    },
    {
      title: "Total Revenue",
      value: `₱${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Dashboard Overview</h1>
          <p className="text-secondary/70">Welcome to your admin dashboard. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-dark-paper p-6 rounded-xl border border-zinc-800/50 shadow-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.border} border`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-secondary/70 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-serif text-light">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Additional sections can be added here, e.g. Recent Bookings chart or list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-paper p-6 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-serif text-light">Recent Bookings</h2>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
                  <div>
                    <p className="text-light font-medium">{booking.clientName || 'Guest'}</p>
                    <p className="text-sm text-gray-400">{booking.eventType} • {booking.eventDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    booking.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    booking.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary/50">
                No recent bookings found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-dark-paper p-6 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-serif text-light">Recent Transactions</h2>
          </div>
          <div className="space-y-4">
            {recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
                  <div>
                    <p className="text-light font-medium">Payment for Booking #{payment.bookingId?.slice(0,6)}</p>
                    <p className="text-sm text-gray-400">
                      {payment.createdAt?.toDate ? payment.createdAt.toDate().toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">₱{Number(payment.amount).toLocaleString()}</p>
                    <span className={`text-xs capitalize ${
                      payment.status === 'completed' ? 'text-green-500' :
                      payment.status === 'rejected' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary/50">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
