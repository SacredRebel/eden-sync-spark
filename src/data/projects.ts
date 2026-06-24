import type { Project } from "@/types/project"
import yardBefore from "@/assets/yard-before.jpg.asset.json"
import yardAfter from "@/assets/yard-after.jpg.asset.json"
import treeBefore from "@/assets/tree-before.jpg.asset.json"
import treeAfter from "@/assets/tree-after.jpg.asset.json"
import bedsBefore from "@/assets/beds-before.jpg.asset.json"
import bedsAfter from "@/assets/beds-after.jpg.asset.json"
import soilBefore from "@/assets/soil-before.jpg.asset.json"
import soilAfter from "@/assets/soil-after.jpg.asset.json"
import waterBefore from "@/assets/water-before.jpg.asset.json"
import waterAfter from "@/assets/water-after.jpg.asset.json"
import cornerBefore from "@/assets/corner-before.jpg.asset.json"
import cornerAfter from "@/assets/corner-after.jpg.asset.json"

export const projects: Project[] = [
  {
    slug: "overgrown-yard-cleanup",
    title: "Overgrown Yard Cleanup",
    description: "Cleared weeds, trimmed shrubs, removed debris, and refreshed the yard with mulch.",
    category: "Landscape Maintenance",
    portfolioCategory: "Before & After Transformations",
    location: "Local residential property",
    duration: "1-2 days",
    completedDate: "Project placeholder",
    clientName: "Local homeowner",
    clientTestimonial: "Real client feedback can be added here after the project is photographed and completed.",
    challenge: "The yard felt overgrown, messy, and hard to use because weeds, branches, and neglected planting areas had built up over time.",
    solution: "Cleaned the space, removed green waste, trimmed shrubs, opened pathways, and added mulch to make the yard feel cared for again.",
    materials: ["Mulch", "Green waste bags", "Hand tools", "Pruning tools"],
    techniques: ["Weed removal", "Shrub trimming", "Debris cleanup", "Mulch refresh"],
    results: ["Cleaner yard", "Usable pathways", "Reduced visual clutter", "Ready for regular maintenance"],
    images: [
      { src: yardBefore.url, alt: "Overgrown backyard with weeds, branches, and leaf litter before cleanup", caption: "Before: overgrown yard with debris, weeds, and unused space." },
      { src: yardAfter.url, alt: "Tidy backyard with trimmed shrubs, mulched beds, and clear stepping-stone path after cleanup", caption: "After: cleaned yard with mulch, shaped shrubs, and clear pathways." },
    ],
    steps: [
      { title: "Assess", description: "Walk the space, identify cleanup priorities, and plan disposal or green waste handling.", duration: "Quick review", images: [] },
      { title: "Clear", description: "Remove weeds, leaves, branches, and obvious debris from the main work areas.", duration: "Service day", images: [] },
      { title: "Refresh", description: "Trim, mulch, and leave the space cleaner and easier to maintain.", duration: "Final pass", images: [] },
    ],
    featured: true,
  },
  {
    slug: "fruit-tree-pruning-mulching",
    title: "Fruit Tree Pruning & Mulching",
    description: "Pruned fruit trees, cleaned the base, added compost and mulch for seasonal health.",
    category: "Orchard & Fruit Tree Care",
    portfolioCategory: "Orchard Projects",
    location: "Backyard orchard or fruit tree area",
    duration: "Half day to 2 days",
    completedDate: "Project placeholder",
    clientName: "Local fruit tree owner",
    clientTestimonial: "Add a real testimonial here once available.",
    challenge: "Fruit trees needed shaping, airflow, cleaned basins, and seasonal support around the roots.",
    solution: "Pruned for structure, cleared weeds around the tree base, and added compost and mulch to protect soil moisture.",
    materials: ["Compost", "Wood chip mulch", "Pruning tools", "Organic amendments as needed"],
    techniques: ["Seasonal pruning", "Tree basin cleanup", "Compost application", "Mulching"],
    results: ["Cleaner tree shape", "Protected soil", "Reduced weeds", "Better seasonal care foundation"],
    images: [
      { src: treeBefore.url, alt: "Unpruned fruit tree with tangled branches and weedy base", caption: "Before: overgrown fruit tree with crossing branches and dry basin." },
      { src: treeAfter.url, alt: "Pruned fruit tree with shaped canopy, mulched basin, and healthy fruit", caption: "After: cleanly pruned tree with mulched basin and healthier shape." },
    ],
    steps: [
      { title: "Tree Review", description: "Look at tree structure, deadwood, crossing branches, and root-zone conditions.", duration: "Quick review", images: [] },
      { title: "Prune & Clean", description: "Prune carefully and clear weeds or debris around the tree base.", duration: "Service day", images: [] },
      { title: "Feed & Mulch", description: "Add compost or amendments where appropriate, then mulch for moisture retention.", duration: "Final pass", images: [] },
    ],
    featured: true,
  },
  {
    slug: "raised-garden-bed-setup",
    title: "Raised Garden Bed Setup",
    description: "Built and filled garden beds for vegetables, herbs, and edible plants.",
    category: "Organic Gardens & Food Production",
    portfolioCategory: "Food Forest & Garden Projects",
    location: "Local home garden",
    duration: "1-3 days",
    completedDate: "Project placeholder",
    clientName: "Local gardener",
    clientTestimonial: "Add a real testimonial here once available.",
    challenge: "The property needed an organized edible garden area that was easy to plant, water, and maintain.",
    solution: "Set up raised beds, filled them with soil and compost, and prepared the space for vegetables, herbs, and companion plants.",
    materials: ["Raised bed materials", "Compost", "Garden soil", "Mulch", "Starter plants or seeds"],
    techniques: ["Bed layout", "Soil filling", "Compost blending", "Edible planting setup"],
    results: ["Ready-to-grow beds", "Organized garden layout", "Improved soil volume", "Easy planting access"],
    images: [
      { src: bedsBefore.url, alt: "Empty bare backyard area before raised garden bed installation", caption: "Before: unused backyard patch with bare soil and weeds." },
      { src: bedsAfter.url, alt: "Wooden raised garden beds filled with soil, herbs, and vegetable seedlings", caption: "After: raised beds installed with rich soil, herbs, and starter veggies." },
    ],
    steps: [
      { title: "Layout", description: "Choose bed location, access paths, sun exposure, and practical garden flow.", duration: "Planning", images: [] },
      { title: "Build & Fill", description: "Install beds and fill with a practical soil and compost blend.", duration: "Service day", images: [] },
      { title: "Plant Ready", description: "Finish with mulch, planting guidance, and optional starter plants.", duration: "Final pass", images: [] },
    ],
    featured: true,
  },
  {
    slug: "soil-compost-refresh",
    title: "Soil & Compost Refresh",
    description: "Added compost, mulch, and organic amendments to rebuild tired soil.",
    category: "Soil & Regeneration",
    portfolioCategory: "Regenerative Projects",
    location: "Garden beds and tree basins",
    duration: "Half day to 1 day",
    completedDate: "Project placeholder",
    clientName: "Local property owner",
    clientTestimonial: "Add a real testimonial here once available.",
    challenge: "Planting areas were dry, depleted, uncovered, and not holding moisture well.",
    solution: "Added compost, organic amendments, and mulch layers to protect and rebuild the soil surface.",
    materials: ["Compost", "Worm castings", "Organic amendments", "Mulch"],
    techniques: ["Compost topdressing", "Sheet mulching", "Soil amendment application", "Moisture retention support"],
    results: ["Covered soil", "Improved organic matter", "Better moisture retention", "Healthier planting foundation"],
    images: [
      { src: soilBefore.url, alt: "Dry cracked depleted soil with struggling seedling", caption: "Before: dry, cracked soil with little organic matter." },
      { src: soilAfter.url, alt: "Rich dark compost and wood chip mulch with healthy young plants", caption: "After: composted, mulched bed retaining moisture and feeding plants." },
    ],
    steps: [
      { title: "Prepare", description: "Clear weeds and identify where compost, mulch, or amendments are most useful.", duration: "Quick review", images: [] },
      { title: "Apply", description: "Add compost and amendments around beds, trees, or planting areas.", duration: "Service day", images: [] },
      { title: "Protect", description: "Mulch the soil surface to reduce drying and weed pressure.", duration: "Final pass", images: [] },
    ],
    featured: false,
  },
  {
    slug: "water-smart-planting-area",
    title: "Water-Smart Planting Area",
    description: "Installed low-water plants with mulch and simple irrigation support.",
    category: "Irrigation & Water-Smart Landscaping",
    portfolioCategory: "Regenerative Projects",
    location: "Sunny yard or low-water bed",
    duration: "1-3 days",
    completedDate: "Project placeholder",
    clientName: "Local homeowner",
    clientTestimonial: "Add a real testimonial here once available.",
    challenge: "The landscape needed a lower-maintenance planting area and a simpler watering strategy.",
    solution: "Added drought-tolerant plants, checked watering needs, placed simple drip or timer support, and mulched heavily.",
    materials: ["Drought-tolerant plants", "Drip line or hose timer", "Mulch", "Compost"],
    techniques: ["Low-water plant layout", "Basic irrigation setup", "Leak checks", "Mulching"],
    results: ["Lower-water planting", "Simpler watering", "Protected plant roots", "Cleaner landscape bed"],
    images: [
      { src: waterBefore.url, alt: "Dry sunny bed with sparse stressed plants before water-smart upgrade", caption: "Before: water-stressed bed with bare soil and struggling plants." },
      { src: waterAfter.url, alt: "Drought-tolerant landscape with lavender, succulents, grasses, and drip line", caption: "After: low-water planting with drip irrigation and heavy mulch." },
    ],
    steps: [
      { title: "Water Review", description: "Check sun exposure, plant needs, and existing watering setup.", duration: "Planning", images: [] },
      { title: "Plant & Irrigate", description: "Install suitable plants and basic drip, hose timer, or watering support.", duration: "Service day", images: [] },
      { title: "Mulch", description: "Finish with mulch for moisture retention and weed suppression.", duration: "Final pass", images: [] },
    ],
    featured: false,
  },
  {
    slug: "natural-garden-corner",
    title: "Natural Garden Corner",
    description: "Created a peaceful outdoor sitting or meditation space using natural materials.",
    category: "Outdoor Living Spaces",
    portfolioCategory: "Outdoor Living Projects",
    location: "Small yard corner or garden edge",
    duration: "1-3 days",
    completedDate: "Project placeholder",
    clientName: "Local homeowner",
    clientTestimonial: "Add a real testimonial here once available.",
    challenge: "An unused corner of the yard needed a simple purpose and a more inviting feeling.",
    solution: "Created a defined sitting area with natural accents, simple path or border work, and low-maintenance planting support.",
    materials: ["Stone", "Mulch", "Wood accents", "Plants", "Planter boxes as needed"],
    techniques: ["Small-space layout", "Path or border building", "Natural feature placement", "Planting accents"],
    results: ["More usable corner", "Peaceful outdoor feel", "Natural garden structure", "Simple place to sit or pause"],
    images: [
      { src: cornerBefore.url, alt: "Neglected unused backyard corner with weeds and bare dirt", caption: "Before: forgotten corner with weeds and no purpose." },
      { src: cornerAfter.url, alt: "Cozy garden corner with stone path, wooden bench, and lush planting", caption: "After: peaceful sitting nook with stone path, bench, and natural planting." },
    ],
    steps: [
      { title: "Choose the Corner", description: "Pick the right spot and decide how the space should feel and function.", duration: "Planning", images: [] },
      { title: "Shape the Space", description: "Add paths, borders, seating layout, or simple garden structures.", duration: "Service day", images: [] },
      { title: "Finish Naturally", description: "Add mulch, plants, stones, or small accents to complete the space.", duration: "Final pass", images: [] },
    ],
    featured: false,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured)
}
