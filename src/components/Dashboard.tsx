import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Target, ShieldCheck, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { Transaction, Goal } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  goals: Goal[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, goals }) => {
  
  // Calculate Totals
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter(t => t.type !== 'income' && t.type !== 'savings')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expenses;

  // 50/30/20 Logic Calculation
  const ruleAnalysis = useMemo(() => {
    const fixed = transactions.filter(t => t.type === 'fixed').reduce((a, c) => a + c.amount, 0);
    const variable = transactions.filter(t => t.type === 'variable').reduce((a, c) => a + c.amount, 0); // "Needs" can overlap
    const wants = transactions.filter(t => t.type === 'discretionary').reduce((a, c) => a + c.amount, 0);
    const savings = transactions.filter(t => t.type === 'savings').reduce((a, c) => a + c.amount, 0);
    
    // Combining Fixed + Variable as "Needs" for simple 50/30/20 mapping in this context
    const needsTotal = fixed + variable; 
    
    return [
      { name: 'Necesidades (50%)', value: needsTotal, color: '#6366f1', target: income * 0.5 },
      { name: 'Deseos (30%)', value: wants, color: '#f59e0b', target: income * 0.3 },
      { name: 'Ahorros (20%)', value: savings, color: '#10b981', target: income * 0.2 },
    ];
  }, [transactions, income]);

  // Trend Data (Income vs Expenses over time)
  const trendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const map = new Map();
    
    sorted.forEach(t => {
       const date = new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
       if (!map.has(date)) {
         map.set(date, { name: date, ingresos: 0, gastos: 0 });
       }
       const entry = map.get(date);
       if (t.type === 'income') {
         entry.ingresos += t.amount;
       } else if (t.type !== 'savings') {
          entry.gastos += t.amount;
       }
    });
    return Array.from(map.values());
  }, [transactions]);

  // Category Breakdown (Specific categories sorted by amount)
  const categoryData = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      if (t.type === 'income' || t.type === 'savings') return;
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return Array.from(map).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Balance Total</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">${balance.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="font-medium">+2.5%</span>
            <span className="text-slate-400 ml-1">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Ingresos Mensuales</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">${income.toLocaleString()}</h3>
            </div>
             <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Gastos Totales</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">${expenses.toLocaleString()}</h3>
            </div>
             <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
        </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Fondo de Emergencia</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">$12,400</h3>
            </div>
             <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">65% de meta de 6 meses</p>
        </div>
      </div>

      {/* NEW: Financial Movement Trend */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
             <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">Movimiento de Ingresos y Gastos</h4>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
              <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorGastos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 50/30/20 Rule Visualization */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-4">Regla 50/30/20</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={ruleAnalysis}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 11}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" name="Gasto Real" barSize={20} radius={[0, 4, 4, 0]}>
                   {ruleAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
                <Bar dataKey="target" name="Meta (Regla)" barSize={10} fill="#e2e8f0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {ruleAnalysis.map((item) => (
              <div key={item.name}>
                 <p className="text-xs text-slate-500">{item.name}</p>
                 <p className="font-semibold text-sm" style={{color: item.color}}>${item.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: Detailed Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <PieIcon className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">¿Dónde gastas más?</h4>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData.slice(0, 6)} // Top 6 categories
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monto']}
                />
                <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Goals Section (Summary) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h4 className="text-lg font-bold text-slate-800 mb-6">Resumen de Metas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-slate-100 rounded-xl p-5 hover:border-indigo-100 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{goal.icon}</span>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-md">
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </span>
              </div>
              <h5 className="font-semibold text-slate-700">{goal.name}</h5>
              <div className="flex justify-between text-sm text-slate-500 mt-1 mb-3">
                <span>${goal.currentAmount.toLocaleString()}</span>
                <span>${goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};