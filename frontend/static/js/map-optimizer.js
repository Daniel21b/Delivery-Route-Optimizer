document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            if (targetTab === 'map-optimizer' && map) {
                setTimeout(() => map.invalidateSize(), 100);
            }
        });
    });
    
    let map = L.map('map').setView([40.7128, -74.0060], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    let markers = [];
    let routeLines = [];
    
    const findRouteBtn = document.getElementById('find-route-btn');
    const addressesInput = document.getElementById('addresses');
    const loadingDiv = document.getElementById('map-loading');
    const resultsDiv = document.getElementById('map-results');
    const errorDiv = document.getElementById('map-error');
    
    findRouteBtn.addEventListener('click', async () => {
        const addressText = addressesInput.value.trim();
        if (!addressText) {
            showError('Please enter at least one address');
            return;
        }
        
        const addresses = addressText.split('\n').filter(addr => addr.trim() !== '');
        if (addresses.length === 0) {
            showError('Please enter at least one address');
            return;
        }
        
        clearMap();
        hideResults();
        hideError();
        showLoading();
        findRouteBtn.disabled = true;
        
        try {
            const response = await fetch('/api/optimize-route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    addresses: addresses,
                    algorithm: 'nearest_neighbor'
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to optimize route');
            }
            
            displayRoute(data);
            
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
            findRouteBtn.disabled = false;
        }
    });
    
    function clearMap() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        routeLines.forEach(line => map.removeLayer(line));
        routeLines = [];
    }
    
    function showLoading() {
        loadingDiv.style.display = 'block';
    }
    
    function hideLoading() {
        loadingDiv.style.display = 'none';
    }
    
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    
    function hideError() {
        errorDiv.style.display = 'none';
    }
    
    function hideResults() {
        resultsDiv.style.display = 'none';
    }
    
    async function displayRoute(data) {
        const route = data.route;
        const totalDistance = data.total_distance;
        
        if (route.length === 0) {
            showError('No valid locations found');
            return;
        }
        
        const bounds = [];
        
        for (let i = 0; i < route.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const location = route[i];
            const isFirst = i === 0;
            const isLast = i === route.length - 1;
            
            const markerColor = isFirst ? 'green' : (isLast ? 'red' : 'blue');
            
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="
                    background-color: ${markerColor};
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                ">${location.order}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const marker = L.marker([location.lat, location.lng], { icon: customIcon })
                .addTo(map)
                .bindPopup(`<b>Stop ${location.order}</b><br>${location.address}`);
            
            markers.push(marker);
            bounds.push([location.lat, location.lng]);
        }
        
        if (bounds.length > 1 && data.geometries && data.geometries.length > 0) {
            data.geometries.forEach(geometry => {
                const line = L.polyline(geometry, {
                    color: '#667eea',
                    weight: 4,
                    opacity: 0.7
                }).addTo(map);
                routeLines.push(line);
            });
        } else if (bounds.length > 1) {
            const routeCoordinates = route.map(loc => [loc.lat, loc.lng]);
            const line = L.polyline(routeCoordinates, {
                color: '#667eea',
                weight: 4,
                opacity: 0.7
            }).addTo(map);
            routeLines.push(line);
        }
        
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
        
        document.getElementById('total-distance').textContent = totalDistance;
        
        const routeListDiv = document.getElementById('route-list');
        routeListDiv.innerHTML = '<h4>Route Order:</h4>';
        
        route.forEach(location => {
            const routeItem = document.createElement('div');
            routeItem.className = 'route-item';
            routeItem.innerHTML = `<strong>${location.order}.</strong> ${location.address}`;
            routeListDiv.appendChild(routeItem);
        });
        
        resultsDiv.style.display = 'block';
    }
});
