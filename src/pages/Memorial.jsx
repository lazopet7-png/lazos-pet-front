// ====================================
// src/pages/Memorial.jsx - Página pública del memorial
// ====================================
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Importar componentes existentes
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import TabsNavigation from '../components/TabsNavigation';
import Historia from '../components/Historia';
import Contenido from '../components/Contenido';
import Comentarios from '../components/Comentarios';
import MusicPlayer from '../components/MusicPlayer';
import MiniPlayer from '../components/MiniPlayer';

// React Icons para redes sociales
import {
  FaFacebookSquare,
  FaTiktok,
  FaInstagramSquare,
  FaWhatsapp
} from "react-icons/fa";
import { LuPawPrint } from "react-icons/lu";

// Importar servicios
import memorialService from '../services/memorialService';
import mediaService from '../services/mediaService';
import '../styles/pet-memorial.css';

const Memorial = () => {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("historia");
  const [memorialData, setMemorialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el reproductor de música
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicTracks, setMusicTracks] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const audioRef = useRef(new Audio());

  // Cargar datos reales del memorial
  useEffect(() => {
    const loadMemorialData = async () => {
      if (!qrCode) {
        setError('Código QR no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('🔍 Memorial - Cargando datos para QR:', qrCode);
        
        // Llamar a la API pública para obtener el memorial
        const response = await memorialService.getPublicMemorial(qrCode);
        console.log('📊 Memorial - Respuesta de la API:', response);
        
        if (response && response.memorial) {
          console.log('✅ Memorial - Datos cargados correctamente:', response.memorial);
          setMemorialData(response);
          
          // Aplicar CSS personalizado si existe
          if (response.memorial.dashboard) {
            applyDashboardCSS(response.memorial.dashboard);
          }
          
          // Cargar música del memorial
          loadMusicTracks(response.memorial.id);
        } else {
          throw new Error('Memorial no encontrado o inactivo');
        }
        
      } catch (error) {
        console.error('❌ Error cargando memorial:', error);
        setError(error.message || 'Error al cargar el memorial');
      } finally {
        setLoading(false);
      }
    };

    loadMemorialData();

    // Event listeners para el audio
    const audio = audioRef.current;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [qrCode]);

  // Cargar música del memorial
  const loadMusicTracks = async (profileId) => {
    try {
      setMusicLoading(true);
      
      const response = await mediaService.getPublicMedia(profileId, 'musica');
      
      // Extraer el array de media correctamente
      const tracksArray = response.data?.media || response.media || [];
      
      console.log('🎵 Memorial - Tracks cargados:', tracksArray);
      
      // Formatear tracks para el reproductor (solo MP3s)
      const formattedTracks = tracksArray.map(track => {
        console.log('🎵 Procesando track MP3:', {
          id: track.id || track._id,
          tipo: track.tipo,
          url: track.url,
          archivo: track.archivo
        });
        
        // Extraer título con múltiples fallbacks
        let titulo = track.titulo;
        if (!titulo && track.archivo?.nombreOriginal) {
          // Si no hay título, usar el nombre del archivo sin extensión
          titulo = track.archivo.nombreOriginal.replace(/\.[^/.]+$/, "");
        }
        
        return {
          id: track.id || track._id,
          title: titulo || 'Canción sin título',
          url: track.url, // URL directa del archivo
          tipo: track.tipo,
          description: track.descripcion || '',
          archivo: track.archivo,
          dimensiones: track.dimensiones,
          duracion: track.dimensiones?.duracion,
          tamaño: track.archivo?.tamaño
        };
      });
      
      console.log('🎵 Memorial - Tracks formateados:', formattedTracks);
      setMusicTracks(formattedTracks);
      
    } catch (error) {
      console.error('❌ Error cargando música:', error);
      setMusicTracks([]);
    } finally {
      setMusicLoading(false);
    }
  };

  const handleMusicButtonClick = () => {
    setShowMusicPlayer(true);
  };

  const handleCloseMusicPlayer = () => {
    setShowMusicPlayer(false);
  };

  const handleSelectSong = (song) => {
    console.log('🎵 Memorial - Seleccionando canción MP3:', song);
    console.log('🎵 Memorial - URL disponible:', song.url);
    console.log('🎵 Memorial - Tipo de URL:', typeof song.url);
    console.log('🎵 Memorial - URL vacía?:', !song.url);
    
    setCurrentSong(song);
    
    // Solo manejar archivos MP3
    if (song.url) {
      console.log('✅ Memorial - URL válida, reproduciendo MP3:', song.url);
      audioRef.current.src = song.url;
      audioRef.current.play().then(() => {
        console.log('✅ MP3 iniciado correctamente');
        setIsPlaying(true);
      }).catch((error) => {
        console.error('❌ Error reproduciendo MP3:', error);
        console.error('❌ Error completo:', {
          message: error.message,
          name: error.name,
          code: error.code
        });
        alert('Error al reproducir el archivo de audio: ' + error.message);
      });
    } else {
      console.warn('⚠️ URL de audio faltante');
      console.log('🔍 Debug objeto song completo:', song);
      console.log('🔍 Debug keys del objeto:', Object.keys(song));
      alert('No se puede reproducir este archivo de audio');
    }
    
    setShowMusicPlayer(false);
  };

  const handleTogglePlay = () => {
    if (!currentSong) return;
    
    console.log('🎵 Memorial - Toggle play MP3:', { isPlaying });
    
    if (isPlaying) {
      audioRef.current.pause();
      console.log('⏸️ MP3 pausado');
    } else {
      audioRef.current.play().then(() => {
        console.log('▶️ MP3 reanudado');
      }).catch((error) => {
        console.error('❌ Error reanudando MP3:', error);
      });
    }
  };

  const handleStopMusic = () => {
    console.log('🚪 Memorial - Deteniendo música MP3:', currentSong);
    
    // Limpiar audio MP3
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      console.log('⏹️ Audio MP3 detenido y limpiado');
    }
    
    setCurrentSong(null);
    setIsPlaying(false);
    console.log('✅ Música completamente detenida');
  };

  const applyDashboardCSS = (dashboard) => {
    let styleElement = document.getElementById('memorial-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'memorial-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.innerHTML = dashboard.css || '';
    
    // Aplicar variables CSS para colores personalizados
    if (dashboard.colorPrimario) {
      document.documentElement.style.setProperty('--color-primary', dashboard.colorPrimario);
    }
    if (dashboard.colorSecundario) {
      document.documentElement.style.setProperty('--color-secondary', dashboard.colorSecundario);
    }
    if (dashboard.colorAccento) {
      document.documentElement.style.setProperty('--color-accent', dashboard.colorAccento);
    }
  };

  const renderTabContent = () => {
    if (!memorialData) return null;

    switch (activeTab) {
      case "historia":
        return <Historia memorialData={memorialData.memorial} />;
      case "fotos":
        return <Contenido key="fotos" memorialData={memorialData.memorial} contentType="fotos" />;
      case "videos":
        return <Contenido key="videos" memorialData={memorialData.memorial} contentType="videos" />;
      case "comentarios":
        return (
          <Comentarios 
            qrCode={qrCode}
            comentarios={memorialData.comentarios || []}
            configuracion={memorialData.configuracionComentarios}
          />
        );
      default:
        return <Historia memorialData={memorialData.memorial} />;
    }
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="pet-memorial-status">
        <div className="pet-memorial-status-card">
          <span className="pet-memorial-status-paws" aria-hidden="true">
            <LuPawPrint />
            <LuPawPrint />
            <LuPawPrint />
          </span>
          <p className="pet-memorial-status-title" role="status">Cargando memorial…</p>
          <p className="pet-memorial-status-hint">Obteniendo datos del servidor</p>
        </div>
      </div>
    );
  }

  if (error || !memorialData) {
    // Un fallo de red no es un memorial inexistente. El servidor puede tardar
    // en despertar, y decirle al visitante que su QR no existe sería mentirle.
    // Cubre timeout, caída de red y 5xx (mientras el backend arranca responde
    // 502/503, no siempre llega a agotar el timeout).
    const fallaDeRed = /network|timeout|econn|status code 5/i.test(error || '');

    return (
      <div className="pet-memorial-status">
        <div className="pet-memorial-status-card">
          <span className="pet-memorial-status-paws" aria-hidden="true">
            <LuPawPrint />
          </span>
          <p className="pet-memorial-status-title">
            {fallaDeRed ? 'No pudimos cargar el memorial' : 'Memorial no encontrado'}
          </p>
          <p className="pet-memorial-status-hint">
            {fallaDeRed
              ? 'El servidor tardó en responder. Espera unos segundos y vuelve a intentarlo.'
              : 'El código QR no corresponde a ningún memorial activo.'}
          </p>
          <button
            type="button"
            className="pet-memorial-status-action"
            onClick={() => (fallaDeRed ? window.location.reload() : navigate('/'))}
          >
            {fallaDeRed ? 'Reintentar' : 'Volver al inicio'}
          </button>
        </div>
      </div>
    );
  }

  const memorial = memorialData.memorial;
  const theme = memorial.dashboard?.tema || 'clasico';

  return (
    <div className={`pet-memorial-page memorial theme-${theme}`}>
      <main className="pet-memorial-shell">
        <ProfileHeader
          memorialData={memorial}
          onMusicButtonClick={handleMusicButtonClick}
          musicTracks={musicTracks}
        />

        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="pet-memorial-content">
          {renderTabContent()}
        </div>
      </main>
      
      {/* Redes sociales del memorial - estilo navbar */}
      <div className="pet-socials">
        <div>
          <div className="text-center">
            <h3>
              También estamos cerca de ti
            </h3>
            <div className="pet-social-links">
              <a 
                href="https://www.facebook.com/qr_lazosdevida"
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
              >
                <FaFacebookSquare size={20} />
              </a>
              <a 
                href="https://www.instagram.com/qr_lazosdevida"
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <FaInstagramSquare size={20} />
              </a>
              <a 
                href="https://www.tiktok.com/@qr_lazosdevida"
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok"
              >
                <FaTiktok size={20} />
              </a>
              <a 
                href="https://wa.me/56933783343"
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Reproductor de música */}
      {showMusicPlayer && musicTracks.length > 0 && (
        <MusicPlayer 
          songs={musicTracks}
          onClose={handleCloseMusicPlayer}
          onSelectSong={handleSelectSong}
          loading={musicLoading}
        />
      )}

      {/* Mini reproductor */}
      {currentSong && musicTracks.length > 0 && (
        <MiniPlayer 
          song={currentSong}
          onStop={handleStopMusic}
          onTogglePlay={handleTogglePlay}
          isPlaying={isPlaying}
        />
      )}

    </div>
  );
};

export default Memorial;
