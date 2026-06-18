from flask import Blueprint, jsonify
from config.db import db

health_bp = Blueprint("health", __name__)

@health_bp.route("/api/health", methods=["GET"])
def health_check():
    db_status = "online" if db is not None else "offline"
    return jsonify({
        "status": "healthy",
        "database": db_status
    }), 200
