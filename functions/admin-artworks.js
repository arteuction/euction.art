/**
 * Netlify Function: Admin Artworks Management
 * Handles admin operations for artworks
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

    // Initialize Supabase with service role key (has elevated permissions)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { action, ...params } = JSON.parse(event.body || '{}')

    switch (action) {
      case 'list':
        return await listArtworks(supabase, params)

      case 'get':
        return await getArtwork(supabase, params)

      case 'approve':
        return await approveArtwork(supabase, params)

      case 'reject':
        return await rejectArtwork(supabase, params)

      case 'stats':
        return await getArtworkStats(supabase)

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
    console.error('Error in admin-artworks function:', error)
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
 * List artworks with filters
 */
async function listArtworks(supabase, params) {
  const { status, sdg, search, limit = 50, offset = 0 } = params

  let query = supabase
    .from('Artworks')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (sdg && sdg !== 'all') {
    query = query.eq('primary_sdg', parseInt(sdg))
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,artist_name.ilike.%${search}%,artist_email.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error listing artworks:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch artworks'
      })
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artworks: data || [],
      count: count || 0
    })
  }
}

/**
 * Get single artwork
 */
async function getArtwork(supabase, params) {
  const { id } = params

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artwork ID is required'
      })
    }
  }

  const { data, error } = await supabase
    .from('Artworks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching artwork:', error)
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artwork not found'
      })
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artwork: data
    })
  }
}

/**
 * Approve artwork
 */
async function approveArtwork(supabase, params) {
  const { id, adminId } = params

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artwork ID is required'
      })
    }
  }

  const { data, error } = await supabase
    .from('Artworks')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: adminId || null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error approving artwork:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to approve artwork'
      })
    }
  }

  // TODO: Send email notification to artist

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artwork: data,
      message: 'Artwork approved successfully'
    })
  }
}

/**
 * Reject artwork
 */
async function rejectArtwork(supabase, params) {
  const { id, reason } = params

  if (!id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Artwork ID is required'
      })
    }
  }

  const { data, error } = await supabase
    .from('Artworks')
    .update({
      status: 'rejected',
      rejection_reason: reason || 'Did not meet quality standards'
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error rejecting artwork:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to reject artwork'
      })
    }
  }

  // TODO: Send email notification to artist

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      artwork: data,
      message: 'Artwork rejected'
    })
  }
}

/**
 * Get artwork statistics
 */
async function getArtworkStats(supabase) {
  // Get total counts by status
  const { data: statusCounts, error: statusError } = await supabase
    .from('Artworks')
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
    rejected: statusCounts.filter(a => a.status === 'rejected').length,
    active: statusCounts.filter(a => a.status === 'active').length,
    sold: statusCounts.filter(a => a.status === 'sold').length
  }

  // Get SDG distribution
  const { data: sdgData } = await supabase
    .from('Artworks')
    .select('primary_sdg')
    .in('status', ['approved', 'active', 'sold'])

  const sdgDistribution = {}
  for (let i = 1; i <= 17; i++) {
    sdgDistribution[i] = sdgData?.filter(a => a.primary_sdg === i).length || 0
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      stats,
      sdgDistribution
    })
  }
}
