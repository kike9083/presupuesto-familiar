import React, { useState } from 'react';
import { PiggyBank, Heart, ShoppingBag, Plus, Star } from 'lucide-react';
import { KidJar } from '../types';

export const KidsMode: React.FC = () => {
  const [jars, setJars] = useState<KidJar[]>([
    { type: 'spend', amount: 15.50, color: 'bg-blue-400' },
    { type: 'save', amount: 45.00, color: 'bg-green-400' },
    { type: 'give', amount: 5.00, color: 'bg-pink-400' },
  ]);

  const [celebration, setCelebration] = useState(false);

  const addMoney = (index: number) => {
    const newJars = [...jars];
    newJars[index].amount += 1;
    setJars(newJars);
    setCelebration(true);
    setTimeout(() => setCelebration(false), 1000);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'spend': return <ShoppingBag className="w-8 h-8 text-white" />;
      case 'save': return <PiggyBank className="w-8 h-8 text-white" />;
      case 'give': return <Heart className="w-8 h-8 text-white" />;
      default: return null;
    }
  };

  const getLabel = (type: string) => {
    switch(type) {
      case 'spend': return "Gastar";
      case 'save': return "Ahorrar";
      case 'give': return "Compartir";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 p-8 flex flex-col items-center justify-center relative overflow-hidden font-comic">
        {/* Background Decorations */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-50 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-50 blur-xl"></div>

      <h1 className="text-4xl font-extrabold text-sky-800 mb-2 drop-shadow-sm">Panel de Ahorro Junior</h1>
      <p className="text-sky-600 mb-12 text-lg">¡Administrar el dinero es divertido! 🚀</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl z-10">
        {jars.map((jar, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl transform transition-transform hover:scale-105 border-4 border-white">
            <div className={`h-32 rounded-2xl ${jar.color} mb-6 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {getIcon(jar.type)}
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-700 mb-1">{getLabel(jar.type)}</h3>
              <p className="text-4xl font-black text-slate-800 mb-6">${jar.amount.toFixed(2)}</p>
              
              <button 
                onClick={() => addMoney(idx)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" /> Sumar $1
              </button>
            </div>
          </div>
        ))}
      </div>

      {celebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-bounce">
                <Star className="w-48 h-48 text-yellow-400 fill-current drop-shadow-lg" />
            </div>
        </div>
      )}
      
      <div className="mt-12 bg-white/80 backdrop-blur-sm p-6 rounded-2xl max-w-2xl text-center">
          <h4 className="font-bold text-slate-700 mb-2">¿Sabías que?</h4>
          <p className="text-slate-600">Si ahorras $1 cada día, ¡en un año tendrás $365! ¡Suficiente para una bicicleta genial! 🚲</p>
      </div>
    </div>
  );
};