import * as THREE from 'three';
import { Sphere, SphereGeometry, TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,45,30000);
camera.position.set(-1250,-1250,-1250);

const renderer = new THREE.WebGLRenderer({
    antialias:true });
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

        scene.add(venus);
        //PSPOrbit.add(venus);
        //objects.push(venus);
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
    PSP.position.set(1000, 50, 0);

    //scene.add(PSP);
    //PSPOrbit.add(PSP);
    //objects.push(PSP);
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
scene.add(fogMesh);

const ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(ambientlight);

const spotLight = new THREE.SpotLight( 0xffffff, 25, 300, 100);
spotLight.position.set( 1000, 250, 0 );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
spotLight.target.position.set(1000, 50, 0);
spotLight.target.updateMatrixWorld();
//scene.add(spotLight);
//scene.add(spotLight.target);
//PSPOrbit.add(spotLight);
//objects.push(spotLight);
//PSPOrbit.add(spotLight.target);
//objects.push(spotLight.target);
pivot1.add(spotLight);
pivot1.add(spotLight.target);

const helper = new THREE.SpotLightHelper(spotLight);
//pivot1.add(helper);

//var r = 35;
//var theta = 0;
//var dTheta = 2 * Math.PI / 1000;

function animate() {
    requestAnimationFrame(animate);

    starMesh.rotation.y -= 0.001;
    if (venus) {
        venus.rotation.y -= 0.00075;
    }
    fogMesh.rotation.y -= 0.0015;

    //PSPOrbit();
    //theta += dTheta;
    PSPOrbit.rotation.y += 0.0025;
    
    //PSPOrbit.position.x = r * Math.cos(theta);
    //PSPOrbit.position.z = r * Math.sin(theta);
    
    
    controls.update();

    render();
}

/*function PSPOrbit() {
    if (PSP) {
        PSP.rotation.x += 0.01;
        PSP.rotation.z += 0.01;
    }
}*/

function render() {
    /*theta += dTheta;
    if (PSP) {
        PSP.position.x = r * Math.cos(theta);
        PSP.position.z = r * Math.sin(theta);
    }*/
    renderer.render(scene, camera);
}

animate();