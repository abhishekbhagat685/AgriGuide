import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
df = pd.read_csv("dataset/yield_df.csv")

# Select required columns
df = df[
    [
        "Item",
        "average_rain_fall_mm_per_year",
        "pesticides_tonnes",
        "avg_temp",
        "hg/ha_yield",
    ]
]

# One Hot Encoding
df = pd.get_dummies(df, columns=["Item"])

X = df.drop("hg/ha_yield", axis=1)
y = df["hg/ha_yield"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestRegressor()

model.fit(X_train, y_train)

joblib.dump(model, "yield_model.pkl")
joblib.dump(X.columns.tolist(), "columns.pkl")

print("Model Trained Successfully")