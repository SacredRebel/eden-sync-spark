import { createFileRoute } from "@tanstack/react-router"
import { ArrowRight, Camera, CheckCircle2, Mail, MapPin, Phone, Sparkles, Upload } from "lucide-react"
import Navigation from "@/components/navigation"
import PortfolioGrid from "@/components/portfolio-grid"
import ServiceGrid from "@/components/service-grid"
import { contact, edenDifference, services, signatureProjects } from "@/data/services"
import heroAsset from "@/assets/hero.jpg.asset.json"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eden Local Services | Creative Landscape Design & Land Stewardship" },
      { name: "description", content: "Creative landscape design, orchard care, outdoor living spaces, food forests, and regenerative property transformation throughout Ojai and surrounding communities." },
      { property: "og:title", content: "Eden Local Services | Creative Landscape Design & Land Stewardship" },
      { property: "og:description", content: "Creative landscaping, orchard care, food forests, outdoor living spaces, and regenerative land design throughout Ojai and surrounding communities." },
    ],
  }),
  component: EdenLocalServices,
})

const trustPoints = [
  "We do the practical work: cleanup, pruning, planting, irrigation, and property care.",
  "We do the creative work: outdoor living areas, pathways, gathering spaces, and garden features.",
  "We do the regenerative work: healthier soil, productive gardens, water-smart systems, and landscapes that feel alive.",
]

const quoteOptions = [
  "Yard Cleanup & Maintenance",
  "Fruit Tree / Orchard Care",
  "Garden Bed Setup",
  "Food Forest / Edible Landscape",
  "Outdoor Living Space",
  "Property Transformation Consultation",
  "Soil / Compost / Mulch",
  "Irrigation Help",
  "Drought-Tolerant Planting",
  "Creative Outdoor Space",
  "Not Sure Yet",
]

function EdenLocalServices() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen scroll-smooth bg-[#f6f0e2] pb-24 text-[#2f2f25] md:pb-0">
      <header className="relative isolate overflow-hidden bg-[#203f24] text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroAsset.url})` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#17331d]/90 via-[#244d2b]/88 to-[#f6f0e2]" />

        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
          <Navigation onNavigate={scrollToSection} />
        </div>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pb-28 md:pt-20">
          <div className="text-center md:text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#d8e4bd] md:text-sm">
              Creative landscape design & land stewardship
            </p>
            <h1 className="mb-5 text-5xl font-serif leading-[0.95] tracking-tight md:text-7xl">
              Transform Your Outdoor Space
            </h1>
            <p className="mx-auto mb-5 max-w-3xl text-xl leading-relaxed text-[#fff8e9] md:mx-0 md:text-2xl">
              Creative landscaping, orchard care, food forests, outdoor living spaces, and regenerative land design throughout Ojai and surrounding communities.
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-white/85 md:mx-0 md:text-lg">
              Eden Local Services turns outdoor spaces into living environments — more beautiful, more productive, more useful, more natural, and more alive.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row md:justify-start">
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d8a75b] px-7 py-4 text-base font-bold text-[#1d321f] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#c5913f]"
              >
                Request a Quote
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#244d2b]"
              >
                View Projects
              </button>
              <a
                href={contact.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Phone size={19} />
                Call
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/25 bg-white/15 p-4 shadow-2xl backdrop-blur-md">
            <div className="rounded-[1.5rem] bg-[#fffaf0] p-5 text-[#2f2f25]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6b8e23]">Fast overview</p>
                  <h2 className="text-2xl font-serif text-[#2d5e2d]">Choose your transformation</h2>
                </div>
                <Camera className="text-[#6b8e23]" />
              </div>
              <div className="grid gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => scrollToSection(service.id)}
                    className="flex items-center justify-between rounded-2xl border border-[#ded8c5] bg-white px-4 py-3 text-left shadow-sm transition hover:border-[#6b8e23] hover:shadow-md"
                  >
                    <span className="font-semibold text-[#244d2b]">{service.title}</span>
                    <ArrowRight size={16} className="text-[#6b8e23]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </header>

      <main>
        <section className="px-4 py-10 md:py-14">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-3xl border border-[#ded8c5] bg-[#fffaf0] p-5 shadow-sm">
                <CheckCircle2 className="mb-3 text-[#6b8e23]" />
                <p className="leading-7 text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="scroll-mt-20 px-4 py-14 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#6b8e23]">Services</p>
              <h2 className="mb-4 text-4xl font-serif text-[#2d5e2d] md:text-5xl">Services You Can Book</h2>
              <p className="text-lg leading-8 text-gray-700">
                The existing service foundation remains intact: maintenance, orchards, food production, soil, water-smart landscaping, and outdoor living spaces.
              </p>
            </div>
            <ServiceGrid />
          </div>
        </section>

        <section id="difference" className="scroll-mt-20 bg-[#203f24] px-4 py-14 text-white md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#d8a75b]">The Eden Local Difference</p>
              <h2 className="mb-4 text-4xl font-serif md:text-5xl">More than traditional landscaping.</h2>
              <p className="text-lg leading-8 text-white/80">
                Eden Local sits between landscaping company, orchard specialist, garden builder, outdoor living designer, and regenerative land steward.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {edenDifference.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.id} className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-xl backdrop-blur">
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} alt="" className="h-full w-full object-cover opacity-85" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#203f24] to-transparent" />
                      <div className="absolute bottom-4 left-4 rounded-2xl bg-white/15 p-3 backdrop-blur">
                        <Icon size={28} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
                      <p className="mb-5 leading-7 text-white/80">{item.description}</p>
                      <a href="#contact" className="inline-flex min-h-11 items-center rounded-2xl bg-[#d8a75b] px-4 font-bold text-[#1d321f]">
                        Learn More
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="signature" className="scroll-mt-20 px-4 py-14 md:py-20">
          <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#ded8c5] bg-[#fffaf0] p-6 shadow-sm md:p-10">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#6b8e23]">Signature Eden Local Projects</p>
              <h2 className="mb-4 text-4xl font-serif text-[#2d5e2d] md:text-5xl">Premium projects for outdoor spaces that feel alive.</h2>
              <p className="text-lg leading-8 text-gray-700">
                These offerings are inspirational and custom. The techniques stay behind the scenes; the outcome is a healthier, more beautiful, more useful place to live, gather, relax, and grow food.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {signatureProjects.map((project) => (
                <a key={project} href="#contact" className="group flex min-h-16 items-center justify-between rounded-2xl border border-[#d8cfb8] bg-white px-4 py-3 font-bold text-[#244d2b] transition hover:-translate-y-0.5 hover:border-[#6b8e23] hover:shadow-md">
                  <span>{project}</span>
                  <Sparkles size={18} className="text-[#d8a75b] transition group-hover:rotate-12" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="scroll-mt-20 bg-[#ebe4d2] px-4 py-14 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#6b8e23]">Visual proof</p>
              <h2 className="mb-4 text-4xl font-serif text-[#2d5e2d] md:text-5xl">Before & After Projects</h2>
              <p className="text-lg leading-8 text-gray-700">
                Browse by transformation type: cleanup, orchards, food forests and gardens, outdoor living, creative landscape work, and regenerative systems.
              </p>
            </div>
            <PortfolioGrid />
          </div>
        </section>

        <section id="consultation" className="scroll-mt-20 bg-[#203f24] px-4 py-14 text-white md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#d8a75b]">Premium service</p>
              <h2 className="mb-5 text-4xl font-serif md:text-5xl">Property Transformation & Land Vision</h2>
              <p className="text-lg leading-8 text-white/80">
                Walk the property together and develop a clear vision for outdoor living, food production, orchard systems, gathering areas, fire circles, garden placement, water flow, natural pathways, and creative land use.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur md:p-8">
              <h3 className="mb-4 text-2xl font-serif">A consultation can help you decide:</h3>
              <ul className="grid gap-3 text-white/85 sm:grid-cols-2">
                {["Where gardens should go", "How water moves", "Where people gather", "How orchards can improve", "What to phase first", "How the land can become more useful"].map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-[#d8a75b]" /> {item}</li>
                ))}
              </ul>
              <a href="#contact" className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-[#d8a75b] px-5 font-bold text-[#1d321f]">Schedule a Property Consultation</a>
            </div>
          </div>
        </section>

        <section id="testimonials" className="scroll-mt-20 px-4 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#6b8e23]">Client outcomes</p>
              <h2 className="mb-4 text-4xl font-serif text-[#2d5e2d] md:text-5xl">Spaces that become easier to use, maintain, and love.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {["Our yard finally feels usable again — clean, open, and cared for.", "The fruit trees look healthier and the garden has a real plan now.", "The outdoor sitting area changed how we use the property every day."].map((quote) => (
                <blockquote key={quote} className="rounded-[2rem] border border-[#ded8c5] bg-[#fffaf0] p-6 text-lg leading-8 text-gray-700 shadow-sm">"{quote}"<cite className="mt-4 block text-sm font-bold not-italic text-[#6b8e23]">Local client placeholder</cite></blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 bg-white px-4 py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-[#6b8e23]">Quote request</p>
              <h2 className="mb-4 text-4xl font-serif text-[#2d5e2d] md:text-5xl">Request a Free Quote</h2>
              <p className="text-lg leading-8 text-gray-700">Send photos of your yard for a faster estimate.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <form className="grid gap-4 rounded-[2rem] border border-[#ded8c5] bg-[#f6f0e2] p-5 shadow-sm md:grid-cols-2 md:p-7">
                <input className="min-h-12 rounded-2xl border border-[#d8cfb8] px-4" placeholder="Name" />
                <input className="min-h-12 rounded-2xl border border-[#d8cfb8] px-4" placeholder="Phone" />
                <input className="min-h-12 rounded-2xl border border-[#d8cfb8] px-4" placeholder="Email" />
                <select className="min-h-12 rounded-2xl border border-[#d8cfb8] px-4" defaultValue="">
                  <option value="" disabled>Service needed</option>
                  {quoteOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <input className="min-h-12 rounded-2xl border border-[#d8cfb8] px-4 md:col-span-2" placeholder="Property location / city" />
                <textarea className="rounded-2xl border border-[#d8cfb8] px-4 py-3 md:col-span-2" rows={5} placeholder="Short message" />
                <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-dashed border-[#9caf72] bg-white px-4 text-gray-600 md:col-span-2">
                  <Upload size={18} />
                  Upload photos option can connect to your form provider later
                </label>
                <select className="min-h-12 rounded-2xl border border-[#d8cfb8] px-4" defaultValue="">
                  <option value="" disabled>Preferred contact method</option>
                  <option>Call</option>
                  <option>Text</option>
                  <option>Email</option>
                </select>
                <button type="button" className="min-h-12 rounded-2xl bg-[#6b8e23] px-5 font-bold text-white transition hover:bg-[#556b2f]">
                  Request a Free Quote
                </button>
              </form>

              <aside className="rounded-[2rem] bg-[#244d2b] p-6 text-white shadow-lg md:p-8">
                <MapPin className="mb-4 text-[#d8a75b]" />
                <h3 className="mb-3 text-2xl font-serif">Prefer direct contact?</h3>
                <p className="mb-6 leading-8 text-white/80">
                  Call or email, then send photos of the yard, trees, garden beds, irrigation issue, or outdoor space you want help with.
                </p>
                <div className="grid gap-3">
                  <a href={contact.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 font-bold text-[#244d2b]">
                    <Phone size={18} />
                    {contact.phoneLabel}
                  </a>
                  <a href={`mailto:${contact.email}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 font-bold text-white">
                    <Mail size={18} />
                    {contact.email}
                  </a>
                </div>
                <p className="mt-5 text-sm leading-6 text-white/70">
                  Launch note: replace the phone number and connect the form to your preferred form tool before going live.
                </p>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <MobileActionBar onQuote={() => scrollToSection("contact")} />

      <footer className="bg-[#244d2b] px-4 py-8 text-center text-white">
        <p>© Eden Local Services — local landscaping, orchard care, garden support, and property maintenance.</p>
        <p className="mt-2 text-xs text-white/50">
          <a href="/auth" className="hover:text-white/80 hover:underline">Staff sign in</a>
        </p>
      </footer>
    </div>
  )
}

function MobileActionBar({ onQuote }: { onQuote: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/20 bg-[#203f24]/95 p-3 text-white shadow-2xl backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={contact.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 font-bold">
          <Phone size={18} />
          Call
        </a>
        <button onClick={onQuote} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#d8a75b] font-bold text-[#1d321f]">
          Request Quote
        </button>
      </div>
    </div>
  )
}
