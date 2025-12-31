import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Receipt, PiggyBank, GraduationCap, Menu, LogOut, Settings, Bell, PlusCircle, Filter, Search, X, Calendar as CalendarIcon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { KidsMode } from './components/KidsMode';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Transaction, Goal, CategoryType } from './types';

// Mock Initial Data (Translated)
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-01', description: 'Salario', amount: 5000, category: 'Ingresos', type: 'income', user: 'Papá' },
  { id: '2', date: '2023-10-02', description: 'Hipoteca', amount: 1200, category: 'Vivienda', type: 'fixed', user: 'Conjunto' },
  { id: '3', date: '2023-10-05', description: 'Supermercado', amount: 150, category: 'Comestibles', type: 'variable', user: 'Mamá' },
  { id: '4', date: '2023-10-06', description: 'Suscripción Netflix', amount: 15, category: 'Entretenimiento', type: 'discretionary', user: 'Conjunto' },
  { id: '5', date: '2023-10-08', description: 'Factura Electricidad', amount: 120, category: 'Servicios', type: 'fixed', user: 'Conjunto' },
  { id: '6', date: '2023-10-10', description: 'Fondo de Emergencia', amount: 500, category: 'Ahorro', type: 'savings', user: 'Papá' },
  { id: '7', date: '2023-10-12', description: 'Cena Familiar', amount: 85, category: 'Restaurante', type: 'discretionary', user: 'Conjunto' },
  { id: '8', date: '2023-10-15', description: 'Seguro de Auto', amount: 100, category: 'Seguros', type: 'fixed', user: 'Mamá' },
  { id: '9', date: '2023-10-18', description: 'Gasolinera', amount: 45, category: 'Transporte', type: 'variable', user: 'Mamá' },
  { id: '10', date: '2023-10-20', description: 'Cine', amount: 40, category: 'Entretenimiento', type: 'discretionary', user: 'Papá' },
];

const INITIAL_GOALS: Goal[] = [
  { id: '1', name: 'Vacaciones de Verano', targetAmount: 3000, currentAmount: 1200, deadline: '2024-06-01', icon: '🏖️' },
  { id: '2', name: 'Nueva Laptop', targetAmount: 1500, currentAmount: 800, deadline: '2023-12-25', icon: '💻' },
  { id: '3', name: 'Fondo de Emergencia', targetAmount: 20000, currentAmount: 12400, deadline: '2025-01-01', icon: '🚑' },
];

type View = 'dashboard' | 'transactions' | 'kids' | 'goals';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);

  // Filter State
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState<CategoryType | 'all'>('all');

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    setIsModalOpen(false);
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesDate = filterDate ? t.date.startsWith(filterDate) : true;
      const matchesCategory = filterCategory ? t.category === filterCategory : true;
      const matchesType = filterType !== 'all' ? t.type === filterType : true;
      return matchesDate && matchesCategory && matchesType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterDate, filterCategory, filterType]);

  // Derived lists for dropdowns
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category))).sort();
  }, [transactions]);

  const resetFilters = () => {
    setFilterDate('');
    setFilterCategory('');
    setFilterType('all');
  };

  const getTitle = (view: View) => {
    switch(view) {
      case 'dashboard': return 'Panel Principal';
      case 'transactions': return 'Transacciones';
      case 'goals': return 'Metas Financieras';
      case 'kids': return 'Modo Niños';
      default: return 'Finanzas';
    }
  }

  if (currentView === 'kids') {
    return (
      <>
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="fixed top-4 right-4 z-50 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors"
        >
          <LogOut className="w-6 h-6 text-slate-700" />
        </button>
        <KidsMode />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">F</span>
            </div>
            {sidebarOpen && <span className="font-bold text-xl tracking-tight">FinanzasPro</span>}
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="Panel Principal" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            icon={<Receipt />} 
            label="Transacciones" 
            active={currentView === 'transactions'} 
            onClick={() => setCurrentView('transactions')}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            icon={<PiggyBank />} 
            label="Metas" 
            active={currentView === 'goals'} 
            onClick={() => setCurrentView('goals')}
            expanded={sidebarOpen}
          />
          
          <div className="pt-8 pb-2">
            <div className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
              Familia
            </div>
          </div>
          
          <SidebarItem 
            icon={<GraduationCap />} 
            label="Modo Niños" 
            active={currentView === 'kids'} 
            onClick={() => setCurrentView('kids')}
            expanded={sidebarOpen}
            color="text-yellow-400 hover:text-yellow-300"
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {getTitle(currentView)}
          </h2>
          <div className="flex items-center space-x-4">
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700">Familia López</p>
                <p className="text-xs text-slate-500">Plan Pro</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                FL
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <Dashboard transactions={transactions} goals={goals} />
          )}

          {currentView === 'transactions' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              
              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center flex-1">
                  <div className="flex items-center gap-2 text-slate-500 font-medium mr-2">
                    <Filter className="w-4 h-4" /> Filtros:
                  </div>
                  
                  {/* Month Filter */}
                  <div className="relative">
                    <input 
                      type="month" 
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Type Filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as CategoryType | 'all')}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="all">Todos los Tipos</option>
                    <option value="fixed">Gastos Fijos</option>
                    <option value="variable">Gastos Variables</option>
                    <option value="discretionary">Gastos Ocio</option>
                    <option value="income">Ingresos</option>
                    <option value="savings">Ahorros</option>
                  </select>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Todas las Categorías</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Reset Button */}
                  {(filterDate || filterCategory || filterType !== 'all') && (
                    <button 
                      onClick={resetFilters}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium px-2"
                    >
                      <X className="w-3 h-3" /> Limpiar
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> Nueva Transacción
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <Receipt className="w-4 h-4 text-slate-500" />
                     Historial
                     <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                       {filteredTransactions.length}
                     </span>
                   </h3>
                </div>
                {filteredTransactions.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Descripción</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4">Tipo</th>
                        <th className="px-6 py-4">Usuario</th>
                        <th className="px-6 py-4 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                            {new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800">{t.description}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{t.category}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${t.type === 'income' ? 'bg-emerald-100 text-emerald-800' : ''}
                              ${t.type === 'fixed' ? 'bg-slate-100 text-slate-800' : ''}
                              ${t.type === 'variable' ? 'bg-blue-100 text-blue-800' : ''}
                              ${t.type === 'discretionary' ? 'bg-amber-100 text-amber-800' : ''}
                              ${t.type === 'savings' ? 'bg-purple-100 text-purple-800' : ''}
                            `}>
                              {t.type === 'fixed' ? 'Fijo' : 
                               t.type === 'variable' ? 'Variable' : 
                               t.type === 'discretionary' ? 'Ocio' : 
                               t.type === 'income' ? 'Ingreso' : 'Ahorro'}
                            </span>
                          </td>
                           <td className="px-6 py-4 text-sm text-slate-500">{t.user}</td>
                          <td className={`px-6 py-4 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                    <Search className="w-12 h-12 mb-3 opacity-20" />
                    <p>No se encontraron transacciones con estos filtros.</p>
                    <button onClick={resetFilters} className="mt-2 text-indigo-600 text-sm hover:underline">Limpiar filtros</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'goals' && (
            <div className="p-8 max-w-6xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">Tus Metas de Ahorro</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                  <span>Nueva Meta</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {goals.map((goal) => {
                  const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                  return (
                    <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <span className="text-9xl grayscale">{goal.icon}</span>
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm">
                            {goal.icon}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${percent >= 100 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {percent}%
                          </div>
                        </div>

                        <h4 className="text-xl font-bold text-slate-800 mb-1">{goal.name}</h4>
                        <p className="text-sm text-slate-500 mb-6">Meta: {new Date(goal.deadline).toLocaleDateString('es-ES')}</p>

                        <div className="space-y-2">
                           <div className="flex justify-between text-sm font-medium">
                              <span className="text-slate-600">${goal.currentAmount.toLocaleString()}</span>
                              <span className="text-slate-400">de ${goal.targetAmount.toLocaleString()}</span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${percent >= 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                                style={{ width: `${percent}%` }}
                              ></div>
                           </div>
                        </div>

                        <button className="mt-6 w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium">
                          Añadir Fondos
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Floating AI */}
        <AIAssistant transactions={transactions} goals={goals} />
        <AddTransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddTransaction}
        />
      </main>
    </div>
  );
}

// Sub-component for Sidebar Items
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
  color?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, expanded, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group
      ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      ${color && !active ? color : ''}
    `}
  >
    <div className={`${active ? 'text-white' : ''} ${!active && color ? color : ''}`}>
      {icon}
    </div>
    <span className={`ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
      {label}
    </span>
    {!expanded && active && (
      <div className="absolute left-16 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
        {label}
      </div>
    )}
  </button>
);

export default App;