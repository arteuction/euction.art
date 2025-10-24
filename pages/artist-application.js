export default function ArtistApplication() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Artist Application</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={async e => {
          e.preventDefault()
          const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            bio: e.target.bio.value,
            portfolio_url: e.target.portfolio.value,
            pdf_url: e.target.pdf_url.value || null,
            sdg_tags: e.target.sdg.value.split(',').map(s => s.trim()).filter(s => s),
            facebook_url: e.target.facebook_url.value || null,
            instagram_url: e.target.instagram_url.value || null,
            youtube_url: e.target.youtube_url.value || null,
            tiktok_url: e.target.tiktok_url.value || null,
            pinterest_url: e.target.pinterest_url.value || null,
            linkedin_url: e.target.linkedin_url.value || null,
          }
          const res = await fetch('/.netlify/functions/submit-artist', {
            method: 'POST',
            body: JSON.stringify(formData),
          })
          const data = await res.json()
          alert(data.success ? 'Application submitted!' : 'Error submitting application')
          if (data.success) e.target.reset()
        }}
      >
        <h2 className="text-xl font-semibold mt-4">Basic Information</h2>
        <input type="text" name="name" placeholder="Full Name" required className="border px-4 py-2 rounded"/>
        <input type="email" name="email" placeholder="Email" required className="border px-4 py-2 rounded"/>
        <textarea name="bio" placeholder="Short Bio" required className="border px-4 py-2 rounded h-24"/>

        <h2 className="text-xl font-semibold mt-4">Portfolio</h2>
        <input type="url" name="portfolio" placeholder="Portfolio URL (website or cloud drive)" required className="border px-4 py-2 rounded"/>
        <input type="url" name="pdf_url" placeholder="PDF Portfolio URL (optional)" className="border px-4 py-2 rounded"/>

        <h2 className="text-xl font-semibold mt-4">SDG Focus</h2>
        <input type="text" name="sdg" placeholder="SDG Tags (comma separated, e.g., SDG 4, SDG 5, SDG 13)" required className="border px-4 py-2 rounded"/>

        <h2 className="text-xl font-semibold mt-4">Social Media (Optional)</h2>
        <input type="url" name="facebook_url" placeholder="Facebook URL" className="border px-4 py-2 rounded"/>
        <input type="url" name="instagram_url" placeholder="Instagram URL" className="border px-4 py-2 rounded"/>
        <input type="url" name="youtube_url" placeholder="YouTube URL" className="border px-4 py-2 rounded"/>
        <input type="url" name="tiktok_url" placeholder="TikTok URL" className="border px-4 py-2 rounded"/>
        <input type="url" name="pinterest_url" placeholder="Pinterest URL" className="border px-4 py-2 rounded"/>
        <input type="url" name="linkedin_url" placeholder="LinkedIn URL" className="border px-4 py-2 rounded"/>

        <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded font-semibold mt-4 hover:bg-green-700">
          Submit Application
        </button>
      </form>
    </div>
  )
}
