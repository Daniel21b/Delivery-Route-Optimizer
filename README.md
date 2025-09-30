#  Delivery Route Optimizer

A powerful web application that optimizes delivery routes and visualizes pathfinding algorithms. Built with Python Flask backend and vanilla JavaScript frontend.

## Features

### Map Optimizer
- **Geocoding**: Convert real-world street addresses to geographic coordinates
- **Road-Based Routing**: Routes follow actual roads using OSRM (Open Source Routing Machine)
- **Multiple Algorithms**: Choose from 4 optimization algorithms:
  - Nearest Neighbor (Greedy)
  - 2-Opt Optimization
  - Greedy Insertion
  - Simulated Annealing
- **Interactive Map**: Pan, zoom, and visualize optimized routes with animated markers
- **Real Driving Distance**: Calculate actual driving distances, not straight-line distances

###  Grid Visualizer
- **A* Pathfinding**: Visualize the A* algorithm finding the shortest path
- **Wall Avoidance**: Walls are treated as impassable obstacles
- **Interactive Grid**: Draw walls, set start/end points with mouse
- **Smart Validation**: Prevents placing start/end on walls
- **Animation**: Watch the algorithm explore cells and highlight the final path
- **Statistics**: View path length and cells explored
- **No Path Detection**: Correctly identifies when destination is completely blocked

## Technology Stack

**Backend:**
- Python 3.x
- Flask (Web framework)
- Flask-CORS (Cross-origin resource sharing)
- geopy (Geocoding service)
- OSRM API (Road-based routing)
- requests (HTTP client)

**Frontend:**
- HTML5 / CSS3
- Vanilla JavaScript
- Leaflet.js (Interactive maps)
- OpenStreetMap (Map tiles)

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Quick Start (Recommended)

**Unix/Mac:**
```bash
./run.sh
```

**Windows:**
```bash
python -m backend.app
```

Then open http://localhost:3000 in your browser.

### Local Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Delivery-Route-Optimizer
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the application:**
```bash
python -m backend.app
```

4. **Open in browser:**
```
http://localhost:3000
```

### Docker Setup

1. **Build the Docker image:**
```bash
docker build -t delivery-route-optimizer .
```

2. **Run the container:**
```bash
docker run -p 3000:3000 delivery-route-optimizer
```

3. **Open in browser:**
```
http://localhost:3000
```

## Usage Guide

### Map Optimizer

1. Navigate to the **Map Optimizer** tab
2. Enter addresses in the text area (one per line)
   ```
   Times Square, New York, NY
   Central Park, New York, NY
   Brooklyn Bridge, New York, NY
   ```
3. Select optimization algorithm:
   - **Nearest Neighbor**: Fast greedy algorithm, good for quick results
   - **2-Opt**: Iterative improvement, better quality routes
   - **Greedy Insertion**: Builds route by inserting locations optimally
   - **Simulated Annealing**: Probabilistic approach, explores more solutions
4. Click **Find Optimal Route**
5. View the animated route on the map with real road paths and total driving distance

**Note:** 
- Geocoding uses Nominatim (OpenStreetMap) with a 1-second delay between requests to respect rate limits
- Routing uses OSRM API to calculate actual road-based routes (0.5s delay between requests)
- Routes follow real streets and highways, not straight lines
- Distances shown reflect actual driving distances

### Grid Visualizer

1. Navigate to the **Grid Visualizer** tab
2. Select drawing mode:
   - **Set Start**: Click to place the start point (green)
   - **Set End**: Click to place the end point (red)
   - **Draw Wall**: Click and drag to draw obstacles (black)
3. Click **Run A* Algorithm** to find the shortest path
4. Watch the animation:
   - Blue cells = explored by algorithm
   - Yellow cells = final shortest path
5. View statistics (path length, cells explored)
6. Click **Clear Grid** to remove walls and reset

## API Endpoints

### POST /api/optimize-route

Optimize a delivery route from multiple addresses.

**Request:**
```json
{
  "addresses": ["address1", "address2", "address3"],
  "algorithm": "nearest_neighbor"
}
```

**Response:**
```json
{
  "route": [
    {
      "address": "address1",
      "lat": 40.7128,
      "lng": -74.0060,
      "order": 1
    }
  ],
  "total_distance": 12.34
}
```

### POST /api/find-path

Find shortest path on a grid using A* algorithm.

**Request:**
```json
{
  "grid": [[0, 0, 1], [0, 1, 0], [0, 0, 0]],
  "start": {"x": 0, "y": 0},
  "end": {"x": 2, "y": 2}
}
```

**Response:**
```json
{
  "found": true,
  "path": [{"x": 0, "y": 0}, {"x": 1, "y": 0}],
  "explored": [{"x": 0, "y": 0}, {"x": 1, "y": 0}]
}
```

## Project Structure

```
Delivery-Route-Optimizer/
├── backend/
│   ├── __init__.py
│   ├── app.py                    # Flask server
│   ├── algorithms/
│   │   ├── __init__.py
│   │   ├── route_optimizer.py   # Route optimization logic
│   │   └── pathfinding.py       # A* pathfinding algorithm
│   └── utils/
│       ├── __init__.py
│       └── geocoding.py          # Address geocoding service
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css       # Application styles
│   │   └── js/
│   │       ├── map-optimizer.js # Map functionality
│   │       └── grid-visualizer.js # Grid functionality
│   └── templates/
│       └── index.html            # Main application page
├── Dockerfile                    # Docker configuration
├── requirements.txt              # Python dependencies
├── .dockerignore
├── .gitignore
└── README.md
```

## Algorithm Details

### Nearest Neighbor (Route Optimization)
- **Complexity**: O(n²) where n = number of locations
- **Strategy**: Greedy algorithm that always visits the nearest unvisited location
- **Distance Calculation**: Haversine formula for great-circle distance

### A* Pathfinding (Grid Navigation)
- **Complexity**: O(b^d) where b = branching factor, d = depth
- **Heuristic**: Manhattan distance (L1 norm)
- **Movement**: 4-directional (up, down, left, right)

## Troubleshooting

**Port Conflicts**: If port 3000 is already in use (e.g., by another application), you can change it:
1. Edit `backend/app.py` and change the port number in the last line
2. Update the URL in your browser accordingly

**macOS Note**: Ports 5000 and 8080 are commonly used by system services (AirPlay, Apache), so we use port 3000 by default.

## Limitations

1. **Geocoding Rate Limits**: Nominatim allows 1 request per second. Multiple addresses will take time to process.
2. **Route Optimization**: Nearest neighbor is a heuristic, not optimal for all cases (TSP is NP-hard).
3. **Grid Size**: Maximum 40x40 grid for performance reasons.
4. **Browser Support**: Modern browsers only (Chrome, Firefox, Safari, Edge).

## Future Enhancements

- [ ] Add more optimization algorithms (2-opt, Genetic Algorithm)
- [ ] Support for diagonal movement in grid pathfinding
- [ ] Export routes to CSV/JSON
- [ ] Save/load grid configurations
- [ ] Multiple pathfinding algorithm comparison
- [ ] Real-time traffic data integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with  using Python, Flask, and JavaScript**
