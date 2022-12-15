import * as THREE from 'three'
import { OBJLoader } from './addons/loaders/OBJLoader.js';
import { MTLLoader } from './addons/loaders/MTLLoader.js';
import { GLTFLoader } from './addons/loaders/GLTFLoader.js';
function Loadmodel(modelpath,material,tex,texN,scene,posi,rota,sca,uvsc){
  return new Promise((resolve) => {
  const objLoader = new OBJLoader();
  objLoader.load(modelpath,(obj) => {
    obj.traverse((child) => {
     if (child.isMesh){
      child.receiveShadow = true;
      child.castShadow = true;
      child.material = material;
      child.material.map = tex;
      child.material.normalMap = texN;
      child.geometry.attributes.uv.array = child.geometry.attributes.uv.array.map(x => x / uvsc);
     }
    });
    //console.log(obj);
    if(scene!=null){
    scene.add(obj);
    obj.position.set(posi.x,posi.y,posi.z);
    obj.rotation.set(rota.x,rota.y,rota.z);
    obj.scale.set(sca.x,sca.y,sca.z);
    }
    return resolve(obj);
  });
  
  })
}
function LoadmodelG(modelpath,material,tex,texN,scene,posi,rota,sca,texS){
  return new Promise((resolve) => {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(modelpath,(obj) => {
    const gltf = obj.scene;
    gltf.traverse((child) => {
      if (child.isMesh){
       child.receiveShadow = true;
       child.castShadow = true;
       child.material = material;
       child.material.map = tex;
       child.material.map.encoding = THREE.sRGBEncoding;
       child.material.map.flipY = false;
       child.material.normalMap = texN;
       child.material.normalMap.encoding = THREE.sRGBEncoding;
       child.material.normalMap.flipY = false;
       child.material.aoMap = texS;
       child.material.aoMap.encoding = THREE.sRGBEncoding;
       child.material.aoMap.flipY = false;
       child.material.lightMap = texS;
       child.material.lightMap.encoding = THREE.sRGBEncoding;
       child.material.lightMap.flipY = false;
       child.geometry.attributes.uv.array = child.geometry.attributes.uv.array.map(x => x / 2);
      }
     });
     if(scene!=null){
     scene.add(gltf);
     gltf.position.set(posi.x,posi.y,posi.z);
     gltf.rotation.set(rota.x,rota.y,rota.z);
     gltf.scale.set(sca.x,sca.y,sca.z);
     }
     return resolve(gltf);
  });
  })
}
function LoadmodelM(modelpath,mtlpath,textureEquirec,scene,posi,rota,sca){
  return new Promise((resolve) => {
  const manager = new THREE.LoadingManager();
  const objLoader = new OBJLoader(manager);
  new MTLLoader(manager).load(mtlpath, (materials) => {
  materials.preload();
  objLoader.setMaterials(materials).load(modelpath,(obj) => {
    obj.traverse((child) => {
     if (child.isMesh){
      child.receiveShadow = true;
      child.castShadow = true;
      child.material[0]= new THREE.MeshStandardMaterial({
        roughness:0.8,
        metalness:0,
        envMap:textureEquirec,
        normalScale:new THREE.Vector2( 0.1,0.1 )
      });
        child.material[0].map = new THREE.Texture();
      child.material[1]= new THREE.MeshStandardMaterial({
        roughness:0.8,
        metalness:0,
        envMap:textureEquirec,
        normalScale:new THREE.Vector2( 0.3,0.3 )
      });
        child.material[1].map = new THREE.Texture();
     }
    });
    console.log("Loadmodel:"+modelpath);
    if(scene!=null){
    scene.add(obj);
    obj.position.set(posi.x,posi.y,posi.z);
    obj.rotation.set(rota.x,rota.y,rota.z);
    obj.scale.set(sca.x,sca.y,sca.z);
    }
    return resolve(obj);
    });
  })
  })
}
function CreateObject(scene,Mobj,posi,rota,sca){
  return new Promise((resolve) => {
    console.log("createmodel")
    const obj = Mobj.clone();
    scene.add(obj);
    obj.position.set(posi.x,posi.y,posi.z);
    obj.rotation.set(rota.x,rota.y,rota.z);
    obj.scale.set(sca.x,sca.y,sca.z);
    return resolve(obj);
  })
}
export{Loadmodel,CreateObject,LoadmodelM,LoadmodelG}