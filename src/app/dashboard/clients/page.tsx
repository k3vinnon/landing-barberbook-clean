"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X, Phone, Mail, Calendar, User, ArrowLeft, MoreVertical } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

type Client = {
  id: string
  user_id: string
  name: string
  phone: string
  email?: string
  notes?: string
  total_appointments: number
  last_appointment?: string
  created_at: string
  updated_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState<Client | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  })
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: ""
  })

  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    checkAuthAndLoadClients()
  }, [])

  const checkAuthAndLoadClients = async () => {
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

      setUserId(userData.id)
      await loadClients(userData.id)
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error)
      router.push('/login')
    }
  }

  const loadClients = async (userId: string) => {
    try {
      setLoading(true)
      const { data: clients, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true })

      if (error) throw error

      setClients(clients || [])
    } catch (error) {
      console.error('❌ Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {
      name: "",
      phone: "",
      email: ""
    }

    // Validar nome
    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório"
    } else if (formData.name.trim().length < 3) {
      errors.name = "Nome deve ter pelo menos 3 caracteres"
    }

    // Validar telefone
    if (!formData.phone.trim()) {
      errors.phone = "Telefone é obrigatório"
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      errors.phone = "Formato de telefone inválido"
    }

    // Validar email (se preenchido)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Formato de email inválido"
    }

    setFormErrors(errors)
    return !errors.name && !errors.phone && !errors.email
  }

  const openModal = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || "",
        notes: client.notes || ""
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: "",
        phone: "",
        email: "",
        notes: ""
      })
    }
    setFormErrors({ name: "", phone: "", email: "" })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingClient(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      notes: ""
    })
    setFormErrors({ name: "", phone: "", email: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !userId) return

    try {
      const clientData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        notes: formData.notes.trim() || null,
        user_id: userId
      }

      if (editingClient) {
        // Update
        const { error } = await supabase
          .from('clients')
          .update({ ...clientData, updated_at: new Date().toISOString() })
          .eq('id', editingClient.id)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('clients')
          .insert(clientData)

        if (error) throw error
      }

      await loadClients(userId)
      closeModal()
    } catch (error) {
      console.error('❌ Erro ao salvar cliente:', error)
      alert('Erro ao salvar cliente. Tente novamente.')
    }
  }

  const handleDelete = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) throw error

      if (userId) {
        await loadClients(userId)
      }
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('❌ Erro ao deletar cliente:', error)
      alert('Erro ao deletar cliente. Tente novamente.')
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  )

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca"
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (!userId) {
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
                <User className="h-6 w-6 text-[#FFD700]" />
                <span className="font-bold text-xl">Meus Clientes</span>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Novo Cliente</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar cliente..."
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#FFD700] focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
            Carregando clientes...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-bold mb-2">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-zinc-400 mb-6">
                {searchTerm 
                  ? 'Tente buscar por outro nome ou telefone'
                  : 'Adicione seus clientes para gerenciar agendamentos'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-3 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Adicionar Primeiro Cliente
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-[#FFD700]/50 transition-all cursor-pointer"
                onClick={() => setShowDetailsModal(client)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] font-bold text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{client.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(client)
                    }}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-[#FFD700] transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-zinc-300">
                    <Phone className="h-4 w-4 text-[#FFD700]" />
                    {client.phone}
                  </p>
                  <p className="flex items-center gap-2 text-zinc-400">
                    <User className="h-4 w-4 text-[#FFD700]" />
                    {client.total_appointments} visitas | Última: {formatDate(client.last_appointment)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
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
                <label className="block text-sm font-medium mb-2">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full rounded-lg bg-black border ${
                    formErrors.name ? 'border-red-500' : 'border-zinc-800'
                  } px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none`}
                  placeholder="Ex: João Silva"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Telefone/WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full rounded-lg bg-black border ${
                    formErrors.phone ? 'border-red-500' : 'border-zinc-800'
                  } px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none`}
                  placeholder="Ex: +351 912 345 678"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-lg bg-black border ${
                    formErrors.email ? 'border-red-500' : 'border-zinc-800'
                  } px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none`}
                  placeholder="Ex: joao@email.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium mb-2">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-lg bg-black border border-zinc-800 px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none resize-none"
                  placeholder="Observações sobre o cliente..."
                  rows={3}
                />
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
                  {editingClient ? 'Salvar' : 'Adicionar'}
                </button>
              </div>

              {/* Botão Deletar (apenas no modo edição) */}
              {editingClient && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowDeleteConfirm(editingClient.id)
                    closeModal()
                  }}
                  className="w-full rounded-lg border border-red-500/50 px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Cliente
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Detalhes do Cliente</h2>
              <button
                onClick={() => setShowDetailsModal(null)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar e Nome */}
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700]/10 text-[#FFD700] font-bold text-2xl">
                  {showDetailsModal.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{showDetailsModal.name}</h3>
                  <p className="text-zinc-400 text-sm">
                    Cliente desde {formatDate(showDetailsModal.created_at)}
                  </p>
                </div>
              </div>

              {/* Informações */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Phone className="h-5 w-5 text-[#FFD700]" />
                  <span>{showDetailsModal.phone}</span>
                </div>
                {showDetailsModal.email && (
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Mail className="h-5 w-5 text-[#FFD700]" />
                    <span>{showDetailsModal.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-zinc-300">
                  <Calendar className="h-5 w-5 text-[#FFD700]" />
                  <span>
                    {showDetailsModal.total_appointments} visitas | Última: {formatDate(showDetailsModal.last_appointment)}
                  </span>
                </div>
              </div>

              {/* Notas */}
              {showDetailsModal.notes && (
                <div className="pt-4 border-t border-zinc-800">
                  <h4 className="font-medium mb-2 text-zinc-400">Notas:</h4>
                  <p className="text-zinc-300 text-sm">{showDetailsModal.notes}</p>
                </div>
              )}

              {/* Histórico (placeholder) */}
              <div className="pt-4 border-t border-zinc-800">
                <h4 className="font-medium mb-2 text-zinc-400">Histórico de Agendamentos:</h4>
                <p className="text-zinc-500 text-sm italic">
                  Histórico será exibido quando houver agendamentos
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDetailsModal(null)
                    openModal(showDetailsModal)
                  }}
                  className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(showDetailsModal.id)
                    setShowDetailsModal(null)
                  }}
                  className="flex-1 rounded-lg border border-red-500/50 px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar
                </button>
              </div>
            </div>
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
              <h2 className="text-2xl font-bold mb-2">Deletar Cliente?</h2>
              <p className="text-zinc-400">
                Tem certeza? Isso também deletará todos os agendamentos deste cliente. Esta ação não pode ser desfeita.
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
