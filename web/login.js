// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    
    // Verifica si Eel está disponible para evitar errores
    if (typeof eel === "undefined") {
        console.error("Eel no está cargado. Verifica que eel.js esté incluido en tu HTML.");
        return;
    }

    // Evento para el botón de login
    document.getElementById("btn_login").addEventListener("click", function(event) {
        event.preventDefault();

        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        // Llamada a la función de Python
        eel.verify_login(correo, contrasena)(function(response) {
            if (response.mensaje === "Login exitoso") {
                // Guardar datos del usuario en localStorage (para uso en el frontend)
                localStorage.setItem("id_usuario", response.id_usuario);
                localStorage.setItem("nombre_usuario", response.nombre_usuario);
                localStorage.setItem("id_rol", response.id_rol);
                localStorage.setItem("id_sucursal", response.id_sucursal);

                // Redirigir según el rol
                if (response.id_rol === 3) {
                    window.location.href = "/pages/superuser/historico_usuarios/historico_usuarios.html";
                }
                
                if (response.id_rol === 1) {
                    window.location.href = "/pages/administrator/dashboard/dashboard.html";
                }

                if (response.id_rol === 2) {
                    alert("Acceso denegado para un auxiliar.");
                }

            } else {
                alert("Credenciales incorrectas. Intenta de nuevo.");
            }
        });
    });

});
