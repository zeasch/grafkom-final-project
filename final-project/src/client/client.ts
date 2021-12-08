import * as THREE from 'three';
import { MathUtils, Sphere, SphereGeometry, sRGBEncoding, TetrahedronBufferGeometry, TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SpriteText from 'three-spritetext';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
camera.position.set(-1000, 0, 5000);

const renderer = new THREE.WebGLRenderer({
    antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => console.log("Controls Change"));
controls.minDistance = 0;
controls.maxDistance = 18500;
controls.enableDamping = true;

const starTexture = new TextureLoader().load('textures/galaxy.png');
const starGeometry = new THREE.SphereGeometry(13500, 100, 100);
const starMaterial = new THREE.MeshBasicMaterial({
  map : starTexture,
  side: THREE.BackSide
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

var venus;
const venusMap = new TextureLoader().load('textures/venusmap.jpg');
venusMap.encoding = THREE.sRGBEncoding;
venusMap.flipY = false;

const venusDisMap = new TextureLoader().load('textures/venusbump.jpg');
venusDisMap.encoding = THREE.sRGBEncoding;
venusDisMap.flipY = false;

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

const loader = new GLTFLoader();
loader.load('3D-resource/Venus_1_12103.glb', function (gltf) {
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
        //venus.userData.isContainer = true

        pivot3.add(venus);
        
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

var PSP;
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

const fogTexture = new TextureLoader().load('textures/fog.png');
const fogGeometry = new SphereGeometry(505, 100, 100);
const fogMaterial = new THREE.MeshPhongMaterial({
    map: fogTexture,
    transparent: true,
    opacity: 0.5
});
const fogMesh = new THREE.Mesh(fogGeometry, fogMaterial);
fogMesh.position.set(-3000, 0, -3000);
//scene.add(fogMesh);

const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(ambientlight);

const pointLight = new THREE.PointLight( 0xffffff, 1, 0, 2 );
pointLight.position.set( 0, 0, 0 );
scene.add( pointLight );

const sphereSize = 250;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
//scene.add( pointLightHelper );

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

const helper = new THREE.SpotLightHelper(spotLight);
//pivot1.add(helper);

const SimpleText = new SpriteText('Parker Solar Probe', 50);
SimpleText.color = 'lightgray';
SimpleText.position.x = -1050;
SimpleText.position.y = 75;
SimpleText.position.z = -1000;
pivot1.add(SimpleText);

const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );

const venusText = new SpriteText('Venus', 50);
venusText.color = 'lightgray';
venusText.position.x = -2600;
venusText.position.y = 300;
venusText.position.z = -2500;
pivot3.add(venusText);

var element = document.getElementById('button');
//element.addEventListener("click", fungsianimasi)

var sun;
const sunTexture = new TextureLoader().load('textures/sun-texture.jpg');
sunTexture.encoding = THREE.sRGBEncoding;
sunTexture.flipY = false;

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

var mercury;
const mercuryMap = new TextureLoader().load('textures/mercury-texture.jpg');
mercuryMap.encoding = THREE.sRGBEncoding;
//mercuryMap.flipY = false;

const mercuryBumpMap = new TextureLoader().load('textures/mercurybump.jpg');
mercuryBumpMap.encoding = THREE.sRGBEncoding;
mercuryBumpMap.flipY = false;

//const mercuryLoader = new GLTFLoader();
loader.load('3D-resource/Mercury.glb', function(gltf) {
        mercury = gltf.scene;
        mercury.scale.set(0.5, 0.5, 0.5);
        mercury.position.set(-1500, 0, -1500);
        mercury.rotation.x = MathUtils.degToRad(-0.03);
        mercury.traverse((m) => {
            if (m.isMesh) {
                //m.material.map = mercuryMap;
                //m.material.bumpMap = mercuryBumpMap;
                m.material.bumpScale = 0.015;
                m.material.needsUpdate = true;
                console.log(m.material);
            }
        });
        
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

const sunText = new SpriteText('Sun', 50);
sunText.color = 'lightgray';
sunText.position.x = 500;
sunText.position.y = 535;
sunText.position.z = 0;
scene.add(sunText);

const mercuryLight = new THREE.SpotLight(0xffffff, 25, 400, 200);
mercuryLight.position.set(-2000, 700, -2000);
mercuryLight.castShadow = true;
mercuryLight.shadow.mapSize.width = 1024;
mercuryLight.shadow.mapSize.height = 1024;
mercuryLight.shadow.camera.near = 500;
mercuryLight.shadow.camera.far = 4000;
mercuryLight.shadow.camera.fov = 30;
mercuryLight.target.position.set(-2000, 0, -2000);
mercuryLight.target.updateMatrixWorld();

//scene.add(mercuryLight);
scene.add(mercuryLight.target);

const mercuryLightHelper = new THREE.SpotLightHelper(mercuryLight);
//scene.add(mercuryLightHelper);

var earth;
const earthMap = new TextureLoader().load('textures/earth-texture.jpg');
earthMap.encoding = sRGBEncoding;
earthMap.flipY = false;

loader.load('3D-resource/Earth.glb', function (gltf) {
        earth = gltf.scene;
        earth.position.set(-3500, 0, -3500);
        earth.scale.set(0.5, 0.5, 0.5);
        earth.rotation.x = MathUtils.degToRad(-23.4);
        earth.traverse((e) => {
            if (e.isMesh) {
                //e.material.map = earthMap;
                e.material.needsUpdate = true;
            }
        });
        pivot4.add(earth);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

/*var eros;
loader.load('3D-resource/Eros.glb', function (gltf) {
        eros = gltf.scene;
        eros.scale.set(75, 75, 75);
        eros.position.set(-6500, 500, -6500);
        eros.rotation.y = 10;

        pivot1.add(eros);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
        console.log(error);
    }
);

const erosSpotLight = new THREE.SpotLight( 0xffffff, 25, 500, 200);
erosSpotLight.position.set(-6500, 1500, -6500);
erosSpotLight.castShadow = true;
erosSpotLight.shadow.mapSize.width = 1024;
erosSpotLight.shadow.mapSize.height = 1024;
erosSpotLight.shadow.camera.near = 500;
erosSpotLight.shadow.camera.far = 4000;
erosSpotLight.shadow.camera.fov = 30;
erosSpotLight.target.position.set(-6500, 500, -6500);
erosSpotLight.target.updateMatrixWorld();

scene.add(erosSpotLight);
scene.add(erosSpotLight.target);

const erosSpotLightHelper = new THREE.SpotLightHelper(erosSpotLight);
scene.add(erosSpotLightHelper);*/

const earthText = new SpriteText('Earth', 50);
earthText.color = 'lightgray';
earthText.position.x = -3600;
earthText.position.y = 300;
earthText.position.z = -3500;
pivot4.add(earthText);

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

function animate() {
    requestAnimationFrame(animate);

    starMesh.rotation.y -= 0.0005;
    if (venus) {
        venus.rotation.y -= 0.00035;
    }
    fogMesh.rotation.y -= 0.00065;

    Orbit.rotation.y += 0.00025;

    if (sun) {
        sun.rotation.y -= 0.00035;
    }

    if (mercury) {
        mercury.rotation.y += 0.00035;
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