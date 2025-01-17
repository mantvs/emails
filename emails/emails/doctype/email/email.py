# Copyright (c) 2025, Manto Tecnologia and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from emails.utils.cpanel_api import CPanelAPI


class Email(Document):
    # Campos e métodos adicionais podem ser adicionados aqui para representar um e-mail
    pass

def get_cpanel_credentials():
    settings = frappe.get_single("Email Settings")
    if not settings.cpanel_hostname or not settings.cpanel_username or not settings.cpanel_token:
        frappe.throw("Faltam configurações do cPanel")
    return settings.cpanel_hostname, settings.cpanel_username, settings.cpanel_token, settings.cpanel_domain

@frappe.whitelist()
def list_emails():
    hostname, username, token, domain = get_cpanel_credentials()
    api = CPanelAPI(hostname, username, token)
    response = api.list_email_accounts(domain)
    if response.get("status") != 1:
        frappe.throw(f"Erro ao listar os e-mails: {response.get('error', 'Erro desconhecido')}")
    accounts = response.get("data")
    filtered_accounts = [account for account in accounts if account.get("email", "").endswith(f"@{domain}")] 
    return filtered_accounts

@frappe.whitelist()
def create_email(email, password, quota):
    hostname, username, token, domain = get_cpanel_credentials()
    api = CPanelAPI(hostname, username, token)
    response = api.create_email_account(email, password, quota, domain)
    if response.get("status") != 1:
        frappe.throw(f"Erro ao criar a conta de e-mail: {response.get('error', 'Erro desconhecido')}")
    return response

@frappe.whitelist()
def delete_email(email):
    hostname, username, token, domain = get_cpanel_credentials()
    api = CPanelAPI(hostname, username, token)
    response = api.delete_email_account(email, domain)
    if response.get("status") != 1:
        frappe.throw(f"Erro ao excluir a conta de e-mail: {response.get('error', 'Erro desconhecido')}")
    return response

@frappe.whitelist()
def change_email_password(email, new_password, domain):
    hostname, username, token, domain = get_cpanel_credentials()
    api = CPanelAPI(hostname, username, token)  # Cria a instância da classe CPanelAPI
    response = api.change_email_password(email, new_password, domain)  # Chama o método de alteração de senha
    return response
