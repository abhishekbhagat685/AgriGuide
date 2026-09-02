from fastapi import FastAPI, UploadFile, File
from PIL import Image
import tensorflow as tf
import numpy as np
import os

app = FastAPI()

# Load trained model
model = tf.keras.models.load_model("model.h5")

# Automatically read class names from dataset folder
class_names = sorted(
    [
        folder
        for folder in os.listdir("dataset")
        if os.path.isdir(os.path.join("dataset", folder))
    ]
)

print("Loaded Classes:")
print(class_names)

# Disease -> recommendation mapping
recommendations = {
    "Pepper__bell___Bacterial_spot": "Apply copper-based bactericides. Avoid overhead irrigation and remove infected leaves promptly.",
    "Pepper__bell___healthy": "No disease detected. Maintain regular watering and monitor for pests.",
    "Potato___Early_blight": "Use fungicides containing chlorothalonil or mancozeb. Rotate crops and remove infected foliage.",
    "Potato___Late_blight": "Apply fungicides like metalaxyl or mancozeb immediately. Destroy infected plants to prevent spread.",
    "Potato___healthy": "No disease detected. Continue regular care and monitoring.",
    "Tomato_Bacterial_spot": "Use copper-based sprays. Avoid working with wet plants and practice crop rotation.",
    "Tomato_Early_blight": "Apply fungicide (chlorothalonil/mancozeb). Remove lower infected leaves and mulch soil.",
    "Tomato_Late_blight": "Apply fungicide immediately (metalaxyl-based). Remove and destroy infected plants.",
    "Tomato_Leaf_Mold": "Improve air circulation, reduce humidity, and apply fungicide if severe.",
    "Tomato_Septoria_leaf_spot": "Remove infected leaves, apply fungicide (copper or chlorothalonil), avoid overhead watering.",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Use miticides or insecticidal soap. Increase humidity to discourage mites.",
    "Tomato__Target_Spot": "Apply fungicide (azoxystrobin or chlorothalonil). Remove infected debris.",
    "Tomato__Tomato_YellowLeaf__Curl_Virus": "No direct cure. Control whiteflies (vector) using insecticides or sticky traps. Remove infected plants.",
    "Tomato__Tomato_mosaic_virus": "No cure available. Remove and destroy infected plants. Disinfect tools between uses.",
    "Tomato_healthy": "No disease detected. Maintain regular watering and monitor for pests."
}


@app.get("/")
def home():
    return {
        "message": "Plant Disease Detection API Running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        image = Image.open(file.file).convert("RGB")

        # Resize image
        image = image.resize((224, 224))

        # Convert to numpy array
        image = np.array(image).astype("float32")

        # Normalize
        image = image / 255.0

        # Add batch dimension
        image = np.expand_dims(image, axis=0)

        # Predict
        prediction = model.predict(image, verbose=0)

        # Get prediction
        index = int(np.argmax(prediction[0]))
        confidence = float(np.max(prediction[0])) * 100
        disease = class_names[index]

        return {
            "success": True,
            "disease": disease,
            "confidence": round(confidence, 2),
            "recommendation": recommendations.get(disease, "No recommendation available.")
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }