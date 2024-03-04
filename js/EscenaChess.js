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
    //Añadimos luz direccional
    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.3);
    direccional.position.set(-1,10,-1);
    direccional.castShadow = true;
    scene.add(direccional);
    scene.add(new THREE.CameraHelper(direccional.shadow.camera));
    //Añadimos luz focal
    const focal = new THREE.SpotLight(0xFFFFFF,0.3);
    focal.position.set(-2,30,4);
    focal.target.position.set(0,0,0);
    focal.angle= Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow= true;
    focal.shadow.camera.far = 20;
    focal.shadow.camera.fov = 80;
    scene.add(focal);
    scene.add(new THREE.CameraHelper(focal.shadow.camera));
}

function loadScene()
{
    //Creamos las texturas
    //const texsuelo = new THREE.TextureLoader().load("images/chess/Cement/Cement.jpg");
    const texsuelo = new THREE.TextureLoader().load("images/chess/baldosas.jpg");
    //Creamos el material del suelo
    //const materialSuelo = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );
    const materialSuelo = new THREE.MeshStandardMaterial({map:texsuelo});
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), materialSuelo );
    suelo.receiveShadow = true;
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
    // Habitacion
    const path ="images/chess/Yokohama/"
    const paredes = [];
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"posx.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"negx.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"posy.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"negy.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"posz.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                  map: new THREE.TextureLoader().load(path+"negz.jpg")}) );
    const habitacion = new THREE.Mesh( new THREE.BoxGeometry(40,40,40),paredes);
    /*habitacion.position.x = 0;
    habitacion.position.y = 10;
    habitacion.position.z = 0;*/
    scene.add(habitacion);
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
     gltf.scene.traverse(ob=>{
        if(ob.isObject3D){
             ob.castShadow = true;
             ob.receiveShadow = true;
        }
    })
 
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
       gltf.scene.traverse(ob=>{
        if(ob.isObject3D){
             ob.castShadow = true;
             ob.receiveShadow = true;
        }
        })
   
   }, undefined, function ( error ) {
   
       console.error( error );
   
   } );
}
/***
 * Límites del tablero:
 * x=[-21,21]
 * z=[-21,21]
 */
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
       gltf.scene.traverse(ob=>{
        if(ob.isObject3D){
             ob.castShadow = true;
             ob.receiveShadow = true;
        }
        })
   
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
    gltf.scene.traverse(ob=>{
        if(ob.isObject3D){
             ob.castShadow = true;
             ob.receiveShadow = true;
        }
    })
    }, undefined, function ( error ) {

        console.error( error );

    } );

    glloader.load( 'models/bishop/scene.gltf', function ( gltf ) {
        gltf.scene.position.y = 1.5;
        gltf.scene.position.x = 9;
        gltf.scene.position.z = 21;
        //Establecemos la escala del rey
        gltf.scene.scale.x = gltf.scene.scale.x*3
        gltf.scene.scale.y = gltf.scene.scale.y*3
        gltf.scene.scale.z = gltf.scene.scale.z*3
        gltf.scene.name = 'bishop1';
        const bishop1 = gltf.scene;
        //Agregamos el modelo como hijo del objeto tablero.
        //boardObject.add( king );
        boardObject.add( bishop1 );
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D){
                 ob.castShadow = true;
                 ob.receiveShadow = true;
            }
        })
    }, undefined, function ( error ) {
    
            console.error( error );
    
    } );

    glloader.load( 'models/bishop/scene.gltf', function ( gltf ) {
        gltf.scene.position.y = 1.5;
        gltf.scene.position.x = -9;
        gltf.scene.position.z = 21;
        //Establecemos la escala del rey
        gltf.scene.scale.x = gltf.scene.scale.x*3
        gltf.scene.scale.y = gltf.scene.scale.y*3
        gltf.scene.scale.z = gltf.scene.scale.z*3
        gltf.scene.name = 'bishop2';
        const bishop2 = gltf.scene;
        //Agregamos el modelo como hijo del objeto tablero.
        //boardObject.add( king );
        boardObject.add( bishop2 );
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D){
                 ob.castShadow = true;
                 ob.receiveShadow = true;
            }
        })
    }, undefined, function ( error ) {
    
            console.error( error );
    
    } );

   glloader.load( 'models/horse/scene.gltf', function ( gltf ) {
    //Como el centro del modelo del caballo está un poco desplazado, creamos un horseObject que será el padre del caballo para facilitar el manejo de la posición del caballo
    const horseObject = new THREE.Object3D();
    horseObject.position.x = 15;
    horseObject.position.y = 0;
    horseObject.position.z = 21;
    //Desplazamos el modelo del caballo al centro (recordemos que su centro esta desplazado), para que al añadirlo como hijo al horseObject, el centro del horseObject esté en el sitio donde debería encontrarse el centro del modelo del caballo
    gltf.scene.position.y = 1.2;
    gltf.scene.position.x = -2;
    gltf.scene.position.z = -5.5;
    //Establecemos la escala del caballo
    gltf.scene.scale.x = gltf.scene.scale.x*0.13
    gltf.scene.scale.y = gltf.scene.scale.y*0.13
    gltf.scene.scale.z = gltf.scene.scale.z*0.13
    gltf.scene.name = 'horse1';
    const horse1 = gltf.scene;
    horseObject.add(horse1)
    //Agregamos el modelo como hijo del objeto tablero.
    //scene.add(horseObject);
    boardObject.add( horseObject );
    gltf.scene.traverse(ob=>{
        if(ob.isObject3D){
             ob.castShadow = true;
             ob.receiveShadow = true;
        }
    })

    }, undefined, function ( error ) {

        console.error( error );

    } );

    glloader.load( 'models/horse/scene.gltf', function ( gltf ) {
        //Como el centro del modelo del caballo está un poco desplazado, creamos un horseObject que será el padre del caballo para facilitar el manejo de la posición del caballo
        const horseObject = new THREE.Object3D();
        horseObject.position.x = -15;
        horseObject.position.y = 0;
        horseObject.position.z = 21;
        //Desplazamos el modelo del caballo al centro (recordemos que su centro esta desplazado), para que al añadirlo como hijo al horseObject, el centro del horseObject esté en el sitio donde debería encontrarse el centro del modelo del caballo
        gltf.scene.position.y = 1.2;
        gltf.scene.position.x = -2;
        gltf.scene.position.z = -5.5;
        //Establecemos la escala del caballo
        gltf.scene.scale.x = gltf.scene.scale.x*0.13
        gltf.scene.scale.y = gltf.scene.scale.y*0.13
        gltf.scene.scale.z = gltf.scene.scale.z*0.13
        gltf.scene.name = 'horse2';
        const horse2 = gltf.scene;
        horseObject.add(horse2)
        //Agregamos el modelo como hijo del objeto tablero.
        //scene.add(horseObject);
        boardObject.add( horseObject );
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D){
                 ob.castShadow = true;
                 ob.receiveShadow = true;
            }
        })
    
        }, undefined, function ( error ) {
    
            console.error( error );
    
        } );

    glloader.load( 'models/rook/scene.gltf', function ( gltf ) {
        gltf.scene.position.y = 1.5;
        gltf.scene.position.x = 21;
        gltf.scene.position.z = 21;
        //Establecemos la escala del rey
        gltf.scene.scale.x = gltf.scene.scale.x*3
        gltf.scene.scale.y = gltf.scene.scale.y*3
        gltf.scene.scale.z = gltf.scene.scale.z*3
        gltf.scene.name = 'rook1';
        const rook1 = gltf.scene;
        //Agregamos el modelo como hijo del objeto tablero.
        //boardObject.add( king );
        boardObject.add( rook1 );
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D){
                 ob.castShadow = true;
                 ob.receiveShadow = true;
            }
        })

    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    glloader.load( 'models/rook/scene.gltf', function ( gltf ) {
        gltf.scene.position.y = 1.5;
        gltf.scene.position.x = -21;
        gltf.scene.position.z = 21;
        //Establecemos la escala del rey
        gltf.scene.scale.x = gltf.scene.scale.x*3
        gltf.scene.scale.y = gltf.scene.scale.y*3
        gltf.scene.scale.z = gltf.scene.scale.z*3
        gltf.scene.name = 'rook2';
        const rook2 = gltf.scene;
        //Agregamos el modelo como hijo del objeto tablero.
        //boardObject.add( king );
        boardObject.add( rook2 );
        gltf.scene.traverse(ob=>{
            if(ob.isObject3D){
                 ob.castShadow = true;
                 ob.receiveShadow = true;
            }
        })

    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    //Cargamos los peones

    for(let i = 0; i < 8; i++){
        glloader.load( 'models/pawn/scene.gltf', function ( gltf ) {
            gltf.scene.position.y = 1.5;
            gltf.scene.position.x = -21+i*6;
            gltf.scene.position.z = 15;
            //Establecemos la escala del rey
            gltf.scene.scale.x = gltf.scene.scale.x*3
            gltf.scene.scale.y = gltf.scene.scale.y*3
            gltf.scene.scale.z = gltf.scene.scale.z*3
            gltf.scene.name = ('pawn'+(i+1));
            const pawn = gltf.scene;
            //Agregamos el modelo como hijo del objeto tablero.
            //boardObject.add( king );
            boardObject.add( pawn );
            gltf.scene.traverse(ob=>{
                if(ob.isObject3D){
                     ob.castShadow = true;
                     ob.receiveShadow = true;
                }
            })
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
    }
}
//Función que inicia la animación de la pieza seleccionada.
function movePiece(){
    let pawn = scene.getObjectByName('pawn1');
    let oldPositionX = pawn.position.x;
    let oldPositionY = pawn.position.y;
    let oldPositionZ = pawn.position.z;
    new TWEEN.Tween( pawn.position ).
        to( {x:[oldPositionX,oldPositionX+6],y:[oldPositionY,5,oldPositionY],z:[oldPositionZ,oldPositionZ-6]}, 2000 ).
        interpolation( TWEEN.Interpolation.Bezier ).
        easing( TWEEN.Easing.Bounce.Out ).
        start();
}
function setupGUI()
{
    const effectController = {
		mensaje: 'Prueba animación',
        play: function(){movePiece();}
    }

    // Creacion interfaz
	const gui = new GUI();

	// Construccion del menu
	const h = gui.addFolder("Prueba animaciones");
    h.add(effectController, "mensaje").name("Aplicacion");
    h.add(effectController, "play").name("Probar animación de piezas");
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