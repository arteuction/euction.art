import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export async function handler(event) {
  const { email } = JSON.parse(event.body)
  const { error } = await supabase.from('Newsletter_Subscribers').insert([{ email }])
  return {
    statusCode: error ? 400 : 200,
    body: JSON.stringify({ success: !error }),
  }
}
