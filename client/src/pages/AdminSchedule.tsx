import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  // Calendar,
  ArrowLeft,
  Ship
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PortSchedule {
  port: string;
  arrival: string;
  departure: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

interface Voyage {
  voyageNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: 'On Time' | 'Delayed' | 'Completed';
  schedule: PortSchedule[];
}

interface Schedule {
  _id: string;
  vesselName: string;
  vesselType: string;
  capacity: string;
  flag: string;
  currentLocation: string;
  voyages: Voyage[];
  createdBy: {
    email: string;
  };
  createdAt: string;
}

const AdminSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  type FormVoyage = {
    voyageNumber: string;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
    status: 'On Time' | 'Delayed' | 'Completed';
    schedule: Array<{
      port: string;
      arrival: string;
      departure: string;
      status: 'Completed' | 'In Progress' | 'Upcoming';
    }>;
  };

  const defaultVoyage: FormVoyage = {
    voyageNumber: '',
    origin: '',
    destination: '',
    departure: '',
    arrival: '',
    status: 'On Time',
    schedule: [{
      port: '',
      arrival: '',
      departure: '',
      status: 'Upcoming'
    }]
  };

  const [formData, setFormData] = useState<{
    vesselName: string;
    vesselType: string;
    capacity: string;
    flag: string;
    currentLocation: string;
    voyages: FormVoyage[];
  }>({
    vesselName: '',
    vesselType: '',
    capacity: '',
    flag: '',
    currentLocation: '',
    voyages: [{ ...defaultVoyage }]
  });
  // Remove unused variables
  // const { logout } = useAuth();
  // const navigate = useNavigate();

  const vesselTypes = [
    'Container Ship',
    'Bulk Carrier',
    'Tanker',
    'RoRo Ship',
    'General Cargo'
  ];

  const statusOptions = [
    'On Time',
    'Delayed',
    'Completed'
  ];

  const portStatusOptions = [
    'Completed',
    'In Progress',
    'Upcoming'
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/schedules');
      setSchedules(response.data.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vesselName || !formData.vesselType || !formData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await axios.post('/schedules', formData);
      toast.success('Schedule created successfully');
      fetchSchedules();
      resetForm();
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      toast.error(error.response?.data?.error || 'Failed to create schedule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      await axios.delete(`/schedules/${id}`);
      toast.success('Schedule deleted successfully');
      fetchSchedules();
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      toast.error(error.response?.data?.error || 'Failed to delete schedule');
    }
  };

  const resetForm = () => {
    setFormData({
      vesselName: '',
      vesselType: '',
      capacity: '',
      flag: '',
      currentLocation: '',
      voyages: [{ ...defaultVoyage }]
    });
    setShowCreateForm(false);
  };

  const addVoyage = () => {
    setFormData(prev => ({
      ...prev,
      voyages: [...prev.voyages, { ...defaultVoyage }]
    }));
  };

  const removeVoyage = (index: number) => {
    if (formData.voyages.length > 1) {
      setFormData(prev => ({
        ...prev,
        voyages: prev.voyages.filter((_, i) => i !== index).map(v => ({
          ...defaultVoyage,
          ...v
        }))
      }));
    }
  };

  const addPortSchedule = (voyageIndex: number) => {
    setFormData(prev => {
      const newVoyages = [...prev.voyages];
      const voyage = { ...defaultVoyage, ...newVoyages[voyageIndex] };
      
      const newPort: PortSchedule = {
        port: '',
        arrival: '',
        departure: '',
        status: 'Upcoming'
      };
      
      newVoyages[voyageIndex] = {
        ...voyage,
        schedule: [...voyage.schedule, newPort]
      };
      
      return { ...prev, voyages: newVoyages };
    });
  };

  const removePortSchedule = (voyageIndex: number, portIndex: number) => {
    setFormData(prev => {
      const newVoyages = [...prev.voyages];
      const voyage = { ...defaultVoyage, ...newVoyages[voyageIndex] };
      
      if (voyage.schedule.length <= 1) {
        return prev;
      }
      
      const newSchedule = voyage.schedule.filter((_, i) => i !== portIndex);
      
      newVoyages[voyageIndex] = {
        ...voyage,
        schedule: newSchedule
      };
      
      return { ...prev, voyages: newVoyages };
    });
  };

  const updateVoyage = (
    voyageIndex: number, 
    field: keyof FormVoyage, 
    value: string | 'On Time' | 'Delayed' | 'Completed'
  ) => {
    setFormData(prev => {
      const newVoyages = [...prev.voyages];
      const currentVoyage = { ...defaultVoyage, ...newVoyages[voyageIndex] };
      
      // Create a new voyage object with the updated field
      const updatedVoyage: FormVoyage = {
        ...currentVoyage,
        [field]: value,
        schedule: [...(currentVoyage.schedule || [])]
      };
      
      newVoyages[voyageIndex] = updatedVoyage;
      return { ...prev, voyages: newVoyages };
    });
  };

  const updatePortSchedule = (
    voyageIndex: number, 
    portIndex: number, 
    field: keyof PortSchedule, 
    value: string | 'Completed' | 'In Progress' | 'Upcoming'
  ) => {
    setFormData(prev => {
      const newVoyages = [...prev.voyages];
      const voyage = { ...defaultVoyage, ...newVoyages[voyageIndex] };
      
      // Create a new schedule array with the updated port
      const newSchedule = voyage.schedule.map((port, idx) => {
        if (idx === portIndex) {
          const updatedPort: PortSchedule = {
            port: field === 'port' ? (value as string) : port.port,
            arrival: field === 'arrival' ? (value as string) : port.arrival,
            departure: field === 'departure' ? (value as string) : port.departure,
            status: field === 'status' ? (value as 'Completed' | 'In Progress' | 'Upcoming') : port.status
          };
          return updatedPort;
        }
        return port;
      });
      
      // Update the voyage with the new schedule
      newVoyages[voyageIndex] = {
        ...voyage,
        schedule: newSchedule
      };
      
      return { ...prev, voyages: newVoyages };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                to="/admin/dashboard"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vessel Schedule Management</h1>
                <p className="text-gray-600 mt-1">Create and manage vessel schedules</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Schedule
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Vessel Schedule</h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vessel Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vessel Name *
                      </label>
                      <input
                        type="text"
                        value={formData.vesselName}
                        onChange={(e) => setFormData({ ...formData, vesselName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vessel Type *
                      </label>
                      <select
                        value={formData.vesselType}
                        onChange={(e) => setFormData({ ...formData, vesselType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select vessel type</option>
                        {vesselTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity *
                      </label>
                      <input
                        type="text"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 8,000 TEU"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flag
                      </label>
                      <input
                        type="text"
                        value={formData.flag}
                        onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Panama"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Location
                      </label>
                      <input
                        type="text"
                        value={formData.currentLocation}
                        onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., At Sea"
                      />
                    </div>
                  </div>

                  {/* Voyages */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Voyages</h3>
                      <button
                        type="button"
                        onClick={addVoyage}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Voyage
                      </button>
                    </div>

                    {formData.voyages.map((voyage, voyageIndex) => (
                      <div key={voyageIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-900">Voyage {voyageIndex + 1}</h4>
                          {formData.voyages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVoyage(voyageIndex)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Voyage Number
                            </label>
                            <input
                              type="text"
                              value={voyage.voyageNumber}
                              onChange={(e) => updateVoyage(voyageIndex, 'voyageNumber', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Origin
                            </label>
                            <input
                              type="text"
                              value={voyage.origin}
                              onChange={(e) => updateVoyage(voyageIndex, 'origin', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Destination
                            </label>
                            <input
                              type="text"
                              value={voyage.destination}
                              onChange={(e) => updateVoyage(voyageIndex, 'destination', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Departure Date
                            </label>
                            <input
                              type="date"
                              value={voyage.departure}
                              onChange={(e) => updateVoyage(voyageIndex, 'departure', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Arrival Date
                            </label>
                            <input
                              type="date"
                              value={voyage.arrival}
                              onChange={(e) => updateVoyage(voyageIndex, 'arrival', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={voyage.status}
                              onChange={(e) => updateVoyage(voyageIndex, 'status', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Port Schedule */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-700">Port Schedule</h5>
                            <button
                              type="button"
                              onClick={() => addPortSchedule(voyageIndex)}
                              className="flex items-center px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Port
                            </button>
                          </div>

                          {voyage.schedule.map((port, portIndex) => (
                            <div key={portIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                              <input
                                type="text"
                                value={port.port}
                                onChange={(e) => updatePortSchedule(voyageIndex, portIndex, 'port', e.target.value)}
                                placeholder="Port name"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="datetime-local"
                                value={port.arrival}
                                onChange={(e) => updatePortSchedule(voyageIndex, portIndex, 'arrival', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type="datetime-local"
                                value={port.departure}
                                onChange={(e) => updatePortSchedule(voyageIndex, portIndex, 'departure', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <div className="flex">
                                <select
                                  value={port.status}
                                  onChange={(e) => updatePortSchedule(voyageIndex, portIndex, 'status', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {portStatusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                  ))}
                                </select>
                                {voyage.schedule.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removePortSchedule(voyageIndex, portIndex)}
                                    className="px-2 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Schedule
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Schedules List */}
        <div className="space-y-6">
          {schedules.map((schedule) => (
            <motion.div
              key={schedule._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{schedule.vesselName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{schedule.vesselType}</span>
                      <span>•</span>
                      <span>{schedule.capacity}</span>
                      <span>•</span>
                      <span>{schedule.flag}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Current Location: {schedule.currentLocation}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {schedule.voyages.map((voyage, voyageIndex) => (
                    <div key={voyageIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Voyage: {voyage.voyageNumber}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          voyage.status === 'On Time' ? 'bg-green-100 text-green-800' :
                          voyage.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {voyage.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {voyage.origin} → {voyage.destination} ({new Date(voyage.departure).toLocaleDateString()} - {new Date(voyage.arrival).toLocaleDateString()})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {voyage.schedule.map((port, portIndex) => (
                          <div key={portIndex} className="p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium">{port.port}</div>
                            <div className="text-gray-600">
                              {new Date(port.arrival).toLocaleString()} - {new Date(port.departure).toLocaleString()}
                            </div>
                            <span className={`inline-block px-1 py-0.5 rounded text-xs ${
                              port.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              port.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {port.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-12">
            <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No schedules yet</h3>
            <p className="text-gray-500 mb-4">Start by creating your first vessel schedule</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Schedule
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSchedule;
