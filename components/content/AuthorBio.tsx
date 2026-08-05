import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { AuthorFrontmatter } from "@/lib/content/types";

/**
 * Reused for both the article's author and its reviewer (ArticleHeader
 * already collapses the reviewer block when reviewer === author, so this
 * component itself never needs to know which role it's rendering).
 */
export function AuthorBio({ author, heading }: { author: AuthorFrontmatter; heading: string }) {
  return (
    <section className="column-author-bio">
      <h2>{heading}</h2>
      <div className="column-author-bio-card">
        <ImageWithFallback
          src={author.profileImage}
          alt={author.name}
          width={96}
          height={96}
          placeholderText={author.name}
          className="column-author-bio-image"
        />
        <div className="column-author-bio-content">
          <p className="column-author-bio-name">{author.name}</p>
          <p className="column-author-bio-job-title">{author.jobTitle}</p>
          <p className="column-author-bio-text">{author.bio}</p>
          {author.specialties.length > 0 && (
            <ul className="column-author-bio-specialties">
              {author.specialties.map((specialty) => (
                <li key={specialty}>{specialty}</li>
              ))}
            </ul>
          )}
          <Link href={`/doctor/${author.slug}`} className="column-author-bio-link">
            {author.name} 원장 소개 더 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
