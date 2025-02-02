document.addEventListener("DOMContentLoaded", function () {
    if (typeof eel === "undefined") {
        console.error("Eel no está cargado. Verifica que eel.js esté incluido en tu HTML.");
        return;
    }

    document.getElementById("btn_login").addEventListener("click", function(event) {
        event.preventDefault();  // Evita que el formulario se envíe de forma tradicional

        // Obtener valores de los campos de entrada
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        // Llamar a la función de verificación de login en el backend
        eel.verify_login(correo, contrasena)(function(response) {
            if (response.mensaje === "Login exitoso") {
                // Verifica el tipo de usuario y redirige a la vista correspondiente
                if (response.role === "admin") {
                    window.location.href = "pages/administrator/dashboard/dashboard.html"; // Asegúrate de que esta ruta sea correcta
                } else if (response.role === "superuser") {
                    window.location.href = "pages/superuser/usuarios/usuarios.html"; // Asegúrate de que esta ruta sea correcta
                }
            } else {
                // Mostrar mensaje de error en la interfaz
                document.getElementById("message").innerText = response.mensaje;
            }
        });
    });
});
