from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Load the trained model
model = load_model("model.h5")

# Class index -> class name mapping
class_names = {
    0: "Pepper__bell___Bacterial_spot",
    1: "Pepper__bell___healthy",
    2: "Potato___Early_blight",
    3: "Potato___Late_blight",
    4: "Potato___healthy",
    5: "Tomato_Bacterial_spot",
    6: "Tomato_Early_blight",
    7: "Tomato_Late_blight",
    8: "Tomato_Leaf_Mold",
    9: "Tomato_Septoria_leaf_spot",
    10: "Tomato_Spider_mites_Two_spotted_spider_mite",
    11: "Tomato__Target_Spot",
    12: "Tomato__Tomato_YellowLeaf__Curl_Virus",
    13: "Tomato__Tomato_mosaic_virus",
    14: "Tomato_healthy"
}


def predict_disease(img_path):

    # Check whether image exists
    if not os.path.exists(img_path):
        raise FileNotFoundError("Image file not found")

    # Load image
    img = image.load_img(
        img_path,
        target_size=(224, 224)
    )

    # Convert image to array
    img_array = image.img_to_array(img)

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    # Normalize pixel values
    img_array = img_array / 255.0

    # Prediction
    prediction = model.predict(img_array, verbose=0)

    # Get predicted class
    predicted_index = int(
        np.argmax(prediction, axis=1)[0]
    )

    # Get confidence
    confidence = float(
        np.max(prediction)
    )

    # Get disease name
    disease = class_names[predicted_index]

    return {
        "disease": disease,
        "confidence": round(confidence * 100, 2)
    }