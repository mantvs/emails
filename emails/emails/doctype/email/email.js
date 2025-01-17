// Copyright (c) 2025, Manto Tecnologia and contributors
// For license information, please see license.txt

frappe.ui.form.on("Email", {
    refresh: function (frm) {

        // Atualizar a lista de e-mails na tela
        update_email_list(frm);

        frm.add_custom_button("Criar Email", () => {
            // Obtendo o domínio de forma assíncrona     
            frappe.db.get_single_value("Email Settings", "cpanel_domain")
            .then((domain) => {

                // Gerando uma senha aleatória
                const senhaGerada = gerarSenha();

                // Exibindo o prompt após obter o domínio
                frappe.prompt([
                    { label: "Email", fieldname: "email", fieldtype: "Data", description: `@${domain}` },
                    { label: "Password", fieldname: "password", fieldtype: "Password", default: senhaGerada, read_only: 1, description: "Copie e cole em local seguro" },
                    { label: "Quota (MB)", fieldname: "quota", fieldtype: "Int", default: 500, read_only: 1 }
                ], (values) => {
                    const full_email = `${values.email}@${domain}`; 
                    values.email = values.email.replace(`@${domain}`, "");               
                    frappe.call({
                        method: "emails.emails.doctype.email.email.create_email",
                        args: values,
                        callback: function (r) {
                            if (r.message) {
                                frappe.msgprint(`O email ${full_email} foi criado com sucesso!`);
                                // Atualizar a lista de e-mails na tela
                                update_email_list(frm);      
                            }
                        }
                    });
                }, "Criar Email", "Criar");
            });
        });
        
        frm.add_custom_button("Excluir Email", () => {
            // Obtendo a lista de contas de e-mail existentes
            frappe.call({
                method: "emails.emails.doctype.email.email.list_emails",
                callback: function (r) {
                    if (r.message) {
                        // Convertendo as contas de e-mail para o formato esperado pelo campo Select
                        const emailOptions = r.message.map(email => email.email);
        
                        // Obtendo o domínio de forma assíncrona
                        frappe.db.get_single_value("Email Settings", "cpanel_domain")
                        .then((domain) => {
                            // Exibindo o prompt com as contas de e-mail existentes
                            frappe.prompt([
                                {  label: "Selecione o Email", fieldname: "email", fieldtype: "Select",  options: emailOptions }
                            ], (values) => {
                                // Confirmando a exclusão do e-mail selecionado
                                frappe.confirm(
                                    `Tem certeza que deseja excluir a conta de e-mail ${values.email}?`, 
                                    () => {
                                        // Caso o usuário confirme, exclui o e-mail
                                        frappe.call({
                                            method: "emails.emails.doctype.email.email.delete_email",
                                            args: {
                                                email: values.email,
                                                domain: domain
                                            },
                                            callback: function (r) {
                                                if (r.message) {
                                                    frappe.msgprint(`O e-mail ${values.email} foi excluído com sucesso!`);
                                                    // Atualizar a lista de e-mails na tela
                                                    update_email_list(frm);
                                                }
                                            }
                                        });
                                    },
                                    () => {
                                        // Caso o usuário cancele a exclusão
                                        frappe.msgprint("A exclusão foi cancelada.");
                                    }
                                );
                            }, "Excluir Email", "Excluir");
                        });
                    } else {
                        frappe.msgprint("Nenhum e-mail encontrado para excluir.");
                    }
                }
            });
        });

        frm.add_custom_button("Alterar Senha", () => {
            // Obtendo a lista de contas de e-mail existentes
            frappe.call({
                method: "emails.emails.doctype.email.email.list_emails",
                callback: function (r) {
                    if (r.message) {
                        // Convertendo as contas de e-mail para o formato esperado pelo campo Select
                        const emailOptions = r.message.map(email => email.email);
        
                        // Gerando uma nova senha automaticamente
                        const novaSenhaGerada = gerarSenha();
        
                        // Obtendo o domínio de forma assíncrona
                        frappe.db.get_single_value("Email Settings", "cpanel_domain")
                        .then((domain) => {
                            // Exibindo o prompt com as contas de e-mail existentes
                            frappe.prompt([
                                { label: "Selecione o Email", fieldname: "email", fieldtype: "Select", options: emailOptions },
                                { label: "Nova Senha", fieldname: "new_password", fieldtype: "Password", default: novaSenhaGerada, read_only: 1, description: "Copie e cole em local seguro" }
                            ], (values) => {
                                frappe.call({
                                    method: "emails.emails.doctype.email.email.change_email_password",
                                    args: { 
                                        email: values.email, 
                                        new_password: values.new_password,
                                        domain: domain
                                    },
                                    callback: function (r) {
                                        if (r.message) {
                                            frappe.msgprint(`A senha do email ${values.email} foi alterada com sucesso!`);
                                        }
                                    }
                                });
                            }, "Alterar Senha", "Alterar");
                        });
                    } else {
                        frappe.msgprint("Nenhum email encontrado para alterar a senha.");
                    }
                }
            });
        }); 
      
        // Adicionar botão de logout
        frm.add_custom_button("Sair", () => {
            frappe.app.logout(); // Chama o método de logout do Frappe
        }).css({
            "background-color": "#2eb2ff",  // Fundo azul
            "color": "#fff",               // Texto branco
            "cursor": "pointer"            // Cursor de mão no hover
        });

}});


// Função para atualizar a lista de e-mails no campo HTML
function update_email_list(frm) {
    frappe.call({
        method: "emails.emails.doctype.email.email.list_emails",
        callback: function (r) {
            if (r.message) {
                const emails = r.message;
                let html = `
                    <table style="border-collapse: collapse; width: 100%; margin-top: 60px; margin-bottom: 40px;">
                        <thead style="border: 0px solid #dee2e6;">
                            <tr>
                                <th style="padding: 7px 0 7px 10px; text-align: left; border-radius: 10px; background-color: #f3f3f3; font-weight: 550;">Contas de E-mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${emails.map(email => `
                                <tr style="border-bottom: 1px solid #dee2e6;">
                                    <td style="padding: 10px;">${email.email}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;

                frm.set_df_property("email_list", "options", html);                
            } else {
                frm.set_df_property("email_list", "options", "<p>Nenhum email encontrado</p>")
            }
        }

    })
}

// Função para gerar senha
function gerarSenha() {
    const caracteresMaiusculos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const caracteresMinusculos = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiais = "!@#$%^&*";
    
    const todasAsPossibilidades = caracteresMaiusculos + caracteresMinusculos + numeros + especiais;

    let senha = "";

    // Garantir pelo menos um de cada tipo
    senha += caracteresMaiusculos.charAt(Math.floor(Math.random() * caracteresMaiusculos.length));
    senha += caracteresMinusculos.charAt(Math.floor(Math.random() * caracteresMinusculos.length));
    senha += numeros.charAt(Math.floor(Math.random() * numeros.length));
    senha += especiais.charAt(Math.floor(Math.random() * especiais.length));

    // Preencher com caracteres aleatórios até atingir o comprimento mínimo de 8 caracteres
    for (let i = senha.length; i < 8; i++) {
        senha += todasAsPossibilidades.charAt(Math.floor(Math.random() * todasAsPossibilidades.length));
    }

    // Embaralhar os caracteres da senha
    senha = senha.split("").sort(() => Math.random() - 0.5).join("");

    // Verificar se a senha não contém combinações de caracteres repetidos ou sequenciais
    while (/(\w)\1/.test(senha) || /012|123|234|345|456|567|678|789/.test(senha)) {
        senha = gerarSenha();
    }

    return senha;
}


