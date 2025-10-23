import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export async function handler(event) {
  const { name, email, bio, portfolio_url, sdg_tags } = JSON.parse(event.body)
  const { error } = await supabase.from('Artists').insert([{ name, email, bio, portfolio_url, sdg_tags }])
  return {
    statusCode: error ? 400 : 200,
    body: JSON.stringify({ success: !error, error }),
  }
}
