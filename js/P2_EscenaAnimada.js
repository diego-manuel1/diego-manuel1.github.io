/**
 * EscenaAnimada.js
 * 
 * Practica AGM #2. Escena basica con interfaz y animacion
 * Se trata de añadir un interfaz de usuario que permita 
 * disparar animaciones sobre los objetos de la escena con Tween
 * 
 * @author 
 * 
 */

// Modulos necesarios
/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";
// Variables de consenso
let renderer, scene, camera;
// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let pentShape;
let material;
let figures;
let cameraControls, effectController;
// Acciones
init();
loadScene();
loadGUI();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    /*******************
    * TO DO: Completar el motor de render y el canvas
    *******************/
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);
    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000);
    camera.position.set( 0.5, 2, 7 );
    /*******************
    * TO DO: Añadir manejador de camara (OrbitControls)
    *******************/
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt( new THREE.Vector3(0,1,0) );
}

function loadScene()
{
    material = new THREE.MeshNormalMaterial( {wireframe:false} );
    //Cambiamos de momento a un basic material
    //const material = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );
    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), material );
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    // Creamos el pentagono para posicionar las figuras
    //const geoPent = new THREE.CylinderGeometry( 1, 5, 1, 5, 1);
    //Creamos la geometría de las figuras
    const geoCubo = new THREE.BoxGeometry( 2,2,2 );
    const geoEsfera = new THREE.SphereGeometry( 1, 20,20 );
    const geoCone = new THREE.ConeGeometry( 1, 5, 8, 1);
    const geoCylinder = new THREE.CylinderGeometry( 1, 1, 2);
    const geoCapsule = new THREE.CapsuleGeometry(1, 5, 1);
    //Creamos la mesh con la geometría y el material
    
    const cubo = new THREE.Mesh( geoCubo, material );
    const esfera = new THREE.Mesh( geoEsfera, material );
    const cone = new THREE.Mesh( geoCone, material );
    const cylinder = new THREE.Mesh( geoCylinder, material );
    const capsule = new THREE.Mesh( geoCapsule, material );
    figures = [cubo, esfera, cone, cylinder, capsule];
    //Creamos la forma del pentagono y posicionamos sobre sus vertices a las figuras
    pentShape = new THREE.Shape();
    const pentRadius = 4;
    //const pentSides = 5;

    /*for (let i = 0; i < pentSides; i++) {
        let angle = (i / pentSides) * Math.PI * 2;
        //let angle = (i / pentSides) * (-Math.PI/2);
        let x = Math.cos(angle) * pentRadius;
        let y = Math.sin(angle) * pentRadius;
        if (i === 0) {
            pentShape.moveTo(x, y);
        } else {
            pentShape.lineTo(x, y);
        }
        //Colocamos la figura en la posición
        figures[i].position.x = x;
        figures[i].position.y = y;
    }*/
    stablishPentRadius(pentRadius)
    //Creamos la geometría del pentagono
    const geoPent = new THREE.ShapeGeometry( pentShape );
    const pent = new THREE.Mesh( geoPent, material );
    //Hacemos hijos del mesh del pentagono al resto de mesh y los rotamos para que sean paralelos al pentagono
    for(let i = 0; i < figures.length; i++){
        pent.add(figures[i]);
        figures[i].rotation.x = Math.PI / 2;
    }
    //Rotamos el pentagono para que sea paralelo al suelo (también se mueven las figuras para que sean paralelas sobre el plano)
    pent.rotation.x = -Math.PI / 2;
    
    //Creamos el objeto 3D que representa el pentagono
    const pentObject = new THREE.Object3D();
    pentObject.position.x=0;
    pentObject.position.y=1;
    pentObject.position.z=0;
    pentObject.add(pent);
    pentObject.add( new THREE.AxesHelper(1) );
    //Agregamos el objeto a la escena
    scene.add(pentObject);
    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const glloader = new GLTFLoader();
    glloader.load( 'models/anime_lady_officer/scene.gltf', function ( gltf ) {
            gltf.scene.position.y = 0;
            gltf.scene.rotation.y = -Math.PI/2;
            pentObject.add( gltf.scene );
            gltf.scene.scale.x = gltf.scene.scale.y * 2;
            gltf.scene.scale.y = gltf.scene.scale.y * 2;
            gltf.scene.scale.z = gltf.scene.scale.z * 2;
            console.log("LADY OFFICER");
            model = gltf.scene;
            console.log(gltf);
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    scene.add( new THREE.AxesHelper(3) );
}
//Función que establece el radio del pentagono
function stablishPentRadius(radius){
    for (let i = 0; i < 5; i++) {
        let angle = (i / 5) * Math.PI * 2;
        //let angle = (i / pentSides) * (-Math.PI/2);
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        if (i === 0) {
            pentShape.moveTo(x, y);
        } else {
            pentShape.lineTo(x, y);
        }
        //Colocamos la figura en la posición
        figures[i].position.x = x;
        figures[i].position.y = y;
    }
}

function loadGUI()
{
    // Interfaz de usuario
    /*******************
    * TO DO: Crear la interfaz de usuario con la libreria lil-gui.js
    * - Funcion de disparo de animaciones. Las animaciones deben ir
    *   encadenadas
    * - Slider de control de radio del pentagono
    * - Checkbox para alambrico/solido
    *******************/
   // Definicion de los controles
	effectController = {
		mensaje: 'Lady Officer',
		radioPent: 4.0,
        alambric: false,
	};

	// Creacion interfaz
	const gui = new GUI();

	// Construccion del menu
	const h = gui.addFolder("Control PentObject");
	h.add(effectController, "mensaje").name("Aplicacion");
	h.add(effectController, "radioPent", 0, 10).name("Radio del pentagono");
    h.add(effectController, "alambric").name("Alambric");

    gui.onChange( event => {
        //Si se modifica el controlador del radio, modificamos el radio del pentagono
        if(event.property == "radioPent"){
            stablishPentRadius(event.value)
        }
        //Si se modifica el check box del controlador del matarial, modificamos el material
        if(event.property == "alambric"){
            material.wireframe = event.value;
        }
    })
}

function update(delta)
{
    /*******************
    * TO DO: Actualizar tween
    *******************/
}

function render(delta)
{
    requestAnimationFrame( render );
    update(delta);
    renderer.render( scene, camera );
}