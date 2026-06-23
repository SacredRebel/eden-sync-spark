interface NavigationProps { onNavigate: (sectionId: string) => void }

export default function Navigation({ onNavigate }: NavigationProps) {
  const navItems = [
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Projects" },
    { id: "details", label: "Details" },
    { id: "process", label: "Process" },
    { id: "about", label: "About" },
    { id: "contact", label: "Quote" },
  ]
  return <nav><ul className="flex flex-wrap justify-center gap-3 md:gap-7 px-4 text-sm md:text-base">{navItems.map((item) => <li key={item.id}><button onClick={() => onNavigate(item.id)} className="text-white/90 hover:text-white hover:underline transition-all duration-200 py-2">{item.label}</button></li>)}</ul></nav>
}
