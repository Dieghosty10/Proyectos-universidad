//// Constantes y configuración
const CONFIG = {
    pokeApiUrl: 'https://pokeapi.co/api/v2',
    pokemonPorPagina: 10,
    maxPokemon: 50,
    version: '1.0.0'
};

// Estado de la aplicación
const estado = {
    offset: 0,
    todosLosPokemon: [],
    pokemonFiltrados: [],
    pokemonCargados: [],
    detallesCache: new Map(),
    especieCache: new Map(),
    evolucionCache: new Map(),
    ubicacionCache: new Map(),
    movimientoCache: new Map(),
    cargando: false,
    pokemonActual: null
};

// Estado del usuario
const estadoUsuario = {
    loggedIn: false,
    username: null,
    pokemonFavorito: null
};

// Elementos del DOM
const elementos = {
    // Entradas
    entradaBusqueda: document.getElementById('entrada-busqueda'),
    filtroTipo: document.getElementById('filtro-tipo'),
    filtroGeneracion: document.getElementById('filtro-generacion'),
    filtroOrden: document.getElementById('filtro-orden'),
    
    // Botones
    botonBuscar: document.getElementById('boton-buscar'),
    botonAleatorio: document.getElementById('boton-aleatorio'),
    botonCargarMas: document.getElementById('boton-cargar-mas'),
    botonCerrar: document.getElementById('boton-cerrar'),
    botonLimpiar: document.getElementById('boton-limpiar'),
    
    // Contenedores
    tarjetaPokemon: document.getElementById('tarjeta-pokemon'),
    listaPokemon: document.getElementById('lista-pokemon'),
    mensajeError: document.getElementById('mensaje-error'),
    cargaInicial: document.getElementById('carga-inicial'),
    
    // Elementos de tarjeta
    nombrePokemon: document.getElementById('nombre-pokemon'),
    numeroPokemon: document.getElementById('numero-pokemon'),
    imagenPokemon: document.getElementById('imagen-pokemon'),
    tiposPokemon: document.getElementById('tipos-pokemon'),
    pesoPokemon: document.getElementById('peso-pokemon'),
    alturaPokemon: document.getElementById('altura-pokemon'),
    descripcionPokemon: document.getElementById('descripcion-pokemon'),
    estadisticasPokemon: document.getElementById('estadisticas-pokemon'),
    totalEstadisticas: document.getElementById('total-estadisticas'),
    promedioEstadisticas: document.getElementById('promedio-estadisticas'),
    habilidadesPokemon: document.getElementById('habilidades-pokemon'),
    cadenaEvolucion: document.getElementById('cadena-evolucion'),
    ubicacionesPokemon: document.getElementById('ubicaciones-pokemon'),
    movimientosPokemon: document.getElementById('movimientos-pokemon'),
    
    // Elementos de login
    modalLogin: document.getElementById('modal-login'),
    modalRegistro: document.getElementById('modal-registro'),
    botonLogin: document.getElementById('boton-login'),
    botonLogout: document.getElementById('boton-logout'),
    cerrarLogin: document.getElementById('cerrar-login'),
    cerrarRegistro: document.getElementById('cerrar-registro'),
    formularioLogin: document.getElementById('formulario-login'),
    formularioRegistro: document.getElementById('formulario-registro'),
    olvidasteContrasena: document.getElementById('olvidaste-contrasena'),
    registrarse: document.getElementById('registrarse'),
    usuarioInfo: document.getElementById('usuario-info'),
    nombreUsuario: document.getElementById('nombre-usuario'),
    pokemonFavoritoSelect: document.getElementById('pokemon-favorito')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar eventos
    configurarEventos();
    configurarEventosLogin();
    
    // Mostrar pantalla de carga
    simularCargaInicial();
    
    // Configurar Service Worker para PWA
    registrarServiceWorker();
    
    // Verificar sesión
    verificarSesion();
});

// Funciones de inicialización
function configurarEventos() {
    // Eventos de búsqueda
    elementos.botonBuscar.addEventListener('click', buscarPokemon);
    elementos.botonAleatorio.addEventListener('click', buscarPokemonAleatorio);
    elementos.entradaBusqueda.addEventListener('input', manejarInputBusqueda);
    elementos.entradaBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarPokemon();
    });
    elementos.botonLimpiar.addEventListener('click', limpiarBusqueda);
    
    // Eventos de filtrado
    elementos.filtroTipo.addEventListener('change', filtrarPokemon);
    elementos.filtroGeneracion.addEventListener('change', filtrarPokemon);
    elementos.filtroOrden.addEventListener('change', filtrarPokemon);
    
    // Eventos de controles
    elementos.botonCargarMas.addEventListener('click', cargarMasPokemon);
    elementos.botonCerrar.addEventListener('click', () => {
        elementos.tarjetaPokemon.classList.add('oculto');
    });
}

function configurarEventosLogin() {
    // Abrir modal de login
    elementos.botonLogin.addEventListener('click', () => {
        elementos.modalLogin.classList.remove('oculto');
    });
    
    // Cerrar modales
    elementos.cerrarLogin.addEventListener('click', () => {
        elementos.modalLogin.classList.add('oculto');
    });
    
    elementos.cerrarRegistro.addEventListener('click', () => {
        elementos.modalRegistro.classList.add('oculto');
    });
    
    // Cambiar a registro
    elementos.registrarse.addEventListener('click', (e) => {
        e.preventDefault();
        elementos.modalLogin.classList.add('oculto');
        elementos.modalRegistro.classList.remove('oculto');
    });
    
    // Cambiar a login
    elementos.olvidasteContrasena.addEventListener('click', (e) => {
        e.preventDefault();
        alert("¡Un Pokémon Psyduck está trabajando en recuperar tu contraseña! Pronto estará listo.");
    });
    
    // Login
    elementos.formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        
        // Simulación de login (en un caso real, esto sería una llamada a tu backend)
        if (usuario && password) {
            iniciarSesion(usuario);
        } else {
            alert("¡Necesitas completar todos los campos, entrenador!");
        }
    });
    
    // Registro
    elementos.formularioRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('nuevo-usuario').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('nueva-password').value;
        const confirmPassword = document.getElementById('confirmar-password').value;
        const pokemonFavorito = document.getElementById('pokemon-favorito').value;
        
        if (password !== confirmPassword) {
            alert("¡Las contraseñas no coinciden!");
            return;
        }
        
        if (usuario && email && password && pokemonFavorito) {
            // Simulación de registro (en un caso real, esto sería una llamada a tu backend)
            estadoUsuario.pokemonFavorito = pokemonFavorito;
            iniciarSesion(usuario);
            elementos.modalRegistro.classList.add('oculto');
            alert(`¡Bienvenido, entrenador ${usuario}! Has elegido a ${capitalizarTexto(pokemonFavorito)} como tu Pokémon favorito.`);
        } else {
            alert("¡Necesitas completar todos los campos para unirte a PokeDT!");
        }
    });
    
    // Logout
    elementos.botonLogout.addEventListener('click', cerrarSesion);
    
    // Cargar Pokémon para el selector de favoritos
    cargarPokemonParaSelector();
}

function simularCargaInicial() {
    let progreso = 0;
    const barraCarga = document.querySelector('.progreso-carga');
    
    const intervalo = setInterval(() => {
        progreso += Math.random() * 10;
        barraCarga.style.width = `${Math.min(progreso, 100)}%`;
        
        if (progreso >= 100) {
            clearInterval(intervalo);
            setTimeout(() => {
                elementos.cargaInicial.classList.add('oculto');
                cargarPokemonInicial();
                cargarTiposPokemon();
            }, 500);
        }
    }, 200);
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registrado con éxito:', registration.scope);
                })
                .catch(error => {
                    console.log('Error al registrar ServiceWorker:', error);
                });
        });
    }
}

// Funciones principales
async function cargarPokemonInicial() {
    if (estado.cargando) return;
    estado.cargando = true;
    
    try {
        const respuesta = await fetch(`${CONFIG.pokeApiUrl}/pokemon?limit=${CONFIG.pokemonPorPagina}&offset=${estado.offset}`);
        const data = await respuesta.json();
        
        estado.todosLosPokemon = data.results.map((pokemon, index) => ({
            ...pokemon,
            id: estado.offset + index + 1
        }));
        
        estado.pokemonFiltrados = [...estado.todosLosPokemon];
        estado.offset += CONFIG.pokemonPorPagina;
        
        // Pre-cargar detalles de los primeros Pokémon
        await Promise.all(
            estado.todosLosPokemon.slice(0, 5).map(p => precargarDetallesPokemon(p))
        );
        
        mostrarListaPokemon(estado.pokemonFiltrados);
    } catch (error) {
        console.error('Error al cargar Pokémon:', error);
        mostrarMensajeError('Error al cargar Pokémon. Intenta recargar la página.');
    } finally {
        estado.cargando = false;
    }
}

async function cargarTiposPokemon() {
    try {
        const respuesta = await fetch(`${CONFIG.pokeApiUrl}/type?limit=20`);
        const data = await respuesta.json();
        
        data.results.forEach(tipo => {
            if (tipo.name !== 'shadow' && tipo.name !== 'unknown') {
                const opcion = document.createElement('option');
                opcion.value = tipo.name;
                opcion.textContent = capitalizarTexto(tipo.name);
                elementos.filtroTipo.appendChild(opcion);
            }
        });
    } catch (error) {
        console.error('Error al cargar tipos:', error);
    }
}

async function cargarPokemonParaSelector() {
    try {
        const respuesta = await fetch(`${CONFIG.pokeApiUrl}/pokemon?limit=50`);
        const data = await respuesta.json();
        
        data.results.forEach((pokemon, index) => {
            const opcion = document.createElement('option');
            opcion.value = pokemon.name;
            opcion.textContent = capitalizarTexto(pokemon.name);
            elementos.pokemonFavoritoSelect.appendChild(opcion);
        });
    } catch (error) {
        console.error('Error al cargar Pokémon para selector:', error);
    }
}

async function cargarMasPokemon() {
    if (estado.cargando || estado.pokemonCargados.length >= CONFIG.maxPokemon) return;
    estado.cargando = true;
    
    elementos.botonCargarMas.disabled = true;
    elementos.botonCargarMas.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    
    try {
        const respuesta = await fetch(`${CONFIG.pokeApiUrl}/pokemon?limit=${CONFIG.pokemonPorPagina}&offset=${estado.offset}`);
        const data = await respuesta.json();
        
        const nuevosPokemon = data.results.map((pokemon, index) => ({
            ...pokemon,
            id: estado.offset + index + 1
        }));
        
        estado.todosLosPokemon = [...estado.todosLosPokemon, ...nuevosPokemon];
        estado.pokemonFiltrados = [...estado.todosLosPokemon];
        estado.offset += CONFIG.pokemonPorPagina;
        
        mostrarListaPokemon(estado.pokemonFiltrados);
    } catch (error) {
        console.error('Error al cargar más Pokémon:', error);
        mostrarMensajeError('Error al cargar más Pokémon.');
    } finally {
        elementos.botonCargarMas.disabled = false;
        elementos.botonCargarMas.innerHTML = '<i class="fas fa-plus"></i> Cargar más Pokémon';
        estado.cargando = false;
    }
}

async function precargarDetallesPokemon(pokemon) {
    try {
        const detalles = await obtenerDetallesPokemon(pokemon.name);
        estado.detallesCache.set(pokemon.name, detalles);
        return detalles;
    } catch (error) {
        console.error(`Error al precargar ${pokemon.name}:`, error);
        return null;
    }
}

function manejarInputBusqueda() {
    const valor = elementos.entradaBusqueda.value.trim();
    elementos.botonLimpiar.classList.toggle('oculto', valor === '');
}

function limpiarBusqueda() {
    elementos.entradaBusqueda.value = '';
    elementos.botonLimpiar.classList.add('oculto');
    elementos.entradaBusqueda.focus();
}

async function buscarPokemon() {
    const terminoBusqueda = elementos.entradaBusqueda.value.trim().toLowerCase();
    
    if (!terminoBusqueda) {
        mostrarListaPokemon(estado.pokemonFiltrados);
        return;
    }
    
    mostrarSpinner();
    elementos.tarjetaPokemon.classList.add('oculto');
    elementos.listaPokemon.innerHTML = '';
    elementos.mensajeError.classList.add('oculto');
    
    try {
        // Buscar por ID o nombre exacto
        const pokemon = await obtenerDetallesPokemon(terminoBusqueda);
        mostrarDetallesPokemon(pokemon);
    } catch (error) {
        console.error('Error al buscar Pokémon:', error);
        
        // Buscar coincidencias parciales en la lista cargada
        const resultados = estado.pokemonFiltrados.filter(p => 
            p.name.includes(terminoBusqueda) || 
            p.id.toString().includes(terminoBusqueda)
        );
        
        if (resultados.length > 0) {
            mostrarListaPokemon(resultados);
        } else {
            mostrarMensajeError();
        }
    } finally {
        ocultarSpinner();
    }
}

async function buscarPokemonAleatorio() {
    const idAleatorio = Math.floor(Math.random() * 898) + 1;
    elementos.entradaBusqueda.value = idAleatorio;
    elementos.botonLimpiar.classList.remove('oculto');
    buscarPokemon();
}

function filtrarPokemon() {
    const tipoSeleccionado = elementos.filtroTipo.value;
    const generacionSeleccionada = elementos.filtroGeneracion.value;
    const ordenSeleccionado = elementos.filtroOrden.value;
    
    let resultados = [...estado.todosLosPokemon];
    
    if (tipoSeleccionado) {
        resultados = resultados.filter(p => 
            estado.detallesCache.get(p.name)?.types.some(t => t.type.name === tipoSeleccionado)
        );
    }
    
    if (generacionSeleccionada) {
        const limitesGeneracion = {
            '1': { min: 1, max: 151 },
            '2': { min: 152, max: 251 },
            '3': { min: 252, max: 386 },
            '4': { min: 387, max: 493 },
            '5': { min: 494, max: 649 },
            '6': { min: 650, max: 721 },
            '7': { min: 722, max: 809 },
            '8': { min: 810, max: 898 }
        };
        
        const { min, max } = limitesGeneracion[generacionSeleccionada];
        resultados = resultados.filter(p => p.id >= min && p.id <= max);
    }
    
    // Ordenar resultados
    if (ordenSeleccionado) {
        resultados.sort((a, b) => {
            const detalleA = estado.detallesCache.get(a.name) || {};
            const detalleB = estado.detallesCache.get(b.name) || {};
            
            switch (ordenSeleccionado) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'weight':
                    return (detalleB.weight || 0) - (detalleA.weight || 0);
                case 'height':
                    return (detalleB.height || 0) - (detalleA.height || 0);
                default: // 'id'
                    return a.id - b.id;
            }
        });
    }
    
    estado.pokemonFiltrados = resultados;
    mostrarListaPokemon(estado.pokemonFiltrados);
}

// Funciones de visualización
async function mostrarListaPokemon(pokemonList) {
    if (pokemonList.length === 0) {
        mostrarMensajeError('No se encontraron Pokémon con esos filtros.');
        return;
    }
    
    // Limitar la cantidad de Pokémon mostrados
    const pokemonAMostrar = pokemonList.slice(0, CONFIG.maxPokemon);
    
    // Limpiar lista solo si es una nueva búsqueda/filtrado
    if (!estado.cargando) {
        elementos.listaPokemon.innerHTML = '';
        estado.pokemonCargados = [];
    }
    
    elementos.tarjetaPokemon.classList.add('oculto');
    elementos.mensajeError.classList.add('oculto');
    
    for (const pokemon of pokemonAMostrar) {
        // Evitar duplicados
        if (estado.pokemonCargados.includes(pokemon.name)) continue;
        
        try {
            const detalles = await obtenerDetallesPokemon(pokemon.name);
            crearItemPokemon(detalles);
            estado.pokemonCargados.push(pokemon.name);
        } catch (error) {
            console.error(`Error al cargar ${pokemon.name}:`, error);
        }
    }
    
    // Mostrar u ocultar botón "Cargar más"
    elementos.botonCargarMas.style.display = 
        (pokemonList.length > estado.pokemonCargados.length && 
         estado.pokemonCargados.length < CONFIG.maxPokemon) ? 
        'block' : 'none';
}

function crearItemPokemon(pokemon) {
    const item = document.createElement('div');
    item.className = 'item-pokemon aparecer';
    item.addEventListener('click', () => mostrarDetallesPokemon(pokemon));
    
    const id = pokemon.id.toString().padStart(3, '0');
    const nombre = capitalizarTexto(pokemon.name);
    const tipos = pokemon.types.map(t => t.type.name);
    const imagen = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;
    
    item.innerHTML = `
        <img src="${imagen}" alt="${nombre}" loading="lazy">
        <h3>${nombre}</h3>
        <p>#${id}</p>
        <div class="tipos-item">
            ${tipos.map(tipo => `<span class="tipo-item tipo-${tipo}">${capitalizarTexto(tipo)}</span>`).join('')}
        </div>
    `;
    
    elementos.listaPokemon.appendChild(item);
}

async function mostrarDetallesPokemon(pokemon) {
    mostrarSpinner();
    elementos.listaPokemon.innerHTML = '';
    elementos.mensajeError.classList.add('oculto');
    
    try {
        // Cargar información adicional
        const [especie, cadenaEvolucion, ubicaciones, movimientos] = await Promise.all([
            obtenerEspeciePokemon(pokemon.id),
            obtenerCadenaEvolucion(pokemon.id),
            obtenerUbicacionesPokemon(pokemon.id),
            obtenerMovimientosPokemon(pokemon.id)
        ]);
        
        const descripcion = obtenerDescripcionEnEspanol(especie.flavor_text_entries) || 
                           'Descripción no disponible en español.';
        
        // Actualizar tarjeta
        actualizarTarjetaPokemon(pokemon, descripcion, cadenaEvolucion, ubicaciones, movimientos);
        
        // Guardar Pokémon actual
        estado.pokemonActual = pokemon;
        
        elementos.tarjetaPokemon.classList.remove('oculto');
    } catch (error) {
        console.error('Error al mostrar detalles:', error);
        mostrarMensajeError('Error al cargar detalles del Pokémon.');
    } finally {
        ocultarSpinner();
    }
}

function actualizarTarjetaPokemon(pokemon, descripcion, cadenaEvolucion, ubicaciones, movimientos) {
    const id = pokemon.id.toString().padStart(3, '0');
    const nombre = capitalizarTexto(pokemon.name);
    const imagen = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;
    const tipos = pokemon.types.map(t => t.type.name);
    const habilidades = pokemon.abilities.map(a => a.ability.name);
    const estadisticas = pokemon.stats;
    const totalStats = estadisticas.reduce((sum, stat) => sum + stat.base_stat, 0);
    const promedioStats = Math.round(totalStats / estadisticas.length);
    const peso = (pokemon.weight / 10).toFixed(1); // Convertir a kg
    const altura = (pokemon.height / 10).toFixed(1); // Convertir a metros
    
    // Encabezado
    elementos.nombrePokemon.textContent = nombre;
    elementos.numeroPokemon.textContent = `#${id}`;
    
    // Imagen y tipos
    elementos.imagenPokemon.src = imagen;
    elementos.imagenPokemon.alt = nombre;
    
    elementos.tiposPokemon.innerHTML = tipos.map(tipo => 
        `<span class="tipo tipo-${tipo}">${capitalizarTexto(tipo)}</span>`
    ).join('');
    
    // Datos rápidos
    elementos.pesoPokemon.textContent = `${peso} kg`;
    elementos.alturaPokemon.textContent = `${altura} m`;
    
    // Descripción
    elementos.descripcionPokemon.textContent = descripcion;
    
    // Estadísticas
    elementos.estadisticasPokemon.innerHTML = estadisticas.map(stat => `
        <div class="estadistica">
            <p>
                <span class="nombre-estadistica">${capitalizarTexto(stat.stat.name.replace('-', ' '))}:</span>
                <span>${stat.base_stat}</span>
            </p>
            <div class="barra-estadistica">
                <div class="relleno-estadistica" style="width: ${Math.min(100, stat.base_stat)}%"></div>
            </div>
        </div>
    `).join('');
    
    elementos.totalEstadisticas.textContent = totalStats;
    elementos.promedioEstadisticas.textContent = promedioStats;
    
    // Habilidades
    elementos.habilidadesPokemon.innerHTML = habilidades.map(habilidad => 
        `<li><i class="fas fa-chevron-right"></i> ${capitalizarTexto(habilidad.replace('-', ' '))}</li>`
    ).join('');
    
    // Evoluciones
    if (cadenaEvolucion && cadenaEvolucion.length > 0) {
        elementos.cadenaEvolucion.innerHTML = '';
        
        cadenaEvolucion.forEach((etapa, index) => {
            etapa.forEach(pokemonEvo => {
                const evolucionElemento = document.createElement('div');
                evolucionElemento.className = 'evolucion';
                evolucionElemento.addEventListener('click', () => mostrarDetallesPokemon(pokemonEvo));
                
                evolucionElemento.innerHTML = `
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonEvo.id}.png" alt="${pokemonEvo.name}" loading="lazy">
                    <p>${capitalizarTexto(pokemonEvo.name)}</p>
                `;
                
                elementos.cadenaEvolucion.appendChild(evolucionElemento);
            });
            
            if (index < cadenaEvolucion.length - 1) {
                const flecha = document.createElement('div');
                flecha.className = 'flecha-evolucion';
                flecha.innerHTML = '<i class="fas fa-arrow-right"></i>';
                elementos.cadenaEvolucion.appendChild(flecha);
            }
        });
    } else {
        elementos.cadenaEvolucion.innerHTML = '<p>Este Pokémon no evoluciona.</p>';
    }
    
    // Ubicaciones
    if (ubicaciones && ubicaciones.length > 0) {
        elementos.ubicacionesPokemon.innerHTML = ubicaciones
            .slice(0, 10) // Limitar a 10 ubicaciones
            .map(region => `<span class="ubicacion">${capitalizarTexto(region.replace('-', ' '))}</span>`)
            .join('');
        
        if (ubicaciones.length > 10) {
            elementos.ubicacionesPokemon.innerHTML += `<span class="ubicacion">+${ubicaciones.length - 10} más</span>`;
        }
    } else {
        elementos.ubicacionesPokemon.innerHTML = '<p>No se encontraron ubicaciones para este Pokémon.</p>';
    }
    
    // Movimientos
    if (movimientos && movimientos.length > 0) {
        elementos.movimientosPokemon.innerHTML = movimientos
            .slice(0, 15) // Limitar a 15 movimientos
            .map(movimiento => `<span class="movimiento tooltip" title="${capitalizarTexto(movimiento.name.replace('-', ' '))}">
                ${capitalizarTexto(movimiento.name.replace('-', ' ').substring(0, 10))}
                <span class="tooltiptext">${capitalizarTexto(movimiento.name.replace('-', ' '))}</span>
            </span>`)
            .join('');
        
        if (movimientos.length > 15) {
            elementos.movimientosPokemon.innerHTML += `<span class="movimiento">+${movimientos.length - 15} más</span>`;
        }
    } else {
        elementos.movimientosPokemon.innerHTML = '<p>No se encontraron movimientos para este Pokémon.</p>';
    }
}

function mostrarMensajeError(mensaje = null) {
    if (mensaje) {
        elementos.mensajeError.querySelector('p').textContent = mensaje;
    }
    elementos.mensajeError.classList.remove('oculto');
}

function mostrarSpinner() {
    elementos.listaPokemon.innerHTML = '<div class="spinner"></div>';
}

function ocultarSpinner() {
    const spinner = elementos.listaPokemon.querySelector('.spinner');
    if (spinner) spinner.remove();
}

// Funciones de login
function iniciarSesion(username) {
    estadoUsuario.loggedIn = true;
    estadoUsuario.username = username;
    
    // Actualizar UI
    elementos.botonLogin.classList.add('oculto');
    elementos.usuarioInfo.classList.remove('oculto');
    elementos.nombreUsuario.textContent = username;
    elementos.modalLogin.classList.add('oculto');
    
    // Guardar en localStorage
    localStorage.setItem('pokeDTUser', JSON.stringify(estadoUsuario));
    
    // Mostrar mensaje de bienvenida
    const bienvenida = document.createElement('div');
    bienvenida.className = 'mensaje-bienvenida aparecer';
    bienvenida.innerHTML = `
        <div class="contenido-bienvenida">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Pikachu">
            <p>¡Bienvenido, ${username}! Prepárate para tu aventura Pokémon.</p>
        </div>
    `;
    document.body.appendChild(bienvenida);
    
    // Eliminar mensaje después de 3 segundos
    setTimeout(() => {
        bienvenida.classList.add('desvanecer');
        setTimeout(() => bienvenida.remove(), 500);
    }, 3000);
}

function cerrarSesion() {
    estadoUsuario.loggedIn = false;
    estadoUsuario.username = null;
    
    // Actualizar UI
    elementos.botonLogin.classList.remove('oculto');
    elementos.usuarioInfo.classList.add('oculto');
    
    // Eliminar de localStorage
    localStorage.removeItem('pokeDTUser');
    
    // Mostrar mensaje de despedida
    const despedida = document.createElement('div');
    despedida.className = 'mensaje-bienvenida aparecer';
    despedida.innerHTML = `
        <div class="contenido-bienvenida">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" alt="Snorlax">
            <p>¡Hasta pronto! Snorlax echa una siesta mientras te espera.</p>
        </div>
    `;
    document.body.appendChild(despedida);
    
    // Eliminar mensaje después de 3 segundos
    setTimeout(() => {
        despedida.classList.add('desvanecer');
        setTimeout(() => despedida.remove(), 500);
    }, 3000);
}

function verificarSesion() {
    const usuarioGuardado = localStorage.getItem('pokeDTUser');
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        iniciarSesion(usuario.username);
    }
}

// Funciones de la API
async function obtenerDetallesPokemon(identificador) {
    // Verificar caché primero
    if (estado.detallesCache.has(identificador)) {
        return estado.detallesCache.get(identificador);
    }
    
    const respuesta = await fetch(`${CONFIG.pokeApiUrl}/pokemon/${identificador}`);
    if (!respuesta.ok) throw new Error('Pokémon no encontrado');
    
    const data = await respuesta.json();
    
    // Almacenar en caché
    estado.detallesCache.set(data.name, data);
    if (data.id) {
        estado.detallesCache.set(data.id.toString(), data);
    }
    
    return data;
}

async function obtenerEspeciePokemon(id) {
    if (estado.especieCache.has(id)) {
        return estado.especieCache.get(id);
    }
    
    const respuesta = await fetch(`${CONFIG.pokeApiUrl}/pokemon-species/${id}`);
    if (!respuesta.ok) throw new Error('Especie no encontrada');
    
    const data = await respuesta.json();
    estado.especieCache.set(id, data);
    return data;
}

async function obtenerCadenaEvolucion(id) {
    if (estado.evolucionCache.has(id)) {
        return estado.evolucionCache.get(id);
    }
    
    const especie = await obtenerEspeciePokemon(id);
    const respuesta = await fetch(especie.evolution_chain.url);
    if (!respuesta.ok) return null;
    
    const data = await respuesta.json();
    const cadenaProcesada = procesarCadenaEvolucion(data.chain);
    
    estado.evolucionCache.set(id, cadenaProcesada);
    return cadenaProcesada;
}

function procesarCadenaEvolucion(cadena) {
    const resultado = [];
    
    function procesarEtapa(etapa, nivel) {
        if (!resultado[nivel]) resultado[nivel] = [];
        
        const id = obtenerIdDeUrl(etapa.species.url);
        resultado[nivel].push({
            name: etapa.species.name,
            id: id
        });
        
        if (etapa.evolves_to && etapa.evolves_to.length > 0) {
            etapa.evolves_to.forEach(e => procesarEtapa(e, nivel + 1));
        }
    }
    
    procesarEtapa(cadena, 0);
    return resultado;
}

async function obtenerUbicacionesPokemon(id) {
    if (estado.ubicacionCache.has(id)) {
        return estado.ubicacionCache.get(id);
    }
    
    try {
        const respuesta = await fetch(`${CONFIG.pokeApiUrl}/pokemon/${id}/encounters`);
        if (!respuesta.ok) return [];
        
        const data = await respuesta.json();
        const ubicacionesUnicas = [...new Set(data.map(e => e.location_area.name))];
        
        estado.ubicacionCache.set(id, ubicacionesUnicas);
        return ubicacionesUnicas;
    } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        return [];
    }
}

async function obtenerMovimientosPokemon(id) {
    if (estado.movimientoCache.has(id)) {
        return estado.movimientoCache.get(id);
    }
    
    try {
        const detalles = await obtenerDetallesPokemon(id);
        const movimientos = detalles.moves.map(m => m.move);
        
        estado.movimientoCache.set(id, movimientos);
        return movimientos;
    } catch (error) {
        console.error('Error al cargar movimientos:', error);
        return [];
    }
}

// Funciones de utilidad
function obtenerDescripcionEnEspanol(entradasDescripcion) {
    const descripcionEspanol = entradasDescripcion.find(
        entrada => entrada.language.name === 'es'
    );
    
    return descripcionEspanol ? 
        descripcionEspanol.flavor_text.replace(/\f/g, ' ').replace(/\u00ad\n/g, ' ') : 
        null;
}

function obtenerIdDeUrl(url) {
    return parseInt(url.split('/').slice(-2, -1)[0]);
}

function capitalizarTexto(texto) {
    return texto.replace(/-/g, ' ')
               .split(' ')
               .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
               .join(' ');
}