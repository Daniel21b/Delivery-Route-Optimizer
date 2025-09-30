import heapq
from typing import List, Tuple, Dict, Optional

class Node:
    def __init__(self, x: int, y: int, g: float = float('inf'), h: float = 0, parent: Optional['Node'] = None):
        self.x = x
        self.y = y
        self.g = g
        self.h = h
        self.f = g + h
        self.parent = parent
    
    def __lt__(self, other):
        if hasattr(self, 'f') and hasattr(other, 'f'):
            return self.f < other.f
        return self.g < other.g
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    def __hash__(self):
        return hash((self.x, self.y))

class AStarPathfinder:
    def __init__(self, grid: List[List[int]], start: Dict[str, int], end: Dict[str, int]):
        self.grid = grid
        self.rows = len(grid)
        self.cols = len(grid[0]) if self.rows > 0 else 0
        self.start = (start['x'], start['y'])
        self.end = (end['x'], end['y'])
    
    def heuristic(self, x1: int, y1: int, x2: int, y2: int) -> float:
        return abs(x1 - x2) + abs(y1 - y2)
    
    def get_neighbors(self, x: int, y: int) -> List[Tuple[int, int]]:
        """
        Get valid neighboring cells for pathfinding.
        Only returns neighbors that are:
        1. Within grid bounds
        2. Not walls (grid value != 1)
        """
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < self.cols and 0 <= ny < self.rows:
                if self.grid[ny][nx] != 1:
                    neighbors.append((nx, ny))
        
        return neighbors
    
    def find_path(self) -> Dict:
        start_node = Node(self.start[0], self.start[1], g=0, h=self.heuristic(self.start[0], self.start[1], self.end[0], self.end[1]))
        
        open_set = [start_node]
        closed_set = set()
        explored = []
        
        nodes_dict = {(start_node.x, start_node.y): start_node}
        
        while open_set:
            current = heapq.heappop(open_set)
            
            if (current.x, current.y) in closed_set:
                continue
            
            closed_set.add((current.x, current.y))
            explored.append({"x": current.x, "y": current.y})
            
            if (current.x, current.y) == self.end:
                path = []
                node = current
                while node:
                    path.append({"x": node.x, "y": node.y})
                    node = node.parent
                path.reverse()
                
                return {
                    "found": True,
                    "path": path,
                    "explored": explored
                }
            
            for nx, ny in self.get_neighbors(current.x, current.y):
                if (nx, ny) in closed_set:
                    continue
                
                tentative_g = current.g + 1
                
                if (nx, ny) not in nodes_dict:
                    neighbor = Node(nx, ny, g=tentative_g, h=self.heuristic(nx, ny, self.end[0], self.end[1]), parent=current)
                    nodes_dict[(nx, ny)] = neighbor
                    heapq.heappush(open_set, neighbor)
                else:
                    neighbor = nodes_dict[(nx, ny)]
                    if tentative_g < neighbor.g:
                        neighbor.g = tentative_g
                        neighbor.f = neighbor.g + neighbor.h
                        neighbor.parent = current
                        heapq.heappush(open_set, neighbor)
        
        return {
            "found": False,
            "path": [],
            "explored": explored
        }


class DijkstraPathfinder:
    def __init__(self, grid: List[List[int]], start: Dict[str, int], end: Dict[str, int]):
        self.grid = grid
        self.rows = len(grid)
        self.cols = len(grid[0]) if self.rows > 0 else 0
        self.start = (start['x'], start['y'])
        self.end = (end['x'], end['y'])
    
    def get_neighbors(self, x: int, y: int) -> List[Tuple[int, int]]:
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < self.cols and 0 <= ny < self.rows:
                if self.grid[ny][nx] != 1:
                    neighbors.append((nx, ny))
        
        return neighbors
    
    def find_path(self) -> Dict:
        start_node = Node(self.start[0], self.start[1], g=0)
        
        open_set = [start_node]
        closed_set = set()
        explored = []
        
        nodes_dict = {(start_node.x, start_node.y): start_node}
        
        while open_set:
            current = heapq.heappop(open_set)
            
            if (current.x, current.y) in closed_set:
                continue
            
            closed_set.add((current.x, current.y))
            explored.append({"x": current.x, "y": current.y})
            
            if (current.x, current.y) == self.end:
                path = []
                node = current
                while node:
                    path.append({"x": node.x, "y": node.y})
                    node = node.parent
                path.reverse()
                
                return {
                    "found": True,
                    "path": path,
                    "explored": explored
                }
            
            for nx, ny in self.get_neighbors(current.x, current.y):
                if (nx, ny) in closed_set:
                    continue
                
                tentative_g = current.g + 1
                
                if (nx, ny) not in nodes_dict:
                    neighbor = Node(nx, ny, g=tentative_g, parent=current)
                    nodes_dict[(nx, ny)] = neighbor
                    heapq.heappush(open_set, neighbor)
                else:
                    neighbor = nodes_dict[(nx, ny)]
                    if tentative_g < neighbor.g:
                        neighbor.g = tentative_g
                        neighbor.parent = current
                        heapq.heappush(open_set, neighbor)
        
        return {
            "found": False,
            "path": [],
            "explored": explored
        }


class GreedyPathfinder:
    def __init__(self, grid: List[List[int]], start: Dict[str, int], end: Dict[str, int]):
        self.grid = grid
        self.rows = len(grid)
        self.cols = len(grid[0]) if self.rows > 0 else 0
        self.start = (start['x'], start['y'])
        self.end = (end['x'], end['y'])
    
    def heuristic(self, x1: int, y1: int, x2: int, y2: int) -> float:
        return abs(x1 - x2) + abs(y1 - y2)
    
    def get_neighbors(self, x: int, y: int) -> List[Tuple[int, int]]:
        neighbors = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < self.cols and 0 <= ny < self.rows:
                if self.grid[ny][nx] != 1:
                    neighbors.append((nx, ny))
        
        return neighbors
    
    def find_path(self) -> Dict:
        start_node = Node(self.start[0], self.start[1], g=0, h=self.heuristic(self.start[0], self.start[1], self.end[0], self.end[1]))
        start_node.f = start_node.h
        
        open_set = [start_node]
        closed_set = set()
        explored = []
        
        nodes_dict = {(start_node.x, start_node.y): start_node}
        
        while open_set:
            current = heapq.heappop(open_set)
            
            if (current.x, current.y) in closed_set:
                continue
            
            closed_set.add((current.x, current.y))
            explored.append({"x": current.x, "y": current.y})
            
            if (current.x, current.y) == self.end:
                path = []
                node = current
                while node:
                    path.append({"x": node.x, "y": node.y})
                    node = node.parent
                path.reverse()
                
                return {
                    "found": True,
                    "path": path,
                    "explored": explored
                }
            
            for nx, ny in self.get_neighbors(current.x, current.y):
                if (nx, ny) in closed_set:
                    continue
                
                if (nx, ny) not in nodes_dict:
                    h = self.heuristic(nx, ny, self.end[0], self.end[1])
                    neighbor = Node(nx, ny, g=current.g + 1, h=h, parent=current)
                    neighbor.f = h
                    nodes_dict[(nx, ny)] = neighbor
                    heapq.heappush(open_set, neighbor)
        
        return {
            "found": False,
            "path": [],
            "explored": explored
        }
