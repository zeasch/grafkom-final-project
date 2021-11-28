import * as THREE from 'three';
import { Sphere, SphereGeometry, TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import SpriteText from 'three-spritetext';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
camera.position.set(-4500, 0, -4500);

const renderer = new THREE.WebGLRenderer({
    antialias:true });
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => console.log("Controls Change"));
controls.minDistance = 10;
controls.maxDistance = 10000;

const starTexture = new TextureLoader().load('textures/galaxy.png');
const starGeometry = new THREE.SphereGeometry(5000, 2500, 2500);
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

const PSPOrbit = new THREE.Object3D();
scene.add(PSPOrbit);

var pivot1 = new THREE.Object3D();
pivot1.rotation.y = 0;

PSPOrbit.add( pivot1 );

const loader = new GLTFLoader();
loader.load('3D-resource/Venus_1_12103.glb', function (gltf) {
        venus = gltf.scene;
        venus.position.set(-3000, 0, -3000);
        venus.traverse((o) => {
            if (o.isMesh) {
                o.material.map = venusMap;
                o.material.displacementMap = venusDisMap;
                o.material.displacementScale = 1;
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
const fogGeometry = new SphereGeometry(505, 505, 505);
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
venusText.position.x = -3250;
venusText.position.y = 535;
venusText.position.z = -3000;
scene.add(venusText);

var element = document.getElementById('button');

function animate() {
    requestAnimationFrame(animate);

    starMesh.rotation.y -= 0.001;
    if (venus) {
        venus.rotation.y -= 0.00075;
    }
    fogMesh.rotation.y -= 0.0015;

    PSPOrbit.rotation.y += 0.0025;
    
    controls.update();

    render();
}

function render() {

    renderer.render(scene, camera);
}

animate();