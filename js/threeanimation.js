import * as THREE from '../node_modules/three/build/three.module.js';
import {
    BoxGeometry,
    ConeGeometry,
    CylinderGeometry,
    Euler,
    Matrix4,
    OctahedronGeometry, PerspectiveCamera,
    Quaternion, SphereGeometry,
    Vector3
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {degToRad} from "three/src/math/MathUtils.js";

const BG_BLUE = 0x0367a6;
const COLOR_PINK = 0xff9fe5;
const COLOR_ORANGE = 0xef8354;
const COLOR_GREEN = 0xa4af69;

window.countFPS = (function () {
    var lastLoop = (new Date()).getMilliseconds();
    var count = 1;
    var fps = 0;

    return function () {
        var currentLoop = (new Date()).getMilliseconds();
        if (lastLoop > currentLoop) {
            fps = count;
            count = 1;
        } else {
            count += 1;
        }
        lastLoop = currentLoop;
        return 'FPS: ' + fps;
    };
}());

function createMatrix(position, eulerRotation, scale)
{
    const quat = new Quaternion();
    quat.setFromEuler(eulerRotation);
    const matrix = new Matrix4();
    matrix.compose(position, quat, scale);
    return matrix;
}

// Create some floating structures
function registerOctahedrons(scene)
{
    const matrices = [
        // Left octa
        createMatrix(new Vector3(-1,3.5,0), new Euler(0,0,0), new Vector3(0.3,0.3,0.3)),
        // middle octa
        createMatrix(new Vector3(0,3,0), new Euler(0,0,0), new Vector3(0.3,0.3,0.3)),
        // right octa
        createMatrix(new Vector3(1,2.5,0), new Euler(0,0,0), new Vector3(0.3,0.3,0.3)),
    ];
    
    const colors = [
        new THREE.Color(255,0,0),
        new THREE.Color(0,255,0),
        new THREE.Color(0,0,255),
    ];
    
    const materialOpts = {
        color: COLOR_PINK,
    };
    
    const geometry = new OctahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, matrices.length );
    for ( let i = 0; i < matrices.length; i ++ ) {
        mesh.setMatrixAt( i, matrices[i] );
        //mesh.setColorAt(i, colors[i]);
    }
    // mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = true;

    scene.add(mesh);
}

function createTubeAndWires(scene)
{
    const matrices = [
        // Tube
        createMatrix(new Vector3(0,4.5,0), new Euler(degToRad(-90),0,degToRad(-90)), new Vector3(0.05,3,0.05)),
        // main wire
        createMatrix(new Vector3(0,6,0), new Euler(0,0,0), new Vector3(0.01,3,0.01)),
        // Left wire
        createMatrix(new Vector3(-1,4,0), new Euler(0,0,0), new Vector3(0.01,1,0.01)),
        // middle wire
        createMatrix(new Vector3(0,5-1.5/2-0.5,0), new Euler(0,0,0), new Vector3(0.01,1.5,0.01)),
        // right wire
        createMatrix(new Vector3(1,5-2/2-0.5,0), new Euler(0,0,0), new Vector3(0.01,2,0.01)),
    ];
    const materialOpts = {
        color: COLOR_ORANGE,
    };
    const geometry = new CylinderGeometry(1, 1);
    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, matrices.length );
    for ( let i = 0; i < matrices.length; i ++ ) {
        mesh.setMatrixAt( i, matrices[i] );
    }

    mesh.castShadow = true;

    scene.add(mesh);
}

function createPearls(scene)
{
    const matrices = [
        // Left wire
        createMatrix(new Vector3(-1,4.5 + 0.1,0), new Euler(0,0,0), new Vector3(0.05 ,0.05,0.05)),
        // middle wire
        createMatrix(new Vector3(0,4.5 + 0.15,0), new Euler(0,0,0), new Vector3(0.1 ,0.1,0.1)),
        // right wire
        createMatrix(new Vector3(1,4.5 + 0.1,0), new Euler(0,0,0), new Vector3(0.05 ,0.05,0.05)),
    ];
    const materialOpts = {
        // color: 0xffffff,
        metalness: 1,
        roughness: 0,
        // flatShading: true,
    };
    const geometry = new SphereGeometry(1, 10);
    const material = new THREE.MeshStandardMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, matrices.length );
    for ( let i = 0; i < matrices.length; i ++ ) {
        mesh.setMatrixAt( i, matrices[i] );
    }
    
    scene.add(mesh);
}

const scene = new THREE.Scene();
const camera = new PerspectiveCamera();
camera.position.set(1, 2, 4);
camera.updateProjectionMatrix();
camera.lookAt(0, 4,0);

// TODO: move camera from y 2 to y 5 and X -2.5 to 2.5

const baseColor = 0x999999;

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setClearColor(BG_BLUE);
renderer.setPixelRatio( window.devicePixelRatio );
// renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = false;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMappingExposure = THREE.ReinhardToneMapping;

// Ambiant light
const light = new THREE.AmbientLight( baseColor, 0.4 ); // soft white light
scene.add(light);

const sunLight = new  THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(-100,200.5,60);
scene.add(sunLight);

let mouseX = 10, mouseY = 10;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
}

// Fog
//scene.fog = new THREE.FogExp2(BG_BLUE, 0.05);
scene.fog = new THREE.Fog(BG_BLUE, 10, 50);

// Compose the scene
registerOctahedrons(scene);
createTubeAndWires(scene);
createPearls(scene);

function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

//const controls = new OrbitControls(camera, renderer.domElement);
//controls.autoRotate = true;
// controls.autoRotateSpeed = 0.25;
//controls.autoRotateSpeed = -2;

var dt=1000/60;
var timeTarget=0;
function render(time) {
    time *= 0.001;
    resize();
    //controls.update();
    renderer.clear();
    renderer.render(scene, camera);
    // console.log(renderer.info.render.calls);
    requestAnimationFrame(render);
}

setInterval(() => {console.log(countFPS())}, 1000);

render();