"use client";
import { useEffect, Dispatch, SetStateAction } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Component to a recentered map when the selected producer changes
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface Producer {
  id: number;
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  cultivationMethods: string[];
}

interface ProducerMapProps {
  producers: Producer[];
  selectedProducer: Producer | null;
  setSelectedProducer: Dispatch<SetStateAction<Producer | null>>;
}

export default function ProducerMap({ producers, selectedProducer, setSelectedProducer }: ProducerMapProps) {
  // Fix for Leaflet default icon issue in Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // Custom marker icon for producers
  const producerIcon = new L.Icon({
    iconUrl: "/icons/strawberry-marker.svg",
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  });

  // Set the default center to a point in South Minas Gerais
  const defaultCenter: [number, number] = [-22.4, -45.9];
  const defaultZoom = 9;

  // If a producer is selected, use their location as the center
  const center: [number, number] = selectedProducer 
    ? [selectedProducer.latitude, selectedProducer.longitude] 
    : defaultCenter;

  const zoom = selectedProducer ? 12 : defaultZoom;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Update map center when selected producer changes */}
      <MapUpdater center={center} zoom={zoom} />

      {/* Add markers for each producer */}
      {producers.map((producer) => (
        <Marker
          key={producer.id}
          position={[producer.latitude, producer.longitude]}
          icon={producerIcon}
          eventHandlers={{
            click: () => {
              setSelectedProducer(producer);
            },
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{producer.name}</h3>
              <p className="text-sm">{producer.city}, {producer.state}</p>
              {/*<button*/}
              {/*  onClick={() => setSelectedProducer(producer)}*/}
              {/*  className="mt-2 text-primary hover:underline text-sm font-medium"*/}
              {/*>*/}
              {/*  Ver detalhes*/}
              {/*</button>*/}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
