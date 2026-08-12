import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ColumnCard } from "@/components/cards/ColumnCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { authorSource } from "@/lib/content/sources/authors";
import { columnSource } from "@/lib/content/sources/columns";
import { buildGraph, buildPersonJsonLd, buildBreadcrumbJsonLd } from "@/lib/jsonld";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

/**
 * Stage 5-1: the real author profile page — the canonical URL the whole
 * JSON-LD architecture has pointed `Person`/`worksFor`/`author` references
 * at since stage 3-1 (`${SITE_URL}/doctor/{slug}#person`), previously a
 * stage-1 placeholder (`<h1>원장 프로필: {slug}</h1>`, no metadata, no
 * generateStaticParams). Distinct from `/doctor` (the "대표원장 스토리"
 * brand-narrative page) — this is the structured, source-of-truth profile
 * driven by `content/authors/*.mdx`, not a duplicate of that page.
 */
export async function generateStaticParams() {
  return authorSource.getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = authorSource.getBySlug(slug);
  if (!author) return {};

  const { frontmatter } = author;
  const title = `${frontmatter.name} ${frontmatter.jobTitle}`;
  const canonicalUrl = absoluteUrl(`/doctor/${frontmatter.slug}`);

  return {
    title,
    description: frontmatter.bio,
    alternates: {
      canonical: `/doctor/${frontmatter.slug}`,
    },
    robots: {
      index: frontmatter.active,
      follow: true,
    },
    openGraph: {
      type: "profile",
      siteName: SITE_NAME,
      title,
      description: frontmatter.bio,
      url: canonicalUrl,
      locale: "ko_KR",
      images: [{ url: frontmatter.profileImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: frontmatter.bio,
      images: [frontmatter.profileImage],
    },
  };
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = authorSource.getBySlug(slug);
  if (!author || !author.frontmatter.active) notFound();

  const { frontmatter } = author;
  const canonicalUrl = absoluteUrl(`/doctor/${frontmatter.slug}`);
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "대표원장 스토리", href: "/doctor" },
    { label: frontmatter.name, href: `/doctor/${frontmatter.slug}` },
  ];
  const authoredColumns = columnSource.getPublished().filter((c) => c.frontmatter.authorSlug === frontmatter.slug);

  const graph = buildGraph([buildPersonJsonLd(frontmatter), buildBreadcrumbJsonLd(breadcrumbItems, canonicalUrl)]);

  return (
    <div className="doctor-profile-page">
      <JsonLd data={graph} />
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />

        <header className="doctor-profile-header">
          <Image
            src={frontmatter.profileImage}
            alt={frontmatter.name}
            width={160}
            height={160}
            className="doctor-profile-image"
          />
          <div>
            <h1>{frontmatter.name}</h1>
            <p className="doctor-profile-job-title">{frontmatter.jobTitle}</p>
            <p className="doctor-profile-bio">{frontmatter.bio}</p>
            <Link href="/doctor" className="doctor-profile-story-link">
              {frontmatter.name} 원장의 진료 철학과 이야기
            </Link>
          </div>
        </header>

        <div className="doctor-profile-details">
          {frontmatter.education.length > 0 && (
            <section>
              <h2>학력 및 자격</h2>
              <ul>
                {frontmatter.education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {frontmatter.career.length > 0 && (
            <section>
              <h2>경력</h2>
              <ul>
                {frontmatter.career.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          {frontmatter.specialties.length > 0 && (
            <section>
              <h2>진료 분야</h2>
              <ul>
                {frontmatter.specialties.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {authoredColumns.length > 0 && (
          <section className="doctor-profile-columns">
            <h2>{frontmatter.name} 원장이 쓴 글</h2>
            <div className="doctor-profile-columns-grid">
              {authoredColumns.map((column) => (
                <ColumnCard key={column.frontmatter.slug} column={column} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
