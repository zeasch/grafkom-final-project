import * as THREE from 'three';
import { MathUtils, Sphere, SphereGeometry, sRGBEncoding, TetrahedronBufferGeometry, TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SpriteText from 'three-spritetext';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
camera.position.set(-1000, 500, 5000);

const renderer = new THREE.WebGLRenderer({
    antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* --- ORBIT CONTROL --- */ 
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => console.log("Controls Change"));
controls.minDistance = 0;
controls.maxDistance = 20500;
controls.enableDamping = true;

/* ---BACKGROUND --- */
const starTexture = new TextureLoader().load('textures/galaxy.png');
const starGeometry = new THREE.SphereGeometry(15500, 100, 100);
const starMaterial = new THREE.MeshBasicMaterial({
  map : starTexture,
  side: THREE.BackSide
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

/* --- LIGHTS --- */
const ambientlight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientlight);

const pointLight = new THREE.PointLight( 0xffffff, 1, 0, 2 );
pointLight.position.set( 0, 0, 0 );
scene.add( pointLight );

/* --- ORBIT MOVEMENT --- */
const Orbit = new THREE.Object3D();
scene.add(Orbit);

var pivot1 = new THREE.Object3D();
pivot1.rotation.y = 0;

var pivot2 = new THREE.Object3D();
pivot2.rotation.y = 200;

var pivot3 = new THREE.Object3D();
pivot3.rotation.y = 400;

var pivot4 = new THREE.Object3D();
pivot4.rotation.y = 600;

var pivot5 = new THREE.Object3D();
pivot5.rotation.y = 800;

var pivot6 = new THREE.Object3D();
pivot6.rotation.y = 1000;

var pivot7 = new THREE.Object3D();
pivot7.rotation.y = 1200;

var pivot8 = new THREE.Object3D();
pivot8.rotation.y = 1400;

var pivot9 = new THREE.Object3D();
pivot9.rotation.y = 1600;

Orbit.add(pivot1);
Orbit.add(pivot2);
Orbit.add(pivot3);
Orbit.add(pivot4);
Orbit.add(pivot5);
Orbit.add(pivot6);
Orbit.add(pivot7);
Orbit.add(pivot8);
Orbit.add(pivot9);

var moonOrbit = new THREE.Object3D();
pivot4.add(moonOrbit);

/* --- SUN --- */
var sun;
const sunTexture = new TextureLoader().load('textures/sun-texture.jpg');
sunTexture.encoding = THREE.sRGBEncoding;
sunTexture.flipY = false;

var sunCustomMaterial = new THREE.ShaderMaterial({
    uniforms: { },
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    
});
var sunGeometry = new THREE.SphereGeometry(575, 100, 100);
var sunGlow = new THREE.Mesh(sunGeometry, sunCustomMaterial);
scene.add(sunGlow);

const sunLoader = new GLTFLoader();
sunLoader.load('3D-resource/Sun.glb', function(gltf) {
        sun = gltf.scene;
        sun.traverse((s) => {
            if (s.isMesh) {
                s.material.map = sunTexture;
                s.material.needsUpdate = true;
                console.log(s.material);
                console.log(sunTexture);
            }
        });
        scene.add(sun);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const sunText = new SpriteText('Sun', 50);
sunText.color = 'lightgray';
sunText.position.x = 400;
sunText.position.y = 535;
sunText.position.z = 400;
scene.add(sunText);

/* --- PSP ---  */
var PSP;
const loader = new GLTFLoader();
loader.load('3D-resource/PSP.glb', function (gltf) {
        PSP = gltf.scene;
        PSP.scale.set(25, 25, 25);
        PSP.position.set(-1000, 0, -1000);
        PSP.rotation.y = 10;

        pivot1.add( PSP );
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const spotLight = new THREE.SpotLight( 0xffffff, 25, 300, 100);
spotLight.position.set( -1000, 250, -1000 );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
spotLight.target.position.set(-1000, 0, -1000);
spotLight.target.updateMatrixWorld();

pivot1.add(spotLight);
pivot1.add(spotLight.target);

const SimpleText = new SpriteText('Parker Solar Probe', 50);
SimpleText.color = 'lightgray';
SimpleText.position.x = -1050;
SimpleText.position.y = 75;
SimpleText.position.z = -1000;
pivot1.add(SimpleText);

/* --- MERCURY --- */
var mercury;
loader.load('3D-resource/Mercury.glb', function(gltf) {
        mercury = gltf.scene;
        mercury.scale.set(0.5, 0.5, 0.5);
        mercury.position.set(-1500, 0, -1500);
        mercury.rotation.x = MathUtils.degToRad(-0.03);
        
        pivot2.add(mercury);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const mercuryText = new SpriteText('Mercury', 50);
mercuryText.color = 'lightgray';
mercuryText.position.x = -1600;
mercuryText.position.y = 300;
mercuryText.position.z = -1500;
pivot2.add(mercuryText);

/* --- VENUS --- */
var venus;
const venusMap = new TextureLoader().load('textures/venusmap.jpg');
venusMap.encoding = THREE.sRGBEncoding;
venusMap.flipY = false;

const venusDisMap = new TextureLoader().load('textures/venusbump.jpg');
venusDisMap.encoding = THREE.sRGBEncoding;
venusDisMap.flipY = false;


loader.load('3D-resource/Venus.glb', function (gltf) {
        venus = gltf.scene;
        venus.position.set(-2500, 0, -2500);
        venus.scale.set(0.5, 0.5, 0.5);
        venus.rotation.x = MathUtils.degToRad(-177.4);
        venus.traverse((o) => {
            if (o.isMesh) {
                o.material.map = venusMap;
                o.material.bumpMap = venusDisMap;
                o.material.bumpScale = 0.015;
                o.material.needsUpdate = true;
                console.log(o.material);
                console.log(venusDisMap);
            }
        });
        venus.name = 'venus';

        pivot3.add(venus);
        
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const venusText = new SpriteText('Venus', 50);
venusText.color = 'lightgray';
venusText.position.x = -2600;
venusText.position.y = 300;
venusText.position.z = -2500;
pivot3.add(venusText);

/* --- EARTH --- */
var earth;
loader.load('3D-resource/Earth.glb', function (gltf) {
        earth = gltf.scene;
        earth.position.set(-3500, 0, -3500);
        earth.scale.set(0.5, 0.5, 0.5);
        earth.rotation.x = MathUtils.degToRad(-23.4);

        pivot4.add(earth);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const earthText = new SpriteText('Earth', 50);
earthText.color = 'lightgray';
earthText.position.x = -3600;
earthText.position.y = 300;
earthText.position.z = -3500;
pivot4.add(earthText);

/* --- MOON --- */
var moon;
loader.load('3D-resource/Moon.glb', function (gltf) {
        moon = gltf.scene;
        moon.scale.set(0.1, 0.1, 0.1);
        moon.position.set(-3850, 0, -3850);
        //moon.rotation.y = 10;

        moonOrbit.add(moon);
        //scene.updateWorldMatrix(true, true);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const moonText = new SpriteText('Moon', 50);
moonText.color = 'lightgray';
moonText.position.x = -3950;
moonText.position.y = 150;
moonText.position.z = -3850;
moonOrbit.add(moonText);

/* --- MARS --- */
var mars;
loader.load('3D-resource/Mars.glb', function (gltf) {
        mars = gltf.scene;
        mars.scale.set(0.5, 0.5, 0.5);
        mars.position.set(-4500, 0, -4500);
        mars.rotation.x = MathUtils.degToRad(-25.2);
        pivot5.add(mars);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const marsText = new SpriteText('Mars', 50);
marsText.color = 'lightgray';
marsText.position.x = -4600;
marsText.position.y = 300;
marsText.position.z = -4500;
pivot5.add(marsText);

/* --- JUPITER --- */
var jupiter;
loader.load('3D-resource/Jupiter.glb', function (gltf) {
        jupiter = gltf.scene;
        jupiter.scale.set(0.75, 0.75, 0.75);
        jupiter.position.set(-5500, 0, -5500);
        jupiter.rotation.x = MathUtils.degToRad(-3.1);
        pivot6.add(jupiter);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const jupText = new SpriteText('Jupiter', 50);
jupText.color = 'lightgray';
jupText.position.x = -5600;
jupText.position.y = 400;
jupText.position.z = -5500;
pivot6.add(jupText);

/* --- SATURN --- */
var saturn;
loader.load('3D-resource/Saturn.glb', function (gltf) {
        saturn = gltf.scene;
        saturn.scale.set(0.75, 0.75, 0.75);
        saturn.position.set(-6500, 0, -6500);
        saturn.rotation.x = MathUtils.degToRad(-26.7);
        pivot7.add(saturn);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const satText = new SpriteText('Saturn', 50);
satText.color = 'lightgray';
satText.position.x = -6600;
satText.position.y = 500;
satText.position.z = -6500;
pivot7.add(satText);

/* --- URANUS --- */
var uranus;
loader.load('3D-resource/Uranus.glb', function (gltf) {
        uranus = gltf.scene;
        uranus.scale.set(0.75, 0.75, 0.75);
        uranus.position.set(-7500, 0, -7500);
        uranus.rotation.x = MathUtils.degToRad(-97.8);
        pivot8.add(uranus);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const uraText = new SpriteText('Uranus', 50);
uraText.color = 'lightgray';
uraText.position.x = -7600;
uraText.position.y = 450;
uraText.position.z = -7500;
pivot8.add(uraText);

/* --- NEPTUNE --- */
var neptune;
loader.load('3D-resource/Neptune.glb', function (gltf) {
        neptune = gltf.scene;
        neptune.scale.set(0.75, 0.75, 0.75);
        neptune.position.set(-8500, 0, -8500);
        neptune.rotation.x = MathUtils.degToRad(-28.3);
        pivot9.add(neptune);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const nepText = new SpriteText('Neptune', 50);
nepText.color = 'lightgray';
nepText.position.x = -8600;
nepText.position.y = 450;
nepText.position.z = -8500;
pivot9.add(nepText);

/* --- CLICK BUTTON --- */
var element1 = document.getElementById('button-sun');
element1.addEventListener("click", sunDetail);

function sunDetail() {
    camera.position.set(-1000, 0, -1000);
    scene.remove(sunText);
    document.getElementById('mainTitle').style.display = 'none';
    document.getElementById('mainPar').style.display = 'none';
    document.getElementById('button-sun').style.display = 'none';
    document.getElementById('sunTitle').style.display ='block';
    document.getElementById('sunPar').style.display ='block';
    document.getElementById('button-psp').style.display ='block';
}

var element2 = document.getElementById('button-psp');
element2.addEventListener("click", pspDetail);

function pspDetail() {
    camera.position.set(-1050, 0, -1150);
    pivot1.remove(SimpleText);
    pivot1.remove(PSP);
    pivot1.remove(spotLight);
    pivot1.remove(spotLight.target);
    scene.add(PSP);
    scene.add(spotLight);
    scene.add(spotLight.target);
    scene.add(sunText);
    document.getElementById('sunTitle').style.display ='none';
    document.getElementById('sunPar').style.display ='none';
    document.getElementById('button-psp').style.display ='none';
    document.getElementById('pspTitle').style.display = 'block';
    document.getElementById('pspPar').style.display = 'block';
    document.getElementById('button-mercury').style.display = 'block';
}

var element3 = document.getElementById('button-mercury');
element3.addEventListener("click", merDetail);

function merDetail() {
    scene.remove(PSP);
    scene.remove(spotLight);
    scene.remove(spotLight.target);
    pivot1.add(SimpleText);
    pivot1.add(PSP);
    pivot1.add(spotLight);
    pivot1.add(spotLight.target);
    camera.position.set(-2000, 0, -2000);
    pivot2.remove(mercury);
    pivot2.remove(mercuryText);
    scene.add(mercury);
    document.getElementById('pspTitle').style.display = 'none';
    document.getElementById('pspPar').style.display = 'none';
    document.getElementById('button-mercury').style.display = 'none';
    document.getElementById('merTitle').style.display = 'block';
    document.getElementById('merPar').style.display = 'block';
    document.getElementById('button-venus').style.display = 'block';
}

var element4 = document.getElementById('button-venus');
element4.addEventListener("click", venDetail);

function venDetail() {
    scene.remove(mercury);
    pivot2.add(mercury);
    pivot2.add(mercuryText);
    camera.position.set(-3000, 0, -3000);
    pivot3.remove(venus);
    pivot3.remove(venusText);
    scene.add(venus);
    document.getElementById('merTitle').style.display = 'none';
    document.getElementById('merPar').style.display = 'none';
    document.getElementById('button-venus').style.display = 'none';
    document.getElementById('venTitle').style.display = 'block';
    document.getElementById('venPar').style.display = 'block';
    document.getElementById('button-earth').style.display = 'block';
}

var element5 = document.getElementById('button-earth');
element5.addEventListener("click", ethDetail);

function ethDetail() {
    scene.remove(venus);
    pivot3.add(venus);
    pivot3.add(venusText);
    camera.position.set(-3900, 0, -3900);
    pivot4.remove(earth);
    pivot4.remove(earthText);
    scene.add(earth);
    moonOrbit.remove(moon);
    moonOrbit.remove(moonText);
    scene.add(moon);
    scene.add(moonText);
    document.getElementById('venTitle').style.display = 'none';
    document.getElementById('venPar').style.display = 'none';
    document.getElementById('button-earth').style.display = 'none';
    document.getElementById('ethTitle').style.display = 'block';
    document.getElementById('ethPar').style.display = 'block';
    document.getElementById('button-moon').style.display = 'block';
}

var element6 = document.getElementById('button-moon');
element6.addEventListener("click", moonDetail);

function moonDetail() {
    pivot4.remove(earth);
    pivot4.remove(earthText);
    scene.add(earth);
    scene.add(earthText);
    moonOrbit.remove(moon);
    moonOrbit.remove(moonText);
    pivot4.remove(moonText);
    scene.remove(moonText);
    scene.add(moon);
    camera.position.set(-4050, 0, -4050);
    document.getElementById('ethTitle').style.display = 'none';
    document.getElementById('ethPar').style.display = 'none';
    document.getElementById('button-moon').style.display = 'none';
    document.getElementById('moonTitle').style.display = 'block';
    document.getElementById('moonPar').style.display = 'block';
    document.getElementById('button-mars').style.display = 'block';
}

var element7 = document.getElementById('button-mars');
element7.addEventListener("click", marsDetail);

function marsDetail() {
    scene.remove(moon);
    moonOrbit.add(moon);
    moonOrbit.add(moonText);
    scene.remove(earth);
    pivot4.add(earth);
    scene.remove(earthText);
    pivot4.add(earthText);
    camera.position.set(-5000, 0, -5000);
    pivot5.remove(mars);
    scene.add(mars);
    pivot5.remove(marsText);
    document.getElementById('moonTitle').style.display = 'none';
    document.getElementById('moonPar').style.display = 'none';
    document.getElementById('button-mars').style.display = 'none';
    document.getElementById('marsTitle').style.display = 'block';
    document.getElementById('marsPar').style.display = 'block';
    document.getElementById('button-jupiter').style.display = 'block';
}

var element8 = document.getElementById('button-jupiter');
element8.addEventListener("click", jupDetail);

function jupDetail() {
    scene.remove(mars);
    pivot5.add(mars);
    pivot5.remove(marsText);
    camera.position.set(-6250, 0, -6250);
    pivot6.remove(jupiter);
    pivot6.remove(jupText);
    scene.add(jupiter);
    document.getElementById('marsTitle').style.display = 'none';
    document.getElementById('marsPar').style.display = 'none';
    document.getElementById('button-jupiter').style.display = 'none';
    document.getElementById('jupTitle').style.display = 'block';
    document.getElementById('jupPar').style.display = 'block';
    document.getElementById('button-saturn').style.display = 'block';
}

var element9 = document.getElementById('button-saturn');
element9.addEventListener("click", satDetail);

function satDetail() {
    scene.remove(jupiter);
    pivot6.add(jupiter);
    pivot6.add(jupText);
    camera.position.set(-7250, 0, -7250);
    pivot7.remove(saturn);
    pivot7.remove(satText);
    scene.add(saturn);
    document.getElementById('jupTitle').style.display = 'none';
    document.getElementById('jupPar').style.display = 'none';
    document.getElementById('button-saturn').style.display = 'none';
    document.getElementById('satTitle').style.display = 'block';
    document.getElementById('satPar').style.display = 'block';
    document.getElementById('button-uranus').style.display = 'block';
}

var element10 = document.getElementById('button-uranus');
element10.addEventListener("click", uraDetail);

function uraDetail() {
    scene.remove(saturn);
    pivot7.add(saturn);
    pivot7.add(satText);
    camera.position.set(-8250, 0, -8250);
    pivot8.remove(uranus);
    pivot8.remove(uraText);
    scene.add(uranus);
    document.getElementById('satTitle').style.display = 'none';
    document.getElementById('satPar').style.display = 'none';
    document.getElementById('button-uranus').style.display = 'none';
    document.getElementById('uraTitle').style.display = 'block';
    document.getElementById('uraPar').style.display = 'block';
    document.getElementById('button-neptune').style.display = 'block';
}

var element11 = document.getElementById('button-neptune');
element11.addEventListener("click", nepDetail);

function nepDetail() {
    scene.remove(uranus);
    pivot8.add(uranus);
    pivot8.add(uraText);
    camera.position.set(-9250, 0, -9250);
    pivot9.remove(neptune);
    pivot9.remove(nepText);
    scene.add(neptune);
    document.getElementById('uraTitle').style.display = 'none';
    document.getElementById('uraPar').style.display = 'none';
    document.getElementById('button-neptune').style.display = 'none';
    document.getElementById('nepTitle').style.display = 'block';
    document.getElementById('nepPar').style.display = 'block';
    document.getElementById('button-end').style.display = 'block';
}

var element12 = document.getElementById('button-end');
element12.addEventListener("click", end);

function end() {
    scene.remove(neptune);
    pivot9.add(neptune);
    pivot9.add(nepText);
    
    document.getElementById('nepTitle').style.display = 'none';
    document.getElementById('nepPar').style.display = 'none';
    document.getElementById('button-end').style.display = 'none';
    document.getElementById('endTitle').style.display = 'block';
    document.getElementById('endPar').style.display = 'block';
    document.getElementById('button-start').style.display = 'block';
}

var element13 = document.getElementById('button-start');
element13.addEventListener("click", reload);

function reload() {
    camera.position.set(-1000, 500, 5000);
    document.getElementById('endTitle').style.display = 'none';
    document.getElementById('button-start').style.display = 'none';
    document.getElementById('mainTitle').style.display = 'block';
    document.getElementById('mainPar').style.display = 'block';
    document.getElementById('button-sun').style.display = 'block';
}

function animate() {
    requestAnimationFrame(animate);

    starMesh.rotation.y -= 0.0005;
    
    Orbit.rotation.y += 0.00025;

    if (sun) {
        sun.rotation.y -= 0.00035;
    }

    if (mercury) {
        mercury.rotation.y += 0.00035;
    }

    if (venus) {
        venus.rotation.y -= 0.00035;
    }

    if (earth) {
        earth.rotation.y += 0.00035;
    }
    
    if (moon) {
        moon.rotation.y += 0.00035;
    }

    if (mars) {
        mars.rotation.y += 0.00035;
    }

    if (jupiter) {
        jupiter.rotation.y += 0.00035;
    }

    if (saturn) {
        saturn.rotation.y += 0.00035;
    }

    if (uranus) {
        uranus.rotation.y += 0.00035;
    }

    if (neptune) {
        neptune.rotation.y += 0.00035;
    }
    
    controls.update();

    render();
}

function render() {

    renderer.render(scene, camera);
}

animate();