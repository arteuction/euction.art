export default function ArtistApplication() {
  return (
    <div className="container mx-auto p-6">
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
            sdg_tags: e.target.sdg.value.split(',').map(s => s.trim()),
          }
          const res = await fetch('/.netlify/functions/submit-artist', {
            method: 'POST',
            body: JSON.stringify(formData),
          })
          const data = await res.json()
          alert(data.success ? 'Application submitted!' : 'Error submitting application')
          e.target.reset()
        }}
      >
        <input type="text" name="name" placeholder="Full Name" required className="border px-4 py-2 rounded"/>
        <input type="email" name="email" placeholder="Email" required className="border px-4 py-2 rounded"/>
        <textarea name="bio" placeholder="Short Bio" required className="border px-4 py-2 rounded"/>
        <input type="text" name="portfolio" placeholder="Portfolio URL" required className="border px-4 py-2 rounded"/>
        <input type="text" name="sdg" placeholder="SDG Tags (comma separated)" required className="border px-4 py-2 rounded"/>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Submit Application</button>
      </form>
    </div>
  )
}
