import * as THREE from '../node_modules/three/build/three.module.js';
import {BoxGeometry, ConeGeometry, Euler, Matrix4, OctahedronGeometry, Quaternion, Vector3} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {degToRad} from "three/src/math/MathUtils.js";

const BG_BLUE = 0x0367a6;
const COLOR_PINK = 0xff9fe5;
const COLOR_ORANGE = 0xef8354;
const COLOR_GREEN = 0xa4af69;

function createMatrix(position, eulerRotation, scale)
{
    const quat = new Quaternion();
    quat.setFromEuler(eulerRotation);
    const matrix = new Matrix4();
    matrix.compose(position, quat, scale);
    return matrix;
}


// Create instanced pyramids
function registerCones(scene)
{
    const baseConeHeight = 1.5;
    
    const pyramidsMatrices = [
        // 3 little pyramids
        createMatrix(new Vector3(0,baseConeHeight/2,0), new Euler(0,0,0), new Vector3(1,1,1)),
        createMatrix(new Vector3(-1.337788,baseConeHeight/2,-3.20876), new Euler(0,0,0), new Vector3(1,1,1)),
        createMatrix(new Vector3(1.03933,baseConeHeight/2,-3.66235), new Euler(degToRad(0),degToRad(0),degToRad(0)), new Vector3(1,1,1)),
        // medium pyramid
        createMatrix(new Vector3(3.82015, baseConeHeight*2/2,-4.69025), new Euler(degToRad(0),degToRad(0), degToRad(0)), new Vector3(2,2,2)),
        // Big pyramid
        createMatrix(new Vector3(4.328272, baseConeHeight*4/2,1.023127), new Euler(degToRad(0),degToRad(0), degToRad(0)), new Vector3(4,4,4)),
    ];
    const materialOpts = {};
    const geometry = new ConeGeometry(1,baseConeHeight,3);
    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, pyramidsMatrices.length );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for ( let i = 0; i < pyramidsMatrices.length; i ++ ) {
        mesh.setMatrixAt( i, pyramidsMatrices[i] );
    }
    
    scene.add(mesh);
}

// Create some floating structures
function registerOctahedrons(scene)
{
    const matrices = [
        createMatrix(new Vector3(1.952827,7.109964,5.357402), new Euler(0,0,0), new Vector3(1,1,1)),
        createMatrix(new Vector3(8.80595684,9.38697815,2.63875365), new Euler(0,0,0), new Vector3(1,1,1)),
        createMatrix(new Vector3(6.41082335,6.69409895,-4.85258627), new Euler(degToRad(0),degToRad(0),degToRad(0)), new Vector3(1,1,1)),
        createMatrix(new Vector3(-1.38922143,4.86102295,-4.1731348), new Euler(degToRad(0),degToRad(0), degToRad(0)), new Vector3(1,1,1)),
    ];
    const materialOpts = {
        emissive: COLOR_PINK,
        color: COLOR_PINK,
    };
    const geometry = new OctahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, matrices.length );
    for ( let i = 0; i < matrices.length; i ++ ) {
        mesh.setMatrixAt( i, matrices[i] );
    }

    scene.add(mesh);
}

// Create some cubes
function registerCubes(scene)
{
    const cubeHeight = 1;
    
    const matrices = [
        createMatrix(new Vector3(7.5297575,cubeHeight/2,4.75794506), new Euler(0,0,0), new Vector3(1,1,1)),
        createMatrix(new Vector3(7.68720627,cubeHeight/2,7.25141478), new Euler(0,0,0), new Vector3(1,1,1)),
        createMatrix(new Vector3(5.22734976,cubeHeight/2,6.13682795), new Euler(degToRad(0),degToRad(0),degToRad(0)), new Vector3(1,1,1)),
        createMatrix(new Vector3(6.90357113,cubeHeight+cubeHeight/2,5.7390604), new Euler(degToRad(0),degToRad(0), degToRad(0)), new Vector3(1,1,1)),
    ];
    const materialOpts = {};
    const geometry = new BoxGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, matrices.length );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    for ( let i = 0; i < matrices.length; i ++ ) {
        mesh.setMatrixAt( i, matrices[i] );
    }

    scene.add(mesh);
}

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(27,  1, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(27,  1, 0.1, 1000);
camera.setFocalLength(50);
// camera.position.set(-8.618692, 2.059886, 26.14876);
camera.position.set(-6.618692, 2.059886, 15.14876);
const quat = new Quaternion();
quat.setFromEuler(new Euler(degToRad(-0.559), degToRad(22.588), degToRad(0)));
camera.rotation.setFromQuaternion(quat);
camera.updateProjectionMatrix();
camera.lookAt(0,0,0);

const baseColor = 0x999999;

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setClearColor(BG_BLUE);
renderer.setPixelRatio( window.devicePixelRatio );
// renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = THREE.ReinhardToneMapping;

// Ambiant light
const light = new THREE.AmbientLight( baseColor, 0.1 ); // soft white light
scene.add(light);

scene.add(new  THREE.DirectionalLight(baseColor, 0.5));

const sphere = new THREE.SphereGeometry( 0.01, 16, 8 );

// Blue light
const light1 = new THREE.PointLight( BG_BLUE, 1, 50 );
light1.position.set(1.17681909,0.461263299,-2.00186467);
//Set up shadow properties for the light
light1.castShadow = true;
light1.shadow.mapSize.width = 512; // default
light1.shadow.mapSize.height = 512; // default
light1.shadow.camera.near = 0.1; // default
light1.shadow.camera.far = 500; // default
light1.shadow.bias = -0.0005;
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: BG_BLUE } ) ) );
scene.add( light1 )

// Red light
const light2 = new THREE.PointLight( 0xff0000, 1, 50 );
light2.position.set(6.6597147,0.461263299,6.01144266);
//Set up shadow properties for the light
light2.castShadow = true;
light2.shadow.mapSize.width = 1024; // default
light2.shadow.mapSize.height = 1024; // default
light2.shadow.camera.near = 0.1; // default
light2.shadow.camera.far = 500; // default
light2.shadow.bias = -0.0005;
light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: COLOR_ORANGE } ) ) );
scene.add(light2);

// Instanciate floor
const planeGeometry = new THREE.PlaneGeometry( 1000   , 1000, 10, 10);
const material = new THREE.MeshStandardMaterial( {} );
const plane = new THREE.Mesh( planeGeometry, material );
plane.position.setY(0.1);
plane.receiveShadow = true;


plane.rotation.x = degToRad(-90);

scene.add(plane);

let mouseX = 10, mouseY = 10;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
}

// White directional light at half intensity shining from the top.
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7);
// directionalLight.rotateX(3.14/4);
// scene.add( directionalLight );




// Fog
//scene.fog = new THREE.FogExp2(BG_BLUE, 0.05);
scene.fog = new THREE.Fog(BG_BLUE, 100, 1000);

// Compose the scene
registerOctahedrons(scene);
registerCubes(scene);
registerCones(scene);


function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;

var dt=1000/60;
var timeTarget=0;
function render(time) {
    time *= 0.001;
    resize();

    // TODO: add boundaries to avoid loosing the scene
    // camera.position.x += ( mouseX - camera.position.x ) * .000005;
    // camera.position.y += ( - mouseY - camera.position.y ) * .000005;
    // camera.lookAt( scene.position );
    // camera.lookAt( plane.position );
    // camera.lookAt(0,0,0);
    
    controls.update();
    
    renderer.clear();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();