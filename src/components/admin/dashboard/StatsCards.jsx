import { LuPawPrint, LuQrCode, LuUsers } from 'react-icons/lu';

const formatNumber = (value) => {
  const number = Number(value) || 0;

  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return number.toString();
};

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Clientes',
      value: stats?.totalClients,
      change: stats?.clientsChange || '+0',
      icon: LuUsers,
      iconClass: 'bg-pet-100 text-pet-700',
    },
    {
      title: 'Memoriales activos',
      value: stats?.totalMemorials,
      change: stats?.memorialsChange || '+0',
      icon: LuPawPrint,
      iconClass: 'bg-clay-100 text-clay-700',
    },
    {
      title: 'Códigos QR',
      value: stats?.totalQRs,
      change: stats?.qrChange || '+0',
      icon: LuQrCode,
      iconClass: 'bg-pet-100 text-pet-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => {
        const CardIcon = card.icon;

        return (
          <article key={card.title} className="pet-admin-card overflow-hidden">
            <div className="flex items-center p-5">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}>
                <CardIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <dl className="ml-4 min-w-0 flex-1">
                <dt className="truncate text-sm font-medium text-gray-500">{card.title}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-pet-900">
                  {formatNumber(card.value)}
                </dd>
              </dl>
            </div>
            <div className="flex items-center justify-between border-t border-pet-100 bg-pet-50/70 px-5 py-3 text-xs">
              <span className="font-medium text-pet-700">{card.change} este mes</span>
              <span className="text-gray-500">Total registrado</span>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default StatsCards;
