# routers/kpi.py
from fastapi import APIRouter, Request, HTTPException
from odoo_rpc import OdooRPC
from dotenv import load_dotenv

import os
load_dotenv() 

router = APIRouter(prefix="/kpi", tags=["KPI"])

ODOO_ADMIN_USER = os.getenv("ODOO_ADMIN_USER")
ODOO_ADMIN_PASS = os.getenv("ODOO_ADMIN_PASS")
ODOO_DB = "odudhane"
ODOO_URL = "https://desktop10.office.protempo.nl"
print("---------->>>>>>>>>>>>>>>>>>IN KPI.py<<<<<<<<<<<<<<<<<<<<<")

@router.get("/avg-reconcile-time")
def avg_reconcile_time(request: Request):
    user = request.state.user  # comes from your auth_middleware
    print("======USER IN KPI======>",user)
    print("DB:", ODOO_DB)
    print("USER:", ODOO_ADMIN_USER)
    print("PASS:", bool(ODOO_ADMIN_PASS))
    print("URL:", ODOO_URL)
    try:
        rpc = OdooRPC(
            db=ODOO_DB,
            user=ODOO_ADMIN_USER,
            pwd=ODOO_ADMIN_PASS,
            url=ODOO_URL,
        )
        print("RPC>>>>><<<<<<<<<<<<<<<<>>>>",rpc)
        avg_days = rpc.call(
            "account.kpi",
            "avg_reconcile_time",
            []
        )
        print("avg_days======>",avg_days)

        return {
            "average_days": avg_days
        }

    except Exception as e:
        import traceback
        print("🔥 KPI ERROR 🔥")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
