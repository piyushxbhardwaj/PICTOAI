from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.image_controller import generate_image, upscale_image, variation_image

image_bp = Blueprint("image", __name__)

# Image operations (JWT protected)
image_bp.route("/generate-image", methods=["POST"])(jwt_required()(generate_image))
image_bp.route("/upscale", methods=["POST"])(jwt_required()(upscale_image))
image_bp.route("/variation", methods=["POST"])(jwt_required()(variation_image))
