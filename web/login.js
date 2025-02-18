document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;

    // Llamada al backend para verificar las credenciales
    let respuesta = await eel.verificar_credenciales(correo, contrasena)();

    if (respuesta.success) {
        // Guardar el nombre del rol en sessionStorage en minúsculas
        sessionStorage.setItem("rol", respuesta.rol.toLowerCase());

        // Mostrar alerta indicando el rol con Swal.fire
        Swal.fire({
            title: "Inicio de sesión exitoso",
            text: `Has iniciado sesión como ${respuesta.rol}`,
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            // Redirigir a la página principal según el rol
            window.location.href = "pages/superusuario/clientes/clientes.html";
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "Credenciales incorrectas",
            icon: "error",
            confirmButtonText: "Intentar de nuevo"
        });
    }
});
