from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.auth_controller import (
    register_user, 
    login_user, 
    get_user_credits, 
    handle_payment_success
)

auth_bp = Blueprint("auth", __name__)

# Registration & Login
auth_bp.route("/register", methods=["POST"])(register_user)
auth_bp.route("/login", methods=["POST"])(login_user)

# Credit and payments
auth_bp.route("/credits", methods=["GET"])(jwt_required()(get_user_credits))
auth_bp.route("/payment-success", methods=["POST"], endpoint="payment_success")(jwt_required()(handle_payment_success))
auth_bp.route("/update-credits", methods=["POST"], endpoint="update_credits")(jwt_required()(handle_payment_success)) # Backwards compatibility alias
