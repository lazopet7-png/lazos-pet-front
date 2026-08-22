// ====================================
// src/components/admin/memorials/MemorialForm.jsx - Formulario de memorial
// ====================================
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { memorialService, clientService, qrService } from '../../../services';

const MemorialForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { clientId, memorialId } = params;
  const isEdit = !!memorialId;
  
  // Debug: Ver qué parámetros estamos recibiendo
  console.log('=== DEBUG MEMORIAL FORM ===');
  console.log('Todos los params:', params);
  console.log('clientId:', clientId);
  console.log('memorialId:', memorialId);
  console.log('isEdit:', isEdit);
  console.log('window.location.pathname:', window.location.pathname);
  
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    fechaNacimiento: '',
    fechaFallecimiento: '',
    profesion: '',
    frase: '',
    biografia: '',
    mascota: {
      especie: '',
      raza: '',
      sexo: '',
      personalidad: '',
      favoritos: {
        actividad: '',
        juguete: '',
        comida: '',
        lugar: ''
      }
    },
    ubicacion: {
      ciudad: '',
      pais: '',
      cementerio: ''
    },
    familia: {
      conyuge: '',
      hijos: [],
      padres: []
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);

  const loadClient = useCallback(async () => {
    if (!clientId || clientId === 'undefined') {
      console.error('No se puede cargar cliente: clientId es undefined');
      setError('ID de cliente no válido. Por favor regresa a la lista de clientes.');
      return;
    }
    
    // Validar que el clientId tiene formato de MongoDB ObjectId
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!mongoIdRegex.test(clientId)) {
      console.error('clientId no tiene formato válido de MongoDB:', clientId);
      setError('ID de cliente con formato inválido. Por favor regresa a la lista de clientes.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Llamando a clientService.getClientById con:', clientId);
      const clientData = await clientService.getClientById(clientId);
      console.log('Cliente cargado:', clientData);
      setClient(clientData);
      
      // Pre-llenar algunos datos del cliente
      setFormData(prev => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          ciudad: clientData.ciudad || ''
        }
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const loadMemorial = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Cargando memorial con ID:', memorialId);
      const memorial = await memorialService.getMemorialById(memorialId);
      console.log('Memorial cargado:', memorial);
      
      // 🔧 FIX: Extraer clientId del memorial para modo edición
      const memorialClientId = memorial.cliente?._id || memorial.cliente?.id || memorial.cliente || memorial.clientId;
      console.log('ClientId extraído del memorial:', memorialClientId);
      
      // Actualizar formData con datos del memorial
      setFormData({
        nombre: memorial.nombre || '',
        fechaNacimiento: memorial.fechaNacimiento || '',
        fechaFallecimiento: memorial.fechaFallecimiento || '',
        profesion: memorial.profesion || '',
        frase: memorial.frase || '',
        biografia: memorial.biografia || '',
        mascota: {
          especie: memorial.mascota?.especie || memorial.profesion || '',
          raza: memorial.mascota?.raza || '',
          sexo: memorial.mascota?.sexo || '',
          personalidad: memorial.mascota?.personalidad || '',
          favoritos: {
            actividad: memorial.mascota?.favoritos?.actividad || '',
            juguete: memorial.mascota?.favoritos?.juguete || '',
            comida: memorial.mascota?.favoritos?.comida || '',
            lugar: memorial.mascota?.favoritos?.lugar || ''
          }
        },
        ubicacion: {
          ciudad: memorial.ubicacion?.ciudad || '',
          pais: memorial.ubicacion?.pais || '',
          cementerio: memorial.ubicacion?.cementerio || ''
        },
        familia: {
          conyuge: memorial.familia?.conyuge || '',
          hijos: memorial.familia?.hijos || [],
          padres: memorial.familia?.padres || []
        },
        clientId: memorialClientId // 🔧 Agregar clientId extraído
      });
      
      // Setear cliente si está populated
      if (memorial.cliente && typeof memorial.cliente === 'object') {
        setClient(memorial.cliente);
      } else if (memorialClientId) {
        // Si no está populated, cargar cliente por separado
        console.log('Cliente no populated, cargando por separado...');
        try {
          const clientData = await clientService.getClientById(memorialClientId);
          setClient(clientData);
        } catch (clientError) {
          console.warn('Error cargando cliente:', clientError);
        }
      }
      
    } catch (err) {
      console.error('Error cargando memorial:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [memorialId]);

  useEffect(() => {
    console.log('=== useEffect ejecutándose ===');
    console.log('clientId en useEffect:', clientId);
    console.log('memorialId en useEffect:', memorialId);

    if (clientId && clientId !== 'undefined') {
      console.log('Cargando cliente con ID:', clientId);
      loadClient();
    } else {
      console.warn('clientId es undefined o inválido:', clientId);
    }

    if (isEdit && memorialId && memorialId !== 'undefined') {
      console.log('Cargando memorial para edición con ID:', memorialId);
      loadMemorial();
    }
  }, [clientId, isEdit, loadClient, loadMemorial, memorialId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');

    const updateNestedValue = (source, keys) => {
      const [currentKey, ...remainingKeys] = keys;
      if (remainingKeys.length === 0) {
        return { ...source, [currentKey]: value };
      }

      return {
        ...source,
        [currentKey]: updateNestedValue(source?.[currentKey] || {}, remainingKeys)
      };
    };

    setFormData(prev => updateNestedValue(prev, path));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 INICIANDO SUBMIT DEL MEMORIAL');
    console.log('=== SUBMIT DEBUG ===');
    console.log('clientId de params:', clientId);
    console.log('clientId de formData:', formData.clientId);
    console.log('isEdit:', isEdit);
    console.log('formData completo:', formData);
    console.log('===================');
    
    // 🚨 DEBUG: Verificar fechas antes de enviar
    console.log('=== DEBUG FECHAS ===');
    console.log('fechaNacimiento original:', formData.fechaNacimiento);
    console.log('fechaFallecimiento original:', formData.fechaFallecimiento);
    
    try {
      setSubmitLoading(true);
      setError('');
      
      // 🔧 FIX: Usar clientId de formData si está disponible (modo edición)
      const finalClientId = formData.clientId || clientId;
      console.log('ClientId final a usar:', finalClientId);
      
      if (!finalClientId || finalClientId === 'undefined') {
        throw new Error('No se puede procesar memorial: ID de cliente no válido');
      }
      
      // 🔧 FIX: Formatear fechas correctamente para el backend
      const formatDateForBackend = (dateString) => {
        if (!dateString) return null;
        
        // Si ya está en formato ISO, extraer solo la fecha
        if (dateString.includes('T')) {
          dateString = dateString.split('T')[0];
        }
        
        // Crear fecha en zona horaria local y convertir a ISO con mediodía UTC
        // Esto evita problemas de zona horaria
        const date = new Date(dateString + 'T12:00:00.000Z');
        return date.toISOString();
      };
      
      const memorialData = {
        ...formData,
        clientId: finalClientId,
        fechaNacimiento: formatDateForBackend(formData.fechaNacimiento),
        fechaFallecimiento: formatDateForBackend(formData.fechaFallecimiento)
      };
      
      console.log('=== FECHAS FORMATEADAS ===');
      console.log('fechaNacimiento final:', memorialData.fechaNacimiento);
      console.log('fechaFallecimiento final:', memorialData.fechaFallecimiento);
      console.log('Datos finales a enviar:', memorialData);
      
      let memorial;
      if (isEdit) {
        console.log('Actualizando memorial:', memorialId);
        memorial = await memorialService.updateMemorial(memorialId, memorialData);
      } else {
        console.log('Creando nuevo memorial');
        memorial = await memorialService.createMemorial(memorialData);
      }
      
      console.log('Memorial procesado exitosamente:', memorial);
      console.log('🔍 DEBUG: Estructura del memorial devuelto:');
      console.log('memorial.id:', memorial.id);
      console.log('memorial._id:', memorial._id);
      console.log('memorial.qr:', memorial.qr);
      console.log('Todas las propiedades:', Object.keys(memorial));
      
      // 🔧 FIX: El QR ya se genera automáticamente en el backend
      // No necesitamos generarlo de nuevo aquí
      let qrAlreadyGenerated = false;
      if (!isEdit && memorial.qr && memorial.qr.url) {
        console.log('✅ QR ya generado automáticamente:', memorial.qr.url);
        console.log('🎯 ¿Contiene IP correcta?:', memorial.qr.url.includes('192.168.1.34'));
        setQrGenerated(true);
        qrAlreadyGenerated = true;
      }
      
      // Solo intentar generar QR si no se generó automáticamente
      if (!isEdit && !qrAlreadyGenerated) {
        try {
          const memorialId = memorial.id || memorial._id;
          console.log('🎯 Generando QR manual para memorial ID:', memorialId);
          const qrResponse = await qrService.generateQR(memorialId);
          console.log('🗺️ Respuesta del QR generado:', qrResponse);
          console.log('🗺️ URL del QR:', qrResponse?.url);
          console.log('🗺️ Código del QR:', qrResponse?.code);
          setQrGenerated(true);
        } catch (qrError) {
          console.warn('No se pudo generar QR manualmente:', qrError);
          // Si falla la generación manual, no es problema crítico
        }
      }
      
      // Redirigir a la lista de memoriales o mostrar QR
      if (qrGenerated && !isEdit) {
        // 🔧 FIX: Usar el ID del memorial para redirección
        const memorialId = memorial.id || memorial._id;
        console.log('🎯 Redirigiendo a impresión QR para memorial:', memorialId);
        navigate(`/admin/memorials/${memorialId}/print-qr`);
      } else {
        navigate('/admin/memorials');
      }
      
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <button
                  onClick={() => navigate('/admin/memorials')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  Memoriales
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {isEdit ? 'Editar Memorial' : 'Nuevo Memorial'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Memorial' : 'Crear Nuevo Memorial'}
          </h1>
          {client && (
            <p className="mt-1 text-sm text-gray-500">
              Cliente: {client.nombre} • {client.telefono}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información básica */}
          <div className="pet-admin-card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Nombre de la mascota"
                  />
                </div>

                <div>
                  <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    value={formData.fechaNacimiento?.split('T')[0] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="fechaFallecimiento" className="block text-sm font-medium text-gray-700">
                    Fecha de fallecimiento
                  </label>
                  <input
                    type="date"
                    name="fechaFallecimiento"
                    id="fechaFallecimiento"
                    value={formData.fechaFallecimiento?.split('T')[0] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="mascota.especie" className="block text-sm font-medium text-gray-700">
                    Especie
                  </label>
                  <input
                    type="text"
                    name="mascota.especie"
                    id="mascota.especie"
                    value={formData.mascota.especie}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Perro, gato, conejo..."
                  />
                </div>

                <div>
                  <label htmlFor="mascota.raza" className="block text-sm font-medium text-gray-700">
                    Raza
                  </label>
                  <input
                    type="text"
                    name="mascota.raza"
                    id="mascota.raza"
                    value={formData.mascota.raza}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Mestizo, siamés..."
                  />
                </div>

                <div>
                  <label htmlFor="mascota.sexo" className="block text-sm font-medium text-gray-700">
                    Sexo
                  </label>
                  <select
                    name="mascota.sexo"
                    id="mascota.sexo"
                    value={formData.mascota.sexo}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                  >
                    <option value="">Sin especificar</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                    <option value="desconocido">Desconocido</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mascota.personalidad" className="block text-sm font-medium text-gray-700">
                    Personalidad
                  </label>
                  <input
                    type="text"
                    name="mascota.personalidad"
                    id="mascota.personalidad"
                    value={formData.mascota.personalidad}
                    onChange={handleChange}
                    maxLength={300}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Juguetón, cariñoso y curioso"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="frase" className="block text-sm font-medium text-gray-700">
                    Frase memorable
                  </label>
                  <input
                    type="text"
                    name="frase"
                    id="frase"
                    value={formData.frase}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Una frase o recuerdo que represente su vínculo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="pet-admin-card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Ubicación
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ubicacion.ciudad" className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ubicacion.ciudad"
                    id="ubicacion.ciudad"
                    value={formData.ubicacion.ciudad}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="ubicacion.pais" className="block text-sm font-medium text-gray-700">
                    País
                  </label>
                  <input
                    type="text"
                    name="ubicacion.pais"
                    id="ubicacion.pais"
                    value={formData.ubicacion.pais}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="ubicacion.cementerio" className="block text-sm font-medium text-gray-700">
                    Lugar de descanso
                  </label>
                  <input
                    type="text"
                    name="ubicacion.cementerio"
                    id="ubicacion.cementerio"
                    value={formData.ubicacion.cementerio}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Cementerio, jardín o lugar especial (opcional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recuerdos favoritos */}
          <div className="pet-admin-card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Sus cosas favoritas
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="mascota.favoritos.actividad" className="block text-sm font-medium text-gray-700">
                    Actividad favorita
                  </label>
                  <input
                    type="text"
                    name="mascota.favoritos.actividad"
                    id="mascota.favoritos.actividad"
                    value={formData.mascota.favoritos.actividad}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Pasear por el parque"
                  />
                </div>

                <div>
                  <label htmlFor="mascota.favoritos.juguete" className="block text-sm font-medium text-gray-700">
                    Juguete favorito
                  </label>
                  <input
                    type="text"
                    name="mascota.favoritos.juguete"
                    id="mascota.favoritos.juguete"
                    value={formData.mascota.favoritos.juguete}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Su pelota amarilla"
                  />
                </div>

                <div>
                  <label htmlFor="mascota.favoritos.comida" className="block text-sm font-medium text-gray-700">
                    Comida favorita
                  </label>
                  <input
                    type="text"
                    name="mascota.favoritos.comida"
                    id="mascota.favoritos.comida"
                    value={formData.mascota.favoritos.comida}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Galletas de pollo"
                  />
                </div>

                <div>
                  <label htmlFor="mascota.favoritos.lugar" className="block text-sm font-medium text-gray-700">
                    Lugar favorito
                  </label>
                  <input
                    type="text"
                    name="mascota.favoritos.lugar"
                    id="mascota.favoritos.lugar"
                    value={formData.mascota.favoritos.lugar}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                    placeholder="Ej: Junto a la ventana"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="pet-admin-card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Biografía
              </h3>
              <div>
                <label htmlFor="biografia" className="block text-sm font-medium text-gray-700">
                  Historia de vida
                </label>
                <textarea
                  id="biografia"
                  name="biografia"
                  rows={8}
                  value={formData.biografia}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pet-500 focus:border-pet-500 sm:text-sm"
                  placeholder="Cuenta su historia: personalidad, juegos favoritos, momentos especiales, costumbres y la huella que dejó en la familia."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Esta biografía aparecerá en el memorial público. Sé respetuoso y cariñoso.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/memorials')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pet-700 hover:bg-pet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pet-500 disabled:opacity-50"
            >
              {submitLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m12 2v4m0 12v4m8-10h-4M6 12H2"></path>
                  </svg>
                  {isEdit ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  {isEdit ? 'Actualizar Memorial' : 'Crear Memorial'}
                  {!isEdit && ' y Generar QR'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemorialForm;
