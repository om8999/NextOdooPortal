# ml/predict.py
import xgboost as xgb
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "models" / "invoice_delay.json"

model = None

def load_model():
    global model
    if model is None:
        model = xgb.XGBClassifier()
        model.load_model(str(MODEL_PATH))
    return model

def predict_late_risk(amount_total: float, expected_days: int) -> float:
    mdl = load_model()
    X = np.array([[np.log1p(amount_total), expected_days]])
    prob = mdl.predict_proba(X)[0][1]
    return float(prob)
