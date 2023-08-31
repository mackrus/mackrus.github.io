import './style.css'

import * as THREE from './three_js/build/three.module.js';
import { OrbitControls } from './three_js/examples/jsm/controls/OrbitControls.js';
import { WebGLRenderer } from './three_js/build/three.module.js';


const scene = new THREE.Scene();

// Create a PerspectiveCamera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a WebGLRenderer
const renderer = new WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

// Set the pixel ratio and size of the renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set the camera position
camera.position.setZ(30);

// Render the scene with the camera
renderer.render(scene, camera);

// Create a SphereGeometry, (sun)
const geometry = new THREE.SphereGeometry(1, 200, 200);

// Create a texture for which we will load the sun image onto
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/photos/sun.jpg');

// Create a MeshBasicMaterial for the sun
const material = new THREE.MeshBasicMaterial({ map: texture });

// Create a mesh using the geometry and material
const sun = new THREE.Mesh(geometry, material);

// Add the sun to the scene
scene.add(sun);

// Add a source of light and set its position
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

// Add an Ambient light source
// Create an AmbientLight with a more suitable light color
const ambientLight = new THREE.AmbientLight(0xffffff);

// const pointLightHelper = new THREE.PointLightHelper(pointLight); // Fixed typo in variable name
//const gridHelper = new THREE.GridHelper(100, 100); 
//scene.add(gridHelper);

// Add light to the scene
scene.add(pointLight, ambientLight);

// Have the UI update camera position according to mouse actions
const controls = new OrbitControls(camera, renderer.domElement);


// Create a parent object for the sun
const sunGroup = new THREE.Object3D();
scene.add(sunGroup);

// Create child objects for each planet
const mercury = new THREE.Object3D();
const venus = new THREE.Object3D();
const earth = new THREE.Object3D();
const moon = new THREE.Object3D();
const mars = new THREE.Object3D();
const jupiter = new THREE.Object3D();
const saturn = new THREE.Object3D();
const uranus = new THREE.Object3D();
const neptune = new THREE.Object3D();
const pluto = new THREE.Object3D();


// Create the geometry for each planet, scaling is gathered from https://www2.tntech.edu/leap/astr1010/sssm.html
const mercuryGeometry = new THREE.SphereGeometry(0.04, 32, 32);
const venusGeometry = new THREE.SphereGeometry(0.12, 32, 32);
const earthGeometry = new THREE.SphereGeometry(0.12, 32, 32);
const moonGeometry = new THREE.SphereGeometry(0.01, 32, 32); // Moon
const marsGeometry = new THREE.SphereGeometry(0.06, 32, 32);
const jupiterGeometry = new THREE.SphereGeometry(0.58, 32, 32);
const saturnGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const saturnringGeometry = new THREE.RingGeometry(0.5, 0.8, 64); // The rings of Saturn
const uranusGeometry = new THREE.SphereGeometry(0.30, 32, 32);
const neptuneGeometry = new THREE.SphereGeometry(0.32, 32, 32);
const plutoGeometry = new THREE.SphereGeometry(0.03, 32, 32);



// Load textures for each planet photos are from https://www.solarsystemscope.com/textures/
const mercuryTexture = textureLoader.load('/photos/mercury.jpg');
const venusTexture = textureLoader.load('/photos/venus.jpg');
const earthTexture = textureLoader.load('/photos/earth.jpg');
const moonTexture = textureLoader.load('/photos/moon.jpg');
const marsTexture = textureLoader.load('/photos/mars.jpg');
const jupiterTexture = textureLoader.load('/photos/jupiter.jpg');
const saturnTexture = textureLoader.load('/photos/saturn.jpg');
const saturnringTexture = textureLoader.load('/photos/saturn_ring.png')
const uranusTexture = textureLoader.load('/photos/uranus.jpg');
const neptuneTexture = textureLoader.load('/photos/neptune.jpg');
const plutoTexture = textureLoader.load('/photos/pluto.jpg');

// Create materials for each planet
const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const jupiterMaterial = new THREE.MeshBasicMaterial({ map: jupiterTexture });
const saturnMaterial = new THREE.MeshBasicMaterial({ map: saturnTexture });
const saturnringMaterial = new THREE.MeshBasicMaterial({ map: saturnringTexture, side: THREE.DoubleSide }); // For Saturn
const uranusMaterial = new THREE.MeshBasicMaterial({ map: uranusTexture });
const neptuneMaterial = new THREE.MeshBasicMaterial({ map: neptuneTexture });
const plutoMaterial = new THREE.MeshBasicMaterial({ map: plutoTexture });





// Create meshes for each planet using the geometry
const mercuryMesh = new THREE.Mesh(mercuryGeometry, material);
const venusMesh = new THREE.Mesh(venusGeometry, material);
const earthMesh = new THREE.Mesh(earthGeometry, material);
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
const marsMesh = new THREE.Mesh(marsGeometry, material);
const jupiterMesh = new THREE.Mesh(jupiterGeometry, material);
const saturnMesh = new THREE.Mesh(saturnGeometry, material);
const saturnringMesh = new THREE.Mesh(saturnringGeometry, saturnringMaterial);
const uranusMesh = new THREE.Mesh(uranusGeometry, material);
const neptuneMesh = new THREE.Mesh(neptuneGeometry, material);
const plutoMesh = new THREE.Mesh(plutoGeometry, material);

// Apply the materials to the meshes of each planet
mercuryMesh.material = mercuryMaterial;
venusMesh.material = venusMaterial;
earthMesh.material = earthMaterial;
marsMesh.material = marsMaterial;
jupiterMesh.material = jupiterMaterial;
saturnMesh.material = saturnMaterial;
saturnringMesh.material = saturnringMaterial;
uranusMesh.material = uranusMaterial;
neptuneMesh.material = neptuneMaterial;
plutoMesh.material = plutoMaterial;


// Add the meshes to their respective planet objects
mercury.add(mercuryMesh);
venus.add(venusMesh);
earth.add(earthMesh);
moon.add(moonMesh);
earth.add(moon);
mars.add(marsMesh);
jupiter.add(jupiterMesh);
saturn.add(saturnMesh);
saturn.add(saturnringMesh);
uranus.add(uranusMesh);
neptune.add(neptuneMesh);
pluto.add(plutoMesh);



// Set the positions of the planets relative to the sun scale from https://www2.tntech.edu/leap/astr1010/sssm.html
mercury.position.set(1.45, 0, 0);
venus.position.set(2.275, 0, 0);
earth.position.set(3.75, 0, 0);
moonMesh.position.set(0.2, 0, 0); // Relative to Earth
mars.position.set(5.75, 0, 0);
jupiter.position.set(13.5, 0, 0);
saturn.position.set(18, 0, 0);
saturnringMesh.position.set(0, 0, 0); // Relative to saturn
uranus.position.set(22, 0, 0);
neptune.position.set(28, 0, 0);
pluto.position.set(32, 0, 0);

// Set the angle of the rings relative to the xy-plane
saturnringMesh.rotation.x = Math.PI / 2.3; // Rotate around the x-axis

// Add the child objects to the sun group
sunGroup.add(mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto);

const orbitalSpeed = 3

// Adding orbits for each planet
const mercuryOrbit = {
  semiMajorAxis: 1.45, // Distance from the sun
  eccentricity: 0.2056, // How elliptical the orbit is
  orbitalPeriod: 0.44 / orbitalSpeed, // Time taken to complete one orbit in days
};

// Venus orbital
const venusOrbit = {
  semiMajorAxis: 2.275,
  eccentricity: 0.0068,
  orbitalPeriod: 0.625 / orbitalSpeed,
};

// Earth orbital
const earthOrbit = {
  semiMajorAxis: 3.75,
  eccentricity: 0.0167,
  orbitalPeriod: 0.25 / orbitalSpeed,
};

// Moon orbital
const moonOrbit = {
  semiMajorAxis: 0.5,
  eccentricity: 0.02,
  orbitalPeriod: 0.05 / orbitalSpeed

}

// Mars orbital
const marsOrbit = {
  semiMajorAxis: 5.75,
  eccentricity: 0.0934,
  orbitalPeriod: 0.49 / orbitalSpeed,
};

// Jupiter orbital
const jupiterOrbit = {
  semiMajorAxis: 13.5,
  eccentricity: 0.0489,
  orbitalPeriod: 2.75 / orbitalSpeed,
};

// Saturn orbital
const saturnOrbit = {
  semiMajorAxis: 18,
  eccentricity: 0.0565,
  orbitalPeriod: 7.52 / orbitalSpeed,
};

// Uranus orbital
const uranusOrbit = {
  semiMajorAxis: 22,
  eccentricity: 0.0463,
  orbitalPeriod: 22.01 / orbitalSpeed,
};

// Neptune orbital
const neptuneOrbit = {
  semiMajorAxis: 28,
  eccentricity: 0.0097,
  orbitalPeriod: 41.79 / orbitalSpeed,
};

// Pluto orbital
const plutoOrbit = {
  semiMajorAxis: 32,
  eccentricity: 0.2488,
  orbitalPeriod: 62.59 / orbitalSpeed,
};



// Animation function that renders continually as a loop
function animate() {
  requestAnimationFrame(animate);
  // Sun rotations around own axis
  sun.rotation.x += 0.0001;
  sun.rotation.y += 0.0005;
  sun.rotation.z += 0.0001;

  // Mercury rotation around own axis
  mercury.rotation.x += 0.01;
  mercury.rotation.y += 0.05;
  mercury.rotation.z += 0.00001;



  // Venus rotation around own axis
  venus.rotation.x += 0.007;
  venus.rotation.y += 0.045;
  venus.rotation.z += 0.00001;

  // 

  // Earth rotation around own axis
  earth.rotation.x += 0.000005;
  earth.rotation.y += 0.01;
  earth.rotation.z += 0.001;

  // Moon rotation around own axis
  moon.rotation.x += 0.000;
  moon.rotation.y += 0.0;
  moon.rotation.z += 0.0000;

  // Mars rotation around own axis
  mars.rotation.x += 0.001;
  mars.rotation.y += 0.005;
  mars.rotation.z += 0.0001;

  // Jupiter rotation around own axis
  jupiter.rotation.x += 0.001;
  jupiter.rotation.y += 0.005;
  jupiter.rotation.z += 0.0001;

  // Saturn rotation around own axis
  saturn.rotation.x += 0.00005;
  saturn.rotation.y += 0.005;
  saturn.rotation.z += 0.00001;

  // Uranus rotation around own axis
  uranus.rotation.x += 0.00001;
  uranus.rotation.y += 0.00005;
  uranus.rotation.z += 0.0001;

  // Neptune rotation around own axis
  neptune.rotation.x += 0.00001;
  neptune.rotation.y += 0.00005;
  neptune.rotation.z += 0.000001;

  // Pluto rotation around own axis
  pluto.rotation.x += 0.000001;
  pluto.rotation.y += 0.000005;
  pluto.rotation.z += 0.0000001;

  // Mercury orbital
  const angle = (Date.now() / (mercuryOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const x = mercuryOrbit.semiMajorAxis * Math.cos(angle);
  const z = mercuryOrbit.semiMajorAxis * Math.sin(angle);
  mercury.position.set(x, 0, z);

  // Venus orbital
  const venusAngle = (Date.now() / (venusOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const venusX = venusOrbit.semiMajorAxis * Math.cos(venusAngle);
  const venusZ = venusOrbit.semiMajorAxis * Math.sin(venusAngle);
  venus.position.set(venusX, 0, venusZ);

  // Earth orbital
  const earthAngle = (Date.now() / (earthOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const earthX = earthOrbit.semiMajorAxis * Math.cos(earthAngle);
  const earthZ = earthOrbit.semiMajorAxis * Math.sin(earthAngle);
  earth.position.set(earthX, 0, earthZ);

  // Moon orbital
  const moonAngle = (Date.now() / (moonOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const moonX = moonOrbit.semiMajorAxis * Math.cos(moonAngle);
  const moonZ = moonOrbit.semiMajorAxis * Math.sin(moonAngle);
  moon.position.set(moonX, 0, moonZ)

  // Mars orbital
  const marsAngle = (Date.now() / (marsOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const marsX = marsOrbit.semiMajorAxis * Math.cos(marsAngle);
  const marsZ = marsOrbit.semiMajorAxis * Math.sin(marsAngle);
  mars.position.set(marsX, 0, marsZ);

  // Jupiter orbital
  const jupiterAngle = (Date.now() / (jupiterOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const jupiterX = jupiterOrbit.semiMajorAxis * Math.cos(jupiterAngle);
  const jupiterZ = jupiterOrbit.semiMajorAxis * Math.sin(jupiterAngle);
  jupiter.position.set(jupiterX, 0, jupiterZ);

  // Saturn orbital
  const saturnAngle = (Date.now() / (saturnOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const saturnX = saturnOrbit.semiMajorAxis * Math.cos(saturnAngle);
  const saturnZ = saturnOrbit.semiMajorAxis * Math.sin(saturnAngle);
  saturn.position.set(saturnX, 0, saturnZ);

  // Uranus orbital
  const uranusAngle = (Date.now() / (uranusOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const uranusX = uranusOrbit.semiMajorAxis * Math.cos(uranusAngle);
  const uranusZ = uranusOrbit.semiMajorAxis * Math.sin(uranusAngle);
  uranus.position.set(uranusX, 0, uranusZ);

  // Neptune orbital
  const neptuneAngle = (Date.now() / (neptuneOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const neptuneX = neptuneOrbit.semiMajorAxis * Math.cos(neptuneAngle);
  const neptuneZ = neptuneOrbit.semiMajorAxis * Math.sin(neptuneAngle);
  neptune.position.set(neptuneX, 0, neptuneZ);

  // Pluto orbital
  const plutoAngle = (Date.now() / (plutoOrbit.orbitalPeriod * 24 * 60 * 60)) * Math.PI * 2;
  const plutoX = plutoOrbit.semiMajorAxis * Math.cos(plutoAngle);
  const plutoZ = plutoOrbit.semiMajorAxis * Math.sin(plutoAngle);
  pluto.position.set(plutoX, 0, plutoZ);

  //   



  controls.update();
  renderer.render(scene, camera);
}

// Make a function to generate small spheres or "star"
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 20, 20);
  const material = new THREE.MeshStandardMaterial({ color: 0x00FFFF, emissive: 0xffffff, emissiveIntensity: 0.3 });

  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(2000));

  star.position.set(x, y, z);
  scene.add(star);
}
// Call the addstar function Array(#) number of times
Array(1000).fill().forEach(addStar)


// Make a function to move the camera perspective
function moveCamera() {
  const move = document.body.getBoundingClientRect().top;

  // Calculate the distance from the sun
  const distance = 3 * sun.geometry.parameters.radius;

  // Calculate the angle based on the scroll position
  const angle = move * 0.0015;

  // Calculate the new position of the camera in a spiral pattern
  const x = distance * Math.cos(angle);
  const y = move * 0.002;
  const z = distance * Math.sin(angle);

  // Set the position of the camera
  camera.position.set(x, y, z);
}

document.body.onscroll = moveCamera;

// start the animation
animate();