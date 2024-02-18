/**
 * Escena.js
 * 
 * Practica AGM #1. Escena basica en three.js
 * Seis objetos organizados en un grafo de escena con
 * transformaciones, animacion basica y modelos importados
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

// Variables de consenso
let renderer, scene, camera;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let pentObject;
let angulo = 0;

// Acciones
init();
loadScene();
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
    camera.lookAt( new THREE.Vector3(0,1,0) );
}

function loadScene()
{
    //const material = new THREE.MeshNormalMaterial();
    //Cambiamos de momento a un basic material
    const material = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );
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
    //Creamos la forma del pentagono
    const pentShape = new THREE.Shape();
    const pentRadius = 4;
    const pentSides = 5;
    for (let i = 0; i < pentSides; i++) {
        let angle = (i / pentSides) * Math.PI * 2;
        let x = Math.cos(angle) * pentRadius;
        let y = Math.sin(angle) * pentRadius;
        if (i === 0) {
            pentShape.moveTo(x, y);
        } else {
            pentShape.lineTo(x, y);
        }
    }
    //Creamos la geometría del pentagono
    const geoPent = new THREE.ShapeGeometry( pentShape );
    const pent = new THREE.Mesh( geoPent, material );
    pent.rotation.x = -Math.PI / 2;
    //Creamos la geometría de las figuras
    const geoCubo = new THREE.BoxGeometry( 2,2,2 );
    const geoEsfera = new THREE.SphereGeometry( 1, 20,20 );
    const geoCone = new THREE.ConeGeometry( 1, 20, 8, 1);
    const geoCylinder = new THREE.CylinderGeometry( 1, 1, 2);
    const geoCapsule = new THREE.CapsuleGeometry(1, 5, 1);
    //Creamos la mesh con la geometría y el material
    
    const cubo = new THREE.Mesh( geoCubo, material );
    const esfera = new THREE.Mesh( geoEsfera, material );
    const cone = new THREE.Mesh( geoCone, material );
    const cylinder = new THREE.Mesh( geoCylinder, material );
    const capsule = new THREE.Mesh( geoCapsule, material );
    let figures = [cubo, esfera, cone, cylinder, capsule]
    //Creamos el objeto 3D que representa el pentagono
    pentObject = new THREE.Object3D();
    pentObject.position.x=0;
    pentObject.position.y=1;
    pentObject.position.z=0;
    pentObject.add(pent);
    pentObject.add( new THREE.AxesHelper(1) );
    //Agregamos al pentagono las cinco figuras
    pentObject.add(cubo);
    pentObject.add(esfera);
    pentObject.add(cone);
    pentObject.add(cylinder);
    pentObject.add(capsule);
    //Obtenemos los vertices de la geometría del pentagono
    //pentVertices = geoPent.getAttribute('position');
    //Colocamos el resto de figuras en los extremos del pentagono.
    /*const vertex = new THREE.Vector3();
    for(let i = 0; i < 5; i++)
    {
        vertex.fromBufferAttribute(pentVertices, i);
        figures[i].position.x = vertex.x;
        figures[i].position.y = vertex.y;
        figures[i].position.z = vertex.z;
    }*/
    //Agregamos el objeto a la escena
    scene.add(pentObject);
    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    /*const glloader = new GLTFLoader();
    glloader.load( 'models/RobotExpressive.glb', function ( gltf ) {
        //glloader.load( 'models/robota/scene.gltf', function ( gltf ) {
            gltf.scene.position.y = 1;
            gltf.scene.rotation.y = -Math.PI/2;
            esfera.add( gltf.scene );
            console.log("ROBOT");
            console.log(gltf);
        
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    scene.add( new THREE.AxesHelper(3) );
}

function update()
{
    /*******************
    * TO DO: Modificar el angulo de giro de cada objeto sobre si mismo
    * y del conjunto pentagonal sobre el objeto importado
    *******************/
    angulo += 0.01;
    pentObject.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}