import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminChildCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent');

  useEffect(() => {
    fetchCategories();
  }, [parentId]);

  const fetchCategories = async () => {
    try {
      const res = await apiService.admin.getChildCategories(parentId);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load child categories', err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await apiService.admin.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted');
    } catch (err) {
      console.error('Delete error', err);
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const parentName = categories[0]?.parent?.name;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{parentName ? `${parentName} › ` : ''}Child Categories</h1>
            <p className="text-gray-600 mt-2">Manage sub-categories</p>
          </div>
          <Link to="/admin/categories/new" className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Link>
        </div>

        <Link to="/admin/categories/parents" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Parents
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.sort_order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <Link to={`/admin/categories/${cat.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminChildCategories;
