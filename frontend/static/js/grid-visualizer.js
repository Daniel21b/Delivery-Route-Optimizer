document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');
    
    const GRID_SIZE = 40;
    const CELL_SIZE = 15;
    
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;
    
    const COLORS = {
        EMPTY: '#ffffff',
        WALL: '#2d3748',
        START: '#48bb78',
        END: '#f56565',
        EXPLORED: '#90cdf4',
        PATH: '#fbbf24',
        GRID_LINE: '#e2e8f0'
    };
    
    const CELL_TYPES = {
        EMPTY: 0,
        WALL: 1,
        START: 2,
        END: 3,
        EXPLORED: 4,
        PATH: 5
    };
    
    let grid = [];
    let startCell = null;
    let endCell = null;
    let currentDrawMode = 'wall';
    let isDrawing = false;
    
    const drawStartBtn = document.getElementById('draw-start-btn');
    const drawEndBtn = document.getElementById('draw-end-btn');
    const drawWallBtn = document.getElementById('draw-wall-btn');
    const runPathfindingBtn = document.getElementById('run-pathfinding-btn');
    const clearGridBtn = document.getElementById('clear-grid-btn');
    const pathfindingAlgorithmSelect = document.getElementById('pathfinding-algorithm');
    const gridLoadingDiv = document.getElementById('grid-loading');
    const gridResultsDiv = document.getElementById('grid-results');
    const gridErrorDiv = document.getElementById('grid-error');
    
    initializeGrid();
    drawGrid();
    
    function initializeGrid() {
        grid = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            grid[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                grid[y][x] = CELL_TYPES.EMPTY;
            }
        }
        
        startCell = { x: 5, y: 5 };
        endCell = { x: GRID_SIZE - 6, y: GRID_SIZE - 6 };
        grid[startCell.y][startCell.x] = CELL_TYPES.START;
        grid[endCell.y][endCell.x] = CELL_TYPES.END;
    }
    
    function drawGrid() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cellType = grid[y][x];
                let color = COLORS.EMPTY;
                
                switch (cellType) {
                    case CELL_TYPES.WALL:
                        color = COLORS.WALL;
                        break;
                    case CELL_TYPES.START:
                        color = COLORS.START;
                        break;
                    case CELL_TYPES.END:
                        color = COLORS.END;
                        break;
                    case CELL_TYPES.EXPLORED:
                        color = COLORS.EXPLORED;
                        break;
                    case CELL_TYPES.PATH:
                        color = COLORS.PATH;
                        break;
                }
                
                ctx.fillStyle = color;
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                
                ctx.strokeStyle = COLORS.GRID_LINE;
                ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    
    function getCellFromMouse(event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
        const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);
        
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            return { x, y };
        }
        return null;
    }
    
    function handleCellClick(cell) {
        if (!cell) return;
        
        const currentType = grid[cell.y][cell.x];
        
        if (currentDrawMode === 'start') {
            if (startCell && grid[startCell.y][startCell.x] === CELL_TYPES.START) {
                grid[startCell.y][startCell.x] = CELL_TYPES.EMPTY;
            }
            if (currentType !== CELL_TYPES.END && currentType !== CELL_TYPES.WALL) {
                startCell = cell;
                grid[cell.y][cell.x] = CELL_TYPES.START;
            }
        } else if (currentDrawMode === 'end') {
            if (endCell && grid[endCell.y][endCell.x] === CELL_TYPES.END) {
                grid[endCell.y][endCell.x] = CELL_TYPES.EMPTY;
            }
            if (currentType !== CELL_TYPES.START && currentType !== CELL_TYPES.WALL) {
                endCell = cell;
                grid[cell.y][cell.x] = CELL_TYPES.END;
            }
        } else if (currentDrawMode === 'wall') {
            if (currentType === CELL_TYPES.EMPTY || currentType === CELL_TYPES.EXPLORED || currentType === CELL_TYPES.PATH) {
                grid[cell.y][cell.x] = CELL_TYPES.WALL;
            } else if (currentType === CELL_TYPES.WALL) {
                grid[cell.y][cell.x] = CELL_TYPES.EMPTY;
            }
        }
        
        drawGrid();
    }
    
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const cell = getCellFromMouse(e);
        handleCellClick(cell);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing && currentDrawMode === 'wall') {
            const cell = getCellFromMouse(e);
            if (cell) {
                const currentType = grid[cell.y][cell.x];
                if (currentType === CELL_TYPES.EMPTY || currentType === CELL_TYPES.EXPLORED || currentType === CELL_TYPES.PATH) {
                    grid[cell.y][cell.x] = CELL_TYPES.WALL;
                    drawGrid();
                }
            }
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });
    
    drawStartBtn.addEventListener('click', () => {
        currentDrawMode = 'start';
        updateDrawModeButtons();
    });
    
    drawEndBtn.addEventListener('click', () => {
        currentDrawMode = 'end';
        updateDrawModeButtons();
    });
    
    drawWallBtn.addEventListener('click', () => {
        currentDrawMode = 'wall';
        updateDrawModeButtons();
    });
    
    function updateDrawModeButtons() {
        [drawStartBtn, drawEndBtn, drawWallBtn].forEach(btn => btn.classList.remove('active'));
        
        if (currentDrawMode === 'start') {
            drawStartBtn.classList.add('active');
        } else if (currentDrawMode === 'end') {
            drawEndBtn.classList.add('active');
        } else {
            drawWallBtn.classList.add('active');
        }
    }
    
    clearGridBtn.addEventListener('click', () => {
        clearPathfinding();
        drawGrid();
        hideGridResults();
        hideGridError();
    });
    
    function clearPathfinding() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] === CELL_TYPES.EXPLORED || grid[y][x] === CELL_TYPES.PATH) {
                    grid[y][x] = CELL_TYPES.EMPTY;
                }
            }
        }
    }
    
    runPathfindingBtn.addEventListener('click', async () => {
        if (!startCell || !endCell) {
            showGridError('Please set both start and end points');
            return;
        }
        
        if (grid[startCell.y][startCell.x] !== CELL_TYPES.START) {
            showGridError('Start point is invalid. Please set the start point again.');
            return;
        }
        
        if (grid[endCell.y][endCell.x] !== CELL_TYPES.END) {
            showGridError('End point is invalid. Please set the end point again.');
            return;
        }
        
        clearPathfinding();
        drawGrid();
        hideGridResults();
        hideGridError();
        showGridLoading();
        runPathfindingBtn.disabled = true;
        
        const gridData = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            gridData[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                gridData[y][x] = (grid[y][x] === CELL_TYPES.WALL) ? 1 : 0;
            }
        }
        
        try {
            const response = await fetch('/api/find-path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grid: gridData,
                    start: startCell,
                    end: endCell,
                    algorithm: pathfindingAlgorithmSelect.value
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to find path');
            }
            
            await animatePathfinding(data);
            
            displayGridResults(data);
            
        } catch (error) {
            showGridError(error.message);
        } finally {
            hideGridLoading();
            runPathfindingBtn.disabled = false;
        }
    });
    
    async function animatePathfinding(data) {
        const explored = data.explored;
        const path = data.path;
        
        for (let i = 0; i < explored.length; i++) {
            const cell = explored[i];
            if (grid[cell.y][cell.x] === CELL_TYPES.EMPTY) {
                grid[cell.y][cell.x] = CELL_TYPES.EXPLORED;
                drawGrid();
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        if (data.found && path.length > 0) {
            for (let i = 1; i < path.length - 1; i++) {
                const cell = path[i];
                grid[cell.y][cell.x] = CELL_TYPES.PATH;
                drawGrid();
                await new Promise(resolve => setTimeout(resolve, 30));
            }
        }
    }
    
    function showGridLoading() {
        gridLoadingDiv.style.display = 'block';
    }
    
    function hideGridLoading() {
        gridLoadingDiv.style.display = 'none';
    }
    
    function showGridError(message) {
        gridErrorDiv.textContent = message;
        gridErrorDiv.style.display = 'block';
    }
    
    function hideGridError() {
        gridErrorDiv.style.display = 'none';
    }
    
    function hideGridResults() {
        gridResultsDiv.style.display = 'none';
    }
    
    function displayGridResults(data) {
        const pathStatus = document.getElementById('path-status');
        const pathLength = document.getElementById('path-length');
        const cellsExplored = document.getElementById('cells-explored');
        
        if (data.found) {
            pathStatus.innerHTML = '<strong style="color: #2f855a;">✓ Path Found!</strong>';
            pathLength.textContent = data.path.length;
        } else {
            pathStatus.innerHTML = '<strong style="color: #c53030;">✗ No Path Found</strong>';
            pathLength.textContent = 'N/A';
        }
        
        cellsExplored.textContent = data.explored.length;
        
        gridResultsDiv.style.display = 'block';
    }
});
