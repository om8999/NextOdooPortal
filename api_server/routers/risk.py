from fastapi import APIRouter, Query
from ml.predict import predict_late_risk

router = APIRouter(prefix="/risk", tags=["Risk"])

@router.get("/invoice")
def invoice_risk(
    amount_total: float = Query(..., gt=0),
    expected_days: int = Query(..., gt=0)
):
    risk = predict_late_risk(amount_total, expected_days)

    if risk > 0.7:
        level = "HIGH"
    elif risk > 0.4:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "late_payment_risk": round(risk, 3),
        "risk_level": level
    }
