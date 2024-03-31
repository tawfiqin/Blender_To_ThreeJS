import * as THREE from 'three'
import { LoadGLTFByPath } from './Helpers/ModelHelper.js'
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from '/node_modules/three/examples/jsm/loaders/RGBELoader.js';
//Renderer does the job of rendering the graphics
let renderer = new THREE.WebGLRenderer({

	//Defines the canvas component in the DOM that will be used
	canvas: document.querySelector('#background'),
  antialias: true,
});
const hdrTextureURL = new URL('/public/images/rostock_laage_airport_2k.hdr',import.meta.url);
renderer.setSize(window.innerWidth, window.innerHeight);

//set up the renderer with the default settings for threejs.org/editor - revision r153
renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights  = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0xffffff, 0);
//make sure three/build/three.module.js is over r152 or this feature is not available. 
renderer.outputColorSpace = THREE.SRGBColorSpace 


const scene = new THREE.Scene();

let cameraList = [];

let camera;
let controls;

// Load the GLTF model
LoadGLTFByPath(scene)
  .then(() => {
    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error('Error loading JSON scene:', error);
  });

//retrieve list of all cameras
function retrieveListOfCameras(scene){
  // Get a list of all cameras in the scene
  scene.traverse(function (object) {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  //Set the camera to the first value in the list of cameras
  camera = cameraList[0];

  updateCameraAspect(camera);
  controls = new OrbitControls(camera,renderer.domElement);
  console.log(controls);
  // Start the animation loop after the model and cameras are loaded
  animate();
}

const light2 = new THREE.PointLight( 0xfcfcfc, 150, 100 );
light2.position.set( 0, 10, 0 );
//scene.add( light2 );

let light = new THREE.SpotLight(0xfff8e8,100);
light.position.set(5,5,7);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 1024*8;
light.shadow.mapSize.height = 1024*8;
scene.add( light );
// Set the camera aspect ratio to match the browser window dimensions
function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
const loader  = new RGBELoader();
loader.load(hdrTextureURL, function(texture){
  texture.mapping = THREE.EquirectangularReflectionMapping;
  //scene.background = texture;
  scene.environment = texture;
  
})
//A method to be run each time a frame is generated
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  light.position.set( 
    camera.position.x + 2,
    camera.position.y + 2,
    camera.position.z + 2,
  );
  renderer.render(scene, camera);
};




    