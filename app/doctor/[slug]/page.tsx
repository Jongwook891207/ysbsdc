import { notFound } from "next/navigation";

/**
 * STAGE 1 PLACEHOLDER.
 * TODO(stage 4): add `export async function generateStaticParams()` (SSG
 * over lib/doctors.ts#getAllDoctorSlugs()), full profile layout, and the
 * authored-columns list.
 * TODO(stage 5): add `export async function generateMetadata()` (via
 * lib/metadata.ts#buildDoctorMetadata) and render
 * <JsonLd data={buildPersonJsonLd(doctor)} />.
 * Until generateStaticParams exists, this route falls back to on-demand
 * SSR for every slug — that's the "임시" part to be aware of.
 */
export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  return (
    <div>
      <h1>원장 프로필: {slug}</h1>
    </div>
  );
}
