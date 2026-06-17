import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Loader2, Navigation, AlertCircle, MapPin as MapPinIcon } from 'lucide-react';
import NigeriaSvgMap from './NigeriaSvgMap';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function OfficeLocator({ selectedState }: { selectedState: string | null }) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const geocodingLib = useMapsLibrary('geocoding');
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (selectedState && geocodingLib && placesLib && map) {
      setLoading(true);
      setErrorMsg("");
      const geocoder = new geocodingLib.Geocoder();
      
      geocoder.geocode({ address: `${selectedState} State, Nigeria` }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          
          map.setCenter({ lat, lng });
          map.setZoom(10);
          
          placesLib.Place.searchByText({
            textQuery: `Tax Office Revenue Service in ${selectedState} State Nigeria`,
            locationBias: { lat, lng },
            fields: ['displayName', 'location', 'formattedAddress', 'id'],
            maxResultCount: 10,
          }).then((result) => {
              setPlaces(result.places || []);
              setLoading(false);
          }).catch((e) => {
              console.error(e);
              setLoading(false);
              setErrorMsg(`Could not find tax offices in ${selectedState}.`);
          });
        } else {
            setLoading(false);
            setErrorMsg(`Could not find ${selectedState} on map.`);
        }
      });
    }
  }, [selectedState, geocodingLib, placesLib, map]);

  const findNearestOffice = () => {
    setLoading(true);
    setErrorMsg("");
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });

        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(12);
        }

        if (placesLib) {
          placesLib.Place.searchNearby({
            locationRestriction: {
              center: { lat, lng },
              radius: 50000, // 50km radius
            },
            includedPrimaryTypes: ['local_government_office'], // Try to narrow down
            textQuery: 'Tax Office Revenue Service',
            fields: ['displayName', 'location', 'formattedAddress', 'id', 'regularOpeningHours'],
            maxResultCount: 5,
          } as any).then(({ places }) => {
            // We use generic any cast because searchNearby textQuery is a mix or we fallback to searchByText
            if (!places || places.length === 0) {
              // fallback to text search if nearby doesn't work well
              placesLib.Place.searchByText({
                textQuery: 'Tax Office OR Revenue Service',
                locationBias: { lat, lng },
                fields: ['displayName', 'location', 'formattedAddress', 'id'],
                maxResultCount: 5,
              }).then((result) => {
                  setPlaces(result.places || []);
                  setLoading(false);
              }).catch((e) => {
                  console.error(e);
                  setLoading(false);
              })
            } else {
              setPlaces(places);
              setLoading(false);
            }
          }).catch((err) => {
            console.error("Places API Error:", err);
            // fallback
            placesLib.Place.searchByText({
              textQuery: 'Tax Office OR Revenue Service',
              locationBias: { lat, lng },
              fields: ['displayName', 'location', 'formattedAddress', 'id'],
              maxResultCount: 5,
            }).then((result) => {
                setPlaces(result.places || []);
                setLoading(false);
            }).catch((e) => {
                setErrorMsg("Failed to locate an office.");
                setLoading(false);
            })
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMsg("Unable to access your location. Please ensure location services are enabled.");
        setLoading(false);
      }
    );
  };

  return (
    <>
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-xs border border-white/20">
        <h3 className="font-bold text-slate-800 mb-2">Find Nearest NRS Office</h3>
        <p className="text-xs text-slate-600 mb-4">Click below to locate the closest tax service office to your current location, or click on the map of Nigeria to find offices in a specific state.</p>
        <button 
          onClick={findNearestOffice}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Navigation className="w-5 h-5 mr-2" />}
          Locate Me
        </button>

        {errorMsg && (
            <div className="mt-3 text-xs text-red-500 flex items-start">
                <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
                {errorMsg}
            </div>
        )}
        
        {places.length > 0 && (
          <div className="mt-4 max-h-48 overflow-y-auto space-y-3 pr-2 custom-scrollbar pointer-events-auto">
            {places.map((p, i) => (
              <div key={p.id} className="text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="font-bold text-slate-800">{p.displayName}</div>
                <div className="text-xs text-slate-500 mt-1">{p.formattedAddress}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {userLocation && (
        <AdvancedMarker position={userLocation} title="You are here">
          <Pin background="#2196F3" glyphColor="#fff" borderColor="#1976D2" />
        </AdvancedMarker>
      )}

      {places.map(p => (
        p.location && (
          <AdvancedMarker key={p.id} position={p.location} title={p.displayName}>
            <Pin background="#10B981" glyphColor="#fff" borderColor="#059669" />
          </AdvancedMarker>
        )
      ))}
    </>
  );
}

export default function NearestOfficeMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  if (!hasValidKey) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 h-full flex flex-col items-center justify-center relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Interactive Map</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Click on any state to locate the NRS or NRS branches in that area.</p>
            </div>
            <NigeriaSvgMap onStateClick={setSelectedState} />
            {selectedState && (
              <div className="mt-4 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full font-bold shadow-sm inline-flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4" />
                <span>{selectedState} State</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 h-full min-h-[500px] flex flex-col items-center justify-center shadow-xl">
             <div className="w-full max-w-sm">
                {!selectedState ? (
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <MapPinIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">Select a state</h3>
                    <p>Click on any state on the map to view regional tax offices and their contact details.</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                      Tax Offices in {selectedState}
                    </h3>
                    <div className="space-y-4">
                      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">{selectedState} Nigeria Revenue Service (NRS)</div>
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">NRS</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                            <MapPinIcon className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>No. 1 NRS Road, Federal Secretariat Complex, {selectedState} Capital City, {selectedState} State</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                            <div className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span><span className="font-semibold text-emerald-600 dark:text-emerald-400">Open</span> ⋅ 8:00 AM - 4:00 PM (Monday - Friday)</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                             <div className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                             </div>
                             <span>0800 NRS {selectedState.substring(0,3).toUpperCase()} / +234 800 000 0000</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-start justify-between">
                           <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">{selectedState} State Internal Revenue Service (SIRS)</div>
                           <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">STATE</span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                            <MapPinIcon className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>Revenue House, State Government Secretariat Annex, {selectedState} State</span>
                          </div>
                           <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                            <div className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span><span className="font-semibold text-emerald-600 dark:text-emerald-400">Open</span> ⋅ 8:00 AM - 4:00 PM (Monday - Friday)</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                             <div className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center justify-center">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                             </div>
                             <span>0800 {selectedState.substring(0,3).toUpperCase()} SIRS / +234 800 000 0001</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Centered on Nigeria
  const defaultCenter = { lat: 9.0820, lng: 8.6753 };
  const defaultZoom = 6;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700 h-full flex flex-col items-center justify-center relative">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Interactive Map</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Click on any state to locate the NRS or NRS branches in that area.</p>
          </div>
          <NigeriaSvgMap onStateClick={setSelectedState} />
          {selectedState && (
            <div className="mt-4 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full font-bold shadow-sm inline-flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{selectedState} State</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/2 relative h-[600px] lg:h-auto min-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            mapId="NRS_OFFICE_LOCATOR"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            gestureHandling="greedy"
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
          >
            <OfficeLocator selectedState={selectedState} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
