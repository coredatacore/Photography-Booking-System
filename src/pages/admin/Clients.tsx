import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { Mail, Calendar, User as UserIcon } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  photoURL?: string;
}

export const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'client'));
      const querySnapshot = await getDocs(q);
      const fetchedClients: Client[] = [];
      querySnapshot.forEach((doc) => {
        fetchedClients.push({ id: doc.id, ...doc.data() } as Client);
      });
      setClients(fetchedClients);
    } catch (error) {
      console.error("Error fetching clients: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch clients.',
        background: '#1E1E1E',
        color: '#FFFFFF',
        confirmButtonColor: '#D4AF37'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="text-light">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Clients List</h1>
        <p className="text-gray-400">View and manage your registered clients.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-dark-paper border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg">No clients found in the system.</p>
        </div>
      ) : (
        <div className="bg-dark-paper border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark/50 border-b border-gray-800">
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-dark/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                          {client.photoURL ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={client.photoURL} alt="" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-light">{client.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">ID: {client.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-300">
                          <Mail className="h-4 w-4 mr-2 text-primary/70" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="text-sm text-gray-500">
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-primary hover:text-amber-400 transition-colors"
                        onClick={() => {
                          Swal.fire({
                            title: 'Client Details',
                            html: `
                              <div class="text-left text-light">
                                <p><strong>Name:</strong> ${client.name || 'N/A'}</p>
                                <p><strong>Email:</strong> ${client.email}</p>
                                <p><strong>Phone:</strong> ${client.phone || 'N/A'}</p>
                              </div>
                            `,
                            background: '#1E1E1E',
                            color: '#FFFFFF',
                            confirmButtonColor: '#D4AF37'
                          })
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
