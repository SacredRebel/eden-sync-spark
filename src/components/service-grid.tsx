import { services } from "@/data/services"

export default function ServiceGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {services.map((service) => {
        const Icon = service.icon
        return (
          <article key={service.id} className="bg-[#fffaf0] border border-[#ded8c5] p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-4 mb-4">
              <span className="rounded-full bg-[#e8edd8] p-3 text-[#4f6f24]"><Icon size={30} /></span>
              <div>
                <h3 className="font-serif font-semibold text-xl text-[#2d5e2d]">{service.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">{service.description}</p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-5">
              {service.includes.slice(0, 6).map((item) => <li key={item} className="flex gap-2"><span className="text-[#6b8e23]">•</span>{item}</li>)}
            </ul>
            <a href={`#${service.id}`} className="text-[#4f6f24] font-semibold hover:text-[#2d5e2d]">Learn more →</a>
          </article>
        )
      })}
    </div>
  )
}
