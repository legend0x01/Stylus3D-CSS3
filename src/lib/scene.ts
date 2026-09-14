import * as THREE from "three";

/** Mutable bridge between the DOM scroll loop and the R3F render loop.
 *  Written every frame by App, read by the scene — no React re-renders. */
export const sceneState = {
  progress: 0,
  mx: 0,
  my: 0,
  accent: new THREE.Color("#C6F24E"),
  accentTarget: new THREE.Color("#C6F24E"),
  /** 0 = fully modelled light, 1 = flat poster light (brutalism / swiss) */
  flat: 0,
  flatTarget: 0,
  /** 0 = dark bench, 1 = lit bench */
  light: 0,
  lightTarget: 0,
  reduced: false,
  intro: 0,
};

/* Camera spline — travels down a shallow S through the primitive field */
export const CAMERA_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0.4, 11),
    new THREE.Vector3(-2.6, 1.4, 7.4),
    new THREE.Vector3(2.4, -1.0, 3.2),
    new THREE.Vector3(-2.2, 1.6, -1.4),
    new THREE.Vector3(2.8, -1.4, -5.6),
    new THREE.Vector3(-1.6, 0.9, -10.2),
    new THREE.Vector3(1.8, -0.6, -15.0),
    new THREE.Vector3(-2.4, 1.2, -19.6),
    new THREE.Vector3(2.0, -1.2, -24.2),
    new THREE.Vector3(-1.0, 0.6, -29.0),
    new THREE.Vector3(0, 0, -34.0),
  ],
  false,
  "catmullrom",
  0.4,
);
