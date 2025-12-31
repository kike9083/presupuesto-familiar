import React, { useState } from 'react';
import { X, Check, DollarSign, Calendar, Tag, FileText, Layers } from 'lucide-react';
import { CategoryType, Transaction } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<CategoryType>('variable');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [user, setUser] = useState('Conjunto');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      date,
      description,
      amount: parseFloat(amount),
      category: category || 'General',
      type,
      user,
    };
    onSave(newTx);
    resetForm();
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setType('variable');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const expenseTypes = [
    { id: 'fixed', label: 'Fijo', desc: 'Renta, Servicios', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'variable', label: 'Variable', desc: 'Comida, Gas', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'discretionary', label: 'Ocio', desc: 'Cine, Cenas', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Registrar Movimiento</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Tipo de Movimiento
            </label>
            <div className="grid grid-cols-3 gap-3">
              {expenseTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as CategoryType)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    type === t.id 
                      ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className={`font-bold text-sm ${type === t.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {t.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-2">
               <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    type === 'income' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  + Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => setType('savings')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    type === 'savings' ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Ahorro
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Monto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-800"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Descripción
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Ej: Compras de la semana"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Categoría
            </label>
            <input
              type="text"
              list="categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Ej: Alimentación"
            />
            <datalist id="categories">
              <option value="Vivienda" />
              <option value="Alimentación" />
              <option value="Transporte" />
              <option value="Servicios" />
              <option value="Entretenimiento" />
              <option value="Salud" />
              <option value="Educación" />
              <option value="Ropa" />
            </datalist>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> Guardar Transacción
          </button>
        </form>
      </div>
    </div>
  );
};