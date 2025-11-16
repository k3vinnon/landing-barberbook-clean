"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  barberId: string
}

const DAYS_MAP = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

export function SettingsModal({ isOpen, onClose, barberId }: SettingsModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    start_time: '09:00',
    end_time: '18:00',
    slot_duration: 30
  })

  useEffect(() => {
    if (isOpen) {
      loadSettings()
    }
  }, [isOpen])

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/settings?barber_id=${barberId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setFormData({
          working_days: data.data.working_days || formData.working_days,
          start_time: data.data.start_time || formData.start_time,
          end_time: data.data.end_time || formData.end_time,
          slot_duration: data.data.slot_duration || formData.slot_duration
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barber_id: barberId,
          ...formData
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar configurações')
      }

      alert('✅ Configurações salvas com sucesso!')
      onClose()
    } catch (error: any) {
      console.error('Erro:', error)
      alert(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Configurar Horários</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Dias de Trabalho</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(DAYS_MAP).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDay(key)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    formData.working_days.includes(key)
                      ? 'bg-[#FFD700] text-black font-bold'
                      : 'border border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Início</label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fim</label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duração do Atendimento</label>
            <select
              value={formData.slot_duration}
              onChange={(e) => setFormData({ ...formData, slot_duration: Number(e.target.value) })}
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-2 focus:border-[#FFD700] focus:outline-none"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 font-bold text-black hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
