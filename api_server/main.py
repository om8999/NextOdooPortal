# main.py
from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel
from odoo_rpc import OdooRPC
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token
from middleware import auth_middleware
from dotenv import load_dotenv
import os

load_dotenv()  # 👈 loads .env from project root

ODOO_ADMIN_USER = os.getenv("ODOO_ADMIN_USER")
ODOO_ADMIN_PASS = os.getenv("ODOO_ADMIN_PASS")

if not ODOO_ADMIN_USER or not ODOO_ADMIN_PASS:
    raise RuntimeError("Missing Odoo admin credentials")
app = FastAPI()

app.middleware("http")(auth_middleware)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginModel(BaseModel):
    login: str
    password: str

@app.get("/")
def root():
    return {"status": "API running"}

@app.post("/login")
def login(data: LoginModel):
    try:
        print("=======Data===>",data)
        rpc = OdooRPC(
            db="TESTING_SCANNING_SHIPMENT",
            user=data.login,
            pwd=data.password,
            url="http://localhost:8069"
        )

        user_data = rpc.call(
            "res.users",
            "read",
            args=[[rpc.uid]],
            kwargs={"fields": ["name", "login"]}
        )[0]
        is_admin = rpc.call(
            "res.users",
            "has_group",
            args=[[rpc.uid],"base.group_system"]
        )

        print("USERDATA------>",user_data)
        token = create_access_token({
            "uid": rpc.uid,
            "login": user_data["login"],
            "name": user_data["name"],
            "is_admin": is_admin,
        })

        return {
            "success": True,
            "access_token": token,
            "user": {
                "uid": rpc.uid,
                "name": user_data["name"],
                "login": user_data["login"],
                "is_admin": is_admin,
            }
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/me")
def me(request: Request):
    user = request.state.user
    print("user======>",user)
    return {
        "uid": user["uid"],
        "login": user["login"],
        "name": user["name"],
        "is_admin": user.get("is_admin", False),
    }

class SignupModel(BaseModel):
    name: str
    email: str
    password: str

@app.post("/signup")
def signup(data: SignupModel):
    try:
        # 1️⃣ Connect as ADMIN / SERVICE USER
        admin_rpc = OdooRPC(
            db="TESTING_SCANNING_SHIPMENT",
            user=ODOO_ADMIN_USER,          # or service user
            pwd=ODOO_ADMIN_PASS,  # 🔐 move to env later
            url="http://localhost:8069"
        )

        # 2️⃣ Check if user already exists
        existing_user = admin_rpc.call(
            "res.users",
            "search",
            args=[[("login", "=", data.email)]],
            kwargs={"limit": 1}
        )

        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        # 3️⃣ Create Partner
        partner_id = admin_rpc.call(
            "res.partner",
            "create",
            args=[{
                "name": data.name,
                "email": data.email,
            }]
        )

        # 4️⃣ Get Portal Group ID
        portal_group = admin_rpc.call(
            "ir.model.data",
            "search_read",
            args=[[("module", "=", "base"), ("name", "=", "group_portal")]],
            kwargs={"fields": ["res_id"], "limit": 1}
        )

        if not portal_group:
            raise Exception("Portal group not found")

        portal_group_id = portal_group[0]["res_id"]

        # 5️⃣ Create User
        user_id = admin_rpc.call(
            "res.users",
            "create",
            args=[{
                "name": data.name,
                "login": data.email,
                "password": data.password,
                "partner_id": partner_id,
                "groups_id": [(6, 0, [portal_group_id])],
            }]
        )

        # 6️⃣ Authenticate newly created user
        user_rpc = OdooRPC(
            db="TESTING_SCANNING_SHIPMENT",
            user=data.email,
            pwd=data.password,
            url="http://localhost:8069"
        )

        # 7️⃣ Create JWT
        token = create_access_token({
            "uid": user_rpc.uid,
            "login": data.email,
            "name": data.name,
        })

        return {
            "success": True,
            "access_token": token,
            "user": {
                "uid": user_rpc.uid,
                "name": data.name,
                "login": data.email,
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print("SIGNUP ERROR ====>", e)
        raise HTTPException(status_code=500, detail=str(e))

def admin_only(request: Request):
    user = request.state.user
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")


@app.get("/admin/users")
def get_users(request: Request):
    admin_only(request)

    admin_rpc = OdooRPC(
        db="TESTING_SCANNING_SHIPMENT",
        user=ODOO_ADMIN_USER,
        pwd=ODOO_ADMIN_PASS,
        url="http://localhost:8069"
    )

    users = admin_rpc.call(
        "res.users",
        "search_read",
        args=[[]],
        kwargs={"fields": ["id", "name", "login", "active"]}
    )

    return users

class DeleteUserModel(BaseModel):
    user_id: int
    login: str
    password: str

@app.post("/admin/delete-user")
def delete_user(data: DeleteUserModel, request: Request):
    admin_only(request)

    # 1️⃣ Verify user's password
    try:
        OdooRPC(
            db="TESTING_SCANNING_SHIPMENT",
            user=data.login,
            pwd=data.password,
            url="http://localhost:8069"
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Password verification failed")

    # 2️⃣ Delete user using admin
    admin_rpc = OdooRPC(
        db="TESTING_SCANNING_SHIPMENT",
        user=ODOO_ADMIN_USER,
        pwd=ODOO_ADMIN_PASS,
        url="http://localhost:8069"
    )

    admin_rpc.call(
        "res.users",
        "unlink",
        args=[[data.user_id]]
    )

    return {"success": True}

