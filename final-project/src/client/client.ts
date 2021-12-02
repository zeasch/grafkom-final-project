import * as THREE from 'three';
import { Sphere, SphereGeometry, TetrahedronBufferGeometry, TextureLoader } from 'three';
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
controls.minDistance = 10;
controls.maxDistance = 10000;
controls.enableDamping = true;

const starTexture = new TextureLoader().load('textures/galaxy.png');
const starGeometry = new THREE.SphereGeometry(6000, 100, 100);
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
pivot2.rotation.y = 100;

Orbit.add(pivot1);
Orbit.add(pivot2);

const loader = new GLTFLoader();
loader.load('3D-resource/Venus_1_12103.glb', function (gltf) {
        venus = gltf.scene;
        venus.position.set(-3500, 0, -3500);
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

        scene.add(venus);
        
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
venusText.position.x = -3600;
venusText.position.y = 535;
venusText.position.z = -3500;
scene.add(venusText);

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
        //mercury.scale.set(90, 90, 90);
        mercury.position.set(-2000, 0, -2000);
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
mercuryText.position.x = -2250;
mercuryText.position.y = 550;
mercuryText.position.z = -2000;
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

function animate() {
    requestAnimationFrame(animate);

    starMesh.rotation.y -= 0.0005;
    if (venus) {
        venus.rotation.y -= 0.00025;
    }
    fogMesh.rotation.y -= 0.00065;

    Orbit.rotation.y += 0.00025;

    if (sun) {
        sun.rotation.y -= 0.00025;
    }
    
    controls.update();

    render();
}

function render() {

    renderer.render(scene, camera);
}

animate();