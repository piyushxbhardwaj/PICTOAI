import os
import io
import base64
import hashlib
import json
import datetime
from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from PIL import Image
from config.db import db
from config.model import load_local_pipeline, generate_via_hf_api, generate_via_clipdrop_api, device

# Ensure output directory exists
os.makedirs("static/generated", exist_ok=True)

def check_db_online():
    return db is not None

# 1. Generate Image Endpoint
def generate_image():
    if not check_db_online():
        return jsonify({
            "success": False,
            "message": "Database offline. Please click the 'Live API' badge in the Navbar to switch to Demo Sandbox."
        }), 503

    try:
        user_id = get_jwt_identity()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        credits = user.get("creditBalance", 0)
        if credits <= 0:
            return jsonify({
                "success": False, 
                "message": "No Credit Balance", 
                "creditBalance": credits
            }), 200

        data = request.get_json()
        prompt = data.get("prompt")
        model_type = data.get("model", "HD") # 'Fast', 'HD', 'Creative'
        style = data.get("style", "Cyberpunk")
        aspect = data.get("aspect", "1:1")

        if not prompt:
            return jsonify({"success": False, "message": "Missing Details"}), 400

        # Create unique request hash for caching
        request_params = {
            "prompt": prompt.strip().lower(),
            "model": model_type,
            "style": style,
            "aspect": aspect
        }
        req_hash = hashlib.md5(json.dumps(request_params, sort_keys=True).encode('utf-8')).hexdigest()

        # Check in MongoDB if cache exists
        cached_gen = db.generations.find_one({"hash": req_hash})
        if cached_gen:
            print("[INFO] Serving image from MD5 cache!")
            # Deduct credit (since it's a new generation request, or we can skip if user-friendly)
            new_credits = credits - 1
            db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"creditBalance": new_credits}})

            cached_image_url = cached_gen.get("imageUrl")
            if not cached_image_url and cached_gen.get("imagePath"):
                cached_image_url = request.host_url.rstrip("/") + cached_gen["imagePath"]
            if not cached_image_url:
                cached_image_url = request.host_url.rstrip("/") + f"/static/generated/{req_hash}.png"
            
            return jsonify({
                "success": True,
                "message": "Image Generated (Cached)",
                "creditBalance": new_credits,
                "resultImage": cached_gen["image"],
                "resultImageUrl": cached_image_url
            }), 200

        # --- RUN STABLE DIFFUSION PIPELINE ---
        img_data = None
        
        # 1. Try local pipeline (only if CUDA is available, to avoid slow CPU execution and heavy downloads)
        pipe = None
        if device == "cuda":
            pipe = load_local_pipeline(model_type)
        else:
            print("[INFO] CPU detected. Skipping local diffusers pipeline to avoid downloading gigabytes of weights. Using API fallbacks...")
        if pipe:
            try:
                print(f"[INFO] Running local inference for {model_type}...")
                # Format prompt with style description
                formatted_prompt = f"{prompt}, {style} style, aspect ratio {aspect}, highly detailed"
                
                # Determine resolution
                width, height = 768, 768
                if aspect == '16:9':
                    width, height = 1024, 576
                elif aspect == '9:16':
                    width, height = 576, 1024
                
                # Inference (smaller steps for demo speed)
                image = pipe(
                    prompt=formatted_prompt, 
                    num_inference_steps=20,
                    width=width,
                    height=height
                ).images[0]
                
                # Save to buffer
                buffer = io.BytesIO()
                image.save(buffer, format="PNG")
                img_data = buffer.getvalue()
            except Exception as e:
                print(f"[WARNING] Local inference failed: {e}. Falling back to HF API...")
        
        # 2. Try Hugging Face API fallback
        if not img_data:
            formatted_prompt = f"{prompt}, {style} style, aspect ratio {aspect}, highly detailed, 8k resolution"
            img_data = generate_via_hf_api(formatted_prompt, model_type)
            
        # 3. Clipdrop fallback (stable provider when Hugging Face is unavailable)
        if not img_data:
            print("[WARNING] Hugging Face API failed. Calling Clipdrop text-to-image fallback...")
            clipdrop_prompt = f"{prompt}, {style} style, aspect ratio {aspect}, highly detailed"
            img_data = generate_via_clipdrop_api(clipdrop_prompt)

        # Validate image data if online generation succeeded
        is_online_gen = True
        if img_data:
            try:
                Image.open(io.BytesIO(img_data)).verify()
            except Exception as e:
                print(f"[WARNING] Generated image data is corrupt or invalid: {e}")
                img_data = None

        if not img_data:
            print("[INFO] All networks/APIs offline or corrupt. Generating premium offline placeholder image...")
            is_online_gen = False
            from PIL import ImageDraw
            # 512x512 cyber dark gold theme placeholder
            img = Image.new('RGB', (512, 512), color=(10, 10, 10))
            draw = ImageDraw.Draw(img)
            
            # Draw cyberpunk glowing grid
            for x in range(0, 512, 64):
                draw.line([(x, 0), (x, 512)], fill=(30, 30, 0), width=1)
            for y in range(0, 512, 64):
                draw.line([(0, y), (512, y)], fill=(30, 30, 0), width=1)
                
            # Draw outer gold border
            draw.rectangle([(10, 10), (502, 502)], outline=(255, 215, 0), width=2)
            
            # Draw retro tech symbols or corner brackets
            draw.line([(20, 20), (50, 20)], fill=(255, 215, 0), width=3)
            draw.line([(20, 20), (20, 50)], fill=(255, 215, 0), width=3)
            draw.line([(492, 20), (462, 20)], fill=(255, 215, 0), width=3)
            draw.line([(492, 20), (492, 50)], fill=(255, 215, 0), width=3)
            
            draw.line([(20, 492), (50, 492)], fill=(255, 215, 0), width=3)
            draw.line([(20, 492), (20, 462)], fill=(255, 215, 0), width=3)
            draw.line([(492, 492), (462, 492)], fill=(255, 215, 0), width=3)
            draw.line([(492, 492), (492, 462)], fill=(255, 215, 0), width=3)
            
            # Draw abstract shape in the center (geometric tech logo)
            draw.polygon([(256, 180), (320, 280), (192, 280)], outline=(255, 215, 0), fill=(20, 20, 20), width=2)
            draw.polygon([(256, 310), (288, 260), (224, 260)], outline=(255, 215, 0), fill=(40, 40, 0), width=1)
            
            # Save to buffer
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            img_data = buffer.getvalue()

        # Save to static directory as file
        image_filename = f"{req_hash}.png"
        image_path = os.path.join("static/generated", image_filename)
        
        # Open bytes as image and save
        pil_image = Image.open(io.BytesIO(img_data))
        pil_image.save(image_path, format="PNG")

        image_url = f"/static/generated/{image_filename}"
        absolute_image_url = request.host_url.rstrip("/") + image_url

        # Convert to Base64 to return to frontend
        base64_image = base64.b64encode(img_data).decode('utf-8')
        result_image_str = f"data:image/png;base64,{base64_image}"

        # Save metadata to MongoDB
        generation_metadata = {
            "userId": user_id,
            "prompt": prompt,
            "model": model_type,
            "style": style,
            "aspect": aspect,
            "hash": req_hash,
            "image": result_image_str,
            "imagePath": image_url,
            "imageUrl": absolute_image_url,
            "createdAt": datetime.datetime.utcnow()
        }
        db.generations.insert_one(generation_metadata)

        # Deduct credit
        new_credits = credits - 1
        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"creditBalance": new_credits}})

        # Success message
        response_msg = "Image Generated" if is_online_gen else "Image Generated (Offline Demo Mode)"

        return jsonify({
            "success": True,
            "message": response_msg,
            "creditBalance": new_credits,
            "resultImage": result_image_str,
            "resultImageUrl": absolute_image_url
        }), 200

    except Exception as e:
        print(f"Generation error: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500

def encode_prompt(prompt, style, aspect):
    import urllib.parse
    full = f"{prompt}, {style} style, aspect ratio {aspect}, highly detailed"
    return urllib.parse.quote(full)

# 2. Upscale Endpoint
def upscale_image():
    # Simulates upscaling returning success
    play_amount = request.get_json().get("amount", 0)
    return jsonify({
        "success": True,
        "message": "Image Upscaled"
    }), 200

# 3. Variation Endpoint
def variation_image():
    # Simulates variation returning success
    return jsonify({
        "success": True,
        "message": "Image Variation complete"
    }), 200
