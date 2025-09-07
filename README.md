# NN-Visualiser

Visualize PyTorch neural networks with interactive heatmaps, input contribution highlights, and smooth layer navigation—understand your model from input to output.

## About

NN-Visualiser is a Python tool that provides interactive visualization capabilities for PyTorch neural networks. It offers:

- **Interactive heatmaps** for layer activations and gradients
- **Input contribution analysis** to highlight important features
- **Smooth layer navigation** to step through network layers
- **Real-time visualization** of forward and backward passes


## Installation

1. Clone the repository:
```bash
git clone https://github.com/VibhanshuPatidar/NN-Visualiser.git
cd NN-Visualiser
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```


## Requirements

Create a `requirements.txt` file with the following dependencies:

```txt
fastapi>=0.110
uvicorn[standard]>=0.22
torch>=2.1
typing-extensions>=4.8
pydantic>=2.6
numpy>=1.23
```


### Setting Model Path


**Load and pass model in server.py file**

```python
MODEL_PATH = "your_model.pt"
model = torch.load(MODEL_PATH, map_location="cpu",weights_only=False)
```



## Usage

### Basic Setup for frontend

```txt
cd nn-visualizer
npm install 
npm run dev
```
#### In another terminal start the backend service

```txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```



## Features

- Layer-by-layer activation visualization
- Gradient flow analysis
- Feature importance mapping
- Interactive web interface
- Export visualization results
- Support for various PyTorch model architectures


## License

MIT License

