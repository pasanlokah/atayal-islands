import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { islands } from './data.js';

const mat=(c,extra={})=>new THREE.MeshStandardMaterial({color:c,roughness:.9,flatShading:true,...extra});
const green=mat(0x6d9d73), bark=mat(0x805d49), roof=mat(0x9b6556), beige=mat(0xf8e6b8), water=mat(0x80c5ca,{transparent:true,opacity:.82});
const rock=mat(0x927f79);
export function createWorld(root,onSelect,onFail){
 let renderer,scene,camera,controls,raf=0,disposed=false;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;root.appendChild(renderer.domElement)}catch(e){onFail?.();return {focus(){},setLow(){},resize(){},destroy(){}}}
 scene=new THREE.Scene();scene.background=new THREE.Color(0xdaf1f2);scene.fog=new THREE.Fog(0xdaf1f2,35,90);
 camera=new THREE.PerspectiveCamera(42,1,.1,180);camera.position.set(0,16,34);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;controls.minDistance=11;controls.maxDistance=57;controls.maxPolarAngle=Math.PI*.48;controls.target.set(0,0,0);controls.update();
 scene.add(new THREE.HemisphereLight(0xffffff,0x7b9d92,2.5));const sun=new THREE.DirectionalLight(0xfff7dd,3);sun.position.set(-12,25,12);scene.add(sun);
 const pickable=[],moving=[];const groups={};const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let focal=null,low=false;
 function mesh(geo,material,x=0,y=0,z=0,parent=scene){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m}
 function tree(parent,x,z,s=1){mesh(new THREE.CylinderGeometry(.12*s,.19*s,.85*s,5),bark,x,.69*s,z,parent);const crown=mesh(new THREE.ConeGeometry(.68*s,1.6*s,6),green,x,1.65*s,z,parent);crown.rotation.y=x*.7}
 function hut(parent,x,z,s=1){const walls=mesh(new THREE.BoxGeometry(1.6*s,1.1*s,1.35*s),beige,x,.75*s,z,parent);walls.rotation.y=.2;const top=mesh(new THREE.ConeGeometry(1.35*s,1.12*s,4),roof,x,1.65*s,z,parent);top.rotation.y=Math.PI/4+.2;mesh(new THREE.BoxGeometry(.38*s,.66*s,.05*s),bark,x,.48*s,z+.68*s,parent)}
 function sign(parent,label,color){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff8e8';ctx.beginPath();ctx.roundRect(5,5,502,118,32);ctx.fill();ctx.strokeStyle='#4c716b';ctx.lineWidth=7;ctx.stroke();ctx.fillStyle='#244b45';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 42px sans-serif';ctx.fillText(label,256,66);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));m.scale.set(5.8,1.45,1);m.position.set(0,4.7,0);parent.add(m)}
 function island(data,i){const g=new THREE.Group();g.position.set(...data.location);scene.add(g);groups[data.id]=g;
  const base=mesh(new THREE.CylinderGeometry(5.4,3.8,1.4,9),mat(data.color),0,0,0,g);base.userData.islandId=data.id;pickable.push(base);
  const lower=mesh(new THREE.ConeGeometry(3.7,3.5,9),rock,0,-2.42,0,g);lower.rotation.z=Math.PI;lower.userData.islandId=data.id;pickable.push(lower);
  mesh(new THREE.CylinderGeometry(5.17,5.19,.22,9),mat(i===0?0x86bd80:i===1?0xe3b39e:0xb9bc82),0,.77,0,g);
  if(i===0){for(const [x,z,s] of [[-3,-1,1.2],[-2,2,1],[2,-2,1.1],[3,1,.8],[-.5,-2.5,.7]])tree(g,x,z,s);hut(g,.6,.3,.9);const creek=mesh(new THREE.BoxGeometry(1.05,.08,5.2),water,2,.85,.2,g);creek.rotation.y=-.5}
  if(i===1){hut(g,-1,.4,1.1);for(const [x,z] of [[2.2,-1.4],[3,1.5],[-3,1.9]])tree(g,x,z,.75);for(let j=0;j<5;j++){const strip=mesh(new THREE.BoxGeometry(.23,.09,2.6),mat([0xd65c57,0x4d8793,0xf2e5b5][j%3]),1.45+j*.35,1.01,1,g);strip.rotation.y=.16}mesh(new THREE.BoxGeometry(2.3,.18,2.8),bark,2.2,.9,.95,g)}
  if(i===2){hut(g,-1.9,-1.1,1.1);hut(g,1.7,.5,.9);hut(g,-.1,2.35,.75);tree(g,3,-2,.85);tree(g,-3,1.8,.65);mesh(new THREE.CylinderGeometry(.9,.9,.2,8),mat(0xd8b882),.4,.91,-1,g)}
  sign(g,data.name,data.color);
  g.traverse(o=>{if(o.isMesh){o.userData.islandId=data.id;pickable.push(o)}});
  moving.push({g,base:g.position.y,phase:i*1.4});
 }
 islands.forEach(island);
 for(let i=0;i<10;i++){const g=new THREE.Group();g.position.set((i-4.5)*7,-6,-12-(i%3)*7);mesh(new THREE.IcosahedronGeometry(2.1+(i%3)*.8,0),mat(0xcce3de,{transparent:true,opacity:.5}),0,0,0,g);scene.add(g)}
 const targetCam=new THREE.Vector3(0,16,34),targetLook=new THREE.Vector3(0,0,0);
 function focus(id){focal=id||null;if(!id){targetCam.set(0,16,34);targetLook.set(0,0,0);return}const g=groups[id];if(!g)return;targetLook.set(g.position.x,0,g.position.z);targetCam.set(g.position.x+6,9,g.position.z+15)}
 let down=null;renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(pickable,false).find(h=>h.object.userData.islandId);if(hit)onSelect(hit.object.userData.islandId)});
 function resize(){const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)}const observer=new ResizeObserver(resize);observer.observe(root);resize();
 function animate(t){if(disposed)return;raf=requestAnimationFrame(animate);const time=t*.001;if(!low)moving.forEach(({g,base,phase})=>g.position.y=base+Math.sin(time*.55+phase)*.16);camera.position.lerp(targetCam,.028);controls.target.lerp(targetLook,.035);controls.update();renderer.render(scene,camera)}raf=requestAnimationFrame(animate);
 return {focus,setLow(v){low=v;renderer.setPixelRatio(Math.min(devicePixelRatio||1,v?1:1.7));resize()},resize,destroy(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.map?.dispose();m.dispose()})}});renderer.dispose();renderer.domElement.remove()}};
}
