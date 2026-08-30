import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  Text,
} from "@react-three/drei";
import type { Group } from "three";
import heroBg from "../../assets/hero-background.jpg";

const RED = "#df1930";
const BLUE = "#2456e8";
const NAVY = "#17223f";
const WHITE = "#ffffff";

type TubVariant = {
  body: string;
  band: string;
  lid: string;
  label: string;
  accent: string;
  name: string;
};

const VARIANTS = {
  signature: { body: RED, band: NAVY, lid: BLUE, label: WHITE, accent: BLUE, name: "SIGNATURE" },
  isolate: { body: WHITE, band: BLUE, lid: NAVY, label: WHITE, accent: RED, name: "ISOLATE" },
  ignition: { body: BLUE, band: NAVY, lid: RED, label: WHITE, accent: RED, name: "IGNITION" },
} satisfies Record<string, TubVariant>;

function ProductTub({
  variant = "signature",
  scale = 1,
  spin = true,
}: {
  variant?: keyof typeof VARIANTS;
  scale?: number;
  spin?: boolean;
}) {
  const ref = useRef<Group>(null);
  const colors = VARIANTS[variant] ?? VARIANTS["signature"];

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    if (spin) g.rotation.y += dt * 0.42;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9 + scale) * 0.07;
  });

  return (
    <group ref={ref} scale={scale}>
      {/* body */}
      <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.05, 0.95, 2.1, 64]} />
        <meshStandardMaterial color={colors.body} metalness={0.35} roughness={0.3} />
      </mesh>

      {/* label band */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.062, 1.005, 0.95, 64]} />
        <meshStandardMaterial color={colors.band} metalness={0.25} roughness={0.45} />
      </mesh>

      {/* accent stripes */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.07, 1.055, 0.1, 64]} />
        <meshStandardMaterial color={colors.accent} metalness={0.55} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[1.02, 1.0, 0.1, 64]} />
        <meshStandardMaterial color={colors.accent} metalness={0.55} roughness={0.22} />
      </mesh>

      {/* lid */}
      <mesh castShadow position={[0, 1.08, 0]}>
        <cylinderGeometry args={[1.12, 1.12, 0.36, 64]} />
        <meshStandardMaterial color={colors.lid} metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.28, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.06, 64]} />
        <meshStandardMaterial color={colors.band} roughness={0.55} />
      </mesh>

      {/* wordmark on the label */}
      <Text
        position={[0, -0.02, 1.075]}
        fontSize={0.17}
        letterSpacing={0.06}
        color={colors.label}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
        textAlign="center"
      >
        KUMAR & KUMAR{"\n"}SPORTS
      </Text>
      <Text
        position={[0, -0.42, 1.075]}
        fontSize={0.085}
        letterSpacing={0.24}
        color={colors.accent}
        anchorX="center"
        anchorY="middle"
      >
        {colors.name} FORMULA
      </Text>
    </group>
  );
}

function OrbitingShowcase() {
  const ref = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    g.rotation.y += dt * 0.22;
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.035;
  });

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.45]}>
        <torusGeometry args={[2.35, 0.018, 12, 96]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.42} />
      </mesh>
      <Float speed={1.3} rotationIntensity={0.55} floatIntensity={0.8}>
        <group position={[-2.15, 0.95, -0.5]}>
          <ProductTub variant="isolate" scale={0.42} />
        </group>
      </Float>
      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.1}>
        <group position={[2.15, -0.65, -0.35]}>
          <ProductTub variant="ignition" scale={0.38} />
        </group>
      </Float>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.75}>
        <mesh position={[1.75, 1.48, -1.1]} castShadow>
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color={RED} metalness={0.55} roughness={0.24} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.7}>
        <mesh position={[-1.75, -1.2, -0.75]} castShadow>
          <torusGeometry args={[0.28, 0.07, 20, 48]} />
          <meshStandardMaterial color={BLUE} metalness={0.7} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene({ scrollRef }: { scrollRef?: { current: number } }) {
  const { camera } = useThree();
  const root = useRef<Group>(null);

  useFrame((state, delta) => {
    const s = scrollRef?.current ?? 0;

    // smooth camera position based on scroll
    const targetZ = 6.1 - s * 2.5; // zoom in on scroll
    const targetY = 0.6 - s * 0.6; // move camera down on scroll
    const targetX = (state.mouse.x * 0.6) - (s - 0.5) * 0.6; // subtle x parallax from pointer + scroll

    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    // gently tilt the whole scene for depth
    if (root.current) {
      root.current.rotation.x += ((-s * 0.25) - root.current.rotation.x) * 0.06;
      root.current.rotation.y += (state.clock.elapsedTime * 0.01 - root.current.rotation.y) * 0.02;
    }
  });

  return (
    <>
      <group ref={root}>
      <color attach="background" args={["#00000000"]} />
      <ambientLight intensity={1.05} />
      <directionalLight
        position={[4, 7, 6]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-4, 2, 4]} intensity={22} color={BLUE} />
      <pointLight position={[4, -1, 3]} intensity={18} color={RED} />

        <ProductTub />
        <OrbitingShowcase />

        <ContactShadows position={[0, -1.5, 0]} opacity={0.25} scale={8} blur={2.8} far={4} />

        <Environment>
        <Lightformer intensity={3.5} position={[0, 5, 2]} scale={[8, 8, 1]} />
        <Lightformer
          intensity={1.8}
          color={BLUE}
          position={[-4, 1, 1]}
          rotation-y={Math.PI / 2}
          scale={[12, 3, 1]}
        />
        <Lightformer
          intensity={1.5}
          color={RED}
          position={[4, 0, 1]}
          rotation-y={-Math.PI / 2}
          scale={[12, 3, 1]}
        />
      </Environment>

      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
           minPolarAngle={Math.PI / 3.2}
           maxPolarAngle={Math.PI / 1.85}
           autoRotate
           autoRotateSpeed={0.35}
      />
    </>
  );
}

export function Hero3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);
  const orbA = useRef<HTMLDivElement | null>(null);
  const orbB = useRef<HTMLDivElement | null>(null);
  useEffect(() => setMounted(true), []);

  // update normalized scroll value (0..1) based on viewport height for parallax
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      const v = Math.min(1, y / window.innerHeight);
      scrollRef.current = v;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // update orb positions on animation frame for smoothness
  useEffect(() => {
    let raf = 0;
    function tick() {
      const s = scrollRef.current;
      if (orbA.current) {
        orbA.current.style.transform = `translate3d(${-(s * 40)}px, ${-(s * 18)}px, 0)`;
      }
      if (orbB.current) {
        orbB.current.style.transform = `translate3d(${s * 36}px, ${s * 22}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div 
      className={"hero-stage relative h-[28rem] w-full overflow-hidden rounded-lg sm:h-[36rem] " + className}
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {mounted && (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.6, 6.1], fov: 43 }}
          gl={{ alpha: true, antialias: true }}
          className="relative"
        >
          <Suspense fallback={null}>
            <Scene scrollRef={scrollRef} />
          </Suspense>
        </Canvas>
      )}
      {/* Foreground orbs and shine overlay to amplify 3D depth */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={orbA as any}
          className="hero-orb"
          style={{
            width: 220,
            height: 220,
            background: "radial-gradient(circle at 30% 30%, rgba(36,86,232,0.18), rgba(36,86,232,0.02))",
            left: "6%",
            top: "10%",
          }}
        />
        <div
          ref={orbB as any}
          className="hero-orb"
          style={{
            width: 320,
            height: 320,
            background: "radial-gradient(circle at 70% 70%, rgba(223,25,48,0.14), rgba(223,25,48,0.02))",
            right: "8%",
            bottom: "6%",
          }}
        />
        <div className="hero-shine" />
      </div>
    </div>
  );
}
