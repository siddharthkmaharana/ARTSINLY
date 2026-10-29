import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2, Compass, Award, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArticleJsonLd } from "@/components/seo/JsonLd";

interface BlogPostItem {
  id: string;
  slug: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedDate: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  content: string[];
}

const BLOG_POSTS: Record<string, BlogPostItem> = {
  "the-sacred-smoke-kilns-of-molela": {
    id: "blog-1",
    slug: "the-sacred-smoke-kilns-of-molela",
    category: "CRAFT HERITAGE",
    readTime: "6 MIN READ",
    title: "The Sacred Smoke Kilns of Molela",
    excerpt:
      "On the banks of river Banas, clay is venerated as divine mother earth. Explore how terracotta votive plaques preserve 900 years of tribal lore.",
    imageUrl:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&fm=webp&w=1200&q=85",
    publishedDate: "October 2026",
    authorName: "Pandit Devendra Prajapati",
    authorRole: "National Awardee & 7th Generation Molela Terracotta Master",
    authorBio:
      "Devendra Prajapati is a celebrated Shilp Guru and 7th-generation lineage master of Molela terracotta votive plaques on the Banas river. Over four decades, he has preserved ritual hand-pinched hollow relief methods and primitive reduction smoke firing.",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&fm=webp&w=300&q=80",
    content: [
      "In the tranquil village of Molela on the banks of the sacred Banas river in southern Rajasthan, clay is not seen merely as raw material—it is revered as divine mother earth (Mati Maya). For over nine centuries, the Prajapati artisans have shaped hollow-relief votive plaques honoring tribal deities, ancestor spirits, and the warrior lord Devnarayan.",
      "The process begins with mixing rich alluvial silt gathered during auspicious seasons with donkey dung and sun-dried husk to achieve optimal elasticity and porous resilience. Without mechanical wheels or molds, the master artisan pinches and hollows the clay using only fingertips and a flat wooden blade.",
      "Firing occurs in primitive ground kilns sheltered beneath terracotta shards, cow dung cakes, and wild khejri branches. The resulting reduction smoke leaves deep soot gradients across the terracotta surface, producing an authentic earthy patina that modern industrial kilns can never replicate.",
      "Today, each plaque stands as an unbroken bridge between ancient tribal shamanism and architectural terracotta sculpture, celebrated in museum collections and sacred shrines across the subcontinent.",
    ],
  },
  "ajrakh-printing-in-synchrony-with-the-stars": {
    id: "blog-2",
    slug: "ajrakh-printing-in-synchrony-with-the-stars",
    category: "TEXTILE ALCHEMY",
    readTime: "8 MIN READ",
    title: "Ajrakh: Printing In Synchrony with the Stars",
    excerpt:
      "Derived from \"Azrak\", meaning blue in Arabic, Ajrakh is not merely textile printing—it is astronomy, river biochemistry, and devotional discipline.",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&fm=webp&w=1200&q=85",
    publishedDate: "September 2026",
    authorName: "Ismail Mohammed Khatri",
    authorRole: "UNESCO Seal of Excellence & Master Ajrakh Artisan",
    authorBio:
      "Descended from the generational Khatri clan of Dhamadka, Kutch, Ismail is internationally recognized for reviving natural madder and desert indigo resist printing. His practice rigorously maintains 16 stages of river biochemistry.",
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&fm=webp&w=300&q=80",
    content: [
      "The word 'Ajrakh' finds its origin in 'Azrak', the Arabic word for celestial blue, mirroring the midnight skies of the Thar desert. Across sixteen distinct stages of washing, scouring, printing, and resist-immersion, the master printers of Kutch orchestrate a delicate alchemy between river waters, desert minerals, and celestial cycles.",
      "Unlike modern machine screen printing where pigment sits on the fiber surface, Ajrakh prints penetrate deep into the yarn from both sides. Intricate hand-carved teak wood blocks apply gaj (lime and gum resist), followed by baths of fermented harde (myrobalan) and rusted iron-jaggery liquor.",
      "The vibrant red is coaxed from crushed madder root (Rubia cordifolia) heated over tamarind-wood fires, while the intense royal indigo is born in deep clay fermentation vats tended like living sourdough cultures for weeks.",
      "The resulting star, cosmos, and clover geometric motifs are designed to align with astrological directions, creating a wearable sanctuary of geometric order, breathable cooling, and ancestral protection.",
    ],
  },
  "why-imperfection-is-the-true-mark-of-heritage": {
    id: "blog-3",
    slug: "why-imperfection-is-the-true-mark-of-heritage",
    category: "DESIGN PHILOSOPHY",
    readTime: "5 MIN READ",
    title: "Why Imperfection is the True Mark of Heritage",
    excerpt:
      "In an era of synthetic 3D printing, the uneven kiss of firewood kiln smoke and the tremor of an artisan's hand is the ultimate luxury.",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&fm=webp&w=1200&q=85",
    publishedDate: "October 2026",
    authorName: "Dr. Radhika Sen",
    authorRole: "Senior Textile Conservator & Curatorial Director",
    authorBio:
      "Dr. Radhika Sen holds a PhD in South Asian Material Culture from Oxford. With 20 years of fieldwork alongside rural craft cooperatives, she oversees curatorial ethics, GI authentication, and fair-trade standards at ARTSINLY.",
    authorAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&fm=webp&w=300&q=80",
    content: [
      "We live in an age of frictionless industrial perfection. Injection-molded polymers, computer-numerically-controlled stone cutting, and synthetic 3D printing have rendered geometric symmetry ubiquitous and cheap. Yet, in this sea of sterile flawless uniformity, the human spirit longs for character, soul, and evidence of a living human breath.",
      "In traditional Indian generational crafts, what industrial mass production mislabels as 'defects' are cherished as the fingerprint of existence: the subtle asymmetry of a wheel-thrown terracotta rim, the slight bleed of vegetable indigo where a wooden block hesitated for a heartbeat, the flame-licked oxidation mark across low-fired earthenware.",
      "These irregularities tell an honest, unvarnished story of wind speed, monsoon humidity, kiln embers, and the artisan's mood. They prove that an object was not extruded by an uncaring machine in milliseconds, but nurtured through days of patient, human devotion.",
      "To live with handmade craft is to welcome authentic wabi-sabi elegance into contemporary architectural spaces—reminding us that true luxury is not mechanical perfection, but emotional resonance and ancestral human touch.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS[resolvedParams.slug];

  if (!post) {
    return {
      title: "Field Notes & Essays | ARTSINLY",
    };
  }

  const title = `${post.title} | ARTSINLY Craft Field Notes`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${post.slug}`,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = BLOG_POSTS[resolvedParams.slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-[#FAF7F2] min-h-screen py-6 sm:py-10">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        imageUrl={post.imageUrl}
        datePublished={post.publishedDate}
        authorName={post.authorName}
        authorBio={post.authorBio}
        authorJobTitle={post.authorRole}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Accessible Breadcrumbs with Schema.org JSON-LD */}
        <Breadcrumbs
          items={[
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
          className="mb-4"
        />

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C877E] hover:text-[#1E1E1C] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stories Behind The Kilns</span>
        </Link>

        {/* Single H1 Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C] uppercase tracking-widest">
            <span>{post.category}</span>
            <span className="text-[#8C877E]">•</span>
            <span className="text-[#8C877E]">{post.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1E1E1C] leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EAE5DD] text-xs text-[#8C877E]">
            <span className="font-medium text-[#3A3834]">{post.authorName} • {post.authorRole}</span>
            <span>{post.publishedDate}</span>
          </div>
        </header>

        {/* Featured Image with explicit dimensions to eliminate CLS */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#ECE6DC] mb-10 shadow-xs border border-[#E3DDD1]">
          <img
            src={post.imageUrl}
            alt={`${post.title} — Traditional handcrafted artisanal process`}
            width={1200}
            height={675}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Editorial Body */}
        <div className="space-y-6 text-[#2E2C28] text-base sm:text-lg leading-relaxed font-light">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Author Bio Card (Human Curator / Master Artisan Bio) */}
        <div className="mt-12 p-6 sm:p-7 rounded-xl bg-[#F0EBE1] border border-[#DDD5C8] flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-2xs">
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            width={80}
            height={80}
            loading="lazy"
            decoding="async"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border-2 border-white shadow-2xs"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider">
                CONTRIBUTING GUILD AUTHOR
              </span>
              <span className="text-[#8C877E]">•</span>
              <span className="text-xs text-[#6B665E] font-medium">{post.authorRole}</span>
            </div>
            <h3 className="font-serif text-lg text-[#1E1E1C] font-medium">
              {post.authorName}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#555049] leading-relaxed">
              {post.authorBio}
            </p>
          </div>
        </div>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-[#E5DFD4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[#8C877E] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#52644B]" />
            <span>Curated by ARTSINLY Editorial Pavilion • Registered Fair Trade Platform</span>
          </div>

          <Link
            href="/catalog"
            className="px-5 py-2.5 bg-[#1E1E1C] text-white rounded-md text-xs font-medium hover:bg-[#383734] transition-colors"
          >
            Explore Related Crafts
          </Link>
        </footer>
      </div>
    </article>
  );
}
