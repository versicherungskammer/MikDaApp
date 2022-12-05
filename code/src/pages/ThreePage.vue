<template>
  <canvas id="webgl"></canvas>
</template>

<script setup>
// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { onMounted } from "vue";

// function planesFromMesh(vertices, indices) {
//   // creates a clipping volume from a convex triangular mesh
//   // specified by the arrays 'vertices' and 'indices'

//   const n = indices.length / 3,
//     result = new Array(n);

//   for (let i = 0, j = 0; i < n; ++i, j += 3) {
//     const a = vertices[indices[j]],
//       b = vertices[indices[j + 1]],
//       c = vertices[indices[j + 2]];

//     result[i] = new THREE.Plane().setFromCoplanarPoints(a, b, c);
//   }

//   return result;
// }

// function createPlanes(n) {
//   // creates an array of n uninitialized plane objects

//   const result = new Array(n);

//   for (let i = 0; i !== n; ++i) result[i] = new THREE.Plane();

//   return result;
// }

// function assignTransformedPlanes(planesOut, planesIn, matrix) {
//   // sets an array of existing planes to transformed 'planesIn'

//   for (let i = 0, n = planesIn.length; i !== n; ++i)
//     planesOut[i].copy(planesIn[i]).applyMatrix4(matrix);
// }

// function cylindricalPlanes(n, innerRadius) {
//   const result = createPlanes(n);

//   for (let i = 0; i !== n; ++i) {
//     const plane = result[i],
//       angle = (i * Math.PI * 2) / n;

//     plane.normal.set(Math.cos(angle), 0, Math.sin(angle));

//     plane.constant = innerRadius;
//   }

//   return result;
// }

// const planeToMatrix = (function () {
//   // creates a matrix that aligns X/Y to a given plane

//   // temporaries:
//   const xAxis = new THREE.Vector3(),
//     yAxis = new THREE.Vector3(),
//     trans = new THREE.Vector3();

//   return function planeToMatrix(plane) {
//     const zAxis = plane.normal,
//       matrix = new THREE.Matrix4();

//     // Hughes & Moeller '99
//     // "Building an Orthonormal Basis from a Unit Vector."

//     if (Math.abs(zAxis.x) > Math.abs(zAxis.z)) {
//       yAxis.set(-zAxis.y, zAxis.x, 0);
//     } else {
//       yAxis.set(0, -zAxis.z, zAxis.y);
//     }

//     xAxis.crossVectors(yAxis.normalize(), zAxis);

//     plane.coplanarPoint(trans);
//     return matrix.set(
//       xAxis.x,
//       yAxis.x,
//       zAxis.x,
//       trans.x,
//       xAxis.y,
//       yAxis.y,
//       zAxis.y,
//       trans.y,
//       xAxis.z,
//       yAxis.z,
//       zAxis.z,
//       trans.z,
//       0,
//       0,
//       0,
//       1
//     );
//   };
// })();

// // A regular tetrahedron for the clipping volume:

// const Vertices = [
//     new THREE.Vector3(+1, 0, +Math.SQRT1_2),
//     new THREE.Vector3(-1, 0, +Math.SQRT1_2),
//     new THREE.Vector3(0, +1, -Math.SQRT1_2),
//     new THREE.Vector3(0, -1, -Math.SQRT1_2),
//   ],
//   Indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2],
//   Planes = planesFromMesh(Vertices, Indices),
//   PlaneMatrices = Planes.map(planeToMatrix),
//   GlobalClippingPlanes = cylindricalPlanes(5, 2.5),
//   Empty = Object.freeze([]);

// let camera,
//   scene,
//   renderer,
//   startTime,
//   stats,
//   object,
//   clipMaterial,
//   volumeVisualization,
//   globalClippingPlanes;

// function init() {
//   camera = new THREE.PerspectiveCamera(
//     36,
//     window.innerWidth / window.innerHeight,
//     0.25,
//     16
//   );

//   camera.position.set(0, 1.5, 3);

//   scene = new THREE.Scene();

//   // Lights

//   scene.add(new THREE.AmbientLight(0xffffff, 0.3));

//   const spotLight = new THREE.SpotLight(0xffffff, 0.5);
//   spotLight.angle = Math.PI / 5;
//   spotLight.penumbra = 0.2;
//   spotLight.position.set(2, 3, 3);
//   spotLight.castShadow = true;
//   spotLight.shadow.camera.near = 3;
//   spotLight.shadow.camera.far = 10;
//   spotLight.shadow.mapSize.width = 1024;
//   spotLight.shadow.mapSize.height = 1024;
//   scene.add(spotLight);

//   const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
//   dirLight.position.set(0, 2, 0);
//   dirLight.castShadow = true;
//   dirLight.shadow.camera.near = 1;
//   dirLight.shadow.camera.far = 10;

//   dirLight.shadow.camera.right = 1;
//   dirLight.shadow.camera.left = -1;
//   dirLight.shadow.camera.top = 1;
//   dirLight.shadow.camera.bottom = -1;

//   dirLight.shadow.mapSize.width = 1024;
//   dirLight.shadow.mapSize.height = 1024;
//   scene.add(dirLight);

//   // Geometry

//   clipMaterial = new THREE.MeshPhongMaterial({
//     color: 0xee0a10,
//     shininess: 100,
//     side: THREE.DoubleSide,
//     // Clipping setup:
//     clippingPlanes: createPlanes(Planes.length),
//     clipShadows: true,
//   });

//   object = new THREE.Group();

//   const geometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);

//   for (let z = -2; z <= 2; ++z)
//     for (let y = -2; y <= 2; ++y)
//       for (let x = -2; x <= 2; ++x) {
//         const mesh = new THREE.Mesh(geometry, clipMaterial);
//         mesh.position.set(x / 5, y / 5, z / 5);
//         mesh.castShadow = true;
//         object.add(mesh);
//       }

//   scene.add(object);

//   const planeGeometry = new THREE.PlaneGeometry(3, 3, 1, 1),
//     color = new THREE.Color();

//   volumeVisualization = new THREE.Group();
//   volumeVisualization.visible = false;

//   for (let i = 0, n = Planes.length; i !== n; ++i) {
//     const material = new THREE.MeshBasicMaterial({
//       color: color.setHSL(i / n, 0.5, 0.5).getHex(),
//       side: THREE.DoubleSide,

//       opacity: 0.2,
//       transparent: true,

//       // clip to the others to show the volume (wildly
//       // intersecting transparent planes look bad)
//       clippingPlanes: clipMaterial.clippingPlanes.filter(function (_, j) {
//         return j !== i;
//       }),

//       // no need to enable shadow clipping - the plane
//       // visualization does not cast shadows
//     });

//     const mesh = new THREE.Mesh(planeGeometry, material);
//     mesh.matrixAutoUpdate = false;

//     volumeVisualization.add(mesh);
//   }

//   scene.add(volumeVisualization);

//   const ground = new THREE.Mesh(
//     planeGeometry,
//     new THREE.MeshPhongMaterial({
//       color: 0xa0adaf,
//       shininess: 10,
//     })
//   );
//   ground.rotation.x = -Math.PI / 2;
//   ground.scale.multiplyScalar(3);
//   ground.receiveShadow = true;
//   scene.add(ground);

//   // Renderer
//   const canvas = document.querySelector("#webgl");

//   renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//   });
//   renderer.shadowMap.enabled = true;
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight - 55);
//   window.addEventListener("resize", onWindowResize);
//   // Clipping setup:
//   globalClippingPlanes = createPlanes(GlobalClippingPlanes.length);
//   renderer.clippingPlanes = Empty;
//   renderer.localClippingEnabled = true;

//   // Controls

//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.minDistance = 1;
//   controls.maxDistance = 8;
//   controls.target.set(0, 1, 0);
//   controls.update();

//   // Start

//   startTime = Date.now();
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function setObjectWorldMatrix(object, matrix) {
//   // set the orientation of an object based on a world matrix

//   const parent = object.parent;
//   scene.updateMatrixWorld();
//   object.matrix.copy(parent.matrixWorld).invert();
//   object.applyMatrix4(matrix);
// }

// const transform = new THREE.Matrix4(),
//   tmpMatrix = new THREE.Matrix4();

// function animate() {
//   const currentTime = Date.now(),
//     time = (currentTime - startTime) / 1000;

//   requestAnimationFrame(animate);

//   object.position.y = 1;
//   object.rotation.x = time * 0.5;
//   object.rotation.y = time * 0.2;

//   object.updateMatrix();
//   transform.copy(object.matrix);

//   const bouncy = Math.cos(time * 0.5) * 0.5 + 0.7;
//   transform.multiply(tmpMatrix.makeScale(bouncy, bouncy, bouncy));

//   assignTransformedPlanes(clipMaterial.clippingPlanes, Planes, transform);

//   const planeMeshes = volumeVisualization.children;

//   for (let i = 0, n = planeMeshes.length; i !== n; ++i) {
//     tmpMatrix.multiplyMatrices(transform, PlaneMatrices[i]);
//     setObjectWorldMatrix(planeMeshes[i], tmpMatrix);
//   }

//   transform.makeRotationY(time * 0.1);

//   assignTransformedPlanes(
//     globalClippingPlanes,
//     GlobalClippingPlanes,
//     transform
//   );
//   renderer.render(scene, camera);
// }

// onMounted(() => {
//   init();
//   animate();
// });
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as GeometryUtils from "three/addons/utils/GeometryUtils.js";
import { onMounted } from "vue";

let camera, scene, renderer;
let line, sprite, texture;

let cameraOrtho, sceneOrtho;

let offset = 0;

const dpr = window.devicePixelRatio;

const textureSize = 128 * dpr;
const vector = new THREE.Vector2();
const color = new THREE.Color();

onMounted(() => {
  init();
  animate();
});

function init() {
  //

  const width = window.innerWidth;
  const height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  camera.position.z = 20;

  cameraOrtho = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    1,
    10
  );
  cameraOrtho.position.z = 10;

  scene = new THREE.Scene();
  sceneOrtho = new THREE.Scene();

  //

  const points = GeometryUtils.gosper(8);

  const geometry = new THREE.BufferGeometry();
  const positionAttribute = new THREE.Float32BufferAttribute(points, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.center();

  const colorAttribute = new THREE.BufferAttribute(
    new Float32Array(positionAttribute.array.length),
    3
  );
  colorAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("color", colorAttribute);

  const material = new THREE.LineBasicMaterial({ vertexColors: true });

  line = new THREE.Line(geometry, material);
  line.scale.setScalar(0.05);
  scene.add(line);

  //

  texture = new THREE.FramebufferTexture(
    textureSize,
    textureSize,
    THREE.RGBAFormat
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  //

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(textureSize, textureSize, 1);
  sceneOrtho.add(sprite);

  updateSpritePosition();

  //

  const canvas = document.querySelector("#webgl");
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  //

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  cameraOrtho.left = -width / 2;
  cameraOrtho.right = width / 2;
  cameraOrtho.top = height / 2;
  cameraOrtho.bottom = -height / 2;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  updateSpritePosition();
}

function updateSpritePosition() {
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  const halfImageWidth = textureSize / 2;
  const halfImageHeight = textureSize / 2;

  sprite.position.set(
    -halfWidth + halfImageWidth,
    halfHeight - halfImageHeight,
    1
  );
}

function animate() {
  requestAnimationFrame(animate);

  const colorAttribute = line.geometry.getAttribute("color");
  updateColors(colorAttribute);

  // scene rendering

  renderer.clear();
  renderer.render(scene, camera);

  // calculate start position for copying data

  vector.x = (window.innerWidth * dpr) / 2 - textureSize / 2;
  vector.y = (window.innerHeight * dpr) / 2 - textureSize / 2;

  renderer.copyFramebufferToTexture(vector, texture);

  renderer.clearDepth();
  renderer.render(sceneOrtho, cameraOrtho);
}

function updateColors(colorAttribute) {
  const l = colorAttribute.count;

  for (let i = 0; i < l; i++) {
    const h = ((offset + i) % l) / l;

    color.setHSL(h, 1, 0.5);
    colorAttribute.setX(i, color.r);
    colorAttribute.setY(i, color.g);
    colorAttribute.setZ(i, color.b);
  }

  colorAttribute.needsUpdate = true;

  offset -= 25;
}
</script>
