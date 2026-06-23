import type { ProjectStep } from "@/types/project"

interface ProjectTimelineProps {
  steps: ProjectStep[]
}

export default function ProjectTimeline({ steps }: ProjectTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#6b8e23] hidden md:block"></div>
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col md:flex-row gap-6">
            <div className="hidden md:flex items-center justify-center w-16 h-16 bg-[#6b8e23] text-white rounded-full font-bold text-lg flex-shrink-0 relative z-10">
              {index + 1}
            </div>
            <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold text-[#2d5e2d]">{step.title}</h3>
                    <span className="bg-[#e8e8d8] text-[#6b8e23] px-3 py-1 rounded-full text-sm font-medium">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
                {step.images.length > 0 && (
                  <div className="lg:w-1/3">
                    <div className="grid gap-2">
                      {step.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="relative group">
                          <img
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {image.caption && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <p className="text-white text-sm text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {image.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
