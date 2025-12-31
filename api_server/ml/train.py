import xgboost as xgb
import pandas as pd
import numpy as np
from pathlib import Path

DATA_PATH = Path("ml/data/invoice_payment_behavior.csv")
MODEL_PATH = Path("ml/models/invoice_delay.json")

df = pd.read_csv(DATA_PATH)

# 🔥 Important fix: log-scale amount
df['log_amount'] = np.log1p(df['amount_total'])

X = df[['log_amount', 'expected_days']]
y = df['is_late']

model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    eval_metric="logloss"
)

model.fit(X, y)

# ✅ FEATURE IMPORTANCE (this removes red underline)
importance = model.feature_importances_
features = X.columns

print("\n📊 Feature importance:")
print(pd.Series(importance, index=features))

MODEL_PATH.parent.mkdir(exist_ok=True)
model.save_model(MODEL_PATH)

print("✅ Model trained and saved:", MODEL_PATH)
