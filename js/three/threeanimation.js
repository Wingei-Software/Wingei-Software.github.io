"use strict"

import {
    ACESFilmicToneMapping,
    Color,
    CylinderGeometry,
    Euler,
    Fog,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshStandardMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    PMREMGenerator,
    Quaternion,
    RepeatWrapping,
    Scene,
    SphereGeometry,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import {degToRad} from "three/src/math/MathUtils.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader.js";

const BG_BLUE = 0x0367a6;
const COLOR_PINK = 0xff9fe5;
const COLOR_ORANGE = 0xef8354;
const COLOR_GREEN = 0xa4af69;

const redPaperMaterial = new MeshStandardMaterial({
    color: 0xFF6962,
});
const bluePaperMaterial = new MeshStandardMaterial({
    color: 0x5DDCFF,
});
const orangePaperMaterial = new MeshStandardMaterial({
    color: 0xEDCD56,
});
const pearlsMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.05,
    // envMapIntensity: 1.0,
});
const woodMaterial = new MeshStandardMaterial({color: COLOR_ORANGE});
const ropeMaterial = new MeshStandardMaterial({color: COLOR_ORANGE});

const scene = new Scene();

const canvas = document.querySelector("canvas");
const renderer = new WebGLRenderer({canvas: canvas, antialias: true});
renderer.setClearColor(BG_BLUE);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = false;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

let textureLoader = new TextureLoader();
let exrLoader = new EXRLoader();
let pmremGenerator = new PMREMGenerator(renderer);

textureLoader.load('assets/textures/paper-normal.jpg', texture => {
   texture.repeat.set(2,2);
   texture.wrapS = RepeatWrapping;
   texture.wrapT = RepeatWrapping;
   // texture.needsUpdate = true;
   redPaperMaterial.normalMap = texture;
   bluePaperMaterial.normalMap = texture;
   orangePaperMaterial.normalMap = texture;
   redPaperMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/rope_albedo.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1,10);
    texture.needsUpdate = true;
    ropeMaterial.map = texture;
    ropeMaterial.color = new Color(0xffffff);
    ropeMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/rope_normal.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1,10);
    texture.needsUpdate = true;
    ropeMaterial.normalMap = texture;
    ropeMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/wood_albedo.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    woodMaterial.map = texture;
    woodMaterial.color = new Color(0xffffff);
    woodMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/wood_normal.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    woodMaterial.normalMap = texture;
    woodMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/wood_roughness.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    woodMaterial.roughnessMap = texture;
    woodMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/wood_ao.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    woodMaterial.aoMap = texture;
    woodMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/bronze_albedo.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    pearlsMaterial.map = texture;
    pearlsMaterial.color = new Color(0xffffff);
    pearlsMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/bronze_roughness.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    pearlsMaterial.roughnessMap = texture;
    pearlsMaterial.needsUpdate = true;
});

textureLoader.load('assets/textures/bronze_metallic.png', texture => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(10,1);
    texture.rotation = Math.PI/2;
    texture.needsUpdate = true;
    pearlsMaterial.metalnessMap = texture;
    pearlsMaterial.needsUpdate = true;
});

// from https://polyhaven.com/a/brown_photostudio_05
exrLoader.load('assets/textures/brown_photostudio_02_1k.exr', texture => {
    let txt = pmremGenerator.fromEquirectangular( texture );
    scene.background = txt.texture;
    pearlsMaterial.envMap = txt.texture;
    pearlsMaterial.needsUpdate = true;
    woodMaterial.envMap = txt.texture;
    woodMaterial.needsUpdate = true;
    ropeMaterial.envMap = txt.texture;
    ropeMaterial.needsUpdate = true;
    redPaperMaterial.envMap = txt.texture;
    redPaperMaterial.needsUpdate = true;
    orangePaperMaterial.envMap = txt.texture;
    bluePaperMaterial.envMap = txt.texture;
});

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
    const geometry = new OctahedronGeometry(1, 0);
    
    const left = new Mesh(geometry, orangePaperMaterial);
    left.position.set(-1,3.5,0);
    left.scale.set(0.3,0.3,0.3);
    left.updateMatrix();
    scene.add(left);
    
    const middle = new Mesh(geometry, redPaperMaterial);
    middle.position.set(0,3,0);
    middle.scale.set(0.3,0.3,0.3);
    middle.updateMatrix();
    scene.add(middle);

    const right = new Mesh(geometry, bluePaperMaterial);
    right.position.set(1,2.5,0);
    right.scale.set(0.3,0.3,0.3);
    right.updateMatrix();
    scene.add(right);
}

function createTubeAndWires(scene)
{
    const RopeMatrices = [
        // main wire
        createMatrix(new Vector3(0,6,0), new Euler(0,0,0), new Vector3(0.01,3,0.01)),
        // Left wire
        createMatrix(new Vector3(-1,4,0), new Euler(0,0,0), new Vector3(0.01,1,0.01)),
        // middle wire
        createMatrix(new Vector3(0,5-1.5/2-0.5,0), new Euler(0,0,0), new Vector3(0.01,1.5,0.01)),
        // right wire
        createMatrix(new Vector3(1,5-2/2-0.5,0), new Euler(0,0,0), new Vector3(0.01,2,0.01)),
    ];
    const geometry = new CylinderGeometry(1, 1, 1, 16);
    const mesh = new InstancedMesh( geometry, ropeMaterial, RopeMatrices.length );
    for ( let i = 0; i < RopeMatrices.length; i ++ ) {
        mesh.setMatrixAt( i, RopeMatrices[i] );
    }
    
    const rodMesh = new Mesh(geometry, woodMaterial);
    rodMesh.position.set(0,4.5,0);
    rodMesh.setRotationFromEuler(new Euler(degToRad(-90),0,degToRad(-90)));
    rodMesh.scale.set(0.05,3,0.05);
    mesh.matrixAutoUpdate = false;
    rodMesh.matrixAutoUpdate = false;
    rodMesh.updateMatrix();
    scene.add(mesh);
    scene.add(rodMesh);
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
    const geometry = new SphereGeometry(1, 20);
    const pearls = new InstancedMesh( geometry, pearlsMaterial, matrices.length );
    for ( let i = 0; i < matrices.length; i ++ ) {
        pearls.setMatrixAt( i, matrices[i] );
    }
    
    pearls.matrixAutoUpdate = false;
    scene.add(pearls);
}

const camera = new PerspectiveCamera();
camera.position.set(1, 5, 4);
camera.updateProjectionMatrix();
camera.lookAt(0, 4,0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,4,0);
controls.update();
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1;
controls.enableDamping = true;

// TODO: move camera from y 2 to y 5 and X -2.5 to 2.5

let mouseX = 10, mouseY = 10;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
}

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

const fps_target = 24;
const frame_duration = 1000/fps_target;
let last_frame_time = 0;
let next_frame_time = 0;

function render() {
    if (performance.now() > next_frame_time) {
        resize();
        controls.update();
        renderer.render(scene, camera);
        last_frame_time = performance.now();
        next_frame_time = last_frame_time + frame_duration;
    }
    requestAnimationFrame(render);
}

render();