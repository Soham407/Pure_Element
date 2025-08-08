import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(
            `id,
             name,
             sort_order,
             children:categories(id,name,sort_order)`
          )
          .is('parent_id', null)
          .eq('show_in_nav', true)
          .order('sort_order')
          .order('sort_order', { foreignTable: 'children' });

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
