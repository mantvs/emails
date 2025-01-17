import requests
import frappe

class CPanelAPI:
    def __init__(self, hostname, username, token):
        self.base_url = f"https://{hostname}:2083/execute/"
        self.headers = {
            "Authorization": f"cpanel {username}:{token}"
        }

    def list_email_accounts(self, domain):
        """Lista as contas de e-mail para um domínio."""
        endpoint = "Email/list_pops"
        params = {
            "domain": domain
        }
        response = requests.get(f"{self.base_url}{endpoint}", headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()
    
    def create_email_account(self, email, password, quota, domain):
        """Cria uma conta de e-mail."""
        endpoint = "Email/add_pop"
        params = {
            "email": email,
            "password": password,
            "quota": quota,
            "domain": domain
        }
        response = requests.get(f"{self.base_url}{endpoint}", headers=self.headers, params=params)
        response.raise_for_status()
        return response.json() 

    def delete_email_account(self, email, domain):
        """Exclui uma conta de e-mail."""
        endpoint = "Email/delete_pop"
        params = {
            "email": email,
            "domain": domain
        }
        response = requests.get(f"{self.base_url}{endpoint}", headers=self.headers, params=params)
        return response.json()
    
    def change_email_password(self, email, new_password, domain):
        """Altera a senha de uma conta de e-mail."""
        endpoint = "Email/passwd_pop"
        params = {
            "email": email,
            "password": new_password,
            "domain": domain
        }
        response = requests.get(f"{self.base_url}{endpoint}", headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()
