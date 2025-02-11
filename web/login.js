document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        let correo = document.getElementById("correo").value;
        let contrasena = document.getElementById("contrasena").value;

        if (!correo || !contrasena) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Llamamos a la función de login en Python usando Eel
        let response = await eel.login_usuario(correo, contrasena)();

        if (response.success) {
            alert("Inicio de sesión exitoso.");

            // 🔹 Guarda el id_usuario en sessionStorage
            sessionStorage.setItem("id_usuario", response.user.id_usuario);

            // Redirigir a la página principal o dashboard
            window.location.href = "/pages/superusuario/clientes/clientes.html";
        } else {
            alert(response.message);
        }
    });
});