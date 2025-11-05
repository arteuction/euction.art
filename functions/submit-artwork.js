import { createClient } from '@supabase/supabase-js'

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Check if environment variables are configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Supabase credentials not configured')
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error'
        }),
      }
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

    // Parse and validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Request body is required'
        }),
      }
    }

    const artworkData = JSON.parse(event.body)

    // Validate required fields
    const requiredFields = [
      'artist_name',
      'email',
      'artwork_title',
      'description',
      'medium',
      'year_created',
      'primary_sdg',
      'sdg_connection',
      'reserve_price',
      'artwork_type'
    ]

    const missingFields = requiredFields.filter(field => !artworkData[field])

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        }),
      }
    }

    // Insert artwork submission into database
    const { data, error } = await supabase.from('Artworks').insert([{
      artist_name: artworkData.artist_name,
      artist_email: artworkData.email,
      artist_phone: artworkData.phone || null,
      artist_bio: artworkData.artist_bio || null,
      title: artworkData.artwork_title,
      description: artworkData.description,
      medium: artworkData.medium,
      year_created: parseInt(artworkData.year_created),
      dimensions: artworkData.dimensions || null,
      edition: artworkData.edition || null,
      primary_sdg: parseInt(artworkData.primary_sdg),
      secondary_sdgs: artworkData.secondary_sdgs || [],
      sdg_connection: artworkData.sdg_connection,
      reserve_price: parseFloat(artworkData.reserve_price),
      starting_bid: artworkData.starting_bid ? parseFloat(artworkData.starting_bid) : null,
      artwork_type: artworkData.artwork_type,
      shipping_info: artworkData.shipping_info || null,
      exhibition_history: artworkData.exhibition_history || null,
      certificate: artworkData.certificate || null,
      additional_notes: artworkData.additional_notes || null,
      main_image_url: artworkData.main_image_url,
      additional_image_urls: artworkData.additional_image_urls || [],
      status: 'pending',
      submitted_at: new Date().toISOString()
    }]).select()

    if (error) {
      console.error('Supabase error:', error)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: error.message || 'Failed to submit artwork'
        }),
      }
    }

    // TODO: Trigger email notification to admin and artist
    // This will be implemented when email service is set up

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        artwork_id: data[0].id,
        message: 'Artwork submitted successfully. Our team will review it within 3-5 business days.'
      }),
    }
  } catch (err) {
    console.error('Error in submit-artwork function:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
    }
  }
}
