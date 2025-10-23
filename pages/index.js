import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div className="container mx-auto p-6">
      <section className="text-center my-12">
        <h1 className="text-4xl font-bold">🎨 Art That Changes the World</h1>
        <p className="mt-4 text-lg">
          Where creativity meets sustainability through Web3 art auctions
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/artist-application" className="btn bg-blue-600 text-white px-6 py-3 rounded">
            Become an Artist
          </Link>
          <a href="#newsletter" className="btn bg-green-600 text-white px-6 py-3 rounded">
            Subscribe
          </a>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-4">Featured SDGs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded shadow">SDG 4 – Quality Education</div>
          <div className="p-6 border rounded shadow">SDG 5 – Gender Equality</div>
          <div className="p-6 border rounded shadow">SDG 13 – Climate Action</div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div key={post.id} className="p-4 border rounded shadow">
              <h3 className="font-bold">{post.title}</h3>
              <p className="mt-2 line-clamp-3">{post.content}</p>
              {post.pdf_url && (
                <a href={post.pdf_url} target="_blank" className="text-blue-600 mt-2 inline-block">
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="newsletter" className="my-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Subscribe to Newsletter</h2>
        <form
          className="flex flex-col md:flex-row justify-center gap-2"
          onSubmit={async e => {
            e.preventDefault()
            const email = e.target.email.value
            await fetch('/.netlify/functions/subscribe', {
              method: 'POST',
              body: JSON.stringify({ email }),
            })
            alert('Subscribed!')
            e.target.reset()
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="border px-4 py-2 rounded w-full md:w-80"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  )
}
