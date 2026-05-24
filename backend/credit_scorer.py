import pickle
from pathlib import Path

import numpy as np
import pandas as pd
import xgboost as xgb

DATA_PATH = Path(__file__).parents[1] / 'data' / 'data.csv'
MODEL_PATH = Path(__file__).parents[1] / 'data' / 'model.pkl'
FEATURES = [
    'edad',
    'ingresos',
    'gastos_fijos',
    'gastos_variables',
    'creditos_activos',
]


def generate_synthetic_data() -> pd.DataFrame:
    rng = np.random.default_rng(42)
    n = 500

    edad = rng.integers(18, 66, n)
    ingresos = (rng.integers(800000, 12000001, n) // 50000) * 50000
    gastos_fijos = (ingresos * rng.uniform(0.20, 0.60, n)).astype(int)
    gastos_variables = (ingresos * rng.uniform(0.10, 0.30, n)).astype(int)
    creditos_activos = rng.integers(0, 7, n)

    ahorro_neto = ingresos - gastos_fijos - gastos_variables
    tasa_ahorro = ahorro_neto / ingresos
    base = ((tasa_ahorro > 0.15) & (creditos_activos < 3)).astype(int)
    noise_mask = rng.uniform(0, 1, n) < 0.15
    tomara_credito = np.where(noise_mask, 1 - base, base)

    df = pd.DataFrame({
        'edad': edad,
        'ingresos': ingresos,
        'gastos_fijos': gastos_fijos,
        'gastos_variables': gastos_variables,
        'creditos_activos': creditos_activos,
        'tomara_credito': tomara_credito,
    })
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    return df


def train_model():
    if not DATA_PATH.exists():
        generate_synthetic_data()

    df = pd.read_csv(DATA_PATH)
    X = df[FEATURES]
    y = df['tomara_credito']

    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        eval_metric='logloss',
        random_state=42,
    )
    model.fit(X, y)

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)

    return model


def load_or_train_model():
    if MODEL_PATH.exists():
        with open(MODEL_PATH, 'rb') as f:
            return pickle.load(f)
    return train_model()


def predict_credit_probability(profile: dict) -> dict:
    model = load_or_train_model()

    row = {
        'edad': int(profile.get('age') or 18),
        'ingresos': int(profile.get('income') or 0),
        'gastos_fijos': int(profile.get('fixedExpenses') or 0),
        'gastos_variables': int(profile.get('variableExpenses') or 0),
        'creditos_activos': int(profile.get('credits') or 0),
    }

    df = pd.DataFrame([row], columns=FEATURES)
    proba = model.predict_proba(df)[0]
    prob_1 = float(proba[1])

    importances = dict(zip(FEATURES, model.feature_importances_.tolist()))

    return {
        'probability': round(prob_1 * 100, 1),
        'feature_importances': importances,
        'will_take_credit': prob_1 >= 0.5,
    }
