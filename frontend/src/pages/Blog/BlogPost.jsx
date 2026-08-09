import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { fetchPostBySlug } from "@/lib/postApi";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPostBySlug(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return <p className="text-center py-12 text-muted-foreground">Artículo no encontrado.</p>;
  }

  return (
    <article className="max-w-2xl mx-auto">
      <PageBreadcrumb items={[{ label: "Blog", to: "/blog" }, { label: post.title }]} />
      <h1 className="font-heading text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">Por {post.author}</p>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          className="w-full rounded-lg mb-8 aspect-video object-cover"
        />
      )}

      {post.sections?.length > 1 && (
        <nav aria-label="Índice del artículo" className="mb-8 border rounded-lg p-4">
          <p className="font-medium text-sm mb-2">En este artículo</p>
          <ul className="flex flex-col gap-1 text-sm">
            {post.sections.map((section) => (
              <li key={section.anchor}>
                <a href={`#${section.anchor}`} className="text-primary hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="flex flex-col gap-8">
        {post.sections?.map((section) => (
          <section key={section.anchor} id={section.anchor}>
            <h2 className="font-heading text-xl font-semibold mb-2">{section.heading}</h2>
            <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
