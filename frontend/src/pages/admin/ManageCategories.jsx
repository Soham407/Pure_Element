import React, { useEffect, useMemo, useState } from 'react';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ConfirmModal = ({ isOpen, title, description, confirmText, onConfirm, onClose, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4 text-gray-700">{description}</div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Working...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Removed unused EditModal component; replaced with inline modal to support parent/toggles

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newParentId, setNewParentId] = useState('');
  const [newShowInNav, setNewShowInNav] = useState(true);
  const [newSortOrder, setNewSortOrder] = useState(0);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [categoryBeingEdited, setCategoryBeingEdited] = useState(null);
  const [editParentId, setEditParentId] = useState('');
  const [editShowInNav, setEditShowInNav] = useState(true);
  const [editSortOrder, setEditSortOrder] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryBeingDeleted, setCategoryBeingDeleted] = useState(null);

  const parentCategories = useMemo(() => categories.filter(c => !c.parent_id), [categories]);
  const categoriesById = useMemo(() => {
    const map = new Map();
    categories.forEach(c => map.set(c.id, c));
    return map;
  }, [categories]);
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const aParentName = a.parent_id ? (categoriesById.get(a.parent_id)?.name || '') : '';
      const bParentName = b.parent_id ? (categoriesById.get(b.parent_id)?.name || '') : '';
      if (aParentName !== bParentName) return aParentName.localeCompare(bParentName);
      if (a.sort_order !== b.sort_order) return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [categories, categoriesById]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiService.admin.getCategories();
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error(error?.response?.data?.error || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setCreating(true);
      const payload = {
        name: newCategoryName.trim(),
        parentId: newParentId || null,
        showInNav: !!newShowInNav,
        sortOrder: Number.isNaN(parseInt(newSortOrder)) ? 0 : parseInt(newSortOrder)
      };
      const res = await apiService.admin.createCategory(payload);
      const created = res.data?.category;
      setCategories((prev) => (created ? [created, ...prev] : prev));
      setNewCategoryName('');
      setNewParentId('');
      setNewShowInNav(true);
      setNewSortOrder(0);
      toast.success('Category created');
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(error?.response?.data?.error || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (category) => {
    setCategoryBeingEdited(category);
    setEditParentId(category.parent_id || '');
    setEditShowInNav(category.show_in_nav ?? true);
    setEditSortOrder(category.sort_order ?? 0);
    setEditModalOpen(true);
  };

  const saveEditedCategory = async (updatedName) => {
    if (!categoryBeingEdited) return;
    const trimmed = updatedName.trim();
    if (!trimmed) return;
    try {
      setEditLoading(true);
      const payload = {
        name: trimmed,
        parentId: editParentId || null,
        showInNav: !!editShowInNav,
        sortOrder: Number.isNaN(parseInt(editSortOrder)) ? 0 : parseInt(editSortOrder)
      };
      await apiService.admin.updateCategory(categoryBeingEdited.id, payload);
      setCategories((prev) => prev.map((c) => (
        c.id === categoryBeingEdited.id 
          ? { 
              ...c, 
              name: trimmed, 
              parent_id: payload.parentId, 
              show_in_nav: payload.showInNav, 
              sort_order: payload.sortOrder 
            } 
          : c
      )));
      toast.success('Category updated');
      setEditModalOpen(false);
      setCategoryBeingEdited(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error(error?.response?.data?.error || 'Failed to update category');
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryBeingDeleted(category);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryBeingDeleted) return;
    try {
      setDeleteLoading(true);
      await apiService.admin.deleteCategory(categoryBeingDeleted.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryBeingDeleted.id));
      toast.success('Category deleted');
      setDeleteModalOpen(false);
      setCategoryBeingDeleted(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error?.response?.data?.error || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
          <p className="mt-2 text-gray-600">Create, update, and delete product categories</p>
        </div>

        {/* Create form */}
        <form onSubmit={handleCreateCategory} className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">New Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Skin Care"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Parent Category</label>
              <select
                value={newParentId}
                onChange={(e) => setNewParentId(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">None (Parent)</option>
                {parentCategories.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Show in Navigation</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="new-show-in-nav"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={newShowInNav}
                  onChange={(e) => setNewShowInNav(e.target.checked)}
                />
                <label htmlFor="new-show-in-nav" className="text-sm text-gray-700">Visible</label>
              </div>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Sort Order</label>
              <input
                type="number"
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(parseInt(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="sm:col-span-2 flex items-end justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 disabled:opacity-60"
                disabled={creating || !newCategoryName.trim()}
              >
                <Plus className="h-4 w-4" />
                {creating ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </div>
        </form>

        {/* Categories table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Parent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">In Nav</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sort</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No categories found.</td>
                  </tr>
                ) : (
                  sortedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{category.parent_id ? (categoriesById.get(category.parent_id)?.name || '—') : '—'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${category.show_in_nav ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                          {category.show_in_nav ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{category.sort_order ?? 0}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEditModal(category)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(category)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {/* Edit Modal with extra fields */}
        {editModalOpen && categoryBeingEdited && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Category</h3>
                <button onClick={() => { setEditModalOpen(false); setCategoryBeingEdited(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    defaultValue={categoryBeingEdited.name}
                    onChange={(e) => setCategoryBeingEdited((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                  <select
                    value={editParentId}
                    onChange={(e) => setEditParentId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">None (Parent)</option>
                    {parentCategories
                      .filter((p) => p.id !== categoryBeingEdited.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="edit-show-in-nav"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={editShowInNav}
                    onChange={(e) => setEditShowInNav(e.target.checked)}
                  />
                  <label htmlFor="edit-show-in-nav" className="text-sm text-gray-700">Show in Navigation</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                  <input
                    type="number"
                    value={editSortOrder}
                    onChange={(e) => setEditSortOrder(parseInt(e.target.value) || 0)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t px-6 py-4">
                <button
                  onClick={() => { setEditModalOpen(false); setCategoryBeingEdited(null); }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEditedCategory(categoryBeingEdited.name || '')}
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
                  disabled={editLoading || !(categoryBeingEdited.name || '').trim()}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Category"
          description={
            categoryBeingDeleted
              ? `Are you sure you want to delete the category "${categoryBeingDeleted.name}"? This action cannot be undone.`
              : ''
          }
          confirmText="Delete"
          onConfirm={confirmDeleteCategory}
          onClose={() => {
            setDeleteModalOpen(false);
            setCategoryBeingDeleted(null);
          }}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default ManageCategories;


