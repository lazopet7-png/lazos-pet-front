import { useEffect, useRef, useState } from 'react';

const formatDate = (date) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return parsedDate.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

const Historia = ({ memorialData }) => {
  const [expanded, setExpanded] = useState(false);
  const [canCollapse, setCanCollapse] = useState(false);
  const biographyRef = useRef(null);
  const pet = memorialData?.mascota || {};

  useEffect(() => {
    const shouldCollapse = (biographyRef.current?.scrollHeight || 0) > 260;
    setCanCollapse(shouldCollapse);
    setExpanded(!shouldCollapse);
  }, [memorialData?.biografia]);

  const facts = [
    { label: 'Especie', value: pet.especie || memorialData?.profesion, icon: '🐾' },
    { label: 'Raza', value: pet.raza, icon: '♡' },
    { label: 'Sexo', value: pet.sexo && pet.sexo !== 'desconocido' ? pet.sexo : null, icon: '✦' },
    { label: 'Personalidad', value: pet.personalidad, icon: '☀' },
    { label: 'Nacimiento', value: formatDate(memorialData?.fechaNacimiento), icon: '◌' },
    { label: 'Partida', value: formatDate(memorialData?.fechaFallecimiento), icon: '∞' }
  ].filter((fact) => fact.value);

  const favorites = [
    { label: 'Actividad', value: pet.favoritos?.actividad },
    { label: 'Juguete', value: pet.favoritos?.juguete },
    { label: 'Comida', value: pet.favoritos?.comida },
    { label: 'Lugar', value: pet.favoritos?.lugar }
  ].filter((favorite) => favorite.value);

  return (
    <section className="pet-story" aria-labelledby="pet-biography-title">
      <div className="pet-section-label" id="pet-biography-title">
        <span aria-hidden="true">🐾</span> Su biografía
      </div>

      <div
        ref={biographyRef}
        className={!expanded && canCollapse ? 'pet-biography collapsed' : 'pet-biography'}
      >
        {memorialData?.biografia ? (
          memorialData.biografia.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index}>{paragraph}</p> : null
          ))
        ) : (
          <p>Su historia se está preparando con mucho cariño.</p>
        )}
      </div>

      {canCollapse && (
        <button type="button" className="pet-read-more" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Mostrar menos' : 'Leer su historia completa'}
        </button>
      )}

      {facts.length > 0 && (
        <dl className="pet-facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <span aria-hidden="true">{fact.icon}</span>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {favorites.length > 0 && (
        <div className="pet-favorites">
          <h2>Sus cosas favoritas</h2>
          <div>
            {favorites.map((favorite) => (
              <p key={favorite.label}>
                <strong>{favorite.label}</strong>
                <span>{favorite.value}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Historia;
