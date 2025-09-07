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
torch>=1.9.0
torchvision>=0.10.0
numpy>=1.21.0
matplotlib>=3.4.0
seaborn>=0.11.0
plotly>=5.0.0
streamlit>=1.0.0
opencv-python>=4.5.0
Pillow>=8.3.0
pandas>=1.3.0
```


## Usage

### Basic Setup

```python
from nn_visualiser import Visualiser
import torch

# Load your model
model = torch.load('path/to/your/model.pth')
model.eval()

# Create visualizer
viz = Visualiser(model)

# Visualize with input data
input_tensor = torch.randn(1, 3, 224, 224)  # Example input
viz.visualize(input_tensor)
```


### Setting Model Path



**Load and pass model**

```python
MODEL_PATH = "your_model.pt"
model = torch.load(MODEL_PATH, map_location="cpu",weights_only=False)
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

