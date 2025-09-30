from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from backend.utils.geocoding import GeocodingService
from backend.utils.routing import RoutingService
from backend.algorithms.route_optimizer import RouteOptimizer
from backend.algorithms.pathfinding import AStarPathfinder, DijkstraPathfinder, GreedyPathfinder

app = Flask(__name__, 
            template_folder='../frontend/templates',
            static_folder='../frontend/static')
CORS(app)

geocoding_service = GeocodingService()
routing_service = RoutingService()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/optimize-route', methods=['POST'])
def optimize_route():
    try:
        data = request.get_json()
        addresses = data.get('addresses', [])
        algorithm = data.get('algorithm', 'nearest_neighbor')
        
        if not addresses:
            return jsonify({"error": "No addresses provided"}), 400
        
        geocoded_locations = geocoding_service.geocode_addresses(addresses)
        
        failed_locations = [loc for loc in geocoded_locations if not loc.get('success', False)]
        if failed_locations:
            return jsonify({
                "error": "Some addresses could not be geocoded",
                "failed": failed_locations
            }), 400
        
        distance_matrix, geometry_cache = routing_service.get_route_matrix(geocoded_locations)
        
        optimizer = RouteOptimizer(geocoded_locations, distance_matrix, geometry_cache)
        result = optimizer.optimize(algorithm)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/find-path', methods=['POST'])
def find_path():
    try:
        data = request.get_json()
        grid = data.get('grid', [])
        start = data.get('start', {})
        end = data.get('end', {})
        algorithm = data.get('algorithm', 'astar')
        
        if not grid or not start or not end:
            return jsonify({"error": "Invalid input data"}), 400
        
        pathfinders = {
            'astar': AStarPathfinder,
            'dijkstra': DijkstraPathfinder,
            'greedy': GreedyPathfinder
        }
        
        pathfinder_class = pathfinders.get(algorithm, AStarPathfinder)
        pathfinder = pathfinder_class(grid, start, end)
        result = pathfinder.find_path()
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
