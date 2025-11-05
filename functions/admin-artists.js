/**
 * Netlify Function: Admin Artists Management
 * Handles admin operations for artists
 */

import { createClient } from '@supabase/supabase-js'

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    }
  }

  try {
    // Check environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase credentials not configured')
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error'
        })
      }
    }

    // Initialize Supabase with service role key
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { action, ...params } = JSON.parse(event.body || '{}')

    switch (action) {
      case 'list':
        return await listArtists(supabase, params)

      case 'get':
        return await getArtist(supabase, params)

      case 'approve':
        return await approveArtist(supabase, params)

      case 'reject':
        return await rejectArtist(supabase, params)

      case 'stats':
        return await getArtistStats(supabase)

      default:
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: false,
            error: 'Invalid action'
          })
        }
    }
  } catch (error) {
    console.error('Error in admin-artists function:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    }
  }
}

/**
 * List artists with filters
 */
async function listArtists(supabase, params) {
  const { status, search, limit = 50, offset = 0 } = params

  let query = supabase
    .from('Artists')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,artist_name.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error listing artists:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch artists'
      })
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artists: data || [],
      count: count || 0
    })
  }
}

/**
 * Get single artist
 */
async function getArtist(supabase, params) {
  const { id } = params

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artist ID is required'
      })
    }
  }

  const { data, error } = await supabase
    .from('Artists')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching artist:', error)
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artist not found'
      })
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artist: data
    })
  }
}

/**
 * Approve artist
 */
async function approveArtist(supabase, params) {
  const { id } = params

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artist ID is required'
      })
    }
  }

  const { data, error } = await supabase
    .from('Artists')
    .update({
      status: 'approved'
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error approving artist:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to approve artist'
      })
    }
  }

  // TODO: Send email notification to artist

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artist: data,
      message: 'Artist approved successfully'
    })
  }
}

/**
 * Reject artist
 */
async function rejectArtist(supabase, params) {
  const { id, reason } = params

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artist ID is required'
      })
    }
  }

  const { data, error } = await supabase
    .from('Artists')
    .update({
      status: 'rejected'
      // Note: Artists table doesn't have rejection_reason field
      // You may want to add it to the schema
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error rejecting artist:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to reject artist'
      })
    }
  }

  // TODO: Send email notification to artist

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artist: data,
      message: 'Artist application rejected'
    })
  }
}

/**
 * Get artist statistics
 */
async function getArtistStats(supabase) {
  // Get total counts by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('Artists')
    .select('status')

  if (statusError) {
    console.error('Error fetching stats:', statusError)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch statistics'
      })
    }
  }

  // Calculate stats
  const stats = {
    total: statusCounts.length,
    pending: statusCounts.filter(a => a.status === 'pending').length,
    approved: statusCounts.filter(a => a.status === 'approved').length,
    rejected: statusCounts.filter(a => a.status === 'rejected').length
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      stats
    })
  }
}
