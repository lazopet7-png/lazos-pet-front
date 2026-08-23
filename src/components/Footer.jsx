import React from 'react';

/**
 * Footer del memorial público.
 *
 * Antes era una losa blanca heredada de la versión de personas, con el logo
 * grabado de Lazos de Vida (una imagen cuadrada de 500x500 con el logo al
 * centro y márgenes enormes) forzado a 160x76 px: las letras quedaban de unos
 * 15 px y no se leía nada. Ahora la página cierra con la misma marca con la
 * que abre en el topbar, sobre el fondo de la propia página.
 */
const Footer = () => {
  return (
    <footer className="pet-memorial-footer">
      <div className="pet-memorial-footer-top">
        <div className="pet-memorial-brand">
          <span className="pet-brand-mark" aria-hidden="true">🐾</span>
          <span>
            Lazos de Vida
            <small>Memorial Pets</small>
          </span>
        </div>

        <nav className="pet-memorial-footer-links" aria-label="Enlaces legales">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Contacto</a>
        </nav>
      </div>

      <div className="pet-memorial-footer-legal">
        <p>
          &copy; {new Date().getFullYear()} Lazos de Vida Pets. Todos los derechos reservados.
        </p>
        <p>
          Diseñado por{' '}
          <a href="https://bitsdeve.com" target="_blank" rel="noopener noreferrer">
            bitsdeve
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
