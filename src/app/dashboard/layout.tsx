export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Menu de Navegação */}
      <nav className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="container mx-auto">
          <div className="flex gap-6">
            <a 
              href="/dashboard" 
              className="text-white hover:text-[#FFD700] transition-all font-medium"
            >
              📊 Início
            </a>
            <a 
              href="/dashboard/services" 
              className="text-white hover:text-[#FFD700] transition-all font-medium"
            >
              ⚙️ Serviços
            </a>
            <a 
              href="/dashboard/appointments" 
              className="text-white hover:text-[#FFD700] transition-all font-medium"
            >
              📅 Agendamentos
            </a>
            <a 
              href="/dashboard/settings" 
              className="text-white hover:text-[#FFD700] transition-all font-medium"
            >
              🔧 Configurações
            </a>
          </div>
        </div>
      </nav>

      {/* Conteúdo das páginas */}
      {children}
    </div>
  )
}
