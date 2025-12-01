"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, TrendingUp, Plus, Settings, LogOut, Users, DollarSign, Copy, Check } from "lucide-react"
import { NewAppointmentModal } from "@/components/custom/new-appointment-modal"
import { SettingsModal } from "@/components/custom/settings-modal"
import { WhatsAppTemplatesModal } from "@/components/custom/whatsapp-templates-modal"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

type Appointment = {
  id: string
  client_name: string
  client_whatsapp: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'canceled'
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [barberId, setBarberId] = useState<string | null>(null)
  const [barberUsername, setBarberUsername] = useState<string>("")
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    appointmentsWeek: 0,
    showRate: 0,
    revenue: 0
  })
  
  // Modais
  const [showNewAppointment, setShowNewAppointment] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showReportsMessage, setShowReportsMessage] = useState(false)

  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // Verificar autenticação e carregar dados do usuário
  useEffect(() => {
    checkAuth()
  }, [])

  // Carregar dados quando barberId estiver disponível
  useEffect(() => {
    if (barberId) {
      loadDashboardData()
    }
  }, [barberId])

  const checkAuth = async () => {
    try {
      // Verificar se usuário está autenticado
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        console.log('❌ Usuário não autenticado, redirecionando...')
        router.push('/login')
        return
      }

      console.log('✅ Usuário autenticado:', user.id)

      // 🔍 DEBUG: Mostrar USER COMPLETO
      console.log('👤 USER COMPLETO:', JSON.stringify(user, null, 2))
      console.log('🔍 user.id:', user?.id)
      console.log('🔍 Tipo:', typeof user?.id)

      // Buscar dados do usuário na tabela users
      console.log('═══════════════════════════════════');
      console.log('🔍 ANTES DA QUERY:');
      console.log('   - auth_id que será buscado:', user.id);
      console.log('   - Tipo do auth_id:', typeof user.id);
      console.log('═══════════════════════════════════');
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name')
        .eq('auth_id', user.id)
        .single()
      
      console.log('═══════════════════════════════════');
      console.log('🔍 DEPOIS DA QUERY:');
      console.log('   - userData:', userData);
      console.log('   - userError:', userError);
      console.log('═══════════════════════════════════');

      // 📊 DEBUG: Mostrar resultado da query
      console.log('📊 QUERY EXECUTADA:')
      console.log('   - auth_id procurado:', user?.id)
      console.log('   - userError:', JSON.stringify(userError, null, 2))
      console.log('   - userData:', JSON.stringify(userData, null, 2))

      // 📋 DEBUG: Fazer query SEM .single() para ver TODOS os registros
      const { data: allUsers } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user?.id)

      console.log('📋 TODOS os usuários com este auth_id:', allUsers)

      // 📊 DEBUG: Query alternativa SEM filtro para ver se a tabela tem dados
      const { data: sampleUsers } = await supabase
        .from('users')
        .select('id, email, auth_id')
        .limit(5)

      console.log('📊 AMOSTRA da tabela users (5 primeiros):', sampleUsers)

      if (userError || !userData) {
        console.error('❌ Erro ao buscar dados do usuário:', userError)
        // ❌ DEBUG: Detalhes completos do erro
        console.log('❌ DETALHES DO ERRO:', JSON.stringify(userError, null, 2))
        router.push('/login')
        return
      }

      console.log('✅ Dados do usuário carregados:', userData)
      setBarberId(userData.id)
      setBarberUsername(userData.name || 'barbeiro')
      localStorage.setItem('barber_id', userData.id)
      
    } catch (error) {
      console.error('❌ Erro na verificação de autenticação:', error)
      router.push('/login')
    }
  }

  const loadDashboardData = async () => {
    if (!barberId) return

    try {
      setLoading(true)
      console.log('📊 Carregando dados do dashboard para barberId:', barberId)
      
      // Buscar agendamentos de hoje
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/appointments?barber_id=${barberId}&date=${today}`)
      const data = await response.json()

      if (data.success) {
        console.log('✅ Agendamentos carregados:', data.data?.length || 0)
        setAppointments(data.data || [])
        calculateStats(data.data || [])
      } else {
        console.error('❌ Erro ao carregar agendamentos:', data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = async (todayAppointments: Appointment[]) => {
    if (!barberId) return

    try {
      // Buscar agendamentos da semana
      const today = new Date()
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()))

      const weekResponse = await fetch(`/api/appointments?barber_id=${barberId}`)
      const weekData = await weekResponse.json()

      const weekAppointments = weekData.success ? weekData.data.filter((apt: Appointment) => {
        const aptDate = new Date(apt.date)
        return aptDate >= startOfWeek && aptDate <= endOfWeek
      }) : []

      // Calcular estatísticas
      const todayCount = todayAppointments.length
      const weekCount = weekAppointments.length
      
      const confirmedCount = todayAppointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length
      const attendanceRate = todayCount > 0 ? Math.round((confirmedCount / todayCount) * 100) : 0

      const prices: Record<string, number> = { 'Corte': 40, 'Barba': 30, 'Combo': 60 }
      const weekRevenue = weekAppointments.reduce((sum: number, apt: Appointment) => {
        return sum + (prices[apt.service] || 0)
      }, 0)

      setStats({
        appointmentsToday: todayCount,
        appointmentsWeek: weekCount,
        showRate: attendanceRate,
        revenue: weekRevenue
      })
    } catch (error) {
      console.error('❌ Erro ao calcular estatísticas:', error)
    }
  }

  const copyLink = async () => {
    try {
      const link = `${window.location.origin}/${barberUsername}`
      await navigator.clipboard.writeText(link)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.error('❌ Erro ao copiar link:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('barber_id')
      router.push('/login')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  const handleReportsClick = () => {
    setShowReportsMessage(true)
    setTimeout(() => setShowReportsMessage(false), 3000)
  }

  // Mostrar loading enquanto verifica autenticação
  if (!barberId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-zinc-400">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-[#FFD700]" />
              <span className="font-bold text-xl">BarberBook</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span className="hidden sm:inline">Configurações</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10">
                <Calendar className="h-6 w-6 text-[#FFD700]" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.appointmentsToday}</p>
            <p className="text-sm text-zinc-400">Agendamentos Hoje</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10">
                <TrendingUp className="h-6 w-6 text-[#FFD700]" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.appointmentsWeek}</p>
            <p className="text-sm text-zinc-400">Esta Semana</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.showRate}%</p>
            <p className="text-sm text-zinc-400">Taxa de Comparecimento</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10">
                <DollarSign className="h-6 w-6 text-[#FFD700]" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">R$ {stats.revenue}</p>
            <p className="text-sm text-zinc-400">Faturamento Semanal</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Agendamentos de Hoje */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Agendamentos de Hoje</h2>
                <button 
                  onClick={() => setShowNewAppointment(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Novo
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-zinc-400">Carregando...</div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">
                  Nenhum agendamento para hoje
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-xl border border-zinc-800 bg-black p-4 hover:border-[#FFD700]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700] font-bold text-black">
                              {appointment.client_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold">{appointment.client_name}</p>
                              <p className="text-sm text-zinc-400">{appointment.client_whatsapp}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <span>✂️</span>
                              {appointment.service}
                            </div>
                          </div>
                        </div>
                        <div>
                          {appointment.status === "confirmed" || appointment.status === "completed" ? (
                            <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                              Confirmado
                            </span>
                          ) : appointment.status === "canceled" ? (
                            <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                              Cancelado
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
                              Pendente
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meu Link */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="font-bold mb-4">Meu Link de Agendamento</h3>
              <div className="rounded-lg bg-black p-4 mb-4">
                <p className="text-sm text-[#FFD700] break-all">
                  barberbook.club/{barberUsername}
                </p>
              </div>
              <button 
                onClick={copyLink}
                className="w-full rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Horários Populares */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="font-bold mb-4">Horários Mais Populares</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">14:00 - 15:00</span>
                  <span className="text-sm font-bold text-[#FFD700]">12 agendamentos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">15:00 - 16:00</span>
                  <span className="text-sm font-bold text-[#FFD700]">10 agendamentos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">16:00 - 17:00</span>
                  <span className="text-sm font-bold text-[#FFD700]">9 agendamentos</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="font-bold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleReportsClick}
                  className="w-full rounded-lg border border-zinc-700 px-4 py-2 text-sm text-left hover:bg-zinc-800 transition-colors relative"
                >
                  📊 Ver Relatórios
                  {showReportsMessage && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#FFD700]">
                      Em breve!
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-full rounded-lg border border-zinc-700 px-4 py-2 text-sm text-left hover:bg-zinc-800 transition-colors"
                >
                  ⚙️ Configurar Horários
                </button>
                <button 
                  onClick={() => setShowTemplates(true)}
                  className="w-full rounded-lg border border-zinc-700 px-4 py-2 text-sm text-left hover:bg-zinc-800 transition-colors"
                >
                  💬 Template WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
        onSuccess={loadDashboardData}
        barberId={barberId}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        barberId={barberId}
      />

      <WhatsAppTemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
      />
    </div>
  )
}
