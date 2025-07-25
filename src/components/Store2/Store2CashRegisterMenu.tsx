import React, { useState } from 'react';
import '../../index.css';
import { supabase } from '../../lib/supabase';
import { useStore2PDVCashRegister } from '../../hooks/useStore2PDVCashRegister';
import { 
  DollarSign,
  ArrowDownCircle, 
  ArrowUpCircle, 
  Plus, 
  ShoppingBag, 
  Clock, 
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';

const Store2CashRegisterMenu: React.FC = () => {
  const {
    isOpen,
    currentRegister,
    summary,
    entries,
    loading,
    error,
    refreshData
  } = useStore2PDVCashRegister();

  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const [showOpenRegister, setShowOpenRegister] = useState(false);
  const [showCashEntry, setShowCashEntry] = useState(false);
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');
  const [entryAmount, setEntryAmount] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [entryPaymentMethod, setEntryPaymentMethod] = useState('dinheiro');
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Check Supabase configuration on mount
  React.useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const isConfigured = supabaseUrl && supabaseKey && 
                        supabaseUrl !== 'your_supabase_url_here' && 
                        supabaseKey !== 'your_supabase_anon_key_here' &&
                        !supabaseUrl.includes('placeholder');
    
    setSupabaseConfigured(isConfigured);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleOpenRegister = async () => {
    if (!openingAmount) return;
    
    try {
      console.log('🚀 Abrindo caixa da Loja 2 com valor:', parseFloat(openingAmount));
      
      const { data, error } = await supabase
        .from('pdv2_cash_registers')
        .insert([{
          opening_amount: parseFloat(openingAmount),
          opened_at: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) {
        console.error('Erro ao abrir caixa da Loja 2:', error);
        throw error;
      }
      
      console.log('✅ Caixa da Loja 2 aberto com sucesso:', data.id);
      await refreshData();
      
      setShowOpenRegister(false);
      setOpeningAmount('');
    } catch (err) {
      console.error('Erro ao abrir caixa da Loja 2:', err);
      alert('Erro ao abrir caixa. Tente novamente.');
    }
  };

  const handleCloseRegister = async () => {
    if (!currentRegister || !summary) {
      alert('Erro: Dados do caixa não disponíveis');
      return;
    }
    
    const expectedBalance = summary.expected_balance || 0;
    setClosingAmount(expectedBalance.toFixed(2));
    setShowCloseModal(true);
  };
  
  const handleConfirmClose = async () => {
    if (!closingAmount) {
      alert('Digite o valor de fechamento');
      return;
    }
    
    try {
      console.log('🔒 Fechando caixa da Loja 2 com valor:', parseFloat(closingAmount));
      
      const { data, error } = await supabase
        .from('pdv2_cash_registers')
        .update({
          closing_amount: parseFloat(closingAmount),
          closed_at: new Date().toISOString(),
          difference: parseFloat(closingAmount) - (summary?.expected_balance || 0)
        })
        .eq('id', currentRegister.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao fechar caixa da Loja 2:', error);
        alert(`Erro ao fechar caixa: ${error.message}`);
        return;
      }
      
      console.log('✅ Caixa da Loja 2 fechado com sucesso');
      showSuccessNotification();
      setShowCloseModal(false);
      setClosingAmount('');
      await refreshData();
    } catch (err) {
      console.error('Erro ao fechar caixa da Loja 2:', err);
      alert('Erro ao fechar caixa. Tente novamente.');
    }
  };
  
  const showSuccessNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out translate-x-full';
    notification.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl border border-green-200 p-6 max-w-sm w-full">
        <div class="flex items-start gap-4">
          <div class="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-3 flex-shrink-0 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              ✅ Caixa Fechado com Sucesso!
            </h3>
            <p class="text-gray-600 mb-4">
              O caixa da Loja 2 foi fechado e todas as movimentações foram registradas.
            </p>
            <div class="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="font-semibold text-blue-800">Resumo Final:</span>
              </div>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-blue-700">Valor de fechamento:</span>
                  <span class="font-bold text-blue-900">${closingAmount ? parseFloat(closingAmount).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-blue-700">Saldo esperado:</span>
                  <span class="font-medium text-blue-800">${(summary?.expected_balance || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                </div>
                ${closingAmount && parseFloat(closingAmount) !== (summary?.expected_balance || 0) ? `
                <div class="flex justify-between pt-2 border-t border-blue-200">
                  <span class="text-blue-700">Diferença:</span>
                  <span class="font-bold ${parseFloat(closingAmount) > (summary?.expected_balance || 0) ? 'text-green-600' : 'text-red-600'}">
                    ${Math.abs(parseFloat(closingAmount) - (summary?.expected_balance || 0)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    ${parseFloat(closingAmount) > (summary?.expected_balance || 0) ? ' (sobra)' : ' (falta)'}
                  </span>
                </div>
                ` : ''}
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                onclick="window.location.href='/relatorios_loja2'" 
                class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                📊 Ver Relatórios
              </button>
              <button 
                onclick="this.closest('.fixed').remove()" 
                class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                ✅ OK
              </button>
            </div>
          </div>
        </div>
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl"></div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
      notification.classList.add('translate-x-0');
    }, 100);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }
    }, 10000);
  };
  
  const handleCancelClose = () => {
    setShowCloseModal(false);
    setClosingAmount('');
  };

  const handleCashEntry = async () => {
    if (!entryAmount || !entryDescription) return;
    
    try {
      console.log('💰 Adicionando entrada ao caixa da Loja 2:', {
        type: entryType,
        amount: parseFloat(entryAmount),
        description: entryDescription,
        payment_method: entryPaymentMethod
      });
      
      const { data, error } = await supabase
        .from('pdv2_cash_entries')
        .insert([{
          register_id: currentRegister.id,
          type: entryType,
          amount: parseFloat(entryAmount),
          description: entryDescription,
          payment_method: entryPaymentMethod
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao adicionar entrada da Loja 2:', error);
        throw error;
      }
      
      console.log('✅ Entrada da Loja 2 adicionada com sucesso:', data);
      await refreshData();
      
      setShowCashEntry(false);
      setEntryAmount('');
      setEntryDescription('');
      setEntryType('income');
      setEntryPaymentMethod('dinheiro');
    } catch (err) {
      console.error('Erro ao adicionar entrada da Loja 2:', err);
      alert('Erro ao adicionar entrada. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Supabase Configuration Warning */}
      {!supabaseConfigured && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 rounded-full p-2">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">Funcionalidade de Caixa Indisponível - Loja 2</h3>
              <p className="text-red-700 text-sm">
                O sistema de caixa requer configuração do Supabase.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign size={24} />
            Controle de Caixa - Loja 2
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isOpen ? 'Caixa aberto' : 'Caixa fechado'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
          
          {isOpen && (
            <button
              onClick={handleCloseRegister}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Clock size={16} />
              Fechar Caixa
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border-2 ${isOpen ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status do Caixa</p>
              <p className={`text-lg font-semibold ${isOpen ? 'text-green-600' : 'text-gray-600'}`}>
                {isOpen ? 'Aberto' : 'Fechado'}
              </p>
            </div>
            <div className={`p-2 rounded-full ${isOpen ? 'bg-green-100' : 'bg-gray-100'}`}>
              <DollarSign className={`h-6 w-6 ${isOpen ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
          </div>
        </div>

        {currentRegister && (
          <>
            <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor de Abertura</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatPrice(currentRegister.opening_amount || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <ArrowUpCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {formatPrice(summary.expected_balance)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {!isOpen && (
          <button
            onClick={() => setShowOpenRegister(true)}
            disabled={!supabaseConfigured}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Abrir Caixa
          </button>
        )}

        {isOpen && supabaseConfigured && (
          <>
            <button
              onClick={() => setShowCashEntry(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowDownCircle size={18} />
              Adicionar Entrada
            </button>

            <button
              onClick={() => {
                setEntryType('expense');
                setShowCashEntry(true);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowUpCircle size={18} />
              Adicionar Saída
            </button>
          </>
        )}
      </div>

      {/* Resumo do Caixa */}
      {currentRegister && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Caixa - Loja 2</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor de abertura:</span>
                <span className="font-medium">{formatPrice(summary.opening_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vendas:</span>
                <span className="font-medium text-green-600">{formatPrice(summary.sales_total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Outras entradas:</span>
                <span className="font-medium text-green-600">{formatPrice(summary.other_income_total)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Saídas:</span>
                <span className="font-medium text-red-600">{formatPrice(summary.total_expense)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saldo esperado:</span>
                <span className="font-medium text-purple-600">{formatPrice(summary.expected_balance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vendas realizadas:</span>
                <span className="font-medium">{summary.sales_count}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Register Modal */}
      {showOpenRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Abrir Caixa - Loja 2</h3>
              <button
                onClick={() => setShowOpenRegister(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de Abertura
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={openingAmount}
                  onChange={(e) => setOpeningAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowOpenRegister(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleOpenRegister}
                  disabled={!openingAmount}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Abrir Caixa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Fechamento de Caixa */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Fechar Caixa - Loja 2</h3>
              <button
                onClick={handleCancelClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Resumo do Caixa</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor de abertura:</span>
                    <span className="font-medium">{formatPrice(currentRegister?.opening_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendas:</span>
                    <span className="font-medium text-green-600">{formatPrice(summary?.sales_total || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outras entradas:</span>
                    <span className="font-medium text-green-600">{formatPrice(summary?.other_income_total || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saídas:</span>
                    <span className="font-medium text-red-600">{formatPrice(summary?.total_expense || 0)}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between font-medium">
                      <span>Saldo esperado:</span>
                      <span className="text-blue-800">{formatPrice(summary?.expected_balance || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de Fechamento
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0,00"
                />
                
                {/* Aviso de diferença */}
                {closingAmount && parseFloat(closingAmount) !== (summary?.expected_balance || 0) && (
                  <div className={`mt-2 p-3 rounded-lg border ${
                    parseFloat(closingAmount) > (summary?.expected_balance || 0)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className={
                        parseFloat(closingAmount) > (summary?.expected_balance || 0)
                          ? 'text-green-600'
                          : 'text-red-600'
                      } />
                      <div>
                        <p className={`text-sm font-medium ${
                          parseFloat(closingAmount) > (summary?.expected_balance || 0)
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {parseFloat(closingAmount) > (summary?.expected_balance || 0) ? '💰 Sobra no Caixa' : '⚠️ Falta no Caixa'}
                        </p>
                        <p className={`text-sm ${
                          parseFloat(closingAmount) > (summary?.expected_balance || 0)
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          Diferença: {formatPrice(Math.abs(parseFloat(closingAmount) - (summary?.expected_balance || 0)))}
                          {parseFloat(closingAmount) > (summary?.expected_balance || 0) ? ' a mais' : ' a menos'}
                        </p>
                        <p className={`text-xs mt-1 ${
                          parseFloat(closingAmount) > (summary?.expected_balance || 0)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          Saldo esperado: {formatPrice(summary?.expected_balance || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCancelClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmClose}
                  disabled={!closingAmount}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Fechar Caixa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cash Entry Modal */}
      {showCashEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {entryType === 'income' ? 'Adicionar Entrada' : 'Adicionar Saída'} - Loja 2
              </h3>
              <button
                onClick={() => setShowCashEntry(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as 'income' | 'expense')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="income">Entrada</option>
                  <option value="expense">Saída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={entryDescription}
                  onChange={(e) => setEntryDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição da movimentação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={entryPaymentMethod}
                  onChange={(e) => setEntryPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCashEntry(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCashEntry}
                  disabled={!entryAmount || !entryDescription}
                  className={`flex-1 ${entryType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store2CashRegisterMenu;