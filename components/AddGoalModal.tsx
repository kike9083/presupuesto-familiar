import React, { useState, useEffect } from 'react';
import { X, Check, Target, DollarSign, Calendar, Smile } from 'lucide-react';
import { Goal } from '../types';

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goal: Goal) => void;
    editingGoal?: Goal | null;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSave, editingGoal }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('0');
    const [deadline, setDeadline] = useState('');
    const [icon, setIcon] = useState('💰');

    function resetForm() {
        setName('');
        setTargetAmount('');
        setCurrentAmount('0');
        setDeadline('');
        setIcon('💰');
    }

    useEffect(() => {
        if (isOpen) {
            if (editingGoal) {
                setName(editingGoal.name);
                setTargetAmount(editingGoal.targetAmount.toString());
                setCurrentAmount(editingGoal.currentAmount.toString());
                setDeadline(editingGoal.deadline);
                setIcon(editingGoal.icon);
            } else {
                resetForm();
            }
        }
    }, [editingGoal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !targetAmount || !deadline) return;

        const goalData: Goal = {
            id: editingGoal ? editingGoal.id : Date.now().toString(),
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount),
            deadline,
            icon,
        };

        onSave(goalData);
        onClose();
    };

    const icons = ['💰', '🏖️', '💻', '🚑', '🏠', '🚗', '🎓', '🎁'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {editingGoal ? 'Editar Meta' : 'Nueva Meta de Ahorro'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        aria-label="Cerrar modal"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="goal-name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Nombre de la Meta
                        </label>
                        <input
                            id="goal-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Ej: Fondo de Emergencia"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="target-amount" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Monto Objetivo
                            </label>
                            <input
                                id="target-amount"
                                type="number"
                                required
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="current-amount" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Monto Actual
                            </label>
                            <input
                                id="current-amount"
                                type="number"
                                value={currentAmount}
                                onChange={(e) => setCurrentAmount(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="deadline" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Fecha Límite
                        </label>
                        <input
                            id="deadline"
                            type="date"
                            required
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Smile className="w-4 h-4" /> Icono
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {icons.map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIcon(i)}
                                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${icon === i ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200 bg-white'
                                        }`}
                                    aria-label={`Seleccionar icono ${i}`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        <Check className="w-5 h-5" /> {editingGoal ? 'Actualizar Meta' : 'Crear Meta'}
                    </button>
                </form>
            </div>
        </div>
    );
};
