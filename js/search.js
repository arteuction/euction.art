/**
 * Search Functionality using Supabase Full-Text Search
 */

import { config } from './config.js';

let supabase = null;

async function initSupabase() {
  if (supabase) return supabase;
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(script);
    await new Promise((resolve) => { script.onload = resolve; });
  }
  supabase = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);
  return supabase;
}

// Search artworks
export async function searchArtworks(query, filters = {}) {
  try {
    const client = await initSupabase();
    let queryBuilder = client
      .from('Artworks')
      .select('*')
      .eq('status', 'approved');

    // Text search
    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,artist_name.ilike.%${query}%`);
    }

    // Filter by SDG
    if (filters.sdg) {
      queryBuilder = queryBuilder.eq('primary_sdg', filters.sdg);
    }

    // Filter by medium
    if (filters.medium) {
      queryBuilder = queryBuilder.eq('medium', filters.medium);
    }

    // Filter by price range
    if (filters.minPrice) {
      queryBuilder = queryBuilder.gte('reserve_price', filters.minPrice);
    }
    if (filters.maxPrice) {
      queryBuilder = queryBuilder.lte('reserve_price', filters.maxPrice);
    }

    // Sort
    const sortBy = filters.sortBy || 'submitted_at';
    const sortOrder = filters.sortOrder || 'desc';
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    // Limit results
    queryBuilder = queryBuilder.limit(filters.limit || 50);

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Search error:', error);
    return { data: null, error: error.message };
  }
}

// Search artists
export async function searchArtists(query) {
  try {
    const client = await initSupabase();
    const { data, error } = await client
      .from('Artists')
      .select('*')
      .eq('status', 'approved')
      .or(`name.ilike.%${query}%,artist_name.ilike.%${query}%,bio.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Artist search error:', error);
    return { data: null, error: error.message };
  }
}

// Search NGOs
export async function searchNGOs(query) {
  try {
    const client = await initSupabase();
    const { data, error } = await client
      .from('NGOs')
      .select('*')
      .eq('status', 'verified')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('NGO search error:', error);
    return { data: null, error: error.message };
  }
}

// Get artwork suggestions (autocomplete)
export async function getArtworkSuggestions(query) {
  try {
    const client = await initSupabase();
    const { data, error } = await client
      .from('Artworks')
      .select('id, title, artist_name, main_image_url')
      .eq('status', 'approved')
      .ilike('title', `%${query}%`)
      .limit(5);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Suggestions error:', error);
    return [];
  }
}

// Advanced search with multiple criteria
export async function advancedSearch(criteria) {
  const {
    query,
    sdgs = [],
    mediums = [],
    artworkTypes = [],
    priceRange = {},
    yearRange = {},
    sortBy = 'submitted_at',
    sortOrder = 'desc'
  } = criteria;

  try {
    const client = await initSupabase();
    let queryBuilder = client
      .from('Artworks')
      .select('*')
      .eq('status', 'approved');

    // Text search across multiple fields
    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,artist_name.ilike.%${query}%,sdg_connection.ilike.%${query}%`);
    }

    // SDG filters
    if (sdgs.length > 0) {
      queryBuilder = queryBuilder.in('primary_sdg', sdgs);
    }

    // Medium filters
    if (mediums.length > 0) {
      queryBuilder = queryBuilder.in('medium', mediums);
    }

    // Artwork type filters
    if (artworkTypes.length > 0) {
      queryBuilder = queryBuilder.in('artwork_type', artworkTypes);
    }

    // Price range
    if (priceRange.min) {
      queryBuilder = queryBuilder.gte('reserve_price', priceRange.min);
    }
    if (priceRange.max) {
      queryBuilder = queryBuilder.lte('reserve_price', priceRange.max);
    }

    // Year range
    if (yearRange.min) {
      queryBuilder = queryBuilder.gte('year_created', yearRange.min);
    }
    if (yearRange.max) {
      queryBuilder = queryBuilder.lte('year_created', yearRange.max);
    }

    // Sort and limit
    queryBuilder = queryBuilder
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .limit(50);

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Advanced search error:', error);
    return { data: null, error: error.message };
  }
}

export default {
  searchArtworks,
  searchArtists,
  searchNGOs,
  getArtworkSuggestions,
  advancedSearch
};
