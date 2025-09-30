# Quick Start Guide

## Running the Application

### Option 1: Quick Start Script (Recommended)
```bash
./run.sh
```

### Option 2: Manual Start
```bash
pip install -r requirements.txt
python -m backend.app
```

### Option 3: Docker
```bash
docker build -t delivery-route-optimizer .
docker run -p 3000:3000 delivery-route-optimizer
```

## Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Using the Map Optimizer

1. Click on the **Map Optimizer** tab
2. Enter addresses (one per line):
   ```
   Times Square, New York, NY
   Central Park, New York, NY
   Brooklyn Bridge, New York, NY
   ```
3. Click **Find Optimal Route**
4. Watch the animated markers appear on the map!

**Note**: Geocoding takes ~1 second per address (API rate limit)

## Using the Grid Visualizer

1. Click on the **Grid Visualizer** tab
2. Draw walls by clicking and dragging
3. Click **Set Start** and place a green start point
4. Click **Set End** and place a red end point
5. Click **Run A* Algorithm**
6. Watch the pathfinding animation!

**Important Notes:**
- The A* algorithm treats walls as impassable obstacles
- You cannot place start/end points on wall cells
- Walls cannot be drawn over start/end points
- If no path exists (destination blocked), the algorithm will correctly report "No Path Found"

## Troubleshooting

**ModuleNotFoundError: No module named 'backend'?**
- Don't run: `python backend/app.py` ❌
- Use instead: `python -m backend.app` ✅
- Or use the run script: `./run.sh` ✅

**Port 3000 already in use?**
- Edit `backend/app.py` line 65
- Change `port=3000` to another port like `port=3001`
- Update your browser URL accordingly

**Geocoding not working?**
- Check your internet connection
- Wait between requests (1 second delay required)
- Use full addresses: "123 Main St, City, State"

**Grid not responding?**
- Make sure you've set both Start and End points
- Clear the grid and try again
- Ensure start/end points are not on wall cells

**Path going through walls?**
- This was a display issue, now fixed!
- The A* algorithm correctly avoids walls
- If you placed start/end on walls before the fix, reset them

## Sample Test Data

### Map Optimizer Test Addresses (New York)
```
Empire State Building, New York, NY
Statue of Liberty, New York, NY
Times Square, New York, NY
Central Park, New York, NY
Brooklyn Bridge, Brooklyn, NY
```

### Map Optimizer Test Addresses (San Francisco)
```
Golden Gate Bridge, San Francisco, CA
Alcatraz Island, San Francisco, CA
Fisherman's Wharf, San Francisco, CA
Lombard Street, San Francisco, CA
Golden Gate Park, San Francisco, CA
```

## API Testing with curl

### Test Route Optimization
```bash
curl -X POST http://localhost:3000/api/optimize-route \
  -H "Content-Type: application/json" \
  -d '{
    "addresses": [
      "Times Square, New York",
      "Central Park, New York"
    ],
    "algorithm": "nearest_neighbor"
  }'
```

### Test Pathfinding
```bash
curl -X POST http://localhost:3000/api/find-path \
  -H "Content-Type: application/json" \
  -d '{
    "grid": [[0,0,0],[0,1,0],[0,0,0]],
    "start": {"x": 0, "y": 0},
    "end": {"x": 2, "y": 2}
  }'
```

## Tips for Best Experience

1. **Map Optimizer**:
   - Use complete addresses with city and state
   - Start with 3-5 addresses for faster testing
   - Allow time for geocoding (1 sec per address)

2. **Grid Visualizer**:
   - Click **Draw Wall** before drawing
   - Hold and drag to draw long walls
   - Watch the blue cells (explored) appear first
   - Then the yellow path shows the optimal route

3. **Performance**:
   - Grid size is optimized for 40x40 (fixed)
   - Route optimizer handles up to ~20 addresses efficiently
   - Larger datasets may take longer to process

---

**Need help?** Check the main [README.md](README.md) for detailed documentation.
