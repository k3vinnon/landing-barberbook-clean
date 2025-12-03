'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { MessageSquare, Copy, Send, Check, Calendar } from 'lucide-react';

interface PendingMessage {
  id: string;
  type: '24h' | '1h' | 'confirmation';
  client: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

export default function MessagesPage() {
  const supabase = getSupabaseBrowserClient();
  const [messages, setMessages] = useState<PendingMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [barberName, setBarberName] = useState('');

  useEffect(() => {
    loadMessages();
    // Recarregar a cada 5 minutos
    const interval = setInterval(loadMessages, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: userData } = await supabase
        .from('users')
        .select('id, name')
        .eq('auth_id', user.id)
        .single();
      
      if (!userData) return;
      
      setBarberName(userData.name);
      
      // Buscar agendamentos confirmados futuros
      const today = new Date().toISOString().split('T')[0];
      
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('barber_id', userData.id)
        .eq('status', 'confirmed')
        .gte('date', today);
      
      console.log('✅ Agendamentos confirmados:', appointments?.length);
      
      // Gerar mensagens
      const messagesToSend: PendingMessage[] = [];
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      appointments?.forEach(apt => {
        const firstName = apt.client_name.split(' ')[0];
        
        // Lembrete 24h antes (agendamentos de AMANHÃ que não foram notificados)
        if (apt.date === tomorrowStr && !apt.notification_24h_sent) {
          messagesToSend.push({
            id: apt.id,
            type: '24h',
            client: apt.client_name,
            phone: apt.client_whatsapp,
            service: apt.service,
            date: apt.date,
            time: apt.time,
            message: `Oi ${firstName}! 👋\n\n📅 *Lembrete:* Amanhã às *${apt.time}* você tem *${apt.service}* agendado.\n\n📍 ${userData.name}\n\nNos vemos lá! 😊\n\n_Para cancelar, responda CANCELAR_`
          });
        }
      });
      
      console.log('📱 Mensagens para enviar:', messagesToSend.length);
      setMessages(messagesToSend);
      
    } catch (error) {
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      alert('✅ Mensagem copiada para área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('❌ Erro ao copiar mensagem');
    }
  };

  const sendWhatsApp = async (appointmentId: string, phone: string, message: string) => {
    // Limpar telefone (remover caracteres especiais)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Adicionar código do país se não tiver
    const fullPhone = cleanPhone.startsWith('351') || cleanPhone.startsWith('55') 
      ? cleanPhone 
      : `351${cleanPhone}`; // Portugal por padrão
    
    // Abrir WhatsApp Web
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${fullPhone}?text=${encodedMessage}`, '_blank');
    
    // Marcar como enviada após 2 segundos (tempo para abrir WhatsApp)
    setTimeout(async () => {
      await markAsSent(appointmentId);
    }, 2000);
  };

  const markAsSent = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ notification_24h_sent: true })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      console.log('✅ Marcado como enviado:', appointmentId);
      
      // Recarregar lista
      loadMessages();
    } catch (error) {
      console.error('❌ Erro ao marcar como enviada:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Mensagens WhatsApp</h1>
        <p className="text-zinc-300">Envie lembretes para seus clientes agendados</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-zinc-400">Carregando mensagens...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl">
          <MessageSquare className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg mb-2">Nenhuma mensagem pendente 🎉</p>
          <p className="text-zinc-500 text-sm">Mensagens aparecerão aqui 24h antes dos agendamentos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-zinc-900 border-2 border-zinc-800 rounded-xl p-6 hover:border-[#FFD700] transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold">
                      {msg.client.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{msg.client}</h3>
                      <p className="text-sm text-zinc-400">{msg.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      msg.type === '24h' ? 'bg-blue-500/20 text-blue-400' :
                      msg.type === '1h' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {msg.type === '24h' ? '📅 Lembrete 24h' :
                       msg.type === '1h' ? '⏰ Lembrete 1h' :
                       '✅ Confirmação'}
                    </span>
                    <span className="text-zinc-400">
                      {msg.service} • {new Date(msg.date).toLocaleDateString('pt-PT')} às {msg.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensagem Preview */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-zinc-200 whitespace-pre-line font-mono">
                  {msg.message}
                </p>
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <button
                  onClick={() => copyMessage(msg.message)}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold transition-all"
                >
                  <Copy className="h-5 w-5" />
                  Copiar Mensagem
                </button>
                
                <button
                  onClick={() => sendWhatsApp(msg.id, msg.phone, msg.message)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all"
                >
                  <Send className="h-5 w-5" />
                  Enviar no WhatsApp
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-3 text-center">
                💡 Ao clicar "Enviar", o WhatsApp Web abrirá com a mensagem pronta
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="font-bold text-blue-400 mb-3">💡 Como Funciona:</h3>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>• Mensagens aparecem aqui <strong>24h antes</strong> dos agendamentos confirmados</li>
          <li>• Clique em <strong>"Enviar no WhatsApp"</strong> para abrir o WhatsApp Web</li>
          <li>• A mensagem já vem pronta, só clicar enviar!</li>
          <li>• Após enviar, a mensagem é marcada como enviada automaticamente</li>
          <li>• 🚀 <strong>Em breve:</strong> Envio 100% automático via N8N!</li>
        </ul>
      </div>

    </div>
  );
}
