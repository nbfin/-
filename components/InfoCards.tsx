import React from 'react';
import { 
  Briefcase, 
  PenTool, 
  Clock, 
  HelpCircle,
  AlertCircle,
  Home,
  Trophy
} from 'lucide-react';
import { INCOME_TYPE_DESCRIPTIONS } from '../constants';
import { IncomeType } from '../types';

const InfoCards: React.FC = () => {
  const cards = [
    {
      code: '9A',
      title: '執行業務所得',
      subtitle: '代號 9A - 承攬關係',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_9A],
      tags: ['律師', '會計師', '表演人', '醫師'],
      icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-50',
      borderColor: 'border-indigo-100'
    },
    {
      code: '9B',
      title: '稿費',
      subtitle: '代號 9B - 承攬關係',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_9B],
      note: '每年有 18 萬免稅額度，超過後可扣除 30% 費用計入個人所得',
      tags: ['作曲', '漫畫', '版稅', '演講費'],
      icon: <PenTool className="w-6 h-6 text-pink-500" />,
      color: 'bg-pink-50',
      borderColor: 'border-pink-100'
    },
    {
      code: '51',
      title: '租賃所得',
      subtitle: '代號 51',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_51],
      tags: ['房租', '土地', '車位'],
      icon: <Home className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      code: '50',
      title: '兼職所得',
      subtitle: '代號 50 - 雇傭關係',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_50],
      tags: ['打工仔', '兼職人員', '薪資'],
      icon: <Clock className="w-6 h-6 text-[#5DBAC4]" />,
      color: 'bg-[#F2FBFC]',
      borderColor: 'border-[#AFDFE4]'
    },
    {
      code: '91',
      title: '競賽及中獎',
      subtitle: '代號 91',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_91],
      tags: ['比賽獎金', '摸彩'],
      icon: <Trophy className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-50',
      borderColor: 'border-purple-100'
    },
    {
      code: '92',
      title: '其他所得',
      subtitle: '代號 92',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_92],
      tags: ['無法歸類', '機會較少'],
      icon: <HelpCircle className="w-6 h-6 text-gray-500" />,
      color: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div key={card.code} className={`p-6 rounded-2xl border ${card.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
              {card.code}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{card.title}</h3>
          <p className="text-xs font-medium text-gray-500 mb-3">{card.subtitle}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {card.desc}
          </p>
          {card.note && (
            <div className="mb-4 text-xs bg-gray-50 p-2 rounded border border-gray-100 text-gray-600">
               <span className="font-bold text-gray-700">備註：</span>{card.note}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {card.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      
      <div className="md:col-span-2 bg-[#F2FBFC] rounded-2xl p-6 border border-[#AFDFE4] flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[#5DBAC4] flex-shrink-0 mt-1" />
        <div>
           <h4 className="font-bold text-[#3F8E96] mb-1">小知識：居住者定義</h4>
           <p className="text-sm text-[#4A8890] leading-relaxed">
             「居住者」指本國籍或外國籍在台居留滿 183 天者。未滿 183 天則視為「非居住者」，其扣繳稅率通常較高（例如 9A/9B 超過 5,000 元即扣 20%）。
           </p>
        </div>
      </div>

      <div className="md:col-span-2 bg-[#F2FBFC] rounded-2xl p-6 border border-[#AFDFE4] flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-[#5DBAC4] flex-shrink-0 mt-1" />
        <div>
           <h4 className="font-bold text-[#3F8E96] mb-2">執行業務類別須注意：</h4>
           <ul className="text-sm text-[#4A8890] space-y-1">
             <li>1. <span className="font-bold text-[#36727B]">低於兩萬</span>：不需扣繳、不需 2.11% 二代健保補充保費</li>
             <li>2. <span className="font-bold text-[#36727B]">剛好兩萬</span>：不需扣繳、需要 2.11% 二代健保補充保費</li>
             <li>3. <span className="font-bold text-[#36727B]">高於兩萬</span>：需扣繳 10% 以及 2.11% 二代健保補充保費</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;