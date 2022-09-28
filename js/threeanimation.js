import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.144/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.144/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.144/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.144/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BloomPass } from 'https://unpkg.com/three@0.144/examples/jsm/postprocessing/BloomPass.js';

const BG_BLUE = 0x0367a6;
const COLOR_PINK = 0xff9fe5;
const COLOR_ORANGE = 0xef8354;
const COLOR_GREEN = 0xa4af69;

const randomizeMatrix = function () {
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    return function ( matrix ) {
        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        quaternion.setFromEuler( rotation );
        scale.x = scale.y = scale.z = Math.random() * 0.8;
        // scale.x = scale.y = scale.z = 1;
        matrix.compose( position, quaternion, scale );
    };
}();

function addInstancedMesh(scene, geometry, materialOpts, count) {
    //const material = new THREE.MeshStandardMaterial(materialOpts);
    const material = new THREE.MeshToonMaterial(materialOpts);
    const mesh = new THREE.InstancedMesh( geometry, material, count );
    const matrix = new THREE.Matrix4();
    for ( let i = 0; i < count; i ++ ) {
        randomizeMatrix( matrix );
        mesh.setMatrixAt( i, matrix );
    }
    scene.add(mesh);
}

const itemCount = 1000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setClearColor(BG_BLUE);
// renderer.setClearColor(0x000000);
renderer.setPixelRatio( window.devicePixelRatio );
//renderer.toneMapping = THREE.ReinhardToneMapping;

renderer.toneMapping = THREE.NoToneMapping;

const params = {
    exposure: 1.5,
    bloomStrength: 0.4,
    bloomThreshold: 0.6,
    bloomRadius: 4
};

const renderScene = new RenderPass(scene, camera);

// const bloomPass = new UnrealBloomPass(
//     new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85
// );
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2( window.innerWidth, window.innerHeight ),
    params.bloomStrength, // strength
    params.bloomRadius, // radius
    params.bloomThreshold // threshold
);

// bloomPass.threshold = params.bloomThreshold;
// bloomPass.strength = params.bloomStrength;
// bloomPass.radius = params.bloomRadius;   

renderer.toneMappingExposure = Math.pow( params.exposure, 4.0 );

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

composer.toneMapping = THREE.ReinhardToneMapping;
composer.toneMappingExposure = Math.pow( params.exposure, 4.0 );

let mouseX = 10, mouseY = 10;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
}

// Ambiant light
const light = new THREE.AmbientLight( 0x404040, 0.1 ); // soft white light
scene.add( light );

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );

// Fog
//scene.fog = new THREE.FogExp2(BG_BLUE, 0.05);
scene.fog = new THREE.Fog(BG_BLUE, 100, 1000);

// Take inspiration from https://stonewallforever.org/monument
// TODO: https://threejs.org/examples/#webgl_postprocessing_unreal_bloom_selective (add bloom)

addInstancedMesh(
    scene,
    new THREE.TetrahedronGeometry(1),
    {color: COLOR_GREEN},
    itemCount
);

addInstancedMesh(
    scene,
    new THREE.TetrahedronGeometry(1),
    {
        emissive: COLOR_PINK,
        color: COLOR_PINK,
        emissiveIntensity: 20,
    },
    300
)

addInstancedMesh(
    scene,
    new THREE.OctahedronGeometry(1),
    {
        color: COLOR_ORANGE,
    },
    1000
)

addInstancedMesh(
    scene,
    new THREE.BoxGeometry(1),
    {
        color: COLOR_PINK,
    },
    2000
)

camera.position.z = 1;

function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
        composer.setSize( width, height );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

function render(time) {
    time *= 0.001;
    resize();

    // TODO: add boundaries to avoid loosing the scene
    camera.position.x += ( mouseX - camera.position.x ) * .000005;
    camera.position.y += ( - mouseY - camera.position.y ) * .000005;
    camera.lookAt( scene.position );

    // renderer.render(scene, camera);
    composer.render();
    requestAnimationFrame(render);
}

render();