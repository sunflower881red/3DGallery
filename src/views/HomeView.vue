<script>
import 'animate.css';
import * as THREE from 'three'
//import { OBJLoader } from '../addons/loaders/OBJLoader.js';
import  { sheetL } from "@/sheet.js"
import {Loadmodel,CreateObject,LoadmodelM} from '@/CreateObject.js';
import pictureload from '../components/PictureLoad.vue';
import { EffectComposer } from '../addons/postprocessing/EffectComposer.js';
import { RenderPass } from '../addons/postprocessing/RenderPass.js';
import { Water } from '../addons/objects/Water.js';
// import { SSAOPass } from '../addons/postprocessing/SSAOPass.js';
import { VRButton } from '../addons/webxr/VRButton.js';
export default {
  components: {
    pictureload,
  },
  data() {
    this.cre=null
    this.scene = null
    this.camera = null
    this.renderer = null
    this.cube = null
    this.iwa=null
    this.dl=null
    this.keycode=null
    this.wtex = null
    this.t=0
    this.id=0
    this.sheet=new Array()
    this.sheetL=sheetL
    this.sid=0
    this.composer=null
    this.gakubutiM=null
    this.Llist=null
    this.hemi=null
    this.env=null
    this.mate=null
    this.reso=1.5
    this.raycaster=null
    this.pointer=null
    this.xrcamera=null
    this.vr=null
    this.pls=null
    this.closeflag=false
    this.img=[]
    this.flame=0
    this.ct=0
    this.haiti=false
    this.time=0
    this.water=null
    this.xyz=[]
    this.PicList=[
      {
          name:'',
          author:0,
          year:0,
          caption:''
        },
        {
          name:'ピクチャー1',
          author:'あなた',
          year:'1996年',
          caption:'風景を描きました'
        },
        {
          name:'ピクチャー2',
          author:'あなた',
          year:'1998年',
          caption:'海を描きました'
        },        {
          name:'ピクチャー3',
          author:'あなた',
          year:'1986年',
          caption:'森を描きました'
        },        {
          name:'ピクチャー4',
          author:'あなた',
          year:'1996年',
          caption:'砂漠を描きました'
        }
      ]
    return {
      gui:[],
      infoflag:false,
      cameflag:false,
      menuflag:false,
      Gra_radio:'',
      select:0,
      menusele:0,
      vrbarflag:true,
      src:[],
      shsize:256
    }
  },

  mounted() {
    this.init()
    this.SetObject()
    this.animateLoop()
  },

  methods: {
    init() {
      this.select=0;
      this.menuon(2);
      this.Llist=[
        {
          hemiI:0.2,
          dlI:0.3,
          dlC:0xffffff,
          mapRif:''
        },
        {
          hemiI:0.2,
          dlI:1,
          dlC:0xffffff,
          mapRif:''
        },
        {
          hemiI:0.2,
          dlI:0.6,
          dlC:0xf7b160,
          mapRif:''
        },
        {
          hemiI:0.25,
          dlI:1,
          dlC:0xffffff,
          mapRif:'../assets/park_parking_4k.jpg'
        }
        
      ]
      this.setLights(3);
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xaaaaaa );
      this.scene.fog = new THREE.Fog(0xffffff, 0, 8200);
      this.camera = new THREE.PerspectiveCamera(
        40, // FOV
        window.innerWidth / window.innerHeight, // aspect ratio
        10, // near
        6000 // far
      )
      this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.canvasRef })
      //this.renderer.toneMapping=THREE.CineonToneMapping;
      const domm = document.getElementById("vrb");
      domm.appendChild( VRButton.createButton( this.renderer ) );
      domm.addEventListener('click',this.resetmove);
      this.vrbarflag=false;
      this.renderer.xr.enabled = true;
      this.renderer.autoClear = false;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.xrcamera= new THREE.Object3D();
      this.xrcamera.add(this.camera);
      this.camera.position.x=-40;
      this.xrcamera.position.x = 0;
      this.xrcamera.position.y = 10;
      this.xrcamera.position.z = 180;
      this.scene.add(this.xrcamera);

      // レンダリング解像度
      this.WindowResize();
      window.addEventListener('resize',this.WindowResize);
      window.addEventListener( 'pointermove', this.onPointerMove);
      window.addEventListener( 'click', this.selectinfo);
      //////////////////////////////////////
     
    },

    SetObject() {

      this.xrcamera.position.x = 0;
      this.xrcamera.position.y = 10;
     
      const geometry2 = new THREE.BoxGeometry( 1000, 2, 1000 );
      const geometry3 = new THREE.BoxGeometry( 10, 32, 10 );
      const geometry4 = new THREE.SphereGeometry( 15, 32, 16 );
      /////
      const tex = new THREE.TextureLoader().load('../assets/texC2/stone_wall_diff_1k.webp');
      const texN = new THREE.TextureLoader().load('../assets/coral_fort_wall_01_nor_gl_1k.webp');
      const texNr = new THREE.TextureLoader().load('../assets/texC2/stone_wall_nor_gl_1k.webp');
      const texARM = new THREE.TextureLoader().load('../assets/texC2/stone_wall_arm_1k.webp');
      const texW = new THREE.TextureLoader().load('../assets/wood_cabinet_worn_long_diff_1k.jpeg');
      const texS = new THREE.TextureLoader().load('../assets/stage_ao.jpg');

      const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

      this.water = new Water(
        waterGeometry,
        {
          textureWidth: 256,
          textureHeight:256,
          waterNormals: texN,
          sunDirection: new THREE.Vector3(),
          sunColor: 0x2222ff,
          waterColor: 0xffffff,
          distortionScale: 3.7,
          fog: this.scene.fog !== undefined
        }
      );

      this.water.rotation.x = - Math.PI / 2;
      this.water.material.uniforms[ 'size' ].value = 2;
      this.scene.add(this.water );
      // const texB = new THREE.TextureLoader().load('../assets/tex5/castle_brick_02_red_diff_1k.jpg');
      // const texBN = new THREE.TextureLoader().load('../assets/tex5/castle_brick_02_red_nor_gl_1k.jpg');
      // const texBR = new THREE.TextureLoader().load('../assets/tex5/castle_brick_02_red_rough_1k.jpg');
      /////
      const rep =new THREE.Vector2(14,14);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat=rep;
      texN.wrapS = THREE.RepeatWrapping;
      texN.wrapT = THREE.RepeatWrapping;
      texN.repeat=new THREE.Vector2(4,4);
      texNr.wrapS = THREE.RepeatWrapping;
      texNr.wrapT = THREE.RepeatWrapping;
      texNr.repeat=rep;
      texARM.wrapS = THREE.RepeatWrapping;
      texARM.wrapT = THREE.RepeatWrapping;
      texARM.repeat=rep;
      texW.wrapS = THREE.RepeatWrapping;
      texW.wrapT = THREE.RepeatWrapping;
      texW.repeat=new THREE.Vector2(4,4);
      this.wtex=texN;

      const materialW = new THREE.MeshStandardMaterial({
        color:0xbfd3d9,
        roughness:0.2,
        metalness:0.8,
        envMap:this.env,
        normalMap:texN,
        normalScale:new THREE.Vector2( 1.6,1.6 ),
      })
      const materialT = new THREE.MeshStandardMaterial({
        color:0xccccbb,
        RoughnessMap:texARM,
        metalnessMap:texARM,
        aoMap:texS,
        map:tex,
        envMap:this.env,
        envMapIntensity:1,
        normalMap:texNr,
        normalScale:new THREE.Vector2( 1,1 ),
        lightMap:texS
      })
      const materialT2 = new THREE.MeshStandardMaterial({
        color:0xccccbb,
        RoughnessMap:texARM,
        metalnessMap:texARM,
        aoMap:texARM,
        map:tex,
        envMap:this.env,
        envMapIntensity:1,
        normalMap:texNr,
        normalScale:new THREE.Vector2( 1,1 ),
      })
      this.mate=materialT2;
      this.dl.shadow.camera.right = 512;
      this.dl.shadow.camera.left = -512;
      this.dl.shadow.camera.top = -512;
      this.dl.shadow.camera.bottom = 512;
      this.dl.castShadow = true;
      this.dl.shadow.mapSize.set(2048,2048);
      const setT = setTimeout(this.shadowstatic,5000);
      console.log(setT);
      this.dl.shadow.camera.near = 0.5; // default
      this.dl.shadow.camera.far = 1500; // default
      this.dl.shadow.bias=-0.009;
      this.dl.shadow.normalBias=0.001;
      this.dl.shadow.blurSamples=6;
      this.scene.add( this.dl );
      this.scene.add( this.hemi);
      this.pls = new THREE.PointLight(0xffaf59, 1.2, 80, 3);
      this.scene.add(this.pls);
      this.pls.position.set(-4000,30,40);
      // this.pls.castShadow = true; // default false
      // this.pls.shadow.mapSize.width = 128; // default
      // this.pls.shadow.mapSize.height = 128; // default
      // this.pls.shadow.camera.near = 0.5; // default
      // this.pls.shadow.camera.far = 500; // default
      // this.pls.shadow.bias=-0.009;
      //const pl = new THREE.PointLight(0xffaf59, 1, 80, 3);
      //this.scene.add(pl);
      //pl.position.set(-139,30,40);
      //const pl2 = new THREE.PointLight(0xffaf59, 1, 80, 3);
      //this.scene.add(pl2);
     // pl2.position.set(-139,30,-40);
      this.cube = new THREE.Mesh(geometry3, materialT)
      this.cube.receiveShadow = true;
      this.cube.castShadow = true;
      this.cube.position.set(30,20,-60);
      this.cube2 = new THREE.Mesh(geometry2, materialW)
      this.cube3 = new THREE.Mesh(geometry3, materialT2)
      this.gakubutiM = new Array(10);
      const sc = new THREE.Mesh(geometry4, materialT2)
      this.cube2.receiveShadow = true;
      this.cube2.castShadow = true;
      this.cube3.receiveShadow = true;
      this.cube3.castShadow = true;
      sc.receiveShadow = true;
      sc.castShadow = true;
      //this.scene.add(this.cube)
      this.scene.add(this.cube3)
      sc.position.y=50;
      this.cube2.position.y=-10;
      const targetObject = new THREE.Object3D(); 
      this.scene.add(targetObject); 
      this.dl.target = targetObject;
      this.dl.position.set(300,100,0);
      this.dl.target.position.set(-95,-305,-150);

      this.scene.background=this.env;

      Loadmodel('../assets/wall2.obj',materialT2,tex,texNr,this.scene,new THREE.Vector3(0,-30,-30),new THREE.Vector3(0,0,0),new THREE.Vector3(3,3,3),5)
      .then(obj => CreateObject(this.scene,obj,new THREE.Vector3(-200,-30,-35),new THREE.Vector3(0,4.7,0),new THREE.Vector3(3,3,3)))
      .then(obj => CreateObject(this.scene,obj,new THREE.Vector3(-200,-30,35),new THREE.Vector3(0,4.7,0),new THREE.Vector3(3,3,3)))
      .then(obj => CreateObject(this.scene,obj,new THREE.Vector3(0,-30,-210),new THREE.Vector3(0,0,0),new THREE.Vector3(3,3,3)))

      Loadmodel('../assets/brige.obj',materialT2,tex,texNr,this.scene,new THREE.Vector3(12,2,56),new THREE.Vector3(0,0,0),new THREE.Vector3(1.5,2,1.1),19)
      .then(obj => CreateObject(this.scene,obj,new THREE.Vector3(23,2,-144.2),new THREE.Vector3(0,0,0),new THREE.Vector3(2,2,1.1)));
      Loadmodel('../assets/stageRR.obj',materialT,tex,texNr,this.scene,new THREE.Vector3(0,-5,0),new THREE.Vector3(0,0,0),new THREE.Vector3(20,20,20),9)
      
      const xyz = [
      {
          x:new THREE.Vector3(0,16,0),
          y:new THREE.Vector3(0,-3.15,0),
          z:new THREE.Vector3(2,2,2)
      },
      {
          x:new THREE.Vector3(-132,11,50),
          y:new THREE.Vector3(0,-4.7,0),
          z:new THREE.Vector3(2,2,2)
      },
      {
          x:new THREE.Vector3(-132,11,-43),
          y:new THREE.Vector3(0,4.7,0),
          z:new THREE.Vector3(2,2,2)
      },
      {
          x:new THREE.Vector3(105,16,39),
          y:new THREE.Vector3(0,-3.15,0),
          z:new THREE.Vector3(2,2,2)
      }
      ]
      this.xyz=xyz;
        for (let i = 0; i < 4; i++) {
          LoadmodelM('../assets/gakubuti.obj','../assets/gakubuti.mtl',this.env,this.scene,xyz[i].x,xyz[i].y,xyz[i].z)
          .then(obj => {
            obj.children[0].name="picture__"+i;
            this.gakubutiM[i]=obj;
            obj.children[0].material[0].map=texW;
            obj.children[0].material[1].map=texW;
            obj.children[0].material[1].normalMap=texN;
            obj.children[0].material[0].normalMap=texN;
            obj.children[0].material[0].normalScale=new THREE.Vector2( 0.2,0.2 );
            
          })
        }
        this.id=0;
    },
    Scrolltex(tex,x,y)
    {
      tex.offset.x+=x;
      tex.offset.y+=y;
    }
    ,
    lerp(a, b, t) {
      return (1 - t) * a + t * b;
    }
    ,
    animateLoop() {
      this.camera.position.x=0;
      this.camera.position.z=0;
      this.camera.position.y=0;
      this.time = performance.now() * 0.001;
      this.water.material.uniforms[ 'time' ].value += 1.0 / 120.0;
      const time =30.952326666666693;
			this.dl.position.x = Math.cos( time ) * 600;
			this.dl.position.z = Math.sin( time ) * 600;
      if(this.t>0.5&&this.id==5)this.infoflag=true;
      this.renderer.setAnimationLoop(this.animateLoop)
      const forward = new THREE.Vector4(0,0,1,0);
      const side = new THREE.Vector4(1,0,0,0);
      forward.applyMatrix4(this.xrcamera.matrix).normalize();
      side.applyMatrix4(this.xrcamera.matrix).normalize();
      window.document.onkeydown = (evt) => {
        this.keycode = evt.code;
        
      }
      if(this.t<1&&this.cameflag==true&&this.id<this.sheetL.length-1){
        this.t+=0.0022;
        let shv = new THREE.Vector3(this.xrcamera.position.x,this.xrcamera.position.y,this.xrcamera.position.z);
        let shv1 = new THREE.Vector3(this.sheetL[this.id+1].pp.x,this.sheetL[this.id+1].pp.y,this.sheetL[this.id+1].pp.z);
        // let rhv = new THREE.Vector3(this.xrcamera.rotation.x,this.xrcamera.rotation.y,this.xrcamera.rotation.z);
        // let rhv1 = new THREE.Vector3(this.sheetL[this.id+1].rr.x,this.sheetL[this.id+1].rr.y,this.sheetL[this.id+1].rr.z);
        let pp= shv.lerp(shv1,this.easeInOutCubic(this.t))
        //let rr= rhv.lerp(rhv1,this.easeInOutCubic(this.t))
        this.xrcamera.position.set(pp.x,pp.y,pp.z);
        //this.xrcamera.rotation.set(rr.x,rr.y,rr.z);
        this.cre=pp;
        //console.log("rgrzeger");
      }
      if(this.id>3){
          this.t=0;
          this.id=0;
        }
        this.camera.lookAt(new THREE.Vector3(this.xyz[this.id].x.x,this.xyz[this.id].x.y,this.xyz[this.id].x.z));
        this.xrcamera.lookAt(new THREE.Vector3(this.xyz[this.id].x.x,this.xyz[this.id].x.y,this.xyz[this.id].x.z));
       
      this.Scrolltex(this.wtex,0.000003,0.00003);
      let distance = this.xrcamera.position.distanceTo(this.xyz[this.id].x);
      if(this.cameflag==true){
      if(distance>30)
      this.xrcamera.position.set(this.xrcamera.position.x+forward.x/2*this.pointer.y,this.xrcamera.position.y+forward.y/2*this.pointer.y,this.xrcamera.position.z+forward.z/2*this.pointer.y);
      this.xrcamera.position.set(this.xrcamera.position.x+side.x/2*-this.pointer.x,this.xrcamera.position.y+side.y/2*-this.pointer.x,this.xrcamera.position.z+side.z/2*-this.pointer.x);
      }
      if(this.keycode=="KeyL"){
        this.makesheet();
      }
   
      this.keycode=''
      this.cube.rotation.x+=-0.004;
      if(this.flame==1){
        this.Raycast();
        this.flame=0;
      }
      this.flame++;
      this.composer.render(this.scene, this.xrcamera)
      //this.gui=[this.camera.position.x,this.camera.position.y,this.camera.position.z,this.camera.rotation.x,this.camera.rotation.y,this.camera.rotation.z]  
    },
    easeInOutCubic(x){
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },
    makesheet(){
      let pp = new THREE.Vector3(this.xrcamera.position.x,this.xrcamera.position.y,this.xrcamera.position.z);
      let rr = new THREE.Vector3(this.xrcamera.rotation.x,this.xrcamera.rotation.y,this.xrcamera.rotation.z);
      let m = this.maker(this.sid,pp,rr);
      this.sheet.push(m);
      console.log(this.sheet);
      this.sid++;
    },
    maker(id,pp,rr){
      const ms ={
        id:id,
        pp:pp,
        rr:rr
      }
      return ms;
    },
    sendimg(img,type,no){
      console.log(img);
      if(type=='tex'){
        const rep =new THREE.Vector2(14,14);
        if(no==1){
          this.src[4]=img.src;
          this.cube3.material.map = new THREE.Texture( img );
          this.cube3.material.map.wrapS = THREE.RepeatWrapping;
          this.cube3.material.map.wrapT = THREE.RepeatWrapping;
          this.cube3.material.map.repeat=rep;
          this.cube3.material.map.needsUpdate = true;
          this.cube.material.map = new THREE.Texture( img );
          this.cube.material.map.wrapS = THREE.RepeatWrapping;
          this.cube.material.map.wrapT = THREE.RepeatWrapping;
          this.cube.material.map.repeat=rep;
          this.cube.material.map.needsUpdate = true;
        }else if(no==2){
          this.src[5]=img.src;
          this.cube3.material.normalMap = new THREE.Texture( img );
          this.cube3.material.normalMap.wrapS = THREE.RepeatWrapping;
          this.cube3.material.normalMap.wrapT = THREE.RepeatWrapping;
          this.cube3.material.normalMap.repeat=rep;
          this.cube3.material.normalMap.needsUpdate = true;
          this.cube.material.normalMap = new THREE.Texture( img );
          this.cube.material.normalMap.wrapS = THREE.RepeatWrapping;
          this.cube.material.normalMap.wrapT = THREE.RepeatWrapping;
          this.cube.material.normalMap.repeat=rep;
          this.cube.material.normalMap.needsUpdate = true;
        }

      }else if(type=='gaku'){
        console.log(img);
        this.src[no]=img.src;
        this.gakubutiM[no].children[0].material[0].map = new THREE.Texture( img );
        this.gakubutiM[no].children[0].material[0].map.needsUpdate = true;
        this.img[no+1]=img;
       
      }
    },
    shadowstatic(){
      this.renderer.shadowMap.autoUpdate = false;
    },
    Start(){
      if(this.cameflag==true){
        this.id++;
        this.t=0;
      }
      if(this.cameflag==false){
        this.id=0;
        this.camera.position.x=0;
        this.camera.position.z=0;
        this.camera.position.y=20;
        this.cameflag=true;
      }
    
    },
    setLights(no){
      this.hemi = new THREE.HemisphereLight(0xffffff,0xffffff,this.Llist[no].hemiI);
      this.dl = new THREE.DirectionalLight( this.Llist[no].dlC, this.Llist[no].dlI );
      const textureLoader = new THREE.TextureLoader()
      this.env = textureLoader.load(this.Llist[no].mapRif)
      this.env.mapping = THREE.EquirectangularReflectionMapping
      this.env.magFilter = THREE.LinearFilter
      this.env.minFilter = THREE.LinearMipMapLinearFilter
    }
    ,
    menuon(no){
      this.menusele=no;
      this.menuflag=!this.menuflag;
      this.vrbarflag=false;
    },
    menuoff(){
      this.closeflag=true;
    },
    WindowResize(){
      console.log('rgregreger');
      this.dl.shadow.mapSize.set(this.shsize,this.shsize);
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize(Math.floor(window.innerWidth/this.reso),Math.floor(window.innerHeight/this.reso),false)
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      const renderPass = new RenderPass( this.scene, this.camera);
      renderPass.clearColor = new THREE.Color( 0, 0, 0 );
			renderPass.clearAlpha = 0;
      this.composer = new EffectComposer( this.renderer );
      this.composer.addPass( renderPass );
      // const ssaoPass = new SSAOPass( this.scene, this.xrcamera, width, height );
      // ssaoPass.kernelRadius = 20;
      // ssaoPass.minDistance=0.005;
      // ssaoPass.maxDistance = 0.03;
			//this.composer.addPass( ssaoPass );
    },
    onPointerMove( event ) {
      this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },
    Raycast(){
      if(this.cameflag&&!this.menuflag){
      this.raycaster.setFromCamera( this.pointer, this.camera );
      let objs = this.raycaster.intersectObjects( this.scene.children );

      if(objs.length!=0){

      if(objs[0].object.name.indexOf('picture') !== -1){
        this.pls.position.x=objs[0].point.x;
      this.pls.position.y=objs[0].point.y;
      this.pls.position.z=objs[0].point.z;
        const name = objs[0].object.name.split('__');
        if(name[0]=='picture'){
        this.select=Number(name[1])+1;
        console.log(this.pls);
        this.pls.intensity=3;
        this.pls.decay =2;
        this.pls.color.b=1;
        this.pls.color.g=0.3862745098039216;
        this.pls.color.r=0.2;
        }
      }else{
        this.select=0;
        this.pls.intensity=2;
        this.pls.decay =2;
        this.pls.color.b=0.34901960784313724;
        this.pls.color.g=0.6862745098039216;
        this.pls.color.r=1;
      }
    }
  }
    },
    PicListR(no){
      return this.PicList[no];
    },
    Vron(){
      this.vrbarflag=!this.vrbarflag;
    },
    selectinfo(){
      console.log('click');
      if(this.select!=0&&!this.menuflag){
        if(this.haiti==true){
          console.log("grab");
        }else{
          if(this.img[this.select]!=null)this.$refs.imginfo.setAttribute('src', this.img[this.select].src);
          this.menuon(1);
        }
      }
      if(this.closeflag==true){
        this.menuflag=false;
        this.closeflag=false;
      }
    },
    movepoint(no){
      this.id=no;
      this.t=0;
      this.menuflag=false;
      this.closeflag=false;
    },
    haitiPic(){
      this.haiti=true;
    },
    movebtn(key){
      if(key==1){
        this.xrcamera.position.x-=4.26;
      }
      if(key==2){
        this.xrcamera.position.x+=4.26;
      }
      if(key==3){
        this.xrcamera.position.z-=4.26;
      }
      if(key==4){
        this.xrcamera.position.z+=4.26;
      }
    },
    resetmove(){
      this.pointer.x=0;
      this.pointer.y=0;
      console.log("gtgrtgeggeg");
    }
  }
}
</script>

<template>
  <app class="app">
    <header>
      <transition
      name="menu_transition"
      enter-active-class="animate__animated animate__slideInDown"
      leave-active-class="animate__animated animate__slideOutUp"
      >
      <div id="vrb" class="vr_bar" v-show="vrbarflag"></div>
      </transition>
    </header>
    <div class="main">
      <div class="side_bg" >
      <div v-show="!menuflag" @click="menuon(0)" class="animate__animated animate__fadeIn menu_icon">
        <i class="bi bi-gear"></i>
        <div class="ttlMI">設定</div>
      </div>
      <div v-show="menuflag" @click="menuoff" class="animate__animated animate__fadeIn menu_icon">
        <i class="bi bi-x-circle"></i>
        <div class="ttlMI">閉じる</div>
      </div>
      <div v-show="!menuflag && cameflag" @click="menuon(3)" class="animate__animated animate__fadeIn menu_icon">
        <i class="bi bi-arrows-move"></i>
        <div class="ttlMI">移動</div>
      </div>
      <div v-show="!menuflag && cameflag" @click="menuon(4)" class="animate__animated animate__fadeIn menu_icon">
        <i class="bi bi-image"></i>
        <div class="ttlMI">画像</div>
      </div>
      <div v-show="!menuflag && !cameflag" @click="menuon(2)" class="animate__animated animate__fadeIn menu_icon">
        <i class="bi bi-people-fill"></i>
        <div class="ttlMI">説明</div>
      </div>
      <div v-show="!menuflag && cameflag" @click="Vron()" class="animate__animated animate__fadeIn menu_icon">
        <i class="bi bi-badge-vr-fill"></i>
        <div class="ttlMI">VR</div>
      </div>

    </div>
      <transition
      name="menu_transition"
      enter-active-class="animate__animated animate__tada"
      leave-active-class="animate__animated animate__backOutUp"
      >
      <div id="top_menu" class="animate__animated animate__backInDown menu_cover" v-show="menuflag">
        <div v-show="menusele === 0" class="menu_contents_top">
        <p class="ttl">設定</p>
        <p class="menu_ttl">グラフィックの繊細さ</p>
          <div class="menu_row menu_ttl">
            <input type="radio" @change="this.WindowResize" @id='high' name="gra" value="1" v-model="reso">
              <label for="high" class="menu_label">美しい</label>
            <input type="radio" @change="this.WindowResize" @id='mid' name="gra"  value="1.5" v-model="reso">
              <label for="mid" class="menu_label">普通</label>
            <input type="radio" @change="this.WindowResize" @id='low' name="gra" value="2" v-model="reso">
              <label for="low" class="menu_label">軽量</label>
            <input type="radio" @change="this.WindowResize" @id='verylow' name="gra" value="4" v-model="reso">
              <label for="verylow" class="menu_label">最軽量</label>
          </div>
  
        </div>

         <div v-show="menusele === 1" class="menu_contentsL">
          <p class="menu_ttl"></p>
            <div class="picLui">
              <img id="picL" ref="imginfo" src="">
              <div class="landui__info">
                <div class="info_ttl">{{PicListR(select).name}}</div>
                <!-- <li class="menu_ttl">{{PicListR(select).author}}</li>
                <li class="menu_ttl">{{PicListR(select).year}}</li>
                <li class="menu_ttl">{{PicListR(select).caption}}</li> -->
              </div>
            </div>
          </div> 

          <div v-if="menusele === 2" class="menu_contents">
            <p class="ttl">説明</p>
            <p class="menu_ttl">このアプリではあなたの持っている画像をバーチャル空間に展示することができます。</p>
            <p class="menu_ttl">トップページのサムネイルをタップまたはクリックして画像を登録してください。</p>
            <p class="menu_ttl">画面上の絵をクリックすると大きな画像で見ることができます</p>
            <p class="menu_ttl">VR対応機器やスマートフォンをお持ちの方はVRモードを体験することができます。</p>
            <p class="menu_ttl">VRモードを開始するボタンを押して準備が完了すればバーチャルの世界です。</p>
            </div>
            <div v-if="menusele === 3" class="menu_contents">
              <p class="ttl">移動</p>
              <button class="btnM" @click="movepoint(0)">展示1</button>
              <button class="btnM" @click="movepoint(1)">展示2</button>
              <button class="btnM" @click="movepoint(2)">展示3</button>
              <button class="btnM" @click="movepoint(3)">展示4</button>
              </div>
              <div v-if="menusele === 4" class="menu_contentsP">
                <p class="ttlP">絵の入れ替え</p>
                <div v-if="cameflag" class="ui_wrapper">
                  <pictureload info="展示1" v-on:send="sendimg($event,'gaku',0)" v-bind:srcA="src[0]"/>
                  <pictureload info="展示2" v-on:send="sendimg($event,'gaku',1)" v-bind:srcA="src[1]"/>
                  <pictureload info="展示3" v-on:send="sendimg($event,'gaku',2)" v-bind:srcA="src[2]"/>
                  <pictureload info="展示4" v-on:send="sendimg($event,'gaku',3)" v-bind:srcA="src[3]"/>
                </div>
                <p class="ttlP">模様替え</p>
                <div v-if="cameflag" class="ui_wrapper">
                  <pictureload info="模様" v-on:send="sendimg($event,'tex',1)" v-bind:srcA="src[4]"/>
                  <pictureload info="法線" v-on:send="sendimg($event,'tex',2)" v-bind:srcA="src[5]"/>
                </div>
                </div>
      </div>
      </transition>
      <canvas ref="canvasRef" class="fullscreen"></canvas>
    <div class="main_ui">
      <div v-if="!cameflag" class="ttl">あなたのギャラリー</div>
      <div v-if="!cameflag" class="ttl">展示したい画像を選んでください</div>
      <div v-if="!cameflag" class="ui_wrapper">
        <pictureload info="展示1" v-on:send="sendimg($event,'gaku',0)" v-bind:srcA="src[0]"/>
        <pictureload info="展示2" v-on:send="sendimg($event,'gaku',1)" v-bind:srcA="src[1]"/>
        <pictureload info="展示3" v-on:send="sendimg($event,'gaku',2)" v-bind:srcA="src[2]"/>
        <pictureload info="展示4" v-on:send="sendimg($event,'gaku',3)" v-bind:srcA="src[3]"/>
      </div>
      <div v-if="!cameflag" @click="test" class="ttl_btn">Start</div>
      <!-- <button v-if="cameflag" @click="test" class="arr_btn">→</button> -->
    </div>
    </div>
  </app>  
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css");
@import url('https://fonts.googleapis.com/css2?family=Crete+Round&display=swap');

.app{
  position: relative;
  overflow: hidden;
  
}
.vr_bar{
  position: absolute;
  background-color: rgb(250, 250, 250);
  width: 100vw;
  height: 8vh;
  top: 0;
  left: 0;
  z-index: -15;
}
.main{
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  z-index: -20;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Zen Kaku Gothic New', sans-serif;
}
.btn_ar{
  position: relative;
  left: 0px;
  bottom: 7vh;
  width: 70px;
  height: 70px;
  background-color: aliceblue;
}
.picLui{
  width: 80vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  top: 50px;
}
#picL{
  width: 100%;
  height: auto;
  max-height: 500px;
  max-width : 600px;
}
.main_ui{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  height: 90vh;
}
.btnM{
  background-color: rgba(22, 22, 22, 0.56);
  color: aliceblue;
  margin-top: 30px;
  width: 60vw;
  height: 10vh;
  font-size: 20px;
  border-radius:20px;
  border: solid 5px;
}
.btnM:hover{
  background-color: rgba(101, 101, 101, 0.775);
  color: aliceblue;
}
.fullscreen {
  position: absolute;
  margin: 0;
  padding: 0;
  top : 0px;
  left : 0px;
  width: 100vw;
  height: 100vh;
  z-index: -20;
}
.side_bg{
  position: absolute;
  margin: 0;
  padding: 0;
  bottom: 0px;
  right: 0px;
  width: 100vw;
  height: 7vh;
  z-index: 16;
  backdrop-filter: blur(12px);
  background-color: rgba(58, 58, 58, 0.635);
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-items: center;
}
.menu_cover{
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0px;
  right: 0px;
  width: 100vw;
  height: 93vh;
  z-index: 14;
  display: flex;
  align-items: center;
  flex-direction: column;
  backdrop-filter: blur(12px);
  background-color: rgba(58, 58, 58, 0.635);
}
.menu_contents_top{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.menu_contents{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 80vh;
}
.menu_contentsP{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 80vh;
}
.menu_row{
  display: flex;
  flex-direction: row;
}
.info_ttl{
  margin-top:30px;
  color: aliceblue;
  font-size: 2.5vh;
  margin-left: 10px;
  margin-right: 10px;
  background-color: rgba(0, 0, 0, 0.218);
  position: relative;
  right: 5px;
}
.menu_ttl{
  margin-top:30px;
  color: aliceblue;
  font-size: 2.5vh;
  margin-left: 10px;
  margin-right: 10px;
  background-color: rgba(0, 0, 0, 0.218);
}
.menu_label{
  color: aliceblue;
  font-size: 2.5vh;
  margin-left: 10px;
  margin-right: 10px;
}
.menu_icon{
  margin: 0;
  padding: 0;
  width: 100%; 
  font-size: 30px;
  z-index: 15;
  color: aliceblue;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  cursor: pointer;
}
.ttlMI{
  position: relative;
  font-size: 15px;
  margin-left: 5px;
  padding: 0;
}

@media screen and (orientation: landscape){
  .landui{
    display: flex;
    flex-direction: row;

  }
  .landui__info{
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .menu_label{
    color: aliceblue;
    font-size: 3.5vh;
    margin-left: 10px;
    margin-right: 10px;
  }
  .menu_ttl{
    margin-top:30px;
    color: aliceblue;
    font-size: 2vw;
    margin-left: 10px;
    margin-right: 10px;
    background-color: rgba(0, 0, 0, 0.218);
  }
  .side_bg{
  margin: 0;
  padding: 0;
  top: 0px;
  right: 0px;
  width: 7vw;
  height: 100vh;
  z-index: 16;
  backdrop-filter: blur(12px);
  background-color: rgba(58, 58, 58, 0.635);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:flex-start;
}
.menu_cover{
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0px;
  left: 0px;
  width: 93vw;
  height: 100vh;
  z-index: 14;
  backdrop-filter: blur(12px);
  background-color: rgba(58, 58, 58, 0.635);
}
.menu_icon{
  margin: 0;
  padding: 0;
  width: 100%; 
  font-size: 30px;
  z-index: 15;
  color: aliceblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}
.ttlMI{
  position: relative;
  font-size: 15px;
  margin: 0;
  padding: 0;
  top: -5px;
}
}
.btn{
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 14;
  background-color: aqua;
}
.ttl{
  font-size: 32px;
  color: aliceblue;
  font-family: 'Crete Round', serif;
  background-color: rgba(0, 0, 0, 0.362);
  position: relative;
  top: 20px;
}
.ttlP{
  font-size: 22px;
  color: aliceblue;
  font-family: 'Crete Round', serif;
  background-color: rgba(0, 0, 0, 0.362);
  top: -10px;
}
.ttl_btn{
  background-color: aliceblue;
  font-size: 4rem;
  color: rgb(52, 52, 52);
  font-family: 'Crete Round', serif;
  transition: all 2s;
  padding: 10px;
  border-radius: 20px;
}
.ttl_btn:hover{
  font-size: 5rem;
  cursor:pointer;
  font-family: 'Crete Round', serif;
}
.ttl_btn:active{
  font-size: 5rem;
  color: rgb(8, 51, 88);
  cursor:pointer;
  font-family: 'Crete Round', serif;
}

.arr_btn{
  width: 100px;
  font-size: 6rem;
  color: rgb(92, 98, 104);
  font-family: 'Crete Round', serif;
  transition: all 1s;
  cursor:pointer;
  border: solid 1px;
  margin-top:400px;
}
.arr_btn:hover{
}
.arr_btn:active{
  color: rgb(20, 145, 255);
}
.ttlE{
  position: absolute;
  top: 0px;
  left: 10vw;
  font-size: 0.1vw;
  color: aliceblue;
}
.ttlI{
  font-size: 3rem;
  margin-top:50vh;
  color: aliceblue;
  font-family: 'Crete Round', serif;
}
.ui_wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  top:0px;
  left:0px;
  width: 80vw;
  height: 45vh;
  flex-wrap: wrap;
  max-width: 100%;
}
.menu_contents{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  height: 80vh;
}
.menu_contentsL{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  height: 80vh;
}
</style>