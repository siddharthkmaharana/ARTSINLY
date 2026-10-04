"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X, Clock, Calendar, BookOpen, Share2 } from "lucide-react";

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

const BLOG_POSTS: BlogPostItem[] = [
  {
    id: "blog-1",
    slug: "the-sacred-smoke-kilns-of-molela",
    category: "CRAFT HERITAGE",
    readTime: "6 MIN READ",
    title: "The Sacred Smoke Kilns of Molela",
    excerpt:
      "On the banks of river Banas, clay is venerated as divine mother earth. Explore how terracotta votive plaques preserve 900 years of tribal lore.",
    imageUrl:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=85",
    publishedDate: "October 2026",
    author: "Curatorial Field Notes • Nathdwara & Molela Guild",
    content: [
      "In the tranquil village of Molela on the banks of the sacred Banas river in southern Rajasthan, clay is not seen merely as raw material—it is revered as divine mother earth (Mati Maya). For over nine centuries, the Prajapati artisans have shaped hollow-relief votive plaques honoring tribal deities, ancestor spirits, and the warrior lord Devnarayan.",
      "The process begins with mixing rich alluvial silt gathered during auspicious seasons with donkey dung and sun-dried husk to achieve optimal elasticity and porous resilience. Without mechanical wheels or molds, the master artisan pinches and hollows the clay using only fingertips and a flat wooden blade.",
      "Firing occurs in primitive ground kilns sheltered beneath terracotta shards, cow dung cakes, and wild khejri branches. The resulting reduction smoke leaves deep soot gradients across the terracotta surface, producing an authentic earthy patina that modern industrial kilns can never replicate.",
      "Today, each plaque stands as an unbroken bridge between ancient tribal shamanism and architectural terracotta sculpture, celebrated in museum collections and sacred shrines across the subcontinent.",
    ],
  },
  {
    id: "blog-2",
    slug: "ajrakh-printing-in-synchrony-with-the-stars",
    category: "TEXTILE ALCHEMY",
    readTime: "8 MIN READ",
    title: "Ajrakh: Printing In Synchrony with the Stars",
    excerpt:
      "Derived from \"Azrak\", meaning blue in Arabic, Ajrakh is not merely textile printing—it is astronomy, river biochemistry, and devotional discipline.",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
    publishedDate: "September 2026",
    author: "Editorial Pavilion • Dhamadka & Ajrakhpur Guilds",
    content: [
      "The word 'Ajrakh' finds its origin in 'Azrak', the Arabic word for celestial blue, mirroring the midnight skies of the Thar desert. Across sixteen distinct stages of washing, scouring, printing, and resist-immersion, the master printers of Kutch orchestrate a delicate alchemy between river waters, desert minerals, and celestial cycles.",
      "Unlike modern machine screen printing where pigment sits on the fiber surface, Ajrakh prints penetrate deep into the yarn from both sides. Intricate hand-carved teak wood blocks apply gaj (lime and gum resist), followed by baths of fermented harde (myrobalan) and rusted iron-jaggery liquor.",
      "The vibrant red is coaxed from crushed madder root (Rubia cordifolia) heated over tamarind-wood fires, while the intense royal indigo is born in deep clay fermentation vats tended like living sourdough cultures for weeks.",
      "The resulting star, cosmos, and clover geometric motifs are designed to align with astrological directions, creating a wearable sanctuary of geometric order, breathable cooling, and ancestral protection.",
    ],
  },
  {
    id: "blog-3",
    slug: "why-imperfection-is-the-true-mark-of-heritage",
    category: "DESIGN PHILOSOPHY",
    readTime: "5 MIN READ",
    title: "Why Imperfection is the True Mark of Heritage",
    excerpt:
      "In an era of synthetic 3D printing, the uneven kiss of firewood kiln smoke and the tremor of an artisan's hand is the ultimate luxury.",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85",
    publishedDate: "October 2026",
    author: "Design Philosophy • Curatorial Pavilion",
    content: [
      "We live in an age of frictionless industrial perfection. Injection-molded polymers, computer-numerically-controlled stone cutting, and synthetic 3D printing have rendered geometric symmetry ubiquitous and cheap. Yet, in this sea of sterile flawless uniformity, the human spirit longs for character, soul, and evidence of a living human breath.",
      "In traditional Indian generational crafts, what industrial mass production mislabels as 'defects' are cherished as the fingerprint of existence: the subtle asymmetry of a wheel-thrown terracotta rim, the slight bleed of vegetable indigo where a wooden block hesitated for a heartbeat, the flame-licked oxidation mark across low-fired earthenware.",
      "These irregularities tell an honest, unvarnished story of wind speed, monsoon humidity, kiln embers, and the artisan's mood. They prove that an object was not extruded by an uncaring machine in milliseconds, but nurtured through days of patient, human devotion.",
      "To live with handmade craft is to welcome authentic wabi-sabi elegance into contemporary architectural spaces—reminding us that true luxury is not mechanical perfection, but emotional resonance and ancestral human touch.",
    ],
  },
];

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line from screenshot */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/explore" className="hover:text-[#1E1E1C] transition-colors">
            Explore
          </Link>
          <span>•</span>
          <span className="hover:text-[#1E1E1C] transition-colors cursor-pointer">
            Vases
          </span>
          <span>•</span>
          <span className="text-[#6B665E] truncate">
            Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern
          </span>
        </nav>

        {/* Section Header - Left Aligned exactly matching uploaded screenshot */}
        <div className="max-w-2xl mb-9">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-2">
            DISPATCHES & ESSAYS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1E1E1C] tracking-tight leading-tight mb-2.5">
            Stories Behind The Kilns
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-xl">
            Curatorial field notes documenting the sacred geometry, earth pigments, and oral poetry of rural guild masters.
          </p>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-20">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-[#F4EFE6]/60 border border-[#E3DDD1] rounded-2xl p-3.5 sm:p-4 hover:shadow-md hover:border-[#D5CFC5] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Article Cover Image */}
                <div
                  onClick={() => setSelectedPost(post)}
                  className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#ECE6DC] mb-4 cursor-pointer"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Category & Read Time Row */}
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] tracking-wider mb-2">
                  <span className="text-[#8C877E] font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-[#A8A29E] tracking-wider uppercase">
                    {post.readTime}
                  </span>
                </div>

                {/* Headline */}
                <h3
                  onClick={() => setSelectedPost(post)}
                  className="font-serif text-lg sm:text-[19px] font-medium text-[#1E1E1C] leading-snug mb-2 group-hover:text-[#C2410C] transition-colors cursor-pointer"
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-[12.5px] text-[#6E6A62] leading-relaxed mb-6 font-normal">
                  {post.excerpt}
                </p>
              </div>

              {/* Action Link Row */}
              <div className="pt-3.5 border-t border-[#E5DFD4] mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E1E1C] group-hover:text-[#C2410C] transition-colors cursor-pointer"
                >
                  <span>Read Essay</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reader Modal for complete reading experience without page reload */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1C]/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8E1D5] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-[#8C877E] uppercase tracking-wider font-semibold">
                <span className="text-[#C2410C]">{selectedPost.category}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full hover:bg-[#EAE4D8] text-[#555] transition-colors"
                aria-label="Close reading view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#ECE6DC]">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1E1E1C] leading-tight mb-2">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#8C877E]">
                  <span>{selectedPost.author}</span>
                  <span>•</span>
                  <span>{selectedPost.publishedDate}</span>
                </div>
              </div>

              <div className="border-t border-[#EAE4D8] pt-6 space-y-4 text-sm sm:text-[15px] text-[#3D3A35] leading-relaxed font-light">
                {selectedPost.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="border-t border-[#EAE4D8] pt-6 flex items-center justify-between">
                <div className="text-xs text-[#8C877E]">
                  Published by ARTSINLY Editorial Pavilion
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-[#1E1E1C] text-white rounded-md text-xs font-medium hover:bg-[#383734] transition-colors"
                >
                  Close Essay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
