import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { fetchPosts } from "@/lib/postApi";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Blog" }]} />
      <h1 className="font-heading text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Consejos de cuidado y bienestar para tu mascota.
      </p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay artículos publicados.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="border rounded-lg overflow-hidden group"
            >
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.coverImageAlt || post.title}
                  loading="lazy"
                  className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="p-4">
                <h2 className="font-heading font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
