import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useParams } from 'react-router';
import { getContainer } from '../data/messages';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SiGooglepay, SiPaytm } from 'react-icons/si';
import { FaMobileAlt, FaShieldAlt, FaCookieBite, FaCheckCircle, FaFileInvoice, FaInfoCircle, FaLockOpen } from 'react-icons/fa';

const AnimatedTerrain: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      meshRef.current.rotation.z = time * 0.012;
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.getAttribute('position');
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = Math.sin(x * 0.15 + time) * 0.2 + Math.cos(y * 0.15 + time) * 0.2;
        positionAttribute.setZ(i, z);
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.5, -3.5]}>
      <planeGeometry args={[32, 32, 40, 40]} />
      <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.06} />
    </mesh>
  );
};

const ViewMessage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const container = getContainer(Number(params.id)) || getContainer(0);

  const [temperature, setTemperature] = useState<string>('4.2°C');
  const [humidity, setHumidity] = useState<string>('64%');
  const [gps, setGps] = useState<string>('19.0760, 72.8777');
  const [sealStatus, setSealStatus] = useState<string>('SECURE');
  const [battery, setBattery] = useState<string>('84.2%');
  const [co2, setCo2] = useState<string>('412 ppm');
  const [wsStatus, setWsStatus] = useState<string>('CONNECTING');

  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(() => {
    return !localStorage.getItem('onikuma_cookies_confirmed');
  });
  const [selectedPrice, setSelectedPrice] = useState<number>(299.85);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('Monthly Gold Pass');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentFinalized, setPaymentFinalized] = useState<boolean>(false);
  const [activeGatewayApp, setActiveGatewayApp] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    if (!container) return;
    let socket = new WebSocket('wss://onikuma-telemetry-backend.onrender.com');
    socket.onopen = () => setWsStatus('TELEMETRY ONLINE');
    socket.onclose = () => setWsStatus('LINK DISCONNECTED');
    socket.onmessage = (event) => {
      try {
        const liveData = JSON.parse(event.data);
        if (liveData) {
          if (liveData.temperature !== undefined) setTemperature(`${Number(liveData.temperature).toFixed(1)}°C`);
          if (liveData.humidity !== undefined) setHumidity(`${Number(liveData.humidity).toFixed(0)}%`);
          if (liveData.gps) setGps(typeof liveData.gps === 'object' ? `${liveData.gps.lat.toFixed(4)}, ${liveData.gps.lng.toFixed(4)}` : liveData.gps);
          if (liveData.battery) setBattery(`${Number(liveData.battery).toFixed(1)}%`);
          if (liveData.co2) setCo2(`${liveData.co2} ppm`);
          if (liveData.seal) setSealStatus(liveData.seal);
        }
      } catch (e) { console.error(e); }
    };
    return () => socket.close();
  }, [container]);

  const confirmCookiesAcceptance = () => {
    localStorage.setItem('onikuma_cookies_confirmed', 'true');
    setShowCookieBanner(false);
  };

  const executeFinalizedPayment = (gatewayName: string) => {
    setIsProcessing(true);
    setActiveGatewayApp(gatewayName);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentFinalized(true);
      setTransactionId('TXN-' + Math.floor(100000 + Math.random() * 900000) + 'ONK');
    }, 1500);
  };

  const bgId = ((container?.id || 0) % 6) + 1;
  const currentBgImage = `assets/cargo${bgId}.png`;

  if (!container) return <IonPage><IonContent>Synchronizing Assets...</IonContent></IonPage>;

  return (
    <IonPage style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#000000', borderBottom: '2px solid #d4af37' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ '--color': '#d4af37' }} text="" />
          </IonButtons>
          <IonTitle style={{ '--color': '#ffffff', fontWeight: '800', fontSize: '0.85rem', letterSpacing: '2px', textAlign: 'center' }}>
            ONIKUMA MASTER RADAR TERMINAL
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': 'none', backgroundColor: '#020617', position: 'relative' }}>
        
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.48) 0%, rgba(2, 6, 23, 0.78) 100%), url('${currentBgImage}')`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', zIndex: 0
        }} />

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <AnimatedTerrain />
          </Canvas>
        </div>

        <div style={{ padding: '24px 24px', maxWidth: '1350px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '28px', width: '100%' }}>
            
            <div style={{ flex: '1 1 700px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ background: 'rgba(0, 0, 0, 0.45)', border: '1px solid rgba(255,255,255,0.12)', padding: '24px 28px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ color: '#00f0ff', fontWeight: '700', letterSpacing: '1.5px', display: 'block', marginBottom: '6px', fontSize: '0.65rem' }}>✦ CRITICAL SYSTEM LOGISTICS ARRAY</span>
                    <h1 style={{ fontSize: '1.7rem', color: '#ffffff', margin: '0 0 4px 0', fontWeight: '800' }}>{container.containerId}</h1>
                    <p style={{ color: '#cbd5e1', margin: '0 0 14px 0', fontSize: '0.8rem', fontWeight: '500' }}>Active Cargo Material: <span style={{ color: '#d4af37', fontWeight: '600' }}>{container.material}</span></p>
                  </div>
                  <div style={{ border: '1px solid #d4af37', padding: '6px 14px', borderRadius: '8px', textTransform: 'uppercase', fontSize: '0.6rem', color: '#cbd5e1', fontWeight: '700', textAlign: 'right', background: 'rgba(0,0,0,0.2)' }}>
                    Corporate Lead: <span style={{ color: '#ffffff', display: 'block', fontWeight: '800', marginTop: '2px' }}>CEO Rohan Elias</span>
                  </div>
                </div>
                <span style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '4px 12px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: '700' }}>
                  ● {wsStatus}
                </span>
              </div>

              <div>
                <h3 style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', margin: '0 0 12px 4px', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>✦ REAL-TIME METRIC STREAMING</h3>
                <IonGrid style={{ padding: 0 }}>
                  <IonRow>
                    <IonCol size="12" sizeSm="4" style={{ padding: '6px' }}>
                      <div style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: '700', margin: '0 0 6px 0' }}>INTERNAL TEMP</p>
                        <h2 style={{ fontSize: '1.5rem', color: '#00f0ff', fontWeight: '800', margin: 0 }}>{temperature}</h2>
                      </div>
                    </IonCol>
                    <IonCol size="12" sizeSm="4" style={{ padding: '6px' }}>
                      <div style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: '700', margin: '0 0 6px 0' }}>BARO HUMIDITY</p>
                        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: '800', margin: 0 }}>{humidity}</h2>
                      </div>
                    </IonCol>
                    <IonCol size="12" sizeSm="4" style={{ padding: '6px' }}>
                      <div style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: '700', margin: '0 0 6px 0' }}>GPS MATRIX LINK</p>
                        <h2 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '700', margin: 0, fontFamily: 'monospace', paddingTop: '2px' }}>{gps}</h2>
                      </div>
                    </IonCol>
                  </IonRow>
                  <IonRow style={{ marginTop: '4px' }}>
                    <IonCol size="12" sizeSm="4" style={{ padding: '6px' }}>
                      <div style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: '700', margin: '0 0 6px 0' }}>THERMAL SEAL</p>
                        <h2 style={{ fontSize: '1.3rem', color: '#34d399', fontWeight: '800', margin: 0 }}>{sealStatus}</h2>
                      </div>
                    </IonCol>
                    <IonCol size="12" sizeSm="4" style={{ padding: '6px' }}>
                      <div style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: '700', margin: '0 0 6px 0' }}>BATTERY RESERVE</p>
                        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: '800', margin: 0 }}>{battery}</h2>
                      </div>
                    </IonCol>
                    <IonCol size="12" sizeSm="4" style={{ padding: '6px' }}>
                      <div style={{ background: 'rgba(0, 0, 0, 0.45)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: '700', margin: '0 0 6px 0' }}>CARBON DIOXIDE</p>
                        <h2 style={{ fontSize: '1.4rem', color: '#cbd5e1', fontWeight: '800', margin: 0 }}>{co2}</h2>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                <h4 style={{ color: '#d4af37', margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaInfoCircle /> ASSET UNIT SYSTEM METADATA PROPERTY LIST
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <div>⏳ Target System ETA: <span style={{ color: '#ffffff', fontWeight: '600' }}>{container.eta}</span></div>
                  <div>🌀 Compressor VFD Speed: <span style={{ color: '#ffffff', fontWeight: '600' }}>{container.vfdSpeed}</span></div>
                  <div>📡 G-Force Structural Load: <span style={{ color: '#ffffff', fontWeight: '600' }}>{container.gForce}</span></div>
                  <div>🔒 Blockchain Ledger Hash: <span style={{ color: '#00f0ff', fontFamily: 'monospace' }}>{container.customsHash}</span></div>
                </div>
              </div>

            </div>

            <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column' }}>
              
              {!paymentFinalized && (
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ color: '#000000', fontSize: '0.9rem', fontWeight: '800', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaShieldAlt style={{ color: '#d4af37' }} /> SECURE GATEWAY CHECKOUT
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b' }}>SELECT OPERATIONS LICENSE</label>
                    <select 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.85rem', fontWeight: '600', color: '#000000' }}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSelectedPrice(val);
                        setSelectedPlanName(val === 99.98 ? 'Weekly Pass' : val === 299.85 ? 'Monthly Gold Pass' : 'Corporate Yearly Fleet');
                      }}
                      defaultValue="299.85"
                      disabled={isProcessing}
                    >
                      <option value="99.98">Weekly Corporate Sync — ₹99.98</option>
                      <option value="299.85">Monthly Gold Fleet Pass — ₹299.85</option>
                      <option value="799.69">Corporate Full Ledger Pass — ₹799.69</option>
                    </select>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #edf2f7', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', display: 'block' }}>TOTAL BALANCE COLLECTED</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#000000' }}>₹{selectedPrice}</span>
                  </div>

                  <p style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b', marginBottom: '10px' }}>INTEGRATED UPI APP LINES</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={() => executeFinalizedPayment('Google Pay')} style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <SiGooglepay style={{ fontSize: '1.4rem', color: '#4285F4' }} /> Pay via Google Pay
                    </button>
                    <button onClick={() => executeFinalizedPayment('PhonePe')} style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <FaMobileAlt style={{ fontSize: '1rem', color: '#5f259f' }} /> Pay via PhonePe
                    </button>
                    <button onClick={() => executeFinalizedPayment('Paytm')} style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      <SiPaytm style={{ fontSize: '1.8rem', color: '#00baf2' }} /> Pay via Paytm / UPI
                    </button>
                  </div>
                </div>
              )}

              {paymentFinalized && (
                <div style={{ background: 'rgba(0, 0, 0, 0.65)', border: '2px solid #34d399', borderRadius: '16px', padding: '24px', boxShadow: '0 15px 35px rgba(52, 211, 153, 0.15)', display: 'flex', flexDirection: 'column', textAlign: 'center', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                  <FaCheckCircle style={{ color: '#34d399', fontSize: '2.5rem', margin: '0 auto 10px auto' }} />
                  <h2 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>LICENSE UNLOCKED</h2>
                  <span style={{ color: '#34d399', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px' }}>{selectedPlanName.toUpperCase()} ACTIVE</span>

                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', margin: '20px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}><FaFileInvoice /> License Plan:</span>
                      <span style={{ color: '#ffffff', fontWeight: '700' }}>{selectedPlanName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600' }}>Gateway:</span>
                      <span style={{ color: '#00f0ff', fontWeight: '700' }}>{activeGatewayApp} UPI</span>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px', textAlign: 'left', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#000000', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.5px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaLockOpen style={{ color: '#d4af37' }} /> DECRYPTION COMPLETED
                    </h3>
                    <button 
                      onClick={() => alert('Manifest spreadsheet downloaded successfully under executive command of CEO Rohan Elias.')}
                      style={{ background: '#000000', color: '#ffffff', border: 'none', padding: '10px', width: '100%', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      Download Manifest Ledger
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          <footer style={{ marginTop: '48px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: '600' }}>© 2026 ONIKUMA Logistics Systems. Authored under Executive Command of CEO Rohan Elias.</span>
          </footer>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewMessage;
"Update WebSocket to live Render cloud server"
