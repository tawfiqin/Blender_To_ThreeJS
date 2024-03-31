import * as THREE from 'three'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

const scenePath = '/public/models/scene3.gltf';
const cubePath = '/public/models/cube.gltf';


export const LoadGLTFByPath = (scene) => {
    return new Promise((resolve, reject) => {
      // Create a loader
      const loader = new GLTFLoader();
  
      // Load the GLTF file
      loader.load(scenePath, (gltf) => {
        let model = gltf.scene.children[0];
        console.log(model);
        model.traverse(n => { if ( n.isMesh ) {
          n.castShadow = true; 
          n.receiveShadow = true;
          if(n.material.map) n.material.map.anisotropy = 32; 
        }});
        scene.add(gltf.scene);

        resolve();
      }, undefined, (error) => {
        reject(error);
      });
      
      
    });
};