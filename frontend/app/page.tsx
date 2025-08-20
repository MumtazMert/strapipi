"use client"; // This is a client-side component

// Import React hooks and Image component
import { useEffect, useState } from "react";
import Image from "next/image";

// Define Article interface to match Strapi structure
export interface Article {
  id: string;
  title: string;
  description: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cover: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
  publishedAt: string;
}

// Define Strapi URL
const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'https://popular-champion-998b7da02f.strapiapp.com';

export default function Home() {
  // Define articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles
  const getArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching from:', `${STRAPI_URL}/api/articles?populate=*`);
      const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Handle both cases: data.data (v4) and data (v3) response formats
      const articlesData = data.data || data || [];
      setArticles(Array.isArray(articlesData) ? articlesData : []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      setArticles([]); // Set empty array on error to prevent map error
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Fetch articles on component mount
  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Next.js and Strapi Integration</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-6">Articles</h2>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg">Loading articles...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No articles found. Create some articles in your Strapi admin panel!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              {article.cover && article.cover.url ? (
                <Image
                  className="w-full h-48 object-cover"
                  src={STRAPI_URL + article.cover.url}
                  alt={article.title}
                  width={400}
                  height={192}
                  priority
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <p className="text-sm text-gray-500">
                  Published: {formatDate(article.publishedAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}