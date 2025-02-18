// web/login.js
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;

    // Llamada al backend para verificar las credenciales
    let respuesta = await eel.verificar_credenciales(correo, contrasena)();

    if (respuesta.success) {
        // Guardar el nombre del rol en sessionStorage en minúsculas
        sessionStorage.setItem("rol", respuesta.rol.toLowerCase());

        // Redirigir a la página principal según el rol
        window.location.href = "pages/superusuario/clientes/clientes.html"; // Página de inicio
    } else {
        alert("Credenciales incorrectas");
    }
});
