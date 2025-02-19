document.addEventListener("DOMContentLoaded", function () {
    let rol = sessionStorage.getItem("rol");

    console.log("Rol almacenado en sessionStorage:", rol); // Depuración

    if (!rol) {
        console.log("No hay rol almacenado, no ocultamos nada.");
        return;
    }

    rol = rol.toLowerCase(); // Convertimos a minúsculas para evitar errores de comparación

    if (rol === "superusuario") {
        console.log("Superusuario detectado, no ocultamos botones.");
        return; // No ocultamos nada si es superusuario
    }

    if (rol === "administrador") {
        console.log("Administrador detectado, ocultando botones de superusuario.");
        document.querySelectorAll(".super-only").forEach((boton) => {
            boton.style.display = "none"; 
        });
    }
});