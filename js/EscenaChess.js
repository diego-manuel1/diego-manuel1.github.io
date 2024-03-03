// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables estandar
let renderer, scene, camera;
let cameraControls, effectController;
// Otras globales
let tableObject;
let boardObject;

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
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,100);
    camera.position.set( 0.5, 2, 7 );
    //Controles de camara
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt( new THREE.Vector3(0,1,0) );
    // Eventos
    //renderer.domElement.addEventListener('dblclick', animate );
    //Añadimos luz ambiental
    const ambiental = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambiental);
}

function loadScene()
{
    //Creamos el material del suelo
    const materialSuelo = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), materialSuelo );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);
    //Creamos los objetos del tablero de ajedrez y la mesa.
    tableObject = new THREE.Object3D();
    boardObject = new THREE.Object3D();
    //Centramos la mesa
    tableObject.position.x = 0;
    tableObject.position.y = 0;
    tableObject.position.z = 0;
    //Agregamos el objeto tablero a la escena.
    //scene.add(tableObject);
    //Cargamos la mesa y el tablero
    loadTable();
    loadChessboard();
    //Hacemos al tablero hijo de la mesa.
    tableObject.add(boardObject);
    scene.add(tableObject);
    scene.add(boardObject);
    //Reducimos la escala del tablero
    boardObject.scale.x = boardObject.scale.x*0.05
    boardObject.scale.y = boardObject.scale.y*0.05
    boardObject.scale.z = boardObject.scale.z*0.05
    //Movemos el tablero encima de la mesa.
    boardObject.position.y = 3.3
    //Cargamos las piezas del tablero
    loadPieces()
    //Añadimos ejes a la escena.
    scene.add( new THREE.AxesHelper(3) );
}

function loadTable()
{
    // Importar un modelo en gltf
    const glloader = new GLTFLoader();

     glloader.load( 'models/table/scene.gltf', function ( gltf ) {
     gltf.scene.position.y = 0;
     gltf.scene.position.x = 0;
     gltf.scene.position.z = 0;
     gltf.scene.name = 'table';
     const table = gltf.scene;
     //Agregamos el modelo de la mesa al objeto mesa.
     tableObject.add(table);
 
    }, undefined, function ( error ) {
 
     console.error( error );
 
     } );
}

function loadChessboard(){
    // Importar un modelo en gltf
   const glloader = new GLTFLoader();

   glloader.load( 'models/chess_board/scene.gltf', function ( gltf ) {
       gltf.scene.position.y = 0;
       gltf.scene.position.x = 0;
       gltf.scene.position.z = 0;
       gltf.scene.rotation.y = -Math.PI / 2;
       gltf.scene.name = 'chessBoard';
       const board = gltf.scene;
       //Agregamos el modelo como hijo del objeto tablero.
       boardObject.add( board );
   
   }, undefined, function ( error ) {
   
       console.error( error );
   
   } );
}

function loadPieces(){
    const glloader = new GLTFLoader();

   glloader.load( 'models/king/scene.gltf', function ( gltf ) {
       gltf.scene.position.y = 1.5;
       gltf.scene.position.x = 3;
       gltf.scene.position.z = 21;
       //Establecemos la escala del rey
       gltf.scene.scale.x = gltf.scene.scale.x*3
       gltf.scene.scale.y = gltf.scene.scale.y*3
       gltf.scene.scale.z = gltf.scene.scale.z*3
       gltf.scene.name = 'king';
       const king = gltf.scene;
       //Agregamos el modelo como hijo del objeto tablero.
       //boardObject.add( king );
       boardObject.add( king );
   
   }, undefined, function ( error ) {
   
       console.error( error );
   
   } );

   glloader.load( 'models/queen/scene.gltf', function ( gltf ) {
    gltf.scene.position.y = 1.5;
    gltf.scene.position.x = -3;
    gltf.scene.position.z = 21;
    //Establecemos la escala del rey
    gltf.scene.scale.x = gltf.scene.scale.x*3
    gltf.scene.scale.y = gltf.scene.scale.y*3
    gltf.scene.scale.z = gltf.scene.scale.z*3
    gltf.scene.name = 'queen';
    const queen = gltf.scene;
    //Agregamos el modelo como hijo del objeto tablero.
    //boardObject.add( king );
    boardObject.add( queen );

    }, undefined, function ( error ) {

        console.error( error );

    } );

   glloader.load( 'models/horse/scene.gltf', function ( gltf ) {
    //Como el centro del modelo del caballo está un poco desplazado, creamos un horseObject que será el padre del caballo para facilitar el manejo de la posición del caballo
    const horseObject = new THREE.Object3D();
    horseObject.position.x = 0;
    horseObject.position.y = 0;
    horseObject.position.z = 0;
    //Desplazamos el modelo del caballo al centro (recordemos que su centro esta desplazado), para que al añadirlo como hijo al horseObject, el centro del horseObject esté en el sitio donde debería encontrarse el centro del modelo del caballo
    gltf.scene.position.y = 1.2;
    gltf.scene.position.x = -2;
    gltf.scene.position.z = -5.5;
    //Establecemos la escala del caballo
    gltf.scene.scale.x = gltf.scene.scale.x*0.13
    gltf.scene.scale.y = gltf.scene.scale.y*0.13
    gltf.scene.scale.z = gltf.scene.scale.z*0.13
    gltf.scene.name = 'horse';
    const horse = gltf.scene;
    horseObject.add(horse)
    //Agregamos el modelo como hijo del objeto tablero.
    //scene.add(horseObject);
    boardObject.add( horseObject );
    

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