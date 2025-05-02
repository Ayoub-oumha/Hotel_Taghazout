import React, { useState, useEffect } from 'react';
import { FaUsers, FaBed, FaCheckCircle, FaClipboardList, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../api/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalRooms: 0,
    occupancyRate: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Make actual API call to fetch dashboard data
        const response = await api.get('/admin/dashboard');
        const data = response.data;
       
        
        setStats({
          totalReservations: data.reservations.total,
          pendingReservations: data.reservations.pending,
          confirmedReservations: data.reservations.confirmed,
          totalRooms: data.rooms.total,
          occupancyRate: data.rooms.occupancy_rate,
          totalUsers: data.users.total,
          totalRevenue: data.revenue.total
        });
        
        setRecentBookings(data.recent_reservations.map(booking => ({
          id: booking.id,
          guest: booking.user.name,
          roomName: booking.room.name,
          checkIn: booking.check_in_date,
          checkOut: booking.check_out_date,
          status: booking.status,
          amount: booking.total_price
        })));

        setRevenueData(data.revenue.monthly_data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-[#7C6A46]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 px-16">
      <h1 className="text-2xl font-bold mb-8 text-[#7C6A46] border-b pb-3">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {/* Total Reservations */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-[#7C6A46]">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-[#7C6A46]/10 mr-3">
              <FaClipboardList className="text-[#7C6A46] text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Reservations</p>
              <p className="text-xl font-bold text-gray-800">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

        {/* Pending Reservations */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <FaCalendarCheck className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Reservations</p>
              <p className="text-xl font-bold text-gray-800">{stats.pendingReservations}</p>
            </div>
          </div>
        </div>

        {/* Confirmed Reservations */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Confirmed Reservations</p>
              <p className="text-xl font-bold text-gray-800">{stats.confirmedReservations}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-emerald-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-emerald-100 mr-3">
              <FaMoneyBillWave className="text-emerald-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">MAD {stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Total Rooms */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <FaBed className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Rooms</p>
              <p className="text-xl font-bold text-gray-800">{stats.totalRooms}</p>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        
        
        {/* Total Users */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 mr-3">
              <FaUsers className="text-indigo-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-[#7C6A46]">Recent Bookings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{booking.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{booking.guest}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{booking.roomName}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{formatDate(booking.checkIn)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{formatDate(booking.checkOut)}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">${booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Room & Revenue Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        {/* <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-[#7C6A46]">Monthly Revenue</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {revenueData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <span className="text-sm font-medium text-gray-700">${item.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#7C6A46] h-2.5 rounded-full" 
                      style={{ 
                        width: `${item.revenue > 0 ? (item.revenue / Math.max(...revenueData.map(d => d.revenue)) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        
        {/* Room Status */}
       
      </div>
    </div>
  );
}

export default Dashboard;