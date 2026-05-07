from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

#conexion a mongo usa el nombre del servicio de docker compose
client = MongoClient("mongodb://mongodb:27017/")
db = client["superheroesDB"]
heroes_collection = db["heroes"]

#carpeta para guardar imagenes
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

#modificar heros
@app.route("/heroes/<name>", methods=["PUT"])
def update_hero(name):
    data = request.json
    result = heroes_collection.update_one(
        {"superheroName": name},
        {"$set": data}
    )
    if result.modified_count > 0:
        return jsonify({"message": "Heroe actualizado"}), 200
    else:
        return jsonify({"message": "Heroe no encontrado"}), 404
    
 #eliminar heroe
@app.route("/heroes/<name>", methods=["DELETE"])
def delete_hero(name):
    result = heroes_collection.delete_one({"superheroName": name})
    if result.delete_count > 0:
        return jsonify({"message": "Heroe eliminado"}), 200
    else:
        return jsonify({"message": "Heroe no encontrado"}), 404   
    
 #subir imagen
@app.route("/heroes/<name>", methods=["POST"])
def upload_hero(name):
    if "file" not in request.files:
        return jsonify({"error": "No se envio el archivo"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacio"}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    file_url = f"http://localhost:5000/uploads/{filename}"

    #actualizamos heroe en mongo
    heroes_collection.update_one(
        {"superheroName": name},
        {"$push": {"images": file_url}}
    )
    return jsonify({"message": "Imagen subida", "url": file_url}), 201

@app.route("/uploads/<filename>")
def serve_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

#obtener todos los heros
@app.route("/heroes", methods=["GET"])
def get_heroes():
    heroes = list(heroes_collection.find({}, {"_id": 0}))
    return jsonify(heroes)

#agregamos heroe
@app.route("/heroes", methods=["POST"])
def add_hero():
    data = request.json
    heroes_collection.insert_one(data)
    return jsonify({"message": "Heroe agregado"}), 201

#obtener detalle por nombre
@app.route("/heroes/<name>", methods=["GET"])
def get_hero(name):
    hero = heroes_collection.find_one({"superheroName": name}, {"_id": 0})
    if hero:
        return jsonify(hero)
    else:
        return jsonify({"error": "Heroe no encontrado"}), 404
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

