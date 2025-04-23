import React, { useState, useEffect } from 'react';
import { FaUsers, FaBed, FaCalendarCheck, FaMoneyBillWave, FaChartLine, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setStats({
        totalRooms: 50,
        occupiedRooms: 35,
        totalBookings: 120,
        revenue: 15750
      });

      setRecentBookings([
        { id: 1, guest: 'Mohammed Ali', roomNumber: '101', checkIn: '2025-04-15', checkOut: '2025-04-20', status: 'Active' },
        { id: 2, guest: 'Sarah Johnson', roomNumber: '203', checkIn: '2025-04-18', checkOut: '2025-04-22', status: 'Active' },
        { id: 3, guest: 'Omar Bennani', roomNumber: '305', checkIn: '2025-04-20', checkOut: '2025-04-25', status: 'Upcoming' },
        { id: 4, guest: 'Leila Amrani', roomNumber: '402', checkIn: '2025-04-12', checkOut: '2025-04-19', status: 'Completed' },
        { id: 5, guest: 'John Smith', roomNumber: '110', checkIn: '2025-04-22', checkOut: '2025-04-28', status: 'Upcoming' },
      ]);
      
      setLoading(false);
    }, 1000);
    
    // Replace with actual API calls when ready:
    // axios.get('/api/admin/dashboard-stats')
    //   .then(response => {
    //     setStats(response.data.stats);
    //     setRecentBookings(response.data.recentBookings);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching dashboard data:', error);
    //     setLoading(false);
    //   });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Hotel Taghazout Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaBell className="text-gray-500 text-xl cursor-pointer hover:text-blue-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </div>
          <div className="flex items-center gap-2">
            <img 
              src="https://via.placeholder.com/40" 
              alt="Admin" 
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold text-gray-700">Admin</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaBed className="text-blue-500 text-xl" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Rooms</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{stats.occupiedRooms}/{stats.totalRooms}</p>
              <p className="text-green-500 text-sm">
                {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}% occupied
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaCalendarCheck className="text-green-500 text-xl" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Bookings</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
              <p className="text-green-500 text-sm">+12% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FaUsers className="text-purple-500 text-xl" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Guests</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">178</p>
              <p className="text-green-500 text-sm">+8% this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <FaMoneyBillWave className="text-amber-500 text-xl" />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Revenue</h3>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold">{stats.revenue.toLocaleString()} MAD</p>
              <p className="text-green-500 text-sm">+15% this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Availability Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg text-gray-700 mb-4">Room Availability</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-500 h-4 rounded-full" 
                style={{ width: `${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%` }}
              ></div>
            </div>
            <span className="ml-4 text-lg font-bold">
              {Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded p-3">
              <p className="text-gray-500 text-sm">Occupied Rooms</p>
              <p className="text-xl font-bold text-blue-600">{stats.occupiedRooms}</p>
            </div>
            <div className="border border-gray-200 rounded p-3">
              <p className="text-gray-500 text-sm">Available Rooms</p>
              <p className="text-xl font-bold text-green-600">{stats.totalRooms - stats.occupiedRooms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-lg text-gray-700 mb-4">Room Types Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Standard</span>
                <span className="text-sm font-medium">20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Deluxe</span>
                <span className="text-sm font-medium">15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Suite</span>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Family</span>
                <span className="text-sm font-medium">7</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Executive</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-700">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-blue-500 text-sm hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.guest}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.roomNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.checkIn}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.checkOut}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'Active' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'Completed' ? 'bg-gray-100 text-gray-800' : ''
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold text-lg text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Link to="/admin/rooms/create" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <FaBed className="text-blue-500" />
            </div>
            <span className="text-sm text-gray-600">Add Room</span>
          </Link>

          <Link to="/admin/bookings/create" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <FaCalendarCheck className="text-green-500" />
            </div>
            <span className="text-sm text-gray-600">New Booking</span>
          </Link>

          <Link to="/admin/guests" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
            <div className="bg-purple-100 p-3 rounded-full mb-2">
              <FaUsers className="text-purple-500" />
            </div>
            <span className="text-sm text-gray-600">Manage Guests</span>
          </Link>

          <Link to="/admin/reports" className="bg-amber-50 hover:bg-amber-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
            <div className="bg-amber-100 p-3 rounded-full mb-2">
              <FaChartLine className="text-amber-500" />
            </div>
            <span className="text-sm text-gray-600">Reports</span>
          </Link>

          <Link to="/admin/rooms" className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
            <div className="bg-indigo-100 p-3 rounded-full mb-2">
              <FaBed className="text-indigo-500" />
            </div>
            <span className="text-sm text-gray-600">All Rooms</span>
          </Link>

          <Link to="/admin/bookings" className="bg-rose-50 hover:bg-rose-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
            <div className="bg-rose-100 p-3 rounded-full mb-2">
              <FaCalendarCheck className="text-rose-500" />
            </div>
            <span className="text-sm text-gray-600">All Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;