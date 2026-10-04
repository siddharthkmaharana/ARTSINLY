import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2, Compass } from "lucide-react";

interface BlogPostItem {
  id: string;
  slug: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedDate: string;
  author: string;
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
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85",
    publishedDate: "October 2026",
    author: "Curatorial Field Notes • Nathdwara & Molela Guild",
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
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
    publishedDate: "September 2026",
    author: "Editorial Pavilion • Dhamadka & Ajrakhpur Guilds",
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
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
    publishedDate: "October 2026",
    author: "Design Philosophy • Curatorial Pavilion",
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
    <article className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C877E] hover:text-[#1E1E1C] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stories Behind The Kilns</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C] uppercase tracking-widest">
            <span>{post.category}</span>
            <span className="text-[#8C877E]">•</span>
            <span className="text-[#8C877E]">{post.readTime}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1E1E1C] leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EAE5DD] text-xs text-[#8C877E]">
            <span>{post.author}</span>
            <span>{post.publishedDate}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#ECE6DC] mb-10 shadow-xs border border-[#E3DDD1]">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Editorial Body */}
        <div className="space-y-6 text-[#2E2C28] text-base sm:text-lg leading-relaxed font-light">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Post Footer */}
        <div className="mt-14 pt-8 border-t border-[#E5DFD4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[#8C877E]">
            Curated by ARTSINLY Editorial Pavilion • Registered Fair Trade Platform
          </div>

          <Link
            href="/explore"
            className="px-5 py-2.5 bg-[#1E1E1C] text-white rounded-md text-xs font-medium hover:bg-[#383734] transition-colors"
          >
            Explore Related Crafts
          </Link>
        </div>
      </div>
    </article>
  );
}
