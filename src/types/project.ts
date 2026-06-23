export interface ProjectImage {
  src: string
  alt: string
  caption?: string
}

export interface ProjectStep {
  title: string
  description: string
  duration: string
  images: ProjectImage[]
}

export interface Project {
  slug: string
  title: string
  description: string
  category: string
  portfolioCategory?: string
  location: string
  duration: string
  completedDate: string
  clientName: string
  clientTestimonial: string
  challenge: string
  solution: string
  materials: string[]
  techniques: string[]
  results: string[]
  images: ProjectImage[]
  steps: ProjectStep[]
  featured: boolean
}
