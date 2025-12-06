
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TripService, OrderService, CustomerService } from '../../services/db';
import { useAuth } from '../../services/auth';
import { DispatchTrip, Order, Customer } from '../../types';
import { Card, Button } from '../../components/ui/Elements';
import { ArrowLeft, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to center map on points
const MapRecenter = ({ points }: { points: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [points, map]);
    return null;
};

export const RouteMap: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stops, setStops] = useState<{ order: Order, customer: Customer, lat: number, lng: number }[]>([]);
    const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get Current Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error("Location error", err)
            );
        }

        const loadRoute = async () => {
            if (!user) return;
            try {
                const trips = await TripService.getByDeliveryPerson(user.id);
                const today = new Date().toISOString().split('T')[0];
                const activeTrip = trips.find(t => t.status === 'out_for_delivery' || t.deliveryDate === today);

                if (activeTrip && activeTrip.orderIds.length > 0) {
                    const orders = await OrderService.getOrdersByIds(activeTrip.orderIds);

                    const stopsData = [];
                    for (const order of orders) {
                        if (order.customerId) {
                            const customer = await CustomerService.getById(order.customerId);
                            // Parse location
                            if (customer && customer.locationText) {
                                const [latStr, lngStr] = customer.locationText.split(',').map(s => s.trim());
                                const lat = parseFloat(latStr);
                                const lng = parseFloat(lngStr);
                                if (!isNaN(lat) && !isNaN(lng)) {
                                    stopsData.push({ order, customer, lat, lng });
                                }
                            }
                        }
                    }
                    setStops(stopsData);
                }
            } catch (e) {
                console.error("Failed to load route", e);
            } finally {
                setLoading(false);
            }
        };
        loadRoute();
    }, [user]);

    const mapPoints: [number, number][] = [
        ...(currentLocation ? [currentLocation] : []),
        ...stops.map(s => [s.lat, s.lng] as [number, number])
    ];

    if (loading) return <div className="p-8 text-center">Loading map...</div>;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="p-4 bg-white shadow-sm z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/delivery/dashboard')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="font-bold text-gray-800">Route Map</h2>
                </div>
                <span className="text-sm text-gray-500">{stops.length} Stops</span>
            </div>

            <div className="flex-1 relative">
                <MapContainer center={[27.7172, 85.3240]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {currentLocation && (
                        <Marker position={currentLocation}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {stops.map((stop, idx) => (
                        <Marker key={stop.order.id} position={[stop.lat, stop.lng]}>
                            <Popup>
                                <div className="p-1">
                                    <strong className="block text-sm mb-1">{idx + 1}. {stop.customer.name}</strong>
                                    <p className="text-xs text-gray-600 mb-2">{stop.customer.routeName}</p>
                                    <Button size="sm" className="w-full text-xs h-7" onClick={() => navigate(`/delivery/invoice/${stop.order.id}`)}>
                                        View Order
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    <MapRecenter points={mapPoints} />
                </MapContainer>
            </div>

            {/* List Overlay (Mobile) */}
            <div className="bg-white border-t p-4 max-h-48 overflow-y-auto lg:hidden">
                <h3 className="font-bold text-xs text-gray-500 uppercase mb-2">Delivery Sequence</h3>
                <div className="space-y-2">
                    {stops.map((stop, idx) => (
                        <div key={stop.order.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                <span className="truncate max-w-[150px]">{stop.customer.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`, '_blank')}>
                                <Navigation className="h-4 w-4 text-blue-600" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
