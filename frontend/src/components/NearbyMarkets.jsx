import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Info, Cloud, Droplets, Wind, Search, Car, Bike, Bus, User, ExternalLink, RefreshCw, Layers, AlertCircle, Map as MapIcon, ChevronRight } from 'lucide-react';
import axios from 'axios';

const { BaseLayer } = LayersControl;

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map centering when user location changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center]);
  return null;
}

const NearbyMarkets = () => {
  const [userLoc, setUserLoc] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 });
  const [markets, setMarkets] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [searchStatus, setSearchStatus] = useState('Initializing...');
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  
  const markerRefs = useRef({});

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocating(true);
    setSearchStatus('Detecting your location...');
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLoc(newLoc);
          setMapCenter(newLoc);
          setLocating(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setError("GPS access denied. Showing markets near Pune/Delhi.");
          setLocating(false);
          // Try Pune as fallback if GPS fails
          const puneLoc = { lat: 18.5204, lng: 73.8567 };
          setUserLoc(puneLoc);
          setMapCenter(puneLoc);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation not supported.");
      setLocating(false);
      const puneLoc = { lat: 18.5204, lng: 73.8567 };
      setUserLoc(puneLoc);
      setMapCenter(puneLoc);
    }
  };

  useEffect(() => {
    if (userLoc) {
      fetchData(userLoc);
    }
  }, [userLoc]);

  const fetchData = async (location) => {
    try {
      setLoading(true);
      setSearchStatus('Fetching market data...');
      
      const [marketRes, weatherRes] = await Promise.all([
        axios.get(`/api/nearby-markets?lat=${location.lat}&lng=${location.lng}&radius=5000`),
        axios.get(`/api/weather?lat=${location.lat}&lng=${location.lng}`)
      ]);
      
      const marketData = marketRes.data;
      const foundMarkets = Array.isArray(marketData) ? marketData : (marketData.markets || marketData.value || []);
      setMarkets(foundMarkets);
      setWeather(weatherRes.data);
      setLoading(false);
      setSearchStatus(foundMarkets.length > 0 ? `Found ${foundMarkets.length} markets near you` : 'No markets found in this area.');
    } catch (err) {
      console.error('API Error:', err);
      setLoading(false);
      setSearchStatus('Connection error.');
    }
  };

  const handleMarketClick = (market) => {
    setSelectedMarketId(market.id);
    setMapCenter({ lat: market.lat, lng: market.lng });
    
    // Open popup programmatically
    const marker = markerRefs.current[market.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const getGoogleMapsUrl = (destLat, destLng, mode = 'driving') => {
    const origin = `${userLoc.lat},${userLoc.lng}`;
    const dest = `${destLat},${destLng}`;
    const travelModes = {
      driving: 'driving',
      bicycling: 'bicycling',
      transit: 'transit',
      walking: 'walking',
      satellite: 'driving'
    };
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${travelModes[mode]}`;
    if (mode === 'satellite') url += '&basemap=satellite';
    return url;
  };

  return (
    <div className="pt-28 pb-10 px-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Market <span className="text-emerald-400">Locator</span>
          </motion.h1>
          <div className="flex flex-col gap-2 mt-3">
            <p className="text-slate-400 flex items-center gap-2 font-medium">
              <MapIcon size={18} className="text-emerald-500" /> {searchStatus}
            </p>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 w-fit"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <button 
            onClick={getLocation}
            disabled={locating || loading}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-[2rem] hover:bg-emerald-600 transition-all text-sm font-black shadow-xl shadow-emerald-500/20 disabled:opacity-50"
          >
            {locating || loading ? <RefreshCw className="animate-spin" size={20} /> : <Navigation size={20} />}
            {locating ? "LOCATING..." : loading ? "SEARCHING..." : "MY LOCATION"}
          </button>

          {weather && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 rounded-[2rem] flex items-center gap-8 border-slate-700/50 w-full md:w-auto px-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400">
                  <Cloud size={28} />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">{weather.temp}°C</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{weather.condition}</div>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-700/50 hidden sm:block" />
              <div className="hidden sm:flex gap-6">
                <div className="text-center">
                  <div className="text-blue-400 mb-1"><Droplets size={20} className="mx-auto" /></div>
                  <div className="text-xs text-white font-black">{weather.humidity}%</div>
                </div>
                <div className="text-center">
                  <div className="text-emerald-400 mb-1"><Wind size={20} className="mx-auto" /></div>
                  <div className="text-xs text-white font-black">12km/h</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-2 h-[650px] rounded-[3rem] overflow-hidden border border-slate-700/50 shadow-2xl relative z-10 group">
          <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={mapCenter} />
            <LayersControl position="topright">
              <BaseLayer checked name="Street Map">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
              </BaseLayer>
              <BaseLayer name="Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                />
              </BaseLayer>
            </LayersControl>
            
            <Marker position={[userLoc.lat, userLoc.lng]} icon={L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: #3b82f6; width: 22px; height: 22px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(59,130,246,0.8); animation: pulse 2s infinite;"></div>`,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })}>
              <Popup>You are here</Popup>
            </Marker>

            {markets.map(market => (
              <Marker 
                key={market.id} 
                position={[market.lat, market.lng]}
                ref={el => markerRefs.current[market.id] = el}
              >
                <Popup className="custom-popup" maxWidth={320}>
                  <div className="p-2">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="font-black text-slate-900 text-xl leading-tight">{market.name}</div>
                      <div className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20">{market.distance}KM</div>
                    </div>
                    <div className="text-[12px] text-slate-600 mb-5 flex items-start gap-2 font-medium">
                      <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" /> 
                      <span>{market.address}</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                      <a href={getGoogleMapsUrl(market.lat, market.lng, 'driving')} target="_blank" rel="noreferrer" title="Car" className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all text-slate-600 group/btn">
                        <Car size={20} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[8px] font-black">CAR</span>
                      </a>
                      <a href={getGoogleMapsUrl(market.lat, market.lng, 'bicycling')} target="_blank" rel="noreferrer" title="Bike" className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all text-slate-600 group/btn">
                        <Bike size={20} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[8px] font-black">BIKE</span>
                      </a>
                      <a href={getGoogleMapsUrl(market.lat, market.lng, 'transit')} target="_blank" rel="noreferrer" title="Bus" className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all text-slate-600 group/btn">
                        <Bus size={20} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[8px] font-black">BUS</span>
                      </a>
                      <a href={getGoogleMapsUrl(market.lat, market.lng, 'satellite')} target="_blank" rel="noreferrer" title="Satellite" className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all text-slate-600 group/btn">
                        <Layers size={20} className="group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[8px] font-black">SAT</span>
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Market List */}
        <div className="space-y-4 overflow-y-auto h-[650px] pr-2 custom-scrollbar">
          <div className="sticky top-0 bg-[#0f172a] py-6 z-20 border-b border-slate-800/50 mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Navigation className="text-emerald-400" size={28} /> CLOSEST MANDIS
            </h3>
            <span className="text-[11px] font-black bg-slate-800 text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-widest">{markets.length} LISTED</span>
          </div>
          
          {loading ? (
             <div className="space-y-5">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-48 w-full bg-slate-800/20 animate-pulse rounded-[3rem] border border-slate-700/20" />
               ))}
             </div>
          ) : (
            markets.map((market, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={market.id} 
                onClick={() => handleMarketClick(market)}
                className={`glass-card p-8 rounded-[3rem] transition-all border-slate-700/50 group relative overflow-hidden cursor-pointer ${selectedMarketId === market.id ? 'bg-slate-800/90 border-emerald-500/50' : 'hover:bg-slate-800/70'}`}
              >
                <div className={`absolute top-0 left-0 w-2.5 h-full transition-all ${selectedMarketId === market.id ? 'bg-emerald-500' : 'bg-emerald-500/10 group-hover:bg-emerald-500/30'}`} />
                
                <div className="flex justify-between items-start mb-5">
                  <div className="max-w-[70%]">
                    <div className="font-black text-white group-hover:text-emerald-400 transition-colors text-2xl leading-tight mb-2 uppercase tracking-tight">{market.name}</div>
                    <div className="text-[13px] text-slate-500 flex items-center gap-2 font-bold italic">
                      <MapPin size={16} className="text-emerald-500" /> {market.district}, {market.state}
                    </div>
                  </div>
                  <div className="text-[15px] font-black text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-2xl uppercase tracking-tighter border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    {market.distance} KM
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                   {typeof market.crops === 'string' ? (
                     market.crops.split(' ').map(c => (
                        <span key={c} className="text-[10px] font-black text-slate-400 border border-slate-700/50 px-4 py-2 rounded-full bg-slate-900/50 group-hover:border-emerald-500/30 group-hover:text-emerald-300 transition-all uppercase tracking-wider">
                          {c}
                        </span>
                     ))
                   ) : Array.isArray(market.crops) ? (
                     market.crops.map(c => (
                        <span key={c} className="text-[10px] font-black text-slate-400 border border-slate-700/50 px-4 py-2 rounded-full bg-slate-900/50 group-hover:border-emerald-500/30 group-hover:text-emerald-300 transition-all uppercase tracking-wider">
                          {c}
                        </span>
                     ))
                   ) : null}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/50">
                   <span className="text-[10px] font-black text-emerald-400 flex items-center gap-2">
                     CLICK FOR INFO <ChevronRight size={14} />
                   </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyMarkets;
