const formatYear = (date) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.getUTCFullYear();
};

const ProfileHeader = ({ memorialData, onMusicButtonClick, musicTracks = [] }) => {
  const birthYear = formatYear(memorialData?.fechaNacimiento);
  const deathYear = formatYear(memorialData?.fechaFallecimiento);
  const customBackground = memorialData?.fondos?.[0]?.url || memorialData?.fondos?.[0]?.archivo?.url;
  const petDescription = [memorialData?.mascota?.especie, memorialData?.mascota?.raza]
    .filter(Boolean)
    .join(' · ') || memorialData?.profesion;

  return (
    <header className="pet-memorial-hero">
      {customBackground && (
        <img
          className="pet-memorial-ambient-bg"
          src={customBackground}
          alt=""
          aria-hidden="true"
        />
      )}

      <div className="pet-memorial-topbar">
        <div className="pet-memorial-brand">
          <span className="pet-brand-mark" aria-hidden="true">🐾</span>
          <span>
            Lazos de Vida
            <small>Memorial Pets</small>
          </span>
        </div>

        {musicTracks.length > 0 && (
          <button
            type="button"
            className="pet-music-trigger"
            onClick={onMusicButtonClick}
            aria-label={`Abrir música del memorial. ${musicTracks.length} canciones disponibles`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            Su música
          </button>
        )}
      </div>

      <div className="pet-memorial-hero-content">
        <div className="pet-portrait-wrap">
          <div className="pet-portrait-ring" aria-hidden="true" />
          <div className="pet-portrait">
            {memorialData?.fotoPerfil ? (
              <img
                src={memorialData.fotoPerfil}
                alt={`Retrato de ${memorialData.nombre}`}
              />
            ) : (
              <span role="img" aria-label="Mascota">🐾</span>
            )}
          </div>
          <span className="pet-portrait-paw" aria-hidden="true">🐾</span>
        </div>

        <p className="pet-memorial-eyebrow">Un amor que deja huella</p>
        <h1>Memorial de {memorialData?.nombre || 'nuestra mascota'}</h1>

        {(birthYear || deathYear) && (
          <p className="pet-lifespan">
            {birthYear || '—'} <span aria-hidden="true">♡</span> {deathYear || '—'}
          </p>
        )}

        {petDescription && <p className="pet-kind">{petDescription}</p>}

        <p className="pet-quote">
          “{memorialData?.frase || 'Tu amor y tus recuerdos vivirán siempre con nosotros.'}”
        </p>
      </div>
    </header>
  );
};

export default ProfileHeader;
