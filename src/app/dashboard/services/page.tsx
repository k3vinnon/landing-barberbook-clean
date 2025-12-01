"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, X, Calendar, ArrowLeft } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

type Service = {
  id: string
  name: string
  price: number
  duration: number
  description?: string
  icon: string
  user_id: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [barberId, setBarberId] = useState<string | null>(null)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    icon: "✂️"
  })

  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    checkAuthAndLoadServices()
  }, [])

  const checkAuthAndLoadServices = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (!userData) {
        router.push('/login')
        return
      }

      setBarberId(userData.id)
      await loadServices(userData.id)
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error)
      router.push('/login')
    }
  }

  const loadServices = async (userId: string) => {
    try {
      setLoading(true)
      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setServices(services || [])
    } catch (error) {
      console.error('❌ Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        price: service.price.toString(),
        duration: service.duration.toString(),
        description: service.description || "",
        icon: service.icon
      })
    } else {
      setEditingService(null)
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
        icon: "✂️"
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingService(null)
    setFormData({
      name: "",
      price: "",
      duration: "",
      description: "",
      icon: "✂️"
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!barberId) return

    try {
      const serviceData = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description || null,
        icon: formData.icon,
        user_id: barberId
      }

      if (editingService) {
        // Update
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('services')
          .insert(serviceData)

        if (error) throw error
      }

      await loadServices(barberId)
      closeModal()
    } catch (error) {
      console.error('❌ Erro ao salvar serviço:', error)
      alert('Erro ao salvar serviço. Tente novamente.')
    }
  }

  const handleDelete = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

      if (error) throw error

      if (barberId) {
        await loadServices(barberId)
      }
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Erro ao deletar serviço:', error)
      alert('Erro ao deletar serviço. Tente novamente.')
    }
  }

  const emojiOptions = ["✂️", "💈", "🪒", "💇", "💇‍♂️", "🧔", "👨", "✨", "⭐", "💎"]

  if (!barberId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-zinc-400">Carregando...</p>
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Voltar</span>
              </button>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-[#FFD700]" />
                <span className="font-bold text-xl">Meus Serviços</span>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
            >
              <Plus className="h-5 w-5" />
              Adicionar Serviço
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-zinc-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
            Carregando serviços...
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12">
              <div className="text-6xl mb-4">✂️</div>
              <h3 className="text-xl font-bold mb-2">Nenhum serviço cadastrado</h3>
              <p className="text-zinc-400 mb-6">
                Adicione seus serviços para que os clientes possam agendar
              </p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-3 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
              >
                <Plus className="h-5 w-5" />
                Adicionar Primeiro Serviço
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-[#FFD700]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10 text-2xl">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      <p className="text-sm text-zinc-400">{service.duration} minutos</p>
                    </div>
                  </div>
                </div>

                {service.description && (
                  <p className="text-sm text-zinc-400 mb-4">{service.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div className="text-2xl font-bold text-[#FFD700]">
                    R$ {service.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(service)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-[#FFD700] transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(service.id)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-red-500 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Serviço</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none"
                  placeholder="Ex: Corte Masculino"
                  required
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none"
                  placeholder="Ex: 50.00"
                  required
                />
              </div>

              {/* Duração */}
              <div>
                <label className="block text-sm font-medium mb-2">Duração (minutos)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none"
                  placeholder="Ex: 30"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium mb-2">Descrição (opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none resize-none"
                  placeholder="Descreva o serviço..."
                  rows={3}
                />
              </div>

              {/* Ícone */}
              <div>
                <label className="block text-sm font-medium mb-2">Ícone</label>
                <div className="grid grid-cols-5 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`rounded-lg p-3 text-2xl transition-all ${
                        formData.icon === emoji
                          ? 'bg-[#FFD700] scale-110'
                          : 'bg-black hover:bg-zinc-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
                >
                  {editingService ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmação Delete */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Deletar Serviço?</h2>
              <p className="text-zinc-400">
                Esta ação não pode ser desfeita. O serviço será removido permanentemente.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
