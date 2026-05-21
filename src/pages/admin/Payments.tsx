import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { CreditCard, DollarSign, Calendar, CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

interface PaymentData {
  id: string;
  userEmail: string;
  amount: number;
  status: string;
  method: string;
  createdAt: any;
  bookingId?: string;
}

export const AdminPayments = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    try {
      const paymentsRef = collection(db, "payments");
      const q = query(paymentsRef);
      const snapshot = await getDocs(q);
      
      const fetchedPayments: PaymentData[] = [];
      snapshot.forEach((doc) => {
        fetchedPayments.push({ id: doc.id, ...doc.data() } as PaymentData);
      });

      // Sort locally by createdAt descending if it exists
      fetchedPayments.sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
        return dateB - dateA;
      });

      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch payments.",
        background: "#1E1E1E",
        color: "#F5F5DC",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (paymentId: string, newStatus: string) => {
    try {
      const paymentRef = doc(db, "payments", paymentId);
      await updateDoc(paymentRef, { status: newStatus });
      
      // Update local state
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId ? { ...payment, status: newStatus } : payment
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Payment has been marked as ${newStatus}.`,
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
        text: "Failed to update payment status.",
        background: "#1E1E1E",
        color: "#F5F5DC",
        confirmButtonColor: "#D4AF37",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "completed": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "failed":
      case "refunded": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-secondary bg-secondary/10 border-secondary/20";
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Manage Payments</h1>
          <p className="text-secondary/70">Review and verify client payments.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search by email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-dark-paper text-light placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="bg-dark-paper p-12 rounded-xl border border-zinc-800/50 text-center">
          <DollarSign className="w-16 h-16 text-primary/50 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-light mb-2">No payments found</h2>
          <p className="text-secondary/70">Try adjusting your search or wait for new transactions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-dark-paper p-6 rounded-xl border border-zinc-800/50 shadow-lg hover:border-primary/30 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-serif text-light mb-1 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    {payment.amount?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || "₱0.00"}
                  </h3>
                  <p className="text-sm text-secondary/70">{payment.userEmail}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 flex-grow">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-light text-sm">
                    <div className="bg-dark p-2 rounded-lg border border-primary/10">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <span className="capitalize">{payment.method || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-light text-sm">
                    <div className="bg-dark p-2 rounded-lg border border-primary/10">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span>
                      {payment.createdAt?.seconds 
                        ? new Date(payment.createdAt.seconds * 1000).toLocaleDateString() 
                        : "Unknown date"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col text-sm">
                    <span className="text-secondary/50 mb-1">Transaction ID</span>
                    <span className="text-light font-mono text-xs break-all bg-dark p-2 rounded border border-zinc-800">
                      {payment.id}
                    </span>
                  </div>
                  {payment.bookingId && (
                    <div className="flex flex-col text-sm">
                      <span className="text-secondary/50 mb-1">Booking ID</span>
                      <span className="text-light font-mono text-xs break-all bg-dark p-2 rounded border border-zinc-800">
                        {payment.bookingId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/50 flex justify-end gap-3 mt-auto">
                {payment.status === "pending" && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(payment.id, "failed")}
                      className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Mark Failed
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(payment.id, "completed")}
                      className="px-4 py-2 text-sm font-medium bg-primary text-dark hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Completed
                    </button>
                  </>
                )}
                {payment.status === "completed" && (
                  <button 
                    onClick={() => handleUpdateStatus(payment.id, "refunded")}
                    className="px-4 py-2 text-sm font-medium bg-dark text-light border border-zinc-700 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Refund Payment
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
