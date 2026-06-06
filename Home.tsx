import React, { useRef, useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { getContainers } from '../data/messages';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FaServer } from 'react-icons/fa';

const HomeAnimatedTerrain: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      meshRef.current.rotation.z = time * 0.01;
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
    <mesh ref={meshRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -3, -4]}>
      <planeGeometry args={[40, 40, 30, 30]} />
      <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.06} />
    </mesh>
  );
};

const Home: React.FC = () => {
  const containers = getContainers();

  const backgroundCollection = [
    'assets/cargo1.png',
    'assets/cargo2.png',
    'assets/cargo3.png',
    'assets/cargo4.png',
    'assets/cargo5.png',
    'assets/cargo6.png',
    'assets/cargo7.png'
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundCollection.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [backgroundCollection.length]);

  return (
    <IonPage style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#000000', borderBottom: '2px solid #d4af37' }}>
          <IonTitle style={{ '--color': '#ffffff', fontWeight: '900', fontSize: '1rem', letterSpacing: '2px' }}>
            👑 ONIKUMA PLATINUM ENTERPRISE PORTAL
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': 'none', backgroundColor: '#020617', position: 'relative' }}>
        
        {/* Dynamic Background Image Cycle Engine */}
        {backgroundCollection.map((bgImage, idx) => (
          <div
            key={bgImage}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.5) 0%, rgba(2, 6, 23, 0.75) 100%), url('${bgImage}')`,
              backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
              zIndex: 0, opacity: currentBgIndex === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
          />
        ))}

        {/* Lightweight 3D Vector Layer */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <HomeAnimatedTerrain />
          </Canvas>
        </div>

        {/* Workspace Layout Content Container */}
        <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Executive Section Header: Frosted Glass Modality */}
          <div style={{ background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '20px 28px', borderRadius: '16px', marginBottom: '36px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ color: '#00f0ff', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '2px', display: 'block', marginBottom: '4px' }}>✦ EXECUTIVE DIRECTIVE</span>
              <h2 style={{ color: '#ffffff', margin: 0, fontWeight: '800', fontSize: '1.3rem' }}>Onikuma Cold-Chain Global Matrix</h2>
              <p style={{ color: '#cbd5e1', margin: '4px 0 0 0', fontSize: '0.8rem', fontWeight: '500' }}>Automated high-frequency telemetry infrastructure designed for smart reefer networks.</p>
            </div>
            <div style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid #d4af37', padding: '10px 18px', borderRadius: '10px', textAlign: 'right' }}>
              <span style={{ color: '#d4af37', fontSize: '0.65rem', fontWeight: '800', display: 'block', letterSpacing: '1px' }}>FOUNDER & CEO</span>
              <span style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '800' }}>Rohan Elias</span>
            </div>
          </div>

          {/* Frosted Responsive Data Matrix Grid */}
          <IonGrid style={{ padding: 0 }}>
            <IonRow style={{ margin: '-14px' }}>
              {containers.map((c) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={c.id} style={{ padding: '14px' }}>
                  <a 
                    href={`/message/${c.id}`}
                    style={{ 
                      textDecoration: 'none', display: 'block', position: 'relative', borderRadius: '16px',
                      background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', height: '190px', transition: 'transform 0.3s ease'
                    }}
                    className="fluid-hover-card"
                  >
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#ffffff', fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{c.containerId}</span>
                        <span style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.6rem', fontWeight: '700' }}>NEON ACTIVE</span>
                      </div>

                      <div>
                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.7rem', fontWeight: '700' }}>CARGO CONTENT MANIFEST</p>
                        <h2 style={{ color: '#ffffff', margin: '2px 0 10px 0', fontSize: '1.1rem', fontWeight: '700' }}>{c.material}</h2>
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 0 8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#cbd5e1', fontSize: '0.7rem', fontWeight: '600' }}>⚡ HUMIDITY: {c.humidity}</span>
                          <span style={{ color: '#d4af37', fontSize: '1.25rem', fontWeight: '900' }}>{c.temperature}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          {/* Infrastructure Server Blueprints Panel */}
          <div style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginTop: '36px' }}>
            <h4 style={{ color: '#d4af37', margin: '0 0 16px 0', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaServer /> CENTRAL SERVER BLUEPRINT INSTANCE INFRASTRUCTURE
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', display: 'block' }}>COMPUTE CORE AVAILABILITY</span>
                <span style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>99.998% Uptime ULR</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', display: 'block' }}>PACKET LATENCY CAP</span>
                <span style={{ color: '#00f0ff', fontSize: '1.1rem', fontWeight: '700' }}>12ms High-Freq Stream</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', display: 'block' }}>ENCRYPTION STANDARD</span>
                <span style={{ color: '#34d399', fontSize: '1.1rem', fontWeight: '700' }}>AES-256 GCM Secure</span>
              </div>
            </div>
          </div>

          <footer style={{ marginTop: '48px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '600' }}>© 2026 ONIKUMA Logistics Systems. Authored under Executive Command of CEO Rohan Elias.</span>
          </footer>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;