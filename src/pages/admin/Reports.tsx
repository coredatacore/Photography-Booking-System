import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface ActivityItem {
  text: string;
  time: Date;
  type: 'booking' | 'payment';
}

export const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    totalClients: 0,
    conversionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetch packages for pricing
        const packagesSnapshot = await getDocs(collection(db, "packages"));
        const packagePrices: Record<string, number> = {};
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
        const bookingsSnapshot = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
        let revenue = 0;
        let active = 0;
        let total = 0;
        let successful = 0;
        const uniqueClients = new Set<string>();
        const activities: ActivityItem[] = [];
        
        // Revenue by day of week (0=Sun, 1=Mon... 6=Sat)
        // We'll map to [Mon, Tue, Wed, Thu, Fri, Sat, Sun] -> index 0 to 6
        const weeklyRevenue = [0, 0, 0, 0, 0, 0, 0];

        bookingsSnapshot.forEach((doc) => {
          const data = doc.data();
          total++;
          
          if (data.clientEmail) {
            uniqueClients.add(data.clientEmail);
          }

          if (data.status === "approved" || data.status === "pending") {
            active++;
          }

          let bookingPrice = 0;
          if (data.status === "approved" || data.status === "completed") {
            successful++;
            if (data.package) {
              bookingPrice = packagePrices[data.package] || packagePrices[data.package.toLowerCase().split(' ')[0]] || 0;
            }
            revenue += bookingPrice;

            // Add to chart if it has a valid date
            if (data.createdAt?.toDate) {
              const date = data.createdAt.toDate();
              let day = date.getDay(); // 0 = Sun
              // Convert to 0=Mon, 6=Sun
              day = day === 0 ? 6 : day - 1;
              weeklyRevenue[day] += bookingPrice;
            }
          }

          if (data.createdAt?.toDate) {
            activities.push({
              text: `New booking from ${data.clientName || 'Guest'}`,
              time: data.createdAt.toDate(),
              type: 'booking'
            });
          }
        });

        // Fetch Payments
        const paymentsSnapshot = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc")));
        paymentsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt?.toDate) {
            activities.push({
              text: `Payment of ₱${Number(data.amount || 0).toLocaleString()} received`,
              time: data.createdAt.toDate(),
              type: 'payment'
            });
          }
        });

        // Calculate max for chart normalization
        const maxRev = Math.max(...weeklyRevenue, 1);
        const normalizedChart = weeklyRevenue.map(rev => (rev / maxRev) * 100);

        // Sort activities by date desc
        activities.sort((a, b) => b.time.getTime() - a.time.getTime());

        setStats({
          totalRevenue: revenue,
          activeBookings: active,
          totalClients: uniqueClients.size,
          conversionRate: total > 0 ? Math.round((successful / total) * 100) : 0,
        });
        setChartData(normalizedChart);
        setRecentActivity(activities.slice(0, 5));

      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExport = () => {
    Swal.fire({
      icon: 'success',
      title: 'Export Started',
      text: 'Your report is being generated and will download shortly.',
      background: '#1E1E1E',
      color: '#FFFFFF',
      confirmButtonColor: '#D4AF37',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const statCards = [
    { title: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString('en-PH')}`, icon: TrendingUp, positive: true },
    { title: 'Active Bookings', value: stats.activeBookings.toString(), icon: Calendar, positive: true },
    { title: 'Total Clients', value: stats.totalClients.toString(), icon: Users, positive: true },
    { title: 'Success Rate', value: `${stats.conversionRate}%`, icon: BarChart3, positive: stats.conversionRate >= 50 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-light">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Overview of your business performance.</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-dark-paper border border-gray-700 text-light px-4 py-2 rounded flex items-center justify-center gap-2 font-medium hover:border-primary transition-colors w-full sm:w-auto"
        >
          <Download size={20} className="text-primary" />
          Export Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-dark-paper border border-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-dark p-3 rounded-lg border border-gray-800">
                  <Icon className="text-primary h-6 w-6" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-light">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-dark-paper border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-serif text-primary mb-6">Weekly Revenue Overview</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {chartData.map((height, i) => (
              <div key={i} className="w-full bg-dark rounded-t-sm border border-gray-800 relative group h-full flex items-end">
                <div 
                  className="w-full bg-primary/80 rounded-t-sm group-hover:bg-primary transition-all duration-500"
                  style={{ height: `${Math.max(height, 2)}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-paper border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-serif text-primary mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="text-light text-sm">{activity.text}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-secondary/50">
                No recent activity recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
