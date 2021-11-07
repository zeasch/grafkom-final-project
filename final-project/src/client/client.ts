import * as THREE from 'three';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
camera.position.set(-900,-900,-900);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', () => console.log("Controls Change"));
controls.minDistance = 10;
controls.maxDistance = 10000;

const starTexture = new TextureLoader().load('textures/galaxy.png');
const starGeometry = new THREE.SphereGeometry(4000, 4000, 4000);
const starMaterial = new THREE.MeshBasicMaterial({
  map : starTexture,
  side: THREE.BackSide
});
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

var venus;
const loader = new GLTFLoader();
loader.load('3D-resource/Venus_1_12103.glb', function (gltf) {
        venus = gltf.scene;
        scene.add(venus);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(ambientlight);

// point light
//const pointLight = new THREE.PointLight(0xffffff, 1)
//pointLight.position.set(10000, 10000, 10000);
//scene.add(pointLight);

// point light helper
//const Helper = new THREE.PointLightHelper(pointLight);
//scene.add(Helper);

const fogTexture = new TextureLoader().load('textures/fog.png');
const fogGeometry = new THREE.SphereGeometry(500, 500, 500);
const fogMaterial = new THREE.MeshPhongMaterial({
    map: fogTexture,
    transparent: true,
});
const fogMesh = new THREE.Mesh(fogGeometry, fogMaterial);
//scene.add(fogMesh);


function animate() {
    requestAnimationFrame(animate);

    starMesh.rotation.y -= 0.002;
    if (venus) {
        venus.rotation.y -= 0.001;
    }
   

    controls.update();

    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();