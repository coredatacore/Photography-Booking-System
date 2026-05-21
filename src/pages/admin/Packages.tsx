import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
}

export const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<Package>>({
    title: '',
    description: '',
    price: 0,
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');

  const fetchPackages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'packages'));
      const pkgs: Package[] = [];
      querySnapshot.forEach((doc) => {
        pkgs.push({ id: doc.id, ...doc.data() } as Package);
      });
      setPackages(pkgs);
    } catch (error) {
      console.error("Error fetching packages: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch packages.',
        background: '#1E1E1E',
        color: '#FFFFFF',
        confirmButtonColor: '#D4AF37'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setCurrentPackage(pkg);
    } else {
      setCurrentPackage({ title: '', description: '', price: 0, features: [] });
    }
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPackage({ title: '', description: '', price: 0, features: [] });
  };

  const handleAddFeature = () => {
    if (featureInput.trim() !== '') {
      setCurrentPackage(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setCurrentPackage(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage.title || !currentPackage.price) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
        background: '#1E1E1E',
        color: '#FFFFFF',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }

    try {
      if (currentPackage.id) {
        // Update
        const docRef = doc(db, 'packages', currentPackage.id);
        await updateDoc(docRef, {
          title: currentPackage.title,
          description: currentPackage.description,
          price: Number(currentPackage.price),
          features: currentPackage.features || []
        });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Package has been updated.',
          background: '#1E1E1E',
          color: '#FFFFFF',
          confirmButtonColor: '#D4AF37'
        });
      } else {
        // Create
        await addDoc(collection(db, 'packages'), {
          title: currentPackage.title,
          description: currentPackage.description,
          price: Number(currentPackage.price),
          features: currentPackage.features || []
        });
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New package has been created.',
          background: '#1E1E1E',
          color: '#FFFFFF',
          confirmButtonColor: '#D4AF37'
        });
      }
      handleCloseModal();
      fetchPackages();
    } catch (error) {
      console.error("Error saving package: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save package.',
        background: '#1E1E1E',
        color: '#FFFFFF',
        confirmButtonColor: '#D4AF37'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#3f3f46',
      confirmButtonText: 'Yes, delete it!',
      background: '#1E1E1E',
      color: '#FFFFFF',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'packages', id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Package has been deleted.',
          icon: 'success',
          background: '#1E1E1E',
          color: '#FFFFFF',
          confirmButtonColor: '#D4AF37'
        });
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete package.',
          background: '#1E1E1E',
          color: '#FFFFFF',
          confirmButtonColor: '#D4AF37'
        });
      }
    }
  };

  return (
    <div className="text-light">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-primary mb-2">Packages Management</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your service packages and pricing.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-dark px-4 py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-amber-400 transition-colors w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-dark-paper border border-gray-800 rounded-lg p-6 sm:p-12 text-center">
          <p className="text-gray-400 text-base sm:text-lg mb-6">No packages found.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleOpenModal()}
              className="text-primary border border-primary px-4 py-3 sm:py-2 rounded hover:bg-primary hover:text-dark transition-colors w-full sm:w-auto"
            >
              Create your first package
            </button>
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  const defaultPackages = [
                    { title: 'Essential', price: 5000, description: 'Perfect for quick portrait sessions or small family gatherings.', features: ['2 Hours of Coverage', '50 Edited High-Res Photos', 'Online Private Gallery', '1 Photographer', 'Basic Retouching'] },
                    { title: 'Premium', price: 12000, description: 'Our most popular package, ideal for engagements or events.', features: ['4 Hours of Coverage', '150 Edited High-Res Photos', 'Online Private Gallery', '1 Photographer + 1 Assistant', 'Advanced Retouching', '1 Fine Art Print (8x10)'] },
                    { title: 'Luxury', price: 25000, description: 'Comprehensive coverage for weddings and grand celebrations.', features: ['8 Hours of Coverage', '400+ Edited High-Res Photos', 'Online Private Gallery', '2 Lead Photographers', 'Premium Retouching', 'Custom Leather Photo Album', 'Engagement Session Included'] }
                  ];
                  for (const pkg of defaultPackages) {
                    await addDoc(collection(db, 'packages'), pkg);
                  }
                  await fetchPackages();
                  Swal.fire({ icon: 'success', title: 'Success', text: 'Default packages added!', background: '#1E1E1E', color: '#FFFFFF', confirmButtonColor: '#D4AF37' });
                } catch (e) {
                  console.error(e);
                  setLoading(false);
                }
              }}
              className="bg-primary text-dark px-4 py-3 sm:py-2 rounded hover:bg-amber-400 transition-colors font-medium w-full sm:w-auto"
            >
              Load Default Packages
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-dark-paper border border-gray-800 rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-serif text-primary">{pkg.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(pkg)} className="text-gray-400 hover:text-light transition-colors p-1">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(pkg.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-3xl font-bold mb-4">₱{pkg.price.toLocaleString('en-PH')}</p>
              <p className="text-gray-400 text-sm mb-6 h-10 overflow-hidden line-clamp-2">{pkg.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-3">Features</h4>
                <ul className="space-y-2">
                  {pkg.features?.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                      {feature}
                    </li>
                  ))}
                  {pkg.features && pkg.features.length > 4 && (
                    <li className="text-sm text-primary italic">+{pkg.features.length - 4} more</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-paper border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-serif text-primary">
                {currentPackage.id ? 'Edit Package' : 'Add New Package'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-light transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={currentPackage.title}
                    onChange={(e) => setCurrentPackage({...currentPackage, title: e.target.value})}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. Premium Wedding"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Price (₱) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={currentPackage.price}
                    onChange={(e) => setCurrentPackage({...currentPackage, price: Number(e.target.value)})}
                    className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g. 15000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  rows={3}
                  value={currentPackage.description}
                  onChange={(e) => setCurrentPackage({...currentPackage, description: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Describe this package..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    className="flex-1 bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="Add a feature (e.g. 4 hours coverage)"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-gray-800 text-light px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    Add
                  </button>
                </div>
                
                {currentPackage.features && currentPackage.features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {currentPackage.features.map((feature, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-dark px-3 py-2 rounded border border-gray-800">
                        <span className="text-sm text-gray-300">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-dark px-6 py-2.5 rounded-lg hover:bg-amber-400 transition-colors font-medium"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
