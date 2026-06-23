// Obtener elementos del DOM
const formulario = document.getElementById('formulario-libros');
const inputTitulo = document.getElementById('titulo');
const inputEmail = document.getElementById('email');
const selectCategoria = document.getElementById('categoria');
const selectGenero = document.getElementById('genero');
const inputAnio = document.getElementById('anio');
const contenedorVisor = document.getElementById('contenedor-visor');

// Generos segun la categoria
const generosPorCategoria = {
    'ficcion': [
        { value: 'novela', text: 'Novela' },
        { value: 'ciencia-ficcion', text: 'Ciencia Ficción' },
        { value: 'fantasia', text: 'Fantasía' },
        { value: 'terror', text: 'Terror / Suspenso' }
    ],
    'no-ficcion': [
        { value: 'ensayo', text: 'Ensayo' },
        { value: 'biografia', text: 'Biografía / Historia' },
        { value: 'cientifico', text: 'Divulgación Científica' },
        { value: 'autoayuda', text: 'Autoayuda / Desarrollo' }
    ]
};

// Lista de libros
let listaDeLibros = JSON.parse(localStorage.getItem('mis_libros')) || [];

function guardarEnLocalStorage() {
    localStorage.setItem('mis_libros', JSON.stringify(listaDeLibros));
}

// Lógica de Categorias
function actualizarSelectGenero() {
    const categoriaSeleccionada = selectCategoria.value;
    selectGenero.innerHTML = '';

    if (categoriaSeleccionada === '') {
        const opcionDefecto = document.createElement('option');
        opcionDefecto.value = '';
        opcionDefecto.textContent = '-- Seleccione primero una categoría --';
        selectGenero.appendChild(opcionDefecto);
        selectGenero.disabled = true;
    } else {
        const opcionDefecto = document.createElement('option');
        opcionDefecto.value = '';
        opcionDefecto.textContent = '-- Seleccione un género --';
        selectGenero.appendChild(opcionDefecto);

        const generos = generosPorCategoria[categoriaSeleccionada];
        generos.forEach(genero => {
            const opcion = document.createElement('option');
            opcion.value = genero.value;
            opcion.textContent = genero.text;
            selectGenero.appendChild(opcion);
        });

        selectGenero.disabled = false;
    }
}

// Validación de formulario
function mostrarError(inputElement, mensajeErrorId, mensaje) {
    const spanError = document.getElementById(mensajeErrorId);
    spanError.textContent = mensaje;
    inputElement.classList.add('input-invalid');
    inputElement.classList.remove('input-valid');
}

function marcarComoValido(inputElement, mensajeErrorId) {
    const spanError = document.getElementById(mensajeErrorId);
    spanError.textContent = '';
    inputElement.classList.remove('input-invalid');
    inputElement.classList.add('input-valid');
}

function validarFormulario() {
    let formularioValido = true;
    const tituloValor = inputTitulo.value.trim();
    if (tituloValor === '') {
        mostrarError(inputTitulo, 'error-titulo', 'El título del libro es obligatorio.');
        formularioValido = false;
    } else if (tituloValor.length < 3) {
        mostrarError(inputTitulo, 'error-titulo', 'El título debe tener al menos 3 caracteres.');
        formularioValido = false;
    } else {
        marcarComoValido(inputTitulo, 'error-titulo');
    }

    const emailValor = inputEmail.value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValor === '') {
        mostrarError(inputEmail, 'error-email', 'El correo electrónico es obligatorio.');
        formularioValido = false;
    } else if (!regexEmail.test(emailValor)) {
        mostrarError(inputEmail, 'error-email', 'El formato del correo no es válido.');
        formularioValido = false;
    } else {
        marcarComoValido(inputEmail, 'error-email');
    }

    const categoriaValor = selectCategoria.value;
    if (categoriaValor === '') {
        mostrarError(selectCategoria, 'error-categoria', 'Debe seleccionar una categoría principal.');
        formularioValido = false;
    } else {
        marcarComoValido(selectCategoria, 'error-categoria');
    }

    const generoValor = selectGenero.value;
    if (generoValor === '') {
        mostrarError(selectGenero, 'error-genero', 'Debe seleccionar un género literario.');
        formularioValido = false;
    } else {
        const generosValidos = generosPorCategoria[categoriaValor].map(g => g.value);
        if (!generosValidos.includes(generoValor)) {
            mostrarError(selectGenero, 'error-genero', 'El género elegido no corresponde a la categoría.');
            formularioValido = false;
        } else {
            marcarComoValido(selectGenero, 'error-genero');
        }
    }

    const anioValor = parseInt(inputAnio.value, 10);
    const anioActual = 2026; 
    if (isNaN(anioValor) || inputAnio.value.trim() === '') {
        mostrarError(inputAnio, 'error-anio', 'El año de publicación es obligatorio.');
        formularioValido = false;
    } else if (anioValor < 0 || anioValor > anioActual) {
        mostrarError(inputAnio, 'error-anio', `El año debe estar entre 0 y ${anioActual}.`);
        formularioValido = false;
    } else {
        marcarComoValido(inputAnio, 'error-anio');
    }

    return formularioValido;
}

// Renderizado y Eliminación
function renderizarVisor() {
    contenedorVisor.innerHTML = '';

    if (listaDeLibros.length === 0) {
        contenedorVisor.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
                <h3>No hay libros registrados en el sistema todavía.</h3>
                <p>Usa el formulario para añadir tu primer libro.</p>
            </div>
        `;
        return;
    }

    listaDeLibros.forEach((libro) => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-libro');

        tarjeta.innerHTML = `
            <div>
                <h3>${libro.titulo}</h3>
                <p><strong>Año:</strong> ${libro.anio}</p>
                <p><strong>Categoría:</strong> ${libro.categoria === 'ficcion' ? 'Ficción' : 'No Ficción'}</p>
                <p><strong>Género:</strong> ${libro.generoText}</p>
                <p><strong>Recomendado por:</strong> ${libro.email}</p>
            </div>
        `;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn-eliminar');
        
        btnEliminar.addEventListener('click', () => {
            eliminarLibro(libro.id);
        });

        tarjeta.appendChild(btnEliminar);
        contenedorVisor.appendChild(tarjeta);
    });
}

function eliminarLibro(id) {
    listaDeLibros = listaDeLibros.filter(libro => libro.id !== id);
    guardarEnLocalStorage();
    renderizarVisor();
}

// Event Listeners
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    if (validarFormulario()) {
        const nuevoLibro = {
            id: Date.now(),
            titulo: inputTitulo.value.trim(),
            email: inputEmail.value.trim(),
            categoria: selectCategoria.value,
            genero: selectGenero.value,
            generoText: selectGenero.options[selectGenero.selectedIndex].text,
            anio: inputAnio.value
        };

        listaDeLibros.push(nuevoLibro);
        guardarEnLocalStorage();
        
        formulario.reset();
        actualizarSelectGenero();
        renderizarVisor();

        document.querySelectorAll('.form-group input, .form-group select').forEach(element => {
            element.classList.remove('input-valid', 'input-invalid');
        });
    }
});

selectCategoria.addEventListener('change', () => {
    actualizarSelectGenero();
    const spanError = document.getElementById('error-categoria');
    spanError.textContent = '';
    selectCategoria.classList.remove('input-invalid', 'input-valid');
});

inputTitulo.addEventListener('focus', () => {
    const spanError = document.getElementById('error-titulo');
    spanError.textContent = '';
    inputTitulo.classList.remove('input-invalid', 'input-valid');
});

// Inicialización
actualizarSelectGenero();
renderizarVisor();