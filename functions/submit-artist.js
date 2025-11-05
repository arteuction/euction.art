import { createClient } from '@supabase/supabase-js'

export async function handler(event) {
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

    const {
      name,
      email,
      bio,
      portfolio_url,
      pdf_url,
      sdg_tags,
      location,
      artist_name,
      art_category,
      facebook_url,
      instagram_url,
      youtube_url,
      tiktok_url,
      pinterest_url,
      linkedin_url
    } = JSON.parse(event.body)

    // Validate required fields
    if (!name || !email || !bio || !portfolio_url || !sdg_tags) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }),
      }
    }

    // Insert artist application
    const { error } = await supabase.from('Artists').insert([{
      name,
      email,
      bio,
      portfolio_url,
      pdf_url: pdf_url || null,
      sdg_tags,
      location: location || null,
      artist_name: artist_name || null,
      art_category: art_category || null,
      facebook_url: facebook_url || null,
      instagram_url: instagram_url || null,
      youtube_url: youtube_url || null,
      tiktok_url: tiktok_url || null,
      pinterest_url: pinterest_url || null,
      linkedin_url: linkedin_url || null,
      status: 'pending'
    }])

    if (error) {
      console.error('Supabase error:', error)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: error.message || 'Failed to submit application'
        }),
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('Error in submit-artist function:', err)
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
