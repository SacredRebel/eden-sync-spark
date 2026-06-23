import type React from "react"
import { ChevronLeft, ChevronRight, Filter, Images, MapPin, X } from "lucide-react"
import { useState } from "react"
import { projects } from "@/data/projects"

interface ProjectImage {
  src: string
  alt: string
  caption?: string
}

interface Project {
  title: string
  description: string
  images: ProjectImage[]
  category: string
  portfolioCategory?: string
  slug: string
  location: string
  results: string[]
}

export default function PortfolioGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All Projects")

  const portfolioCategories = [
    "All Projects",
    "Before & After Transformations",
    "Orchard Projects",
    "Food Forest & Garden Projects",
    "Outdoor Living Projects",
    "Creative Landscape Projects",
    "Regenerative Projects",
  ]

  const visibleProjects = activeCategory === "All Projects"
    ? projects
    : projects.filter((project) => project.portfolioCategory === activeCategory)

  const openGallery = (project: Project, imageIndex = 0) => {
    setSelectedProject(project)
    setCurrentImageIndex(imageIndex)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeGallery = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    setCurrentImageIndex(0)
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    if (!selectedProject) return
    setCurrentImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    if (!selectedProject) return
    setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") closeGallery()
    if (event.key === "ArrowRight") nextImage()
    if (event.key === "ArrowLeft") prevImage()
  }

  return (
    <>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {portfolioCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`inline-flex min-h-11 flex-shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition ${
              activeCategory === category
                ? "border-[#244d2b] bg-[#244d2b] text-white"
                : "border-[#d8cfb8] bg-[#fffaf0] text-[#244d2b] hover:border-[#6b8e23]"
            }`}
          >
            <Filter size={14} />
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleProjects.map((project) => {
          const beforeImage = project.images[0]
          const afterImage = project.images[1] ?? project.images[0]

          return (
            <article
              key={project.slug}
              className="group overflow-hidden rounded-[2rem] border border-[#d8cfb8] bg-[#fffaf0] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="grid grid-cols-2 gap-1 bg-[#244d2b] p-1">
                <button type="button" onClick={() => openGallery(project, 0)} className="relative block overflow-hidden rounded-l-[1.65rem]">
                  <img src={beforeImage?.src || "/placeholder.svg"} alt={beforeImage?.alt || project.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Before</span>
                </button>
                <button type="button" onClick={() => openGallery(project, 1)} className="relative block overflow-hidden rounded-r-[1.65rem]">
                  <img src={afterImage?.src || "/placeholder.svg"} alt={afterImage?.alt || project.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#6b8e23] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">After</span>
                </button>
              </div>

              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#e8edd8] px-3 py-1 text-xs font-bold text-[#4f6f24]">{project.portfolioCategory ?? project.category}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-600"><MapPin size={13} /> {project.location}</span>
                </div>
                <h3 className="mb-2 text-2xl font-serif text-[#2d5e2d]">{project.title}</h3>
                <p className="mb-4 leading-7 text-gray-700">{project.description}</p>
                <p className="mb-5 rounded-2xl bg-white p-3 text-sm leading-6 text-gray-700">
                  <strong>Result:</strong> {project.results[0] ?? "A cleaner, healthier, more useful outdoor space."}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => openGallery(project, 0)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#6b8e23] px-4 font-bold text-white transition hover:bg-[#556b2f]"
                  >
                    <Images size={17} />
                    Gallery
                  </button>
                  <a
                    href={`/projects/${project.slug}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-[#6b8e23] px-4 font-bold text-[#2d5e2d] transition hover:bg-[#e8edd8]"
                  >
                    Full Details
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {isModalOpen && selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 md:p-6"
          onClick={closeGallery}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full max-w-5xl">
            <button
              onClick={closeGallery}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>

            {selectedProject.images.length > 1 && (
              <>
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="overflow-hidden rounded-[2rem] bg-white" onClick={(event) => event.stopPropagation()}>
              <img
                src={selectedProject.images[currentImageIndex]?.src || "/placeholder.svg"}
                alt={selectedProject.images[currentImageIndex]?.alt}
                className="max-h-[70vh] w-full object-contain bg-[#111]"
              />
              <div className="p-5 md:p-6">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-serif text-[#2d5e2d]">{selectedProject.title}</h3>
                  <span className="text-sm text-gray-500">
                    {currentImageIndex + 1} of {selectedProject.images.length}
                  </span>
                </div>
                {selectedProject.images[currentImageIndex]?.caption && (
                  <p className="mb-4 leading-7 text-gray-700">{selectedProject.images[currentImageIndex].caption}</p>
                )}
                {selectedProject.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProject.images.map((image, index) => (
                      <button
                        key={`${image.alt}-${index}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          index === currentImageIndex ? "border-[#6b8e23] opacity-100" : "border-gray-300 opacity-60 hover:opacity-90"
                        }`}
                      >
                        <img src={image.src || "/placeholder.svg"} alt={image.alt} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
