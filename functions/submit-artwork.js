/**
 * Netlify Function: Submit Artwork
 * Handles artwork submission with image uploads to Supabase Storage
 */

import { createClient } from '@supabase/supabase-js'
import multipart from 'parse-multipart-data'

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

    // Initialize Supabase client with service role key (has elevated permissions)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Parse multipart form data
    const contentType = event.headers['content-type']
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Content-Type must be multipart/form-data'
        })
      }
    }

    // Extract boundary from content-type header
    const boundary = contentType.split('boundary=')[1]
    if (!boundary) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing boundary in multipart form data'
        })
      }
    }

    // Parse the multipart body
    const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary)

    // Extract form fields and files
    const formData = {}
    const files = {
      mainImage: null,
      additionalImages: []
    }

    parts.forEach(part => {
      if (part.filename) {
        // It's a file
        if (part.name === 'main-image') {
          files.mainImage = part
        } else if (part.name === 'additional-images') {
          files.additionalImages.push(part)
        }
      } else {
        // It's a regular field
        formData[part.name] = part.data.toString('utf-8')
      }
    })

    // Validate required fields
    const requiredFields = [
      'artist-name',
      'email',
      'artwork-title',
      'description',
      'medium',
      'year-created',
      'primary-sdg',
      'sdg-connection',
      'reserve-price',
      'artwork-type'
    ]

    const missingFields = requiredFields.filter(field => !formData[field])
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        })
      }
    }

    // Validate main image
    if (!files.mainImage) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Main artwork image is required'
        })
      }
    }

    // Validate image file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff']
    if (!allowedTypes.includes(files.mainImage.type)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Invalid image format. Allowed: JPG, PNG, WEBP, TIFF'
        })
      }
    }

    // Validate image size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (files.mainImage.data.length > maxSize) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Main image must be under 10MB'
        })
      }
    }

    // Upload main image to Supabase Storage
    const timestamp = Date.now()
    const sanitizedFilename = files.mainImage.filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
    const mainImagePath = `${timestamp}_${sanitizedFilename}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(mainImagePath, files.mainImage.data, {
        contentType: files.mainImage.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Failed to upload image'
        })
      }
    }

    // Get public URL for main image
    const { data: { publicUrl: mainImageUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(mainImagePath)

    // Upload additional images (if any)
    const additionalImageUrls = []
    for (const file of files.additionalImages) {
      if (!file.data || file.data.length === 0) continue

      // Validate additional image
      if (!allowedTypes.includes(file.type)) continue
      if (file.data.length > maxSize) continue

      const additionalPath = `${timestamp}_additional_${file.filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()}`

      const { data: additionalUpload, error: additionalError } = await supabase.storage
        .from('artworks')
        .upload(additionalPath, file.data, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        })

      if (!additionalError) {
        const { data: { publicUrl } } = supabase.storage
          .from('artworks')
          .getPublicUrl(additionalPath)
        additionalImageUrls.push(publicUrl)
      }
    }

    // Parse secondary SDGs (checkboxes)
    const secondarySDGs = parts
      .filter(part => part.name === 'secondary-sdg')
      .map(part => parseInt(part.data.toString('utf-8')))
      .filter(num => !isNaN(num))

    // Insert artwork into database
    const artworkData = {
      artist_name: formData['artist-name'],
      artist_email: formData['email'],
      artist_bio: formData['artist-bio'] || null,
      phone: formData['phone'] || null,

      title: formData['artwork-title'],
      description: formData['description'],
      medium: formData['medium'],
      year_created: parseInt(formData['year-created']),
      dimensions: formData['dimensions'] || null,
      edition: formData['edition'] || null,

      main_image_url: mainImageUrl,
      additional_images: additionalImageUrls.length > 0 ? additionalImageUrls : null,

      primary_sdg: parseInt(formData['primary-sdg']),
      secondary_sdgs: secondarySDGs.length > 0 ? secondarySDGs : null,
      sdg_connection: formData['sdg-connection'],

      reserve_price: parseFloat(formData['reserve-price']),
      starting_bid: formData['starting-bid'] ? parseFloat(formData['starting-bid']) : null,
      artwork_type: formData['artwork-type'],

      shipping_info: formData['shipping-info'] || null,
      exhibition_history: formData['exhibition-history'] || null,
      certificate_of_authenticity: formData['certificate'] || null,
      additional_notes: formData['additional-notes'] || null,

      status: 'pending'
    }

    const { data: insertedArtwork, error: insertError } = await supabase
      .from('Artworks')
      .insert([artworkData])
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)

      // Clean up uploaded images if database insert fails
      await supabase.storage.from('artworks').remove([mainImagePath])
      if (additionalImageUrls.length > 0) {
        const additionalPaths = additionalImageUrls.map(url =>
          url.split('/artworks/')[1]
        )
        await supabase.storage.from('artworks').remove(additionalPaths)
      }

      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Failed to save artwork submission'
        })
      }
    }

    // Success response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        artwork: {
          id: insertedArtwork.id,
          title: insertedArtwork.title,
          status: insertedArtwork.status
        },
        message: 'Artwork submitted successfully! Our curation team will review it within 3-5 business days.'
      })
    }

  } catch (error) {
    console.error('Error in submit-artwork function:', error)
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
