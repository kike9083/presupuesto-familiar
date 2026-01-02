import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Receipt, PiggyBank, GraduationCap, Menu, LogOut, Settings, Bell, PlusCircle, Filter, Search, X, Calendar as CalendarIcon, Pencil, Trash2 } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { KidsMode } from './components/KidsMode';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddGoalModal } from './components/AddGoalModal';
import { Transaction, Goal, CategoryType } from './types';

// Mock Initial Data (Translated)
const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_GOALS: Goal[] = [];

type View = 'dashboard' | 'transactions' | 'kids' | 'goals';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  /* -------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------- */
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('presupuesto_transactions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('presupuesto_goals_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Persistence
  useEffect(() => {
    console.log('Guardando transacciones:', transactions);
    localStorage.setItem('presupuesto_transactions_v1', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    console.log('Guardando metas:', goals);
    localStorage.setItem('presupuesto_goals_v1', JSON.stringify(goals));
  }, [goals]);

  // Filter State
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [filterQuincena, setFilterQuincena] = useState<'all' | '1' | '2'>(new Date().getDate() <= 15 ? '1' : '2');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState<CategoryType | 'all'>('all');

  /* -------------------------------------------------------------
   * HANDLERS
   * ------------------------------------------------------------- */
  const handleSaveTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      // Edit mode
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
      setEditingTransaction(null);
    } else {
      // Add mode
      setTransactions(prev => [transaction, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar esta transacción?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveGoal = (goal: Goal) => {
    setGoals(prev => {
      const exists = prev.find(g => g.id === goal.id);
      if (exists) {
        return prev.map(g => g.id === goal.id ? goal : g);
      }
      return [...prev, goal];
    });
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesDate = filterDate ? t.date.startsWith(filterDate) : true;
      const matchesCategory = filterCategory ? t.category === filterCategory : true;
      const matchesType = filterType !== 'all' ? t.type === filterType : true;

      let matchesQuincena = true;
      if (filterQuincena !== 'all') {
        const day = parseInt(t.date.split('-')[2]);
        if (filterQuincena === '1') {
          matchesQuincena = day <= 15;
        } else {
          matchesQuincena = day > 15;
        }
      }

      return matchesDate && matchesCategory && matchesType && matchesQuincena;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterDate, filterCategory, filterType, filterQuincena]);

  // Derived lists for dropdowns
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category))).sort();
  }, [transactions]);

  const resetFilters = () => {
    setFilterDate(new Date().toISOString().slice(0, 7));
    setFilterQuincena(new Date().getDate() <= 15 ? '1' : '2');
    setFilterCategory('');
    setFilterType('all');
  };

  const getTitle = (view: View) => {
    switch (view) {
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
          title="Salir del Modo Niños"
          aria-label="Salir del Modo Niños"
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
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg - slate - 900 text - white transition - all duration - 300 flex flex - col z - 20`}
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
            <div className={`px - 4 text - xs font - semibold text - slate - 500 uppercase tracking - wider ${!sidebarOpen && 'hidden'} `}>
              Familia
            </div>
          </div>

          <SidebarItem
            icon={<GraduationCap />}
            label="Modo Niños"
            active={(currentView as any) === 'kids'}
            onClick={() => setCurrentView('kids')}
            expanded={sidebarOpen}
            color="text-yellow-400 hover:text-yellow-300"
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
            title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
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
            <button
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              title="Notificaciones"
              aria-label="Notificaciones"
            >
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
            <div className="space-y-4">
              <div className="px-6 pt-4 flex items-center gap-4 bg-white border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <Filter className="w-4 h-4" /> Periodo:
                </div>
                <input
                  id="period-selector-dashboard"
                  type="month"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none"
                  title="Seleccionar Mes"
                  aria-label="Seleccionar Mes"
                />
                <select
                  id="quincena-selector-dashboard"
                  value={filterQuincena}
                  onChange={(e) => setFilterQuincena(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none"
                  title="Seleccionar Quincena"
                  aria-label="Seleccionar Quincena"
                >
                  <option value="all">Mes Completo</option>
                  <option value="1">1ra Quincena (1-15)</option>
                  <option value="2">2da Quincena (16+)</option>
                </select>
              </div>
              <Dashboard transactions={filteredTransactions} goals={goals} />
            </div>
          )}

          {currentView === 'transactions' && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">

              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center flex-1">
                  <div className="flex items-center gap-2 text-slate-500 font-medium mr-2">
                    <Filter className="w-4 h-4" /> Filtros:
                  </div>

                  {/* Month & Quincena Filter */}
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <input
                        id="period-selector-transactions"
                        type="month"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        title="Seleccionar Mes"
                        aria-label="Seleccionar Mes"
                      />
                      <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    <select
                      id="quincena-selector-transactions"
                      value={filterQuincena}
                      onChange={(e) => setFilterQuincena(e.target.value as any)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                      title="Seleccionar Quincena"
                      aria-label="Seleccionar Quincena"
                    >
                      <option value="all">Mes Completo</option>
                      <option value="1">1ra Quincena</option>
                      <option value="2">2da Quincena</option>
                    </select>
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
                  {(filterDate !== new Date().toISOString().slice(0, 7) || filterQuincena !== 'all' || filterCategory || filterType !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium px-2"
                    >
                      <X className="w-3 h-3" /> Limpiar
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsModalOpen(true);
                  }}
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
                        <th className="px-6 py-4 text-center">Acciones</th>
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
                            <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium capitalize
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
                          <td className={`px - 6 py - 4 text - right font - semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-700'} `}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button
                              onClick={() => handleEditTransaction(t)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Editar transacción"
                              aria-label="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(t.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar transacción"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                <button
                  onClick={() => {
                    setEditingGoal(null);
                    setIsGoalModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
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
                          <div className={`px - 3 py - 1 rounded - full text - sm font - bold ${percent >= 100 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'} `}>
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
                              className={`h - full rounded - full transition - all duration - 1000 ${percent >= 100 ? 'bg-green-500' : 'bg-indigo-600'} `}
                              style={{ width: `${percent}% ` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setEditingGoal(goal);
                            setIsGoalModalOpen(true);
                          }}
                          className="mt-6 w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
                        >
                          Editar Meta / Añadir Fondos
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
        {/* Modal Transaction */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null); // Reset editing transaction on close
          }}
          onSave={handleSaveTransaction}
          initialData={editingTransaction}
        />
        <AddGoalModal
          isOpen={isGoalModalOpen}
          onClose={() => {
            setIsGoalModalOpen(false);
            setEditingGoal(null);
          }}
          onSave={handleSaveGoal}
          editingGoal={editingGoal}
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
    className={`flex items - center w - full p - 3 rounded - lg transition - all duration - 200 group
      ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      ${color && !active ? color : ''}
`}
  >
    <div className={`${active ? 'text-white' : ''} ${!active && color ? color : ''} `}>
      {icon}
    </div>
    <span className={`ml - 3 font - medium whitespace - nowrap overflow - hidden transition - all duration - 300 ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} `}>
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