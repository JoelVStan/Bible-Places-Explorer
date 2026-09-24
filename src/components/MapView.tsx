import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Place, Journey, Testament } from '../types';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  ArrowRight,
  Filter,
  Check,
  X,
  Search,
  MapPin,
  Sparkles,
  Bookmark,
} from 'lucide-react';

interface MapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  activeJourney?: Journey | null;
  selectedTestament: Testament | 'ALL';
  onChangeTestament: (t: Testament | 'ALL') => void;
  activeCategory: string;
  onChangeCategory: (cat: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (placeId: string) => void;
}

type TileType = 'streets' | 'natgeo' | 'satellite' | 'topo' | 'osm';

// High quality, completely free tile providers with English labels worldwide
const TILE_PROVIDERS: Record<
  TileType,
  { url: string; attribution: string; nameEn: string; maxZoom: number }
> = {
  streets: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, DeLorme, NAVTEQ, USGS, TomTom',
    nameEn: 'English Street Atlas (Standard)',
    maxZoom: 19,
  },
  natgeo: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'National Geographic, Esri',
    nameEn: 'Historical NatGeo (English)',
    maxZoom: 16,
  },
  topo: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, USGS, NOAA',
    nameEn: 'Topographic (English)',
    maxZoom: 18,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar, Earthstar Geographics',
    nameEn: 'Satellite Imagery',
    maxZoom: 18,
  },
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    nameEn: 'OpenStreetMap (Local Script)',
    maxZoom: 19,
  },
};

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  activeJourney,
  selectedTestament,
  onChangeTestament,
  activeCategory,
  onChangeCategory,
  searchQuery = '',
  onSearchChange,
  bookmarkedIds = [],
  onToggleBookmark,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Default to English Street basemap
  const [currentTile, setCurrentTile] = useState<TileType>('streets');
  const [showTileMenu, setShowTileMenu] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [peekPlace, setPeekPlace] = useState<Place | null>(selectedPlace);
  const [localSearchInput, setLocalSearchInput] = useState(searchQuery);

  // Keep local search input synced with prop
  useEffect(() => {
    setLocalSearchInput(searchQuery);
  }, [searchQuery]);

  // Sync selectedPlace prop to peekPlace state
  useEffect(() => {
    if (selectedPlace) {
      setPeekPlace(selectedPlace);
    }
  }, [selectedPlace]);

  // Filter places based on search query, testament, and category
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return places.filter((p) => {
      // Search matching
      const matchesSearch =
        !query ||
        p.nameEn.toLowerCase().includes(query) ||
        p.nameMl.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.regionMl.toLowerCase().includes(query) ||
        p.modernCountryMl.toLowerCase().includes(query) ||
        (p.alternateNamesMl &&
          p.alternateNamesMl.some((alt) => alt.toLowerCase().includes(query)));

      // Testament matching
      const matchesTestament =
        selectedTestament === 'ALL' ||
        p.testament === selectedTestament ||
        p.testament === 'BOTH';

      // Category matching
      const matchesCategory =
        activeCategory === 'ALL' || p.category === activeCategory;

      return matchesSearch && matchesTestament && matchesCategory;
    });
  }, [places, searchQuery, selectedTestament, activeCategory]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center around Holy Land / Eastern Mediterranean (Jerusalem / Canaan / Galilee)
    const map = L.map(mapContainerRef.current, {
      center: [32.0, 35.2],
      zoom: 7,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
    });

    const provider = TILE_PROVIDERS.streets;
    const tile = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tile;
    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Map container size invalidation for tablets and mobile devices
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when user switches style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const provider = TILE_PROVIDERS[currentTile];
    const newTile = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [currentTile]);

  // Update Markers when filteredPlaces or peekPlace changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredPlaces.forEach((place) => {
      const isSelected = peekPlace?.id === place.id;

      // Color scheme according to category or testament
      let pinColor = '#d97706'; // gold/amber default
      let pinSymbol = '✦';

      if (place.category === 'holy_city') {
        pinColor = '#b45309';
        pinSymbol = '👑';
      } else if (place.category === 'mountain') {
        pinColor = '#15803d';
        pinSymbol = '⛰️';
      } else if (place.category === 'water') {
        pinColor = '#0284c7';
        pinSymbol = '🌊';
      } else if (place.testament === 'NT') {
        pinColor = '#7c3aed';
        pinSymbol = '✝️';
      }

      // Marker HTML with explicit, visible English label directly attached below the pin
      const customHtml = `
        <div class="custom-pin flex flex-col items-center cursor-pointer select-none group" style="transform: translate3d(0,0,0);">
          <div class="relative flex items-center justify-center" style="width: 36px; height: 36px;">
            <div class="absolute inset-0 rounded-full ${
              isSelected ? 'animate-ping opacity-75' : ''
            }" style="background-color: ${pinColor}; opacity: 0.25;"></div>
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 ${
              isSelected
                ? 'border-amber-300 scale-125 ring-4 ring-amber-400/60'
                : 'border-white group-hover:scale-110'
            } transition-transform" style="background-color: ${pinColor};">
              ${pinSymbol}
            </div>
          </div>
          <!-- Clear English Place Name Label inside the map -->
          <div class="mt-0.5 px-2 py-0.5 rounded-md bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs shadow-md border ${
            isSelected
              ? 'border-amber-500 font-extrabold text-amber-700 dark:text-amber-300 ring-2 ring-amber-400/40 scale-105'
              : 'border-stone-200/90 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold'
          } text-[11px] whitespace-nowrap leading-tight transition-all pointer-events-none">
            ${place.nameEn}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'custom-leaflet-marker',
        iconSize: [120, 60],
        iconAnchor: [60, 18], // Centers the 36x36 circular pin right on the coordinate
      });

      const marker = L.marker([place.lat, place.lng], { icon });

      // Click marker to select and fly
      marker.on('click', () => {
        setPeekPlace(place);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([place.lat, place.lng], 10, {
            duration: 0.8,
          });
        }
      });

      // Tooltip with English primary, Malayalam secondary
      marker.bindTooltip(
        `<div style="text-align: center; padding: 4px 6px; font-family: sans-serif;">
          <div style="font-size: 13px; font-weight: 800; color: #1c1917;">${place.nameEn}</div>
          <div style="font-size: 12px; font-weight: 700; color: #b45309; margin-top: 1px;">${place.nameMl}</div>
          <div style="font-size: 10px; color: #78716c; margin-top: 2px;">${place.category.replace('_', ' ').toUpperCase()} • ${place.modernCountryMl}</div>
        </div>`,
        { direction: 'top', offset: [0, -18] }
      );

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredPlaces, peekPlace]);

  // If search changes and places are found, auto-center or adjust bounds
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const query = searchQuery.trim();

    if (query && filteredPlaces.length > 0) {
      if (filteredPlaces.length === 1) {
        const singlePlace = filteredPlaces[0];
        setPeekPlace(singlePlace);
        mapInstanceRef.current.flyTo([singlePlace.lat, singlePlace.lng], 10, {
          duration: 0.8,
        });
      } else {
        try {
          const latlngs: [number, number][] = filteredPlaces.map((p) => [
            p.lat,
            p.lng,
          ]);
          const bounds = L.latLngBounds(latlngs);
          mapInstanceRef.current.fitBounds(bounds, {
            padding: [60, 60],
            maxZoom: 9,
          });
        } catch {
          // fallback
        }
      }
    }
  }, [searchQuery, filteredPlaces]);

  // Update Route if Active Journey is provided
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    if (activeJourney && activeJourney.stops.length > 1) {
      const latlngs: [number, number][] = activeJourney.stops.map((s) => [
        s.lat,
        s.lng,
      ]);

      // Glow outline
      const glowLine = L.polyline(latlngs, {
        color: activeJourney.color || '#f59e0b',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Main route polyline
      const mainLine = L.polyline(latlngs, {
        color: activeJourney.color || '#d97706',
        weight: 3.5,
        dashArray: '7, 7',
        opacity: 0.9,
      });

      routeLayerRef.current.addLayer(glowLine);
      routeLayerRef.current.addLayer(mainLine);

      // Add numbered waypoint markers
      activeJourney.stops.forEach((stop) => {
        const stepHtml = `
          <div class="relative flex flex-col items-center cursor-pointer" style="width: 80px;">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-md border-2 border-white ring-2 ring-stone-900/20" style="background-color: ${activeJourney.color};">
              ${stop.stopNumber}
            </div>
            <div class="mt-0.5 px-1.5 py-0.5 rounded bg-white/95 dark:bg-stone-900/95 text-[10px] font-bold text-stone-800 dark:text-stone-100 shadow border border-stone-200 dark:border-stone-700 whitespace-nowrap">
              ${stop.placeNameEn}
            </div>
          </div>
        `;

        const stepIcon = L.divIcon({
          html: stepHtml,
          className: 'journey-step-marker',
          iconSize: [80, 50],
          iconAnchor: [40, 14],
        });

        const stopMarker = L.marker([stop.lat, stop.lng], { icon: stepIcon });
        stopMarker.bindTooltip(
          `<b>${stop.stopNumber}. ${stop.placeNameEn}</b><br><span style="color:#b45309;">${stop.placeNameMl}</span><br><span style="font-size:10px;">${stop.bibleReferenceMl}</span>`,
          { direction: 'top', offset: [0, -14] }
        );

        stopMarker.on('click', () => {
          const matching = places.find((p) => p.id === stop.placeId);
          if (matching) {
            setPeekPlace(matching);
          }
        });

        routeLayerRef.current?.addLayer(stopMarker);
      });

      // Fit map bounds
      try {
        const bounds = L.latLngBounds(latlngs);
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 8,
        });
      } catch {
        // bounds error fallback
      }
    }
  }, [activeJourney, places]);

  // Fly to selected place
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPlace) return;
    mapInstanceRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 10, {
      duration: 1.0,
    });
  }, [selectedPlace]);

  // Reset view to Holy Land
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([32.0, 35.2], 7, { duration: 0.8 });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleTriggerSearch = (val: string) => {
    setLocalSearchInput(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchInput('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const handleSelectSearchMatch = (place: Place) => {
    setPeekPlace(place);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], 10, {
        duration: 0.8,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden select-none bg-stone-100 dark:bg-stone-950">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-2.5 sm:top-3 left-2 sm:left-3 right-2 sm:right-auto z-10 flex flex-col gap-2 max-w-full pointer-events-auto">
        {/* Row 1: Search Bar + Testament Chips + Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Integrated On-Map Search Input */}
          <div className="relative flex items-center min-w-[180px] sm:min-w-[240px] max-w-xs shadow-md rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-800">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={localSearchInput}
              onChange={(e) => handleTriggerSearch(e.target.value)}
              placeholder="Search places (e.g. Jerusalem, Bethlehem)..."
              className="w-full pl-8 sm:pl-9 pr-7 py-1.5 text-xs rounded-full bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            {localSearchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5"
                title="Clear map search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Testament Filter Chips */}
          <div className="flex items-center bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-full p-1 border border-stone-200/80 dark:border-stone-800 shadow-md overflow-x-auto no-scrollbar">
            <button
              onClick={() => onChangeTestament('ALL')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTestament === 'ALL'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              All ({places.length})
            </button>
            <button
              onClick={() => onChangeTestament('OT')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTestament === 'OT'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              Old Testament
            </button>
            <button
              onClick={() => onChangeTestament('NT')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTestament === 'NT'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              New Testament
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold backdrop-blur-md border shadow-md transition-all ${
                activeCategory !== 'ALL'
                  ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-900 dark:text-amber-200'
                  : 'bg-white/95 dark:bg-stone-900/95 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Types</span>
              <span className="xs:hidden">Filter</span>
              {activeCategory !== 'ALL' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              )}
            </button>

            {/* Category Menu Dropdown */}
            {showFilterDrawer && (
              <div className="absolute top-10 left-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-2 min-w-[200px] sm:min-w-[220px] z-30 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Filter by Category
                </div>
                <div className="space-y-0.5">
                  {[
                    { id: 'ALL', label: 'All Place Categories' },
                    { id: 'holy_city', label: '👑 Holy Cities' },
                    { id: 'city', label: '🏛️ Towns & Cities' },
                    { id: 'mountain', label: '⛰️ Sacred Mountains' },
                    { id: 'water', label: '🌊 Seas & Rivers' },
                    { id: 'region', label: '🗺️ Regions & Islands' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onChangeCategory(cat.id);
                        setShowFilterDrawer(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-semibold'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {activeCategory === cat.id && (
                        <Check className="w-3.5 h-3.5 text-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Active Search Matches Bar on Map */}
        {searchQuery.trim() && (
          <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-amber-300/80 dark:border-amber-700/60 shadow-lg flex flex-col gap-1.5 max-w-md animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {filteredPlaces.length === 0
                    ? `No places found for "${searchQuery}"`
                    : `Found ${filteredPlaces.length} place${
                        filteredPlaces.length === 1 ? '' : 's'
                      } on map`}
                </span>
              </span>
              <button
                onClick={handleClearSearch}
                className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Quick Result Chips to Fly To */}
            {filteredPlaces.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                {filteredPlaces.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectSearchMatch(p)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      peekPlace?.id === p.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{p.nameEn}</span>
                    <span className="text-[10px] opacity-75 font-scripture">
                      ({p.nameMl})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Active Journey Notice on Map */}
      {activeJourney && (
        <div className="absolute top-28 sm:top-20 left-2 sm:left-3 right-2 sm:right-auto max-w-sm z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-3 border border-amber-300/80 dark:border-amber-700/60 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeJourney.color }}
            ></span>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
              {activeJourney.titleEn}
            </span>
          </div>
          <p className="text-[11px] font-scripture text-stone-600 dark:text-stone-400 line-clamp-1">
            {activeJourney.titleMl}
          </p>
          <div className="mt-1.5 text-[10px] text-stone-500 font-medium flex items-center justify-between">
            <span>{activeJourney.stops.length} locations on route</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              Interactive Route
            </span>
          </div>
        </div>
      )}

      {/* Map Control Buttons (Right side - Touch Friendly) */}
      <div className="absolute bottom-20 sm:bottom-6 right-3 sm:right-4 z-10 flex flex-col gap-2 pointer-events-auto">
        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowTileMenu(!showTileMenu)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 shadow-lg flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all"
            title="Change Map Style"
            aria-label="Map layers"
          >
            <Layers className="w-5 h-5 text-amber-600" />
          </button>

          {showTileMenu && (
            <div className="absolute right-12 bottom-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-2 min-w-[220px] z-30 space-y-1">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-0.5">
                Map Basemap (English)
              </div>
              {(Object.keys(TILE_PROVIDERS) as TileType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setCurrentTile(type);
                    setShowTileMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    currentTile === type
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="truncate">{TILE_PROVIDERS[type].nameEn}</span>
                  {currentTile === type && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1.5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center / Reset View */}
        <button
          onClick={handleResetView}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 shadow-lg flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all"
          title="Center Holy Land"
          aria-label="Center map"
        >
          <Compass className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 shadow-lg flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 shadow-lg flex items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        </button>
      </div>

      {/* Selected Place Mobile & Tablet Interactive Slide-up Sheet / Card */}
      {peekPlace && (
        <div className="absolute bottom-2 sm:bottom-6 left-2 sm:left-4 right-2 sm:right-auto sm:max-w-md z-20 bg-white/98 dark:bg-stone-900/98 backdrop-blur-md rounded-2xl p-3.5 border border-amber-300/80 dark:border-amber-700/60 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/50">
                  {peekPlace.testament === 'BOTH'
                    ? 'Old & New'
                    : peekPlace.testament === 'OT'
                    ? 'Old Testament'
                    : 'New Testament'}
                </span>
                <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">
                  {peekPlace.regionMl} • Modern: {peekPlace.modernCountryMl}
                </span>
              </div>

              {/* English Heading Primary, Malayalam Subtitle */}
              <div className="flex items-baseline gap-2 mt-1.5">
                <h3 className="font-extrabold text-stone-900 dark:text-stone-50 text-base sm:text-lg tracking-tight">
                  {peekPlace.nameEn}
                </h3>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400 font-scripture">
                  ({peekPlace.nameMl})
                </span>
              </div>
            </div>

            {/* Peek Card Actions: Bookmark & Dismiss */}
            <div className="flex items-center gap-1 shrink-0">
              {onToggleBookmark && (
                <button
                  onClick={() => onToggleBookmark(peekPlace.id)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    bookmarkedIds.includes(peekPlace.id)
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                  title={
                    bookmarkedIds.includes(peekPlace.id)
                      ? 'Remove from saved'
                      : 'Save this place'
                  }
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(peekPlace.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
              )}
              <button
                onClick={() => setPeekPlace(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                title="Close card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs font-scripture text-stone-600 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
            {peekPlace.briefDescriptionMl}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              📖 {peekPlace.verses.length} Scripture Verses
            </span>

            <button
              onClick={() => onSelectPlace(peekPlace)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-900/20 transition-all cursor-pointer"
            >
              <span>View Full Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
