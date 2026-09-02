from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import uvicorn

app = FastAPI()

# Allow requests from your Node.js backend / frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("yield_model.pkl")
columns = joblib.load("columns.pkl")


class YieldInput(BaseModel):
    item: str
    rainfall: float
    pesticides: float
    temperature: float


@app.get("/")
def home():
    return {"message": "Yield Prediction API Running"}


@app.post("/predict")
def predict(data: YieldInput):
    try:
        # Create input dataframe
        input_data = pd.DataFrame([{
            "average_rain_fall_mm_per_year": data.rainfall,
            "pesticides_tonnes": data.pesticides,
            "avg_temp": data.temperature
        }])

        # Add crop columns
        for col in columns:
            if col.startswith("Item_"):
                input_data[col] = 0

        crop_col = f"Item_{data.item}"

        if crop_col not in input_data.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown crop '{data.item}'. Not present in training data."
            )

        input_data[crop_col] = 1

        # Arrange columns
        input_data = input_data.reindex(columns=columns, fill_value=0)

        prediction = model.predict(input_data)[0]

        return {
            "success": True,
            "predicted_yield": round(float(prediction), 2),
            "unit": "hg/ha"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)