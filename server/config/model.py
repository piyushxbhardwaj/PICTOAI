import os
import torch
import requests
from dotenv import load_dotenv

# Load env variables
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
CLIPDROP_API = os.getenv("CLIPDROP_API")

# Global pipeline cache
_pipelines = {}
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[INFO] PyTorch using device: {device.upper()}")

def get_huggingface_model_id(model_type):
    if model_type == 'Fast':
        return "runwayml/stable-diffusion-v1-5"
    elif model_type == 'HD':
        return "stabilityai/stable-diffusion-xl-base-1.0"
    elif model_type == 'Creative':
        return "Lykon/DreamShaper"
    return "runwayml/stable-diffusion-v1-5"

def load_local_pipeline(model_type):
    """
    Lazy load local Stable Diffusion model pipelines using diffusers.
    """
    global _pipelines
    if model_type in _pipelines:
        return _pipelines[model_type]
    
    model_id = get_huggingface_model_id(model_type)
    print(f"[INFO] Loading local Stable Diffusion pipeline for {model_type} ({model_id})...")
    
    try:
        from diffusers import StableDiffusionPipeline, DiffusionPipeline
        
        # Load SDXL or SD 1.5/DreamShaper
        if model_type == 'HD':
            # SDXL uses DiffusionPipeline
            pipe = DiffusionPipeline.from_pretrained(
                model_id, 
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                use_auth_token=HF_TOKEN if HF_TOKEN else True
            )
        else:
            pipe = StableDiffusionPipeline.from_pretrained(
                model_id, 
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                use_auth_token=HF_TOKEN if HF_TOKEN else True
            )
            
        pipe = pipe.to(device)
        
        # CPU Memory Optimizations
        if device == "cpu":
            pipe.enable_attention_slicing()
            
        # Warmup inference to cache compilation steps
        print(f"[INFO] Warming up {model_type} model singleton...")
        if model_type == 'HD':
            pipe(prompt="warmup", num_inference_steps=1, width=256, height=256)
        else:
            pipe(prompt="warmup", num_inference_steps=1, width=256, height=256)
            
        _pipelines[model_type] = pipe
        print(f"[SUCCESS] Loaded and warmed up local {model_type} successfully!")
        return pipe
    except Exception as e:
        print(f"[WARNING] Failed to load local pipeline for {model_type}: {e}")
        return None

def generate_via_hf_api(prompt, model_type, timeout=30):
    """
    Call Hugging Face Inference API as a fast, keyless/keyed GPU fallback.
    """
    if not HF_TOKEN:
        print("[WARNING] HF_TOKEN is missing. Skipping Hugging Face Inference API call.")
        return None
        
    model_id = get_huggingface_model_id(model_type)
    api_url = f"https://api-inference.huggingface.co/models/{model_id}"
    
    headers = {}
    if HF_TOKEN:
        headers["Authorization"] = f"Bearer {HF_TOKEN}"
        
    print(f"[INFO] Routing to Hugging Face Inference API: {api_url}...")
    try:
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": prompt},
            timeout=timeout
        )
        if response.status_code == 200:
            return response.content
        else:
            print(
                f"[WARNING] Hugging Face API returned status {response.status_code} "
                f"with content-type {response.headers.get('content-type')}: {response.text[:500]}"
            )
            return None
    except Exception as e:
        print(f"[WARNING] Hugging Face API request failed: {type(e).__name__}: {e}")
        return None

def generate_via_clipdrop_api(prompt, timeout=60):
    """
    Call Clipdrop text-to-image as the backup provider when Hugging Face is unavailable.
    """
    if not CLIPDROP_API:
        print("[WARNING] CLIPDROP_API is missing. Skipping Clipdrop fallback.")
        return None

    api_url = "https://clipdrop-api.co/text-to-image/v1"
    headers = {"x-api-key": CLIPDROP_API}

    print("[INFO] Routing to Clipdrop text-to-image API...")
    try:
        response = requests.post(
            api_url,
            headers=headers,
            files={"prompt": (None, prompt)},
            timeout=timeout,
        )

        if response.status_code == 200 and response.headers.get("content-type", "").startswith("image/"):
            return response.content

        error_preview = response.text[:500] if response.headers.get("content-type", "").startswith("application/json") else "<non-json response>"
        print(
            f"[WARNING] Clipdrop API returned status {response.status_code} "
            f"with content-type {response.headers.get('content-type')}: {error_preview}"
        )
        return None
    except Exception as e:
        print(f"[WARNING] Clipdrop API request failed: {type(e).__name__}: {e}")
        return None
