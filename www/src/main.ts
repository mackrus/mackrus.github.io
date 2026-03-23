import * as THREE from "three";
// @ts-ignore
import init, { SolarSystem, generate_stars } from "./pkg/wasm_crate.js";

async function main() {
    await init();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#bg") as HTMLCanvasElement,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Initial camera position
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const PointLight = new THREE.PointLight(0xffffff, 2);
    PointLight.position.set(0, 0, 0); 
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(PointLight, ambientLight);

    const planetMeshes: { [key: string]: THREE.Group } = {};
    const planetSpheres: { [key: string]: THREE.Mesh } = {};
    const satelliteMeshes: { [key: string]: THREE.Mesh } = {};

    // Create Sun and its satellite
    const sunGroup = new THREE.Group();
    sunGroup.name = "SunGroup";
    scene.add(sunGroup);

    function createSunTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d")!;

        ctx.fillStyle = "#FFD700";
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const rad = 40 + Math.random() * 100;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
            grad.addColorStop(0, "rgba(255, 140, 0, 0.5)");
            grad.addColorStop(1, "rgba(255, 140, 0, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    const sunGeometry = new THREE.SphereGeometry(5, 128, 128);
    const sunMaterial = new THREE.MeshPhysicalMaterial({ 
        map: createSunTexture(),
        emissive: 0xFF8C00,
        emissiveIntensity: 1.5,
        roughness: 0.3,
        metalness: 0.1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = "Sun";
    sun.userData.originalEmissive = new THREE.Color(0xFF8C00);
    sun.userData.originalIntensity = 1.5;
    sunGroup.add(sun);

    // Add a soft corona glow
    const coronaGeometry = new THREE.SphereGeometry(5.3, 64, 64);
    const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF8C00,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(corona);

    // WASM Solar System
    const solarSystem = new SolarSystem();
    // Add "Sun" as a planet-like entity to WASM so it can have satellites
    solarSystem.add_planet("Sun", 0, 1, 0, 0.01, 0, 0xFFD700);

    // Create Station-01 (Sun's satellite)
    const stationName = "Station-01";
    solarSystem.add_satellite("Sun", stationName, 8, 0.4, 0.0, 0.05, 0.0, 0xffffff);
    const stationGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); 
    const stationMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8
    });
    const stationMesh = new THREE.Mesh(stationGeometry, stationMaterial);
    stationMesh.name = stationName;
    stationMesh.userData.originalEmissive = new THREE.Color(0xffffff);
    stationMesh.userData.originalIntensity = 0.8;
    sunGroup.add(stationMesh); 
    satelliteMeshes[stationName] = stationMesh;

    const planetsData = [
        { name: "Mercury", size: 0.383, orbitRadius: 10, orbitSpeed: 0.54, color: 0x8C7E6C, satellites: [] },
        { name: "Venus", size: 0.949, orbitRadius: 15, orbitSpeed: 0.65, color: 0xDFC299, satellites: [] },
        { name: "Earth", size: 1, orbitRadius: 22, orbitSpeed: 0.78, color: 0x4B70DD, satellites: [
            { name: "Moon", size: 0.27, orbitRadius: 2.5, orbitSpeed: 0.5, color: 0xB7B9B9 }
        ]},
        { name: "Mars", size: 0.532, orbitRadius: 30, orbitSpeed: 0.99, color: 0xBC5B44, satellites: [
            { name: "Phobos", size: 0.15, orbitRadius: 1.5, orbitSpeed: 0.6, color: 0x8A7B6B },
            { name: "Deimos", size: 0.1, orbitRadius: 2.2, orbitSpeed: 0.8, color: 0x9D8E7D }
        ]},
        { name: "Jupiter", size: 3.2, orbitRadius: 45, orbitSpeed: 1.31, color: 0xBC9E82, satellites: [
            { name: "Overtime-Reporter", size: 0.28, orbitRadius: 5, orbitSpeed: 1.2, color: 0xD3BC8D },
            { name: "Coltrane-Circle", size: 0.24, orbitRadius: 6.5, orbitSpeed: 1.5, color: 0xD6D1C1 },
            { name: "SketchyTop", size: 0.41, orbitRadius: 8, orbitSpeed: 2.0, color: 0x9B968E },
            { name: "Gaussian-Blur", size: 0.37, orbitRadius: 10, orbitSpeed: 2.5, color: 0x7E7974 }
        ]},
        { name: "Saturn", size: 2.8, orbitRadius: 65, orbitSpeed: 1.97, color: 0xE3B873, satellites: [
            { name: "Titan", size: 0.4, orbitRadius: 6, orbitSpeed: 2.2, color: 0xCC9A49 }
        ]},
        { name: "Uranus", size: 1.8, orbitRadius: 85, orbitSpeed: 2.68, color: 0xB5D3D1, satellites: [
            { name: "Titania", size: 0.15, orbitRadius: 3.5, orbitSpeed: 2.8, color: 0xB6A9B8 }
        ]},
        { name: "Neptune", size: 1.7, orbitRadius: 105, orbitSpeed: 3.54, color: 0x5B7EDD, satellites: [
            { name: "Triton", size: 0.2, orbitRadius: 3.5, orbitSpeed: 3.0, color: 0xE6DCCB }
        ]},
    ];

    function hasContent(name: string) {
        // All named bodies in our system are valid targets for the camera
        return !!(name === "Sun" || planetMeshes[name] || satelliteMeshes[name]);
    }

    const worldLabelContainer = document.getElementById("world-labels")!;
    const worldLabels: { [key: string]: HTMLElement } = {};

    function createWorldLabel(name: string) {
        const section = document.getElementById(`section-${name}`);
        
        // ONLY create a label if there is an actual HTML section for this body
        // This allows bodies like Mars to be clickable without having a floating label
        if (!section) return;
        
        // Get content type: data-label attribute or the first h2/h1 text
        let labelText = section.getAttribute("data-label");
        if (!labelText) {
            const h2 = section.querySelector("h2");
            const h1 = section.querySelector("h1");
            labelText = (h2 || h1)?.textContent || name;
        }
        
        const div = document.createElement("div");
        div.className = "world-label";
        div.textContent = labelText;
        worldLabelContainer.appendChild(div);
        worldLabels[name] = div;
    }

    createWorldLabel("Station-01");

    planetsData.forEach(p => {
        solarSystem.add_planet(p.name, p.orbitRadius, p.orbitSpeed, 0.01, 0.02, 0.005, p.color);

        const group = new THREE.Group();
        group.name = p.name;
        scene.add(group);
        planetMeshes[p.name] = group;

        const geometry = new THREE.SphereGeometry(p.size, 128, 128);
        
        const material = new THREE.MeshPhysicalMaterial({ 
            color: p.color,
            metalness: 0,
            roughness: 0.2,
            transmission: 0.6, // Glassy effect
            thickness: 0.5,
            ior: 1.5,
            emissive: new THREE.Color(p.color),
            emissiveIntensity: 0.4, // Inner glow
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = p.name;
        sphere.userData.originalEmissive = new THREE.Color(p.color);
        sphere.userData.originalIntensity = 0.4;
        group.add(sphere);
        planetSpheres[p.name] = sphere;
        
        createWorldLabel(p.name);

        // Add a soft atmospheric glow for each planet
        const atmosGeometry = new THREE.SphereGeometry(p.size * 1.05, 64, 64);
        const atmosMaterial = new THREE.MeshBasicMaterial({
            color: p.color,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const atmos = new THREE.Mesh(atmosGeometry, atmosMaterial);
        group.add(atmos);

        p.satellites.forEach(s => {
            solarSystem.add_satellite(p.name, s.name, s.orbitRadius, s.orbitSpeed, 0.0, 0.03, 0.0, s.color);
            createWorldLabel(s.name);
            
            const sGeometry = new THREE.SphereGeometry(s.size, 64, 64);
            const sMaterial = new THREE.MeshPhysicalMaterial({ 
                color: s.color,
                roughness: 0.5,
                transmission: 0.4,
                emissive: new THREE.Color(s.color),
                emissiveIntensity: 0.2
            });
            const sMesh = new THREE.Mesh(sGeometry, sMaterial);
            sMesh.name = s.name;
            sMesh.userData.originalEmissive = new THREE.Color(s.color);
            sMesh.userData.originalIntensity = 0.2;
            group.add(sMesh);
            satelliteMeshes[s.name] = sMesh;
        });

        if (p.name === "Saturn") {
            const innerRadius = p.size * 1.5;
            const outerRadius = p.size * 2.5;
            const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
            const ringMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xE2BF73, 
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.6 
            });
            const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            ringMesh.rotation.x = -Math.PI / 2;
            group.add(ringMesh); // Add to group, not sphere, so it doesn't spin with the planet
        }
    });

    // Stars from WASM - Spherical shell distribution for a black background
    const starCount = 2000;
    const minRadius = 150;
    const maxRadius = 3500;
    const starsCoords = generate_stars(starCount, minRadius, maxRadius);
    
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCoords);
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const sizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        const dist = Math.sqrt(x * x + y * y + z * z);
        // Normalize distance between 0 and 1 within the shell (150 to 3500)
        const t = (dist - minRadius) / (maxRadius - minRadius);
        // Size ranges from 0.5 to 2.5 pixels
        sizes[i] = 0.5 + t * 2.0;
    }
    starGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    
    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
            attribute float size;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            void main() {
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });
    
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // Navigation Logic
    let currentTargetName = "Sun";
    let targetCameraPosition = new THREE.Vector3(0, 15, 30);
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    let zoomFactor = 1.0;
    const minZoom = 0.5;
    const maxZoom = 3.0;

    window.addEventListener("wheel", (e) => {
        zoomFactor += e.deltaY * 0.001;
        zoomFactor = Math.min(Math.max(zoomFactor, minZoom), maxZoom);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function updateActiveSection(name: string) {
        document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));
        let targetSec = document.getElementById(`section-${name}`);
        
        if (targetSec) {
            targetSec.classList.add("active");
        }
    }

    function setTarget(name: string) {
        currentTargetName = name;
        zoomFactor = 1.0; // Reset zoom on target change
        updateActiveSection(name);
    }

    window.addEventListener("click", (event) => {
        // Only ignore if clicking on active HUD sections, not planet labels
        const target = event.target as HTMLElement;
        if (target.closest(".hud-section")) return;
        if (target.closest("#ui-nav")) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        for (const intersect of intersects) {
            let obj: THREE.Object3D | null = intersect.object;
            let foundName: string | null = null;
            
            // Check current object and parents for a registered name
            while (obj) {
                if (obj.name && (obj.name === "Sun" || planetMeshes[obj.name] || satelliteMeshes[obj.name])) {
                    if (hasContent(obj.name)) {
                        foundName = obj.name;
                    }
                    break;
                }
                obj = obj.parent;
            }

            if (foundName) {
                if (currentTargetName === foundName) {
                    // If already at a satellite, go to its planet
                    let parentPlanet = null;
                    for (const p of planetsData) {
                        if (p.satellites.find(s => s.name === foundName)) {
                            parentPlanet = p.name;
                            break;
                        }
                    }
                    if (foundName === "Station-01") parentPlanet = "Sun";

                    if (parentPlanet) {
                        setTarget(parentPlanet);
                    } else if (foundName !== "Sun") {
                        // If already at a planet, go to Sun
                        setTarget("Sun");
                    }
                } else {
                    setTarget(foundName);
                }
                break;
            }
        }
    });

    let hoveredObject: THREE.Mesh | null = null;
    window.addEventListener("mousemove", (event) => {
        const target = event.target as HTMLElement;
        const isOverUI = target.closest(".hud-section") || target.closest("#ui-nav");

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        let newHover: THREE.Mesh | null = null;

        if (!isOverUI) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            for (const intersect of intersects) {
                let obj: THREE.Object3D | null = intersect.object;
                while (obj) {
                    if (obj.name && (obj.name === "Sun" || planetMeshes[obj.name] || satelliteMeshes[obj.name])) {
                        if (hasContent(obj.name)) {
                            newHover = (intersect.object as THREE.Mesh);
                        }
                        break;
                    }
                    obj = obj.parent;
                }
                if (newHover) break;
            }
        }

        if (newHover !== hoveredObject) {
            if (hoveredObject) {
                const mat = hoveredObject.material as THREE.MeshPhysicalMaterial;
                if (hoveredObject.userData.originalEmissive) {
                    mat.emissive.copy(hoveredObject.userData.originalEmissive);
                    mat.emissiveIntensity = hoveredObject.userData.originalIntensity;
                }
            }
            if (newHover) {
                const mat = newHover.material as THREE.MeshPhysicalMaterial;
                mat.emissive.set(0xaaaaaa); 
                mat.emissiveIntensity = 1.0; 
            }
            hoveredObject = newHover;
        }
        
        document.body.style.cursor = newHover ? "pointer" : "default";
    });

    // UI Buttons, HUD Back Buttons, and Planet Options
    document.querySelectorAll("[data-target]").forEach(el => {
        el.addEventListener("click", (e) => {
            const target = (e.currentTarget as HTMLElement).dataset.target;
            if (target) setTarget(target);
        });
    });

    let lastTime = performance.now();
    let currentTimeScale = 1.0;
    let targetTimeScale = 1.0;

    function animate() {
        requestAnimationFrame(animate);
        const now = performance.now();
        
        // Calculate distance to camera target for dynamic time scaling
        const distToTarget = camera.position.distanceTo(targetCameraPosition);
        
        // Smoothly interpolate time scale based on distance and hover
        // 1.5 (Warp) when far (>40 units), 1.0 when close (<10 units)
        const travelFactor = Math.min(Math.max((distToTarget - 10) / 30, 0), 1);
        const travelScale = 1.0 + (travelFactor * 0.5);

        if (distToTarget > 5) {
            // Still traveling, prioritize travel speed (accelerate then decelerate)
            targetTimeScale = travelScale;
        } else {
            // Arrived, allow hover slowdown
            targetTimeScale = hoveredObject ? 0.05 : 1.0;
        }
        
        currentTimeScale += (targetTimeScale - currentTimeScale) * 0.05;

        const delta = ((now - lastTime) / 16.67) * currentTimeScale; 
        lastTime = now;

        solarSystem.update(delta);
        sun.rotation.y = solarSystem.get_sun_rotation_y();

        const planets = solarSystem.get_planets() as any[];
        planets.forEach(p => {
            const group = p.name === "Sun" ? sunGroup : planetMeshes[p.name];
            const sphere = p.name === "Sun" ? sun : planetSpheres[p.name];
            
            if (group && sphere) {
                group.position.set(p.x, 0, p.z);
                sphere.rotation.x += p.rotation_speeds.x * delta;
                sphere.rotation.y += p.rotation_speeds.y * delta;
                sphere.rotation.z += p.rotation_speeds.z * delta;

                p.satellites.forEach((s: any) => {
                    const sMesh = satelliteMeshes[s.name];
                    if (sMesh) {
                        sMesh.position.set(s.x, 0, s.z);
                        sMesh.rotation.x += s.rotation_speeds.x * delta;
                        sMesh.rotation.y += s.rotation_speeds.y * delta;
                        sMesh.rotation.z += s.rotation_speeds.z * delta;
                    }
                });
            }
        });

        // Update World Labels
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(projScreenMatrix);

        Object.keys(worldLabels).forEach(name => {
            const label = worldLabels[name];
            let mesh: THREE.Object3D | null = null;
            if (name === "Sun") mesh = sun;
            else if (planetSpheres[name]) mesh = planetSpheres[name];
            else if (satelliteMeshes[name]) mesh = satelliteMeshes[name];

            if (mesh) {
                const worldPos = new THREE.Vector3();
                mesh.getWorldPosition(worldPos);
                
                // Determine if label should be visible
                let shouldBeVisible = false;
                
                // 1. Always show satellites of current target
                const parentPlanet = planetsData.find(p => p.name === currentTargetName);
                if (parentPlanet && parentPlanet.satellites.find(s => s.name === name)) {
                    shouldBeVisible = true;
                }
                // Special case: Sun's satellite
                if (currentTargetName === "Sun" && name === "Station-01") {
                    shouldBeVisible = true;
                }

                // 2. Show big bodies or other items only on hover (if not current target)
                if (hoveredObject && hoveredObject.name === name && currentTargetName !== name) {
                    shouldBeVisible = true;
                }

                if (shouldBeVisible && frustum.containsPoint(worldPos)) {
                    // Offset label above the body
                    let offset = 1;
                    if (name === "Sun") offset = 6;
                    else {
                        const pData = planetsData.find(pd => pd.name === name);
                        if (pData) offset = pData.size + 0.5;
                        else {
                            // Check satellites
                            for (const p of planetsData) {
                                const sData = p.satellites.find(s => s.name === name);
                                if (sData) offset = sData.size + 0.3;
                            }
                        }
                    }
                    worldPos.y += offset;

                    const screenPos = worldPos.project(camera);
                    const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
                    const y = (screenPos.y * -0.5 + 0.5) * window.innerHeight;

                    label.style.display = "block";
                    label.style.left = `${x}px`;
                    label.style.top = `${y}px`;
                    
                    // Hide labels if HUD is active, UNLESS it's the currently hovered item
                    const hudActive = !!document.querySelector(".hud-section.active");
                    const isHovered = hoveredObject && hoveredObject.name === name;
                    label.style.opacity = (hudActive && !isHovered) ? "0" : "1";
                } else {
                    label.style.display = "none";
                }
            }
        });

        // Camera Logic
        let targetPos = new THREE.Vector3(0, 0, 0);
        let zoomDist = 20;

        if (currentTargetName === "Sun") {
            targetPos.copy(sunGroup.position);
            zoomDist = 25 * zoomFactor;
            const time = now * 0.0001;
            targetCameraPosition.set(
                targetPos.x + Math.cos(time) * zoomDist,
                targetPos.y + 10 * zoomFactor,
                targetPos.z + Math.sin(time) * zoomDist
            );
        } else if (planetMeshes[currentTargetName]) {
            const targetMesh = planetMeshes[currentTargetName];
            if (targetMesh) {
                targetPos.copy(targetMesh.position);
                const planetData = planetsData.find(pd => pd.name === currentTargetName);
                zoomDist = ((planetData?.size || 1) * 3 + 10) * zoomFactor;
                
                // Camera orbits the planet
                const time = now * 0.0002; // Slower orbit (was 0.001)
                targetCameraPosition.set(
                    targetPos.x + Math.cos(time) * zoomDist,
                    targetPos.y + zoomDist * 0.5,
                    targetPos.z + Math.sin(time) * zoomDist
                );
            }
        } else if (satelliteMeshes[currentTargetName]) {
            const sMesh = satelliteMeshes[currentTargetName];
            if (sMesh) {
                sMesh.getWorldPosition(targetPos);
                
                // Find satellite data to get its size
                let sSize = 0.5;
                for (const p of planetsData) {
                    const found = p.satellites.find(s => s.name === currentTargetName);
                    if (found) {
                        sSize = found.size;
                        break;
                    }
                }
                
                zoomDist = (sSize * 3 + 5) * zoomFactor;
                const time = now * 0.0001; // Slower camera orbit for moons
                targetCameraPosition.set(
                    targetPos.x + Math.cos(time) * zoomDist,
                    targetPos.y + zoomDist * 0.5,
                    targetPos.z + Math.sin(time) * zoomDist
                );
            }
        }

        // Smoothly interpolate camera position and lookAt
        camera.position.lerp(targetCameraPosition, 0.08 * delta);
        targetLookAt.lerp(targetPos, 0.08 * delta);
        camera.lookAt(targetLookAt);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

main();
