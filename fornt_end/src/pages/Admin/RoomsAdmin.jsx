import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function RoomsAdmin() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    room_number: '',
    type: '',
    description: '',
    price_per_night: '',
    capacity: '',
    has_air_conditioning: true,
    has_wifi: true,
    has_tv: true,
    has_minibar: false,
    has_balcony: false,
    has_sea_view: false,
    is_available: true,
    amenities: ['WiFi'],
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Available amenities list
  const availableAmenities = [
    'WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 
    'Room Service', 'Spa', 'Laundry', 'Breakfast'
  ];

  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms');
      setRooms(Array.isArray(response.data.rooms) ? response.data.rooms : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to load rooms');
      setRooms([]);
      setLoading(false);
    }
  };
console.log(rooms)
  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file
      });
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle amenities checkbox changes
  const handleAmenityChange = (amenity) => {
    const currentAmenities = [...formData.amenities];
    
    if (currentAmenities.includes(amenity)) {
      // Remove the amenity if it's already selected
      setFormData({
        ...formData,
        amenities: currentAmenities.filter(item => item !== amenity)
      });
    } else {
      // Add the amenity if it's not already selected
      setFormData({
        ...formData,
        amenities: [...currentAmenities, amenity]
      });
    }
  };

  // Handle form submission for create/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create form data object for file upload
      const submitData = new FormData();
      for (const key in formData) {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      }
      
      if (isEditMode) {
        // Update existing room
        await api.post(`/rooms/${currentRoom.id}?_method=PUT`, submitData);
        alert('Room updated successfully');
      } else {
        // Create new room
        await api.post('/rooms', submitData);
        alert('Room created successfully');
      }
      
      setIsModalVisible(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Failed to save room');
      setLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      room_number: '',
      type: '',
      description: '',
      price_per_night: '',
      capacity: '',
      has_air_conditioning: true,
      has_wifi: true,
      has_tv: true,
      has_minibar: false,
      has_balcony: false,
      has_sea_view: false,
      is_available: true,
      amenities: ['WiFi'],
      image: null
    });
    setImagePreview(null);
  };

  // Open modal for editing
  const handleEdit = (room) => {
    setIsEditMode(true);
    setCurrentRoom(room);
    
    // Parse the JSON amenities if it exists
    let parsedAmenities = [];
    if (room.amenities) {
      try {
        parsedAmenities = JSON.parse(room.amenities);
      } catch (e) {
        console.error('Error parsing amenities:', e);
      }
    }
    
    setFormData({
      name: room.name,
      room_number: room.room_number,
      type: room.type,
      description: room.description || '',
      price_per_night: room.price_per_night,
      capacity: room.capacity,
      has_air_conditioning: Boolean(room.has_air_conditioning),
      has_wifi: Boolean(room.has_wifi),
      has_tv: Boolean(room.has_tv),
      has_minibar: Boolean(room.has_minibar),
      has_balcony: Boolean(room.has_balcony),
      has_sea_view: Boolean(room.has_sea_view),
      is_available: Boolean(room.is_available),
      amenities: parsedAmenities,
      image: null
    });
    
    // Set image preview from existing URL
    if (room.image) {
      setImagePreview(`http://localhost:8000/api/storage/${room.image}`);
    } else {
      setImagePreview(null);
    }
    
    setIsModalVisible(true);
  };

  // Open modal for creating
  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentRoom({});
    resetForm();
    setIsModalVisible(true);
  };

  // Handle room deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setLoading(true);
        await api.delete(`/rooms/${id}`);
        alert('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room');
        setLoading(false);
      }
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort rooms
  const getSortedData = (data) => {
    // Check if data exists and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // First filter by search term
    let filteredData = data.filter(room => 
      room.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.room_number?.toString().includes(searchTerm) || 
      room.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then sort if needed
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  };

  // Get data ready for display
  const sortedRooms = getSortedData(rooms);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#7C6A46]">
        <h1 className="text-2xl font-bold text-[#7C6A46] flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Room Management
        </h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#7C6A46]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C6A46]/50"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={fetchRooms} 
            className="p-2 bg-[#7C6A46]/10 rounded-md hover:bg-[#7C6A46]/20 transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5 text-[#7C6A46]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={handleAdd} 
            className="flex items-center bg-[#7C6A46] text-white px-4 py-2 rounded-md hover:bg-[#7C6A46]/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Room
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-10 w-10 text-[#7C6A46]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#7C6A46]/10">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('id')}
                  >
                    ID
                    {sortConfig.key === 'id' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('room_number')}
                  >
                    Room #
                    {sortConfig.key === 'room_number' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider">
                    Image
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('type')}
                  >
                    Type
                    {sortConfig.key === 'type' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('price_per_night')}
                  >
                    Price
                    {sortConfig.key === 'price_per_night' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('is_available')}
                  >
                    Status
                    {sortConfig.key === 'is_available' && (
                      <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7C6A46] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRooms.length > 0 ? (
                  sortedRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-[#7C6A46]/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {room.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{room.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{room.room_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {room.image ? (
                          <img 
                            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOSAuTzt0QGNItcBR6K5SjBuSPdsLfnDPww&s`}
                            alt={`Room ${room.name}`} 
                            className="h-12 w-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/160x120?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm capitalize text-gray-900">{room.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${room.price_per_night}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {room.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(room)}
                            className="text-[#7C6A46] hover:text-[#7C6A46]/70"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                      No rooms found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating/Editing Rooms */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-medium text-[#7C6A46]">
                {isEditMode ? 'Edit Room' : 'Create New Room'}
              </h3>
              <button 
                onClick={() => setIsModalVisible(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="room_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number*
                  </label>
                  <input
                    type="text"
                    id="room_number"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type*
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                    required
                  >
                    <option value="">Select a type</option>
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="family">Family</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="price_per_night"
                      name="price_per_night"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (Guests)*
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                    required
                    min="1"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Room Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                    accept="image/*"
                  />
                </div>
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                  <img 
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOSAuTzt0QGNItcBR6K5SjBuSPdsLfnDPww&s'} 
                    alt="Room preview" 
                    className="h-40 w-full object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Room Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46]"
                ></textarea>
              </div>

              {/* Availability Toggle */}
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Room is available for booking</span>
                </label>
              </div>
              
              {/* Room Features Section */}
              <div className="mb-4">
                <h4 className="text-md font-medium text-[#7C6A46] mb-2">Room Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_air_conditioning"
                      checked={formData.has_air_conditioning}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Air Conditioning</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_wifi"
                      checked={formData.has_wifi}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">WiFi</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_tv"
                      checked={formData.has_tv}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">TV</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_minibar"
                      checked={formData.has_minibar}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Mini Bar</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_balcony"
                      checked={formData.has_balcony}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Balcony</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="has_sea_view"
                      checked={formData.has_sea_view}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Sea View</span>
                  </label>
                </div>
              </div>
              
              {/* Amenities Section */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-[#7C6A46] mb-2">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="h-5 w-5 text-[#7C6A46] focus:ring-[#7C6A46] border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalVisible(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C6A46]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7C6A46] hover:bg-[#7C6A46]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C6A46] disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isEditMode ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomsAdmin;