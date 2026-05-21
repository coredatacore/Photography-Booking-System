import { useState } from 'react';
import Swal from 'sweetalert2';
import { Save, Bell, Shield, Building, Globe } from 'lucide-react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Photography Booking System',
    email: 'booking@gmail.com',
    phone: '09108220863',
    website: 'https://platformbase.com',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate save
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your changes have been updated successfully.',
      background: '#1E1E1E',
      color: '#FFFFFF',
      confirmButtonColor: '#D4AF37'
    });
  };

  return (
    <div className="text-light max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Platform Settings</h1>
        <p className="text-gray-400">Manage your application preferences and configurations.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="bg-dark-paper border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Building className="text-primary h-5 w-5" />
            <h2 className="text-lg font-medium text-light">General Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Phone Number</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded-lg px-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-light focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-dark-paper border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Bell className="text-primary h-5 w-5" />
            <h2 className="text-lg font-medium text-light">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-light font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Receive email alerts for new bookings and messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
              <div>
                <h3 className="text-light font-medium">SMS Notifications</h3>
                <p className="text-sm text-gray-400">Receive text messages for urgent alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security / System */}
        <div className="bg-dark-paper border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Shield className="text-primary h-5 w-5" />
            <h2 className="text-lg font-medium text-light">System</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-light font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-400">Temporarily disable client access to the platform</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary text-dark px-8 py-3 rounded-lg flex items-center gap-2 font-medium hover:bg-amber-400 transition-colors shadow-lg shadow-primary/20"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
