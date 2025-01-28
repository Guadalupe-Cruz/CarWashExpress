// Sobrescribir empleados en localStorage con datos iniciales
localStorage.setItem(
    'empleados',
    JSON.stringify([
        { nombre: 'Yuritzy', apellido: 'Cruz', email: 'al22211082@gmail.com' },
        { nombre: 'Yair', apellido: 'Rodriguez', email: 'yayo07@gmail.com' },
    ])
);

// Obtener empleados desde localStorage
let empleados = JSON.parse(localStorage.getItem('empleados'));

// Renderizar la tabla principal
function renderMainTable() {
    const tableBody = document.querySelector('#empleados-table tbody');
    tableBody.innerHTML = '';
    empleados.forEach((empleado, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empleado.nombre}</td>
            <td>${empleado.apellido}</td>
            <td>${empleado.email}</td>
            <td>
                <button onclick="deleteEmployee(${index})"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para eliminar empleado
function deleteEmployee(index) {
    const eliminado = empleados.splice(index, 1)[0];
    const eliminados = JSON.parse(localStorage.getItem('eliminados')) || [];
    eliminados.push(eliminado);
    localStorage.setItem('eliminados', JSON.stringify(eliminados));
    localStorage.setItem('empleados', JSON.stringify(empleados));
    renderMainTable();
}

// Función para alternar el formulario
function toggleForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.classList.toggle('form-hidden');
}

// Función para agregar un empleado
function addEmployee(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;

    empleados.push({ nombre, apellido, email });
    localStorage.setItem('empleados', JSON.stringify(empleados));

    renderMainTable();
    toggleForm(); // Ocultar el formulario
    event.target.reset(); // Limpiar el formulario
}

// Cargar tabla al iniciar
renderMainTable();
