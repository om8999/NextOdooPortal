import xmlrpc.client

class OdooRPC:
    def __init__(self, db, user, pwd, url):
        if not all([db, user, pwd, url]):
            raise ValueError(
                f"OdooRPC config error → "
                f"db={db}, user={user}, pwd={'SET' if pwd else None}, url={url}"
            )

        self.db = db
        self.user = user
        self.pwd = pwd
        self.url = url.rstrip("/")  
        self.login()

    def login(self):
        try:
            common = xmlrpc.client.ServerProxy(
                f"{self.url}/xmlrpc/2/common",
                allow_none=True
            )

            self.uid = common.login(self.db, self.user, self.pwd)

            if not self.uid:
                raise Exception("Invalid Odoo credentials")

            self.models = xmlrpc.client.ServerProxy(
                f"{self.url}/xmlrpc/2/object",
                allow_none=True
            )

        except Exception as e:
            raise Exception(f"Odoo login failed: {str(e)}")

    def call(self, model, method, args=None, kwargs=None):
        if not hasattr(self, "uid"):
            raise Exception("Odoo session not initialized")

        try:
            return self.models.execute_kw(
                self.db,
                self.uid,
                self.pwd,
                model,
                method,
                args or [],
                kwargs or {}
            )
        except Exception as e:
            raise Exception(
                f"Odoo RPC error → {model}.{method}: {str(e)}"
            )
