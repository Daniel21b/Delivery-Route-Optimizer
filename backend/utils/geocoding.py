import time
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError

class GeocodingService:
    def __init__(self):
        self.geocoder = Nominatim(user_agent="delivery-route-optimizer")
        self.delay = 1.0
    
    def geocode_address(self, address):
        try:
            time.sleep(self.delay)
            location = self.geocoder.geocode(address, timeout=10)
            if location:
                return {
                    "address": address,
                    "lat": location.latitude,
                    "lng": location.longitude,
                    "success": True
                }
            else:
                return {
                    "address": address,
                    "success": False,
                    "error": "Address not found"
                }
        except (GeocoderTimedOut, GeocoderServiceError) as e:
            return {
                "address": address,
                "success": False,
                "error": str(e)
            }
    
    def geocode_addresses(self, addresses):
        results = []
        for addr in addresses:
            result = self.geocode_address(addr)
            results.append(result)
        return results
