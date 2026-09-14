import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_PATH, sceneState } from "../lib/scene";

/* -------------------------------------------------------------- field */

function Starfield() {
  const geo = useMemo(() => {
    const N = 520;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const a = new THREE.Color("#C6F24E");
    const b = new THREE.Color("#4EC9F5");
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 34;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = 12 - Math.random() * 58;
      const c = Math.random() > 0.6 ? a : b;
      const f = 0.35 + Math.random() * 0.65;
      col[i * 3] = c.r * f;
      col[i * 3 + 1] = c.g * f;
      col[i * 3 + 2] = c.b * f;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial size={0.075} vertexColors sizeAttenuation transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

/* A hairline engraved grid plane — the "bench" the primitives sit on */
function Bench() {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => {
    const pts: number[] = [];
    const S = 26;
    const step = 2;
    for (let i = -S; i <= S; i += step) {
      pts.push(-S, -4.6, i, S, -4.6, i);
      pts.push(i, -4.6, -S, i, -4.6, S);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame(() => {
    if (ref.current) {
      const m = ref.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.16 * (1 - sceneState.flat * 0.75) * (1 - sceneState.light * 0.4);
    }
  });

  return (
    <lineSegments ref={ref} geometry={geo} position={[0, 0, -12]} frustumCulled={false}>
      <lineBasicMaterial color="#3E4C5C" transparent opacity={0.16} depthWrite={false} />
    </lineSegments>
  );
}

/* ----------------------------------------------------------- primitives */

type Kind = "glass" | "clay" | "brut" | "neon" | "metal" | "lime" | "wire";

interface Piece {
  pos: [number, number, number];
  scale: number;
  kind: Kind;
  spin: [number, number, number];
}

const PIECES: Piece[] = [
  { pos: [-3.4, 1.5, 6.2], scale: 1.15, kind: "glass", spin: [0.2, 0.35, 0.1] },
  { pos: [3.6, -1.6, 4.0], scale: 1.0, kind: "clay", spin: [0.15, -0.3, 0.22] },
  { pos: [-3.0, -1.9, 1.2], scale: 0.95, kind: "brut", spin: [-0.25, 0.28, 0.14] },
  { pos: [3.2, 2.0, -0.6], scale: 0.85, kind: "neon", spin: [0.3, 0.2, -0.18] },
  { pos: [-3.6, 1.1, -4.0], scale: 1.25, kind: "metal", spin: [0.12, -0.22, 0.1] },
  { pos: [3.5, -1.2, -7.4], scale: 1.0, kind: "lime", spin: [-0.18, 0.3, 0.24] },
  { pos: [-3.1, 2.2, -11.0], scale: 1.05, kind: "glass", spin: [0.24, 0.18, -0.12] },
  { pos: [3.0, 1.6, -15.0], scale: 0.9, kind: "clay", spin: [0.2, -0.26, 0.16] },
  { pos: [-3.5, -1.5, -18.6], scale: 1.1, kind: "brut", spin: [-0.22, 0.32, 0.1] },
  { pos: [2.8, -2.0, -22.6], scale: 1.0, kind: "neon", spin: [0.28, 0.22, -0.2] },
  { pos: [-2.6, 1.8, -26.6], scale: 1.15, kind: "metal", spin: [0.16, -0.28, 0.18] },
  { pos: [0, 0.2, -31.5], scale: 1.7, kind: "wire", spin: [0.14, 0.24, 0.08] },
];

function geometryFor(kind: Kind): THREE.BufferGeometry {
  switch (kind) {
    case "glass":
      return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case "clay":
      return new THREE.SphereGeometry(0.95, 26, 20);
    case "brut":
      return new THREE.BoxGeometry(1.6, 1.15, 1.15);
    case "neon":
      return new THREE.TorusGeometry(0.78, 0.24, 12, 34);
    case "metal":
      return new THREE.IcosahedronGeometry(1.05, 0);
    case "lime":
      return new THREE.TorusKnotGeometry(0.62, 0.2, 74, 10);
    case "wire":
      return new THREE.IcosahedronGeometry(1.7, 1);
  }
}

function Piece({ piece, index }: { piece: Piece; index: number }) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const phase = index * 0.83;

  const geo = useMemo(() => geometryFor(piece.kind), [piece.kind]);
  const wireGeo = useMemo(() => new THREE.WireframeGeometry(geo), [geo]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const red = sceneState.reduced;
    const spin = red ? 0 : 1;

    g.rotation.x += piece.spin[0] * 0.006 * spin;
    g.rotation.y += piece.spin[1] * 0.006 * spin;
    g.rotation.z += piece.spin[2] * 0.004 * spin;
    g.position.y = piece.pos[1] + (red ? 0 : Math.sin(t * 0.55 + phase) * 0.24);
    const intro = sceneState.intro;
    g.scale.setScalar(piece.scale * (0.2 + intro * 0.8));
    g.position.z = piece.pos[2] + (1 - intro) * 5.5;
  });

  const material = () => {
    switch (piece.kind) {
      case "glass":
        return (
          <meshStandardMaterial
            ref={mat}
            color="#CFE6F5"
            transparent
            opacity={0.32}
            roughness={0.08}
            metalness={0.15}
            envMapIntensity={1}
          />
        );
      case "clay":
        return <meshStandardMaterial ref={mat} color="#FF8A5B" roughness={1} metalness={0} flatShading={false} />;
      case "brut":
        return <meshStandardMaterial ref={mat} color="#FFD43B" roughness={0.95} metalness={0} flatShading />;
      case "neon":
        return (
          <meshStandardMaterial
            ref={mat}
            color="#0A0C12"
            emissive="#FF3DF0"
            emissiveIntensity={1.7}
            roughness={0.4}
            metalness={0.2}
          />
        );
      case "metal":
        return <meshStandardMaterial ref={mat} color="#8A929C" roughness={0.32} metalness={0.85} flatShading />;
      case "lime":
        return (
          <meshStandardMaterial
            ref={mat}
            color="#1A2008"
            emissive="#C6F24E"
            emissiveIntensity={1.15}
            roughness={0.5}
            metalness={0.1}
          />
        );
      case "wire":
        return (
          <meshStandardMaterial
            ref={mat}
            color="#0B0D10"
            emissive="#C6F24E"
            emissiveIntensity={0.55}
            roughness={0.6}
            metalness={0.3}
            wireframe
          />
        );
    }
  };

  return (
    <group ref={ref} position={piece.pos} scale={piece.scale}>
      <mesh geometry={geo} frustumCulled={false}>
        {material()}
      </mesh>
      {(piece.kind === "glass" || piece.kind === "metal") && (
        <lineSegments geometry={wireGeo} frustumCulled={false}>
          <lineBasicMaterial
            color={piece.kind === "glass" ? "#4EC9F5" : "#C6F24E"}
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}

/* ------------------------------------------------------------ lighting */

function Lights() {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const acc = useRef<THREE.PointLight>(null);

  useFrame((state, dt) => {
    const k = Math.min(1, dt * 2.4);
    sceneState.accent.lerp(sceneState.accentTarget, k);
    sceneState.flat += (sceneState.flatTarget - sceneState.flat) * k;
    sceneState.light += (sceneState.lightTarget - sceneState.light) * k;

    const t = state.clock.elapsedTime;
    const f = sceneState.flat;
    const L = sceneState.light;

    if (amb.current) amb.current.intensity = 0.28 + f * 1.5 + L * 0.9;
    if (key.current) {
      key.current.intensity = 2.4 * (1 - f * 0.72) + L * 0.6;
      key.current.color.copy(sceneState.accent).lerp(new THREE.Color("#ffffff"), 0.55 + f * 0.4);
    }
    if (rim.current) {
      rim.current.intensity = (26 + f * 40) * (1 - f * 0.35);
      rim.current.color.copy(sceneState.accent);
    }
    if (acc.current) {
      acc.current.position.set(Math.sin(t * 0.3) * 8, 3.4, Math.cos(t * 0.3) * 8 - 10);
      acc.current.intensity = 16 + f * 22;
      acc.current.color.copy(sceneState.accent);
    }
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.28} />
      <directionalLight ref={key} position={[6, 9, 6]} intensity={2.4} />
      <pointLight ref={rim} position={[-8, -3, -14]} distance={40} decay={2} />
      <pointLight ref={acc} position={[0, 3.4, -10]} distance={34} decay={2} />
      <pointLight position={[4, 6, 8]} intensity={12} color="#4EC9F5" distance={26} decay={2} />
    </>
  );
}

/* --------------------------------------------------------------- camera */

function Rig() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const intro = useRef(0);

  useFrame((state, dt) => {
    const k = Math.min(1, dt * 2.2);

    if (!sceneState.reduced) {
      intro.current = Math.min(1, intro.current + dt * 0.62);
    } else {
      intro.current = 1;
    }
    sceneState.intro = intro.current;

    const p = Math.max(0, Math.min(1, sceneState.progress));
    const eased = 1 - Math.pow(1 - p, 1.7);

    const target = CAMERA_PATH.getPointAt(eased);
    const ahead = CAMERA_PATH.getPointAt(Math.min(0.999, eased + 0.035));

    const par = sceneState.reduced ? 0 : 1;
    const tx = target.x + sceneState.mx * 0.7 * par;
    const ty = target.y + sceneState.my * 0.45 * par;
    const tz = target.z + (1 - intro.current) * 4.2;

    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;

    look.current.lerp(ahead, k * 0.9);
    camera.lookAt(look.current.x * 0.55, look.current.y * 0.55, look.current.z);

    const cam = camera as THREE.PerspectiveCamera;
    cam.rotation.z += (sceneState.mx * 0.035 * par - cam.rotation.z) * k;
    const fov = 44 - eased * 6 + (1 - intro.current) * 8;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * k;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

/* --------------------------------------------------------------- export */

export default function Scene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 15], fov: 44, near: 0.1, far: 90 }}
      frameloop={reduced ? "demand" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <Lights />
      <Rig />
      <Starfield />
      <Bench />
      {PIECES.map((p, i) => (
        <Piece key={i} piece={p} index={i} />
      ))}
    </Canvas>
  );
}
