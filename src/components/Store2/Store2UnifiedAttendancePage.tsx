import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Settings, CreditCard, LogOut } from 'lucide-react';

const Store2UnifiedAttendancePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const menuItems = [
    {
      id: 'sales',
      title: 'Vendas',
      description: 'Sistema de PDV da Loja 2',
      icon: Store,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      onClick: () => navigate('/loja2')
    },
    {
      id: 'cash',
      title: 'Caixas',
      description: 'Controle de caixa da Loja 2',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      onClick: () => navigate('/caixa_loja2')
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Configurações da Loja 2',
      icon: Settings,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      onClick: () => navigate('/configuracoes_loja2')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Atendimento Loja 2</h1>
                <p className="text-sm text-gray-500">Sistema de Atendimento</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Principal</h2>
          <p className="text-gray-600">Selecione uma opção para continuar</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 ${item.hoverColor}`}
              >
                <div className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm group-hover:text-gray-500 transition-colors">
                    {item.description}
                  </p>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Store className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Sistema PDV</p>
              <p className="text-xs text-blue-700">Vendas e atendimento</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Controle de Caixa</p>
              <p className="text-xs text-green-700">Abertura e fechamento</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Configurações</p>
              <p className="text-xs text-purple-700">Ajustes do sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store2UnifiedAttendancePage;