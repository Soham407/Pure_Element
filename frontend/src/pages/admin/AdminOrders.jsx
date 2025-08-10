import React, { useEffect, useMemo, useState } from 'react';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.orders.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      setUpdatingId(orderId);
      await apiService.orders.updateStatus(orderId, nextStatus);
      toast.success('Order status updated');
      // Update locally
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const rows = useMemo(() => orders, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-gray-600 mt-1">Manage every order placed on the site</p>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.users?.email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center">
                        <select
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-500">
                      {order.order_items?.length || 0} items
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <div className="text-center text-gray-600 py-8">No orders found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;


