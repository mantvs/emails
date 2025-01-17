frappe.ready(() => {
    if (frappe.get_route() === "login") {
        // Selecionar o botão de login
        const loginButton = document.querySelector('.btn-login');

        if (loginButton) {
            // Aplicar estilos ao botão
            loginButton.style.backgroundColor = "#007bff"; // Fundo azul
            loginButton.style.color = "#fff";             // Texto branco
            loginButton.style.borderColor = "#007bff";    // Borda azul
            loginButton.style.borderRadius = "5px";       // Bordas arredondadas
            loginButton.style.padding = "10px 20px";      // Padding interno
            loginButton.style.fontWeight = "bold";        // Texto levemente negrito
            loginButton.style.cursor = "pointer";         // Cursor de mão no hover
        }
    }
});
