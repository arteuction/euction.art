import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export async function handler() {
  const { data, error } = await supabase.from('Posts').select('*').order('published_at', { ascending: false })
  return {
    statusCode: 200,
    body: JSON.stringify(error ? [] : data),
  }
}
