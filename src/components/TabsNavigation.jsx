const tabs = [
  { id: 'historia', label: 'Biografía', icon: '♡' },
  { id: 'fotos', label: 'Fotos', icon: '▧' },
  { id: 'videos', label: 'Videos', icon: '▷' },
  { id: 'comentarios', label: 'Recuerdos', icon: '✦' }
];

const TabsNavigation = ({ activeTab, setActiveTab }) => (
  <nav className="pet-memorial-tabs" aria-label="Secciones del memorial">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        onClick={() => setActiveTab(tab.id)}
        className={activeTab === tab.id ? `active pet-tab-${tab.id}` : ''}
        aria-current={activeTab === tab.id ? 'page' : undefined}
      >
        <span aria-hidden="true">{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </nav>
);

export default TabsNavigation;
