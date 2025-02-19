document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;

    let respuesta = await eel.verificar_credenciales(correo, contrasena)();

    if (respuesta.success) {
        sessionStorage.setItem("rol", respuesta.rol.toLowerCase());
        sessionStorage.setItem("nombre_usuario", respuesta.nombre_usuario);
        sessionStorage.setItem("apellido_pt", respuesta.apellido_pt);
        sessionStorage.setItem("apellido_mt", respuesta.apellido_mt);
        sessionStorage.setItem("id_usuario", respuesta.id_usuario); // Asegúrate de almacenar el id_usuario

        Swal.fire({
            icon: "success",
            title: `Bienvenido, ${respuesta.nombre_usuario}!`,
            text: `Has iniciado sesión como ${respuesta.rol}`,
            showConfirmButton: true, // Agrega un botón de "Aceptar"
            confirmButtonText: "Aceptar" // Personaliza el texto del botón
        }).then(() => {
            // Redirige después de que el usuario presione "Aceptar"
            //window.location.href = "pages/superusuario/clientes/clientes.html";
            window.location.href = "/pages/superusuario/clientes/clientes.html";
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "Credenciales incorrectas",
            text: "Verifica tu correo y contraseña",
            confirmButtonText: "Aceptar"
        });
    }
});
