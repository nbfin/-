import React from 'react';
import { 
  Briefcase, 
  PenTool, 
  Clock, 
  HelpCircle,
  AlertCircle
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
      tags: ['作曲', '漫畫', '版稅', '演講費'],
      icon: <PenTool className="w-6 h-6 text-pink-500" />,
      color: 'bg-pink-50',
      borderColor: 'border-pink-100'
    },
    {
      code: '50',
      title: '兼職所得',
      subtitle: '代號 50 - 雇傭關係',
      desc: INCOME_TYPE_DESCRIPTIONS[IncomeType.TYPE_50],
      tags: ['打工仔', '兼職人員', '薪資'],
      icon: <Clock className="w-6 h-6 text-cyan-500" />,
      color: 'bg-cyan-50',
      borderColor: 'border-cyan-100'
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
          <div className="flex flex-wrap gap-2">
            {card.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      
      <div className="md:col-span-2 bg-cyan-50 rounded-2xl p-6 border border-cyan-200 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
        <div>
           <h4 className="font-bold text-cyan-800 mb-1">小知識：居住者定義</h4>
           <p className="text-sm text-cyan-700 leading-relaxed">
             「居住者」指本國籍或外國籍在台居留滿 183 天者。未滿 183 天則視為「非居住者」，其扣繳稅率通常較高（例如 9A/9B 超過 5,000 元即扣 20%）。
           </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;