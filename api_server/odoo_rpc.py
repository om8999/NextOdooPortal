# odoo_rpc.py
import xmlrpc.client

class OdooRPC:
    def __init__(self, db, user, pwd, url):
        self.db = db
        self.url = url
        self.user = user
        self.pwd = pwd

        self.login()

    def login(self):
        common = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/common")
        self.uid = common.login(self.db, self.user, self.pwd)

        if not self.uid:
            raise Exception("Failed to login to Odoo")

        self.models = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object")

    def call(self, model, method, args=None, kwargs=None):
        return self.models.execute_kw(
            self.db, self.uid, self.pwd,
            model, method,
            args or [],
            kwargs or {}
        )
