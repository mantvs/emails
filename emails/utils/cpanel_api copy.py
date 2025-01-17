import requests

class CPanelAPI:
    def __init__(self, hostname, username, token):
        self.hostname = hostname
        self.username = username
        self.token = token
        self.base_url = f"https://{hostname}:2083/json-api/"
        self.headers = {
            "Authorization": f"cpanel {username}:{token}"
        }

    def list_email_accounts(self, domain):
        """Lista as contas de e-mail para um domínio."""
        endpoint = "list_pops"
        params = {
            "cpanel_jsonapi_user": self.username,
            "cpanel_jsonapi_apiversion": "2",
            "cpanel_jsonapi_module": "Email",
            "cpanel_jsonapi_func": endpoint,
            "domain": domain
        }
        response = requests.get(self.base_url, headers=self.headers, params=params)
        return response.json()

    def create_email_account(self, email, password, quota, domain):
        """Cria uma conta de e-mail."""
        endpoint = "addpop"
        params = {
            "cpanel_jsonapi_user": self.username,
            "cpanel_jsonapi_apiversion": "2",
            "cpanel_jsonapi_module": "Email",
            "cpanel_jsonapi_func": endpoint,
            "email": email,
            "password": password,
            "quota": quota,
            "domain": domain
        }
        response = requests.get(self.base_url, headers=self.headers, params=params)
        return response.json()

    def delete_email_account(self, email, domain):
        """Exclui uma conta de e-mail."""
        endpoint = "delpop"
        params = {
            "cpanel_jsonapi_user": self.username,
            "cpanel_jsonapi_apiversion": "2",
            "cpanel_jsonapi_module": "Email",
            "cpanel_jsonapi_func": endpoint,
            "email": email,
            "domain": domain
        }
        response = requests.get(self.base_url, headers=self.headers, params=params)
        return response.json()