import './App.css';
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaPlus, FaGripLines } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { IoIosAttach } from "react-icons/io";
import { GrGoogle } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import ThreadsLoader from './pages/ThreadsLoader';
import supabase from './componentes/suparbase';

export default function App() {
  const [titulo, setTitulo] = useState('Threads');
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [threads, setThreads] = useState([]);
  const [user, setUser] = useState(null);
  const [mostrarThreads, setMostrarThreads] = useState(false);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const menuFuera = useRef(null);
  const navigate = useNavigate();
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);

  const [temaOscuro, setTemaOscuro] = useState(true);

  const toggleTema = () => {
    setTemaOscuro(prev => !prev);
    setTitulo(temaOscuro ? 'Modo Claro - Threads' : 'Modo Oscuro - Threads');
    menuDespegable(!usuarioAutenticado);
    document.documentElement.setAttribute('data-tema', temaOscuro ? 'claro' : 'oscuro');
  };


  const esUsuarioGoogle = user?.providerData?.some(
    (proveedor) => proveedor?.providerId === "google.com"
  );

  const menuDespegable = (estado) => setMenu(estado);

  const abrirImagen = (url) => setImagenSeleccionada(url);
  const cerrarImagen = () => setImagenSeleccionada(null);

  const subirImagen = async (archivo) => {
    const nombre = `${Date.now()}_${archivo.name}`;
    const { error } = await supabase.storage
      .from('imagenes')
      .upload(nombre, archivo);
    if (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
    const url = supabase.storage
      .from('imagenes')
      .getPublicUrl(nombre).data.publicUrl;
    return url;
  };

  const manejarClick = () => {
    setTitulo('Perfil - Threads');
    setMostrarPerfil(prev => !prev);
    if (!usuarioAutenticado) {
      menuDespegable(true);
    }
  };

  const limpiarEstados = () => {
    setUsuarioAutenticado(false);
    setUser(null);
    setThreads([]);
    setNuevoContenido('');
    setMenu(false);
  };

  const cargarThreads = async () => {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error al leer threads:', error);
    } else {
      setThreads(data);
    }
  };

  const publicarThread = async () => {
    if (!nuevoContenido.trim()) return;

    let imagenUrl = null;
    if (imagenSeleccionada) {
      imagenUrl = await subirImagen(imagenSeleccionada);
    }

    const { error } = await supabase
      .from('threads')
      .insert([{
        contenido: nuevoContenido,
        autor: user?.displayName || user?.email || 'Anónimo',
        imagenUrl,
      }]);

    if (error) {
      console.error('Error publicando:', error);
    } else {
      console.log('Publicado correctamente');
      setNuevoContenido('');
      setImagenSeleccionada(null);
      await cargarThreads();
    }
  };

  const cerrarSesion = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Sesión cerrada correctamente');
        limpiarEstados();
        navigate('/');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  useEffect(() => {
    const resultados = threads.filter(thread =>
      thread.autor.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    setFiltrados(resultados);
  }, [terminoBusqueda, threads]);


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      const estaLogueado = Boolean(usuario);
      setUsuarioAutenticado(estaLogueado);
      if (estaLogueado) {
        setUser(usuario);
        navigate('/inicio');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    cargarThreads();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const clickFuera = (event) => {
      const esEnlace = event.target.closest('.menu') || event.target.closest('button') || event.target.closest('.threads');
      if (esEnlace) return;
      if (menuFuera.current && !menuFuera.current.contains(event.target)) {
        setMenu(false);
      }
    };
    const botonFuera = (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
      }
    };
    document.addEventListener('mousedown', clickFuera);
    document.addEventListener('keydown', botonFuera);
    return () => {
      document.removeEventListener('mousedown', clickFuera);
      document.removeEventListener('keydown', botonFuera);
    };
  }, []);

  useEffect(() => {
    document.title = titulo;
    if (titulo !== 'Perfil - Threads') {
      setMenu(false);
    }
  }, [titulo]);

  return (
    <>
      {loading ? (
        <ThreadsLoader />
      ) : (
        <>
          <header className='inicio'>
            <section className='columna1'>
              <div className="icono">
                <a href="/"><img src="/threads.ico" alt="Ícono" /></a>
              </div>
              <nav className="navegacion" ref={menuFuera}>
                <a href="/"><GoHomeFill className='interaccion' title='Inicio' onClick={() => setTitulo('Inicio - Threads')} /></a>
                <IoSearch
                  className='interaccion'
                  title='Buscar'
                  onClick={() => {
                    setTitulo('Buscar - Threads');
                    const resultados = threads.filter(thread =>
                      thread.autor.toLowerCase().includes(terminoBusqueda.toLowerCase())
                    );
                    setFiltrados(resultados);
                    setMostrarFiltro(prev => !prev);
                  }}
                />

                {usuarioAutenticado && (
                  <>
                    <input
                      className={`filtro ${mostrarFiltro ? 'visible' : ''}`}
                      type='text'
                      value={terminoBusqueda}
                      onChange={(e) => setTerminoBusqueda(e.target.value)}
                      placeholder='Buscar por autor...'
                    />
                  </>
                )}

                <FaPlus className='interaccion' title='Crear' onClick={() => { setTitulo('Crear - Threads'); setMostrarThreads(prev => !prev); menuDespegable(!usuarioAutenticado); }} />
                <FaRegHeart
                  className='interaccion'
                  title='Notificaciones'
                  onClick={() => {
                    setTitulo('Notificaciones - Threads');
                    menuDespegable(!usuarioAutenticado);
                  }}
                />

                <VscAccount className='interaccion' title='Perfil' onClick={manejarClick} />

                {usuarioAutenticado && (
                  <div className={`perfil ${mostrarPerfil ? 'visible' : ''}`}>
                    <h3>Threads - Perfil del Usuario:</h3>
                    <p>Email: <span style={{ color: '#616161' }}>{user?.email}</span>.</p>
                    <p>Sesión iniciada con: <i>{user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Correo y contraseña'}</i>.</p>
                  </div>
                )}
              </nav>

              <div className="opciones">
                <IoIosAttach className='interaccion' title='Fijar' onClick={() => { setTitulo('Fijar'); menuDespegable(!usuarioAutenticado); toggleTema(); }} />
                <FaGripLines className='interaccion' title='Más' onClick={() => { setTitulo('Más'); menuDespegable(usuarioAutenticado); }} />
              </div>

              {menu && (
                <div className='menu'>
                  {usuarioAutenticado ? (
                    <>
                      <button onClick={cerrarSesion}>Salir del perfil</button>
                    </>

                  ) : (
                    <>
                      <GrGoogle style={{ fontSize: '40px' }} />
                      <h1>Regístrate para publicar</h1>
                      <p style={{ color: 'gray' }}>
                        Únete a Threads para compartir ideas, hacer preguntas, publicar lo que se te ocurra y mucho más.
                      </p>
                      <div className="submenu" style={{ fontSize: '20px' }}>
                        <FcGoogle />
                        <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                          <p>Continuar con Google</p>
                        </Link>
                        <MdKeyboardArrowRight />
                      </div>
                    </>
                  )}
                </div>
              )}
            </section>

            <section className='feed'>
              <div className={`threads ${mostrarThreads ? 'visible' : ''}`}>
                {user && (
                  <div className='cuadro'>
                    <small>
                      <p>Vas a publicar como: {user?.displayName || user?.email || 'Sin nombre'}.</p>
                    </small>
                    <textarea
                      className='textarea-publicar'
                      value={nuevoContenido}
                      onChange={(e) => setNuevoContenido(e.target.value)}
                      placeholder='¿Qué estás pensando? Puedes decir "Hola".'
                      rows={4}
                    />

                    {esUsuarioGoogle && (
                      <small className="aviso-google">
                        Los usuarios de Google no pueden subir imágenes por razones de seguridad.
                      </small>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImagenSeleccionada(e.target.files[0])}
                      disabled={esUsuarioGoogle}
                    />

                    <button
                      className="boton-publicar"
                      onClick={publicarThread}
                      disabled={!nuevoContenido.trim()}
                    >
                      Publicar
                    </button>
                  </div>
                )}
              </div>

              <div className="contenido">
                <h2>Últimos Threads</h2>
                <ul>
                  {(terminoBusqueda ? filtrados : threads).map((thread) => (
                    <div className='acomodar' key={thread.id}>
                      <strong>
                        {thread.autor || 'Anónimo'} |
                        <span>
                          <small> Publicado el: {new Date(thread.creado_en).toLocaleString()} </small>
                        </span>
                      </strong>
                      <p><span>dice: {thread.contenido}</span></p>
                      {thread.imagenUrl && (
                        <img src={thread.imagenUrl} className="imagen-thread" />
                      )}
                    </div>
                  ))}
                </ul>

              </div>
            </section>
          </header>
        </>
      )}
    </>
  );
}
