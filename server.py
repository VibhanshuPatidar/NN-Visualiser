from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn

MODEL_PATH = "model_3_11.pt"
MAX_LEN = 55

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load PyTorch model
model = torch.load(MODEL_PATH, map_location="cpu",weights_only=False)
model.eval()

def encode_input(s):
    vec = [ord(c) for c in s[:MAX_LEN]]
    if len(vec) < MAX_LEN:
        vec += [0] * (MAX_LEN - len(vec))
    return torch.tensor(vec, dtype=torch.float32).unsqueeze(0)

def forward_trace(model, x):
    activations = []
    vec = x
    for layer in model.modules():
        if isinstance(layer, nn.Sequential) or layer is model:
            continue
        vec = layer(vec)
        if isinstance(vec, torch.Tensor):
            activations.append({
                "type": layer.__class__.__name__,
                "activations": vec.detach().cpu().flatten().tolist()
            })
    return activations

@app.get("/get_activations")
def get_activations(input: str = Query(..., max_length=MAX_LEN)):
    x = encode_input(input)
    with torch.no_grad():
        trace = forward_trace(model, x)
    return {"input": input, "layers": trace}
