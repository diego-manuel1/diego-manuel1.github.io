// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales

// Acciones
init();
loadScene();
setupGUI();
render();

function init()
{
    // Instanciar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );

    // Instanciar el nodo raiz de la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,100);
    camera.position.set(0.5,2,7);
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt(0,1,0);

    // Eventos
    renderer.domElement.addEventListener('dblclick', animate );
}

function loadScene()
{
}

function loadTable(){
    // Importar un modelo en gltf
   const glloader = new GLTFLoader();

   glloader.load( 'models/robota/scene.gltf', function ( gltf ) {
       gltf.scene.position.y = 1;
       gltf.scene.rotation.y = -Math.PI/2;
       gltf.scene.name = 'robota';
       esfera.add( gltf.scene );
   
   }, undefined, function ( error ) {
   
       console.error( error );
   
   } );
}

function setupGUI()
{
}

function update()
{
    TWEEN.update();
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene,camera);
}