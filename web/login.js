// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    
    // Verifica si Eel está disponible para evitar errores
    if (typeof eel === "undefined") {
        console.error("Eel no está cargado. Verifica que eel.js esté incluido en tu HTML.");
        return;
    }

    // Agregar evento al botón de login
    document.getElementById("btn_login").addEventListener("click", function(event) {
        event.preventDefault();  // Evita que el formulario se envíe de forma tradicional

        // Obtener valores de los campos de entrada
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        // Llamar a la función de verificación de login en el backend
        eel.verify_login(correo, contrasena)(function(response) {
            // Si el login es exitoso, redirigir al dashboard
            if (response.mensaje === "Login exitoso") {
                window.location.href = "pages/administrator/dashboard/dashboard.html";
            } else {
                // Mostrar mensaje de error en la interfaz
                document.getElementById("message").innerText = response.mensaje;
            }
        });
    });
});
