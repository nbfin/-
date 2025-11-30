import React from 'react';
import Calculator from './components/Calculator';
import InfoCards from './components/InfoCards';

const App: React.FC = () => {
  return (
    <div className="min-h-screen pb-12">
      {/* Header Decoration - Softer Gradient */}
      <div className="h-48 bg-gradient-to-br from-cyan-400 to-cyan-600 w-full absolute top-0 left-0 z-0"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <div className="text-center mb-10 text-white">
           <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
             各類扣繳及補充保費計算機
           </h1>
           <p className="text-cyan-50 text-lg opacity-90 max-w-2xl mx-auto font-medium">
             教你分辨 4 種勞報單常見所得類別，輕鬆計算二代健保與代扣稅款。
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Calculator (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <Calculator />
          </div>

          {/* Right Column: Info Cards */}
          <div className="lg:col-span-7 space-y-6">
             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
               <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">所得類別介紹</h3>
               <InfoCards />
             </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
           <p>資料來源：各類所得扣繳PDF整理</p>
           <p className="mt-1">僅供參考，實際稅務請依國稅局最新規定為準</p>
        </div>
      </div>
    </div>
  );
};

export default App;