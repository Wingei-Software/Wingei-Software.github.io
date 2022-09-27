window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }
    ;

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

/*************************************
 * 3D animations
 *************************************/

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
        matrix.compose( position, quaternion, scale );
    };
}();

function addInstancedMesh(scene, geometry, materialOpts, count) {
    const material = new THREE.MeshStandardMaterial(materialOpts);
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
renderer.setClearColor(0x0367A6);
renderer.setPixelRatio( window.devicePixelRatio );

let mouseX = 10, mouseY = 10;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );
function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
}

// Ambiant light
const light = new THREE.AmbientLight( 0x404040, 1 ); // soft white light
scene.add( light );

// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
scene.add( directionalLight );

// Fog
scene.fog = new THREE.FogExp2(0x0367A6, 0.05);

// Take inspiration from https://stonewallforever.org/monument
// TODO: https://threejs.org/examples/#webgl_postprocessing_unreal_bloom_selective (add bloom)

addInstancedMesh(
    scene,
    new THREE.TetrahedronGeometry(1),
    {color: 0xa4af69},
    itemCount
);

addInstancedMesh(
    scene,
    new THREE.TetrahedronGeometry(1),
    {
        emissive: 0xff9fe5,
        color: 0xff9fe5,
        emissiveIntensity: 2,
    },
    300
)

addInstancedMesh(
    scene,
    new THREE.OctahedronGeometry(1),
    {
        color: 0xef8354,
    },
    1000
)

addInstancedMesh(
    scene,
    new THREE.BoxGeometry(0.5),
    {
        color: 0x72ddf7,
    },
    2000
)

camera.position.z = 1;

function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
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
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();