<template>
  <canvas id="webgl"></canvas>
</template>

<script setup>
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
// import { CinematicCamera } from "three/addons/cameras/CinematicCamera.js";
// import { onMounted, ref } from "vue";

// let camera, scene, raycaster, renderer, stats;

// const mouse = new THREE.Vector2();
// let INTERSECTED;
// const radius = 100;
// let theta = 0;

// onMounted(() => {
//   init();
//   animate();
// });

// function init() {
//   camera = new CinematicCamera(
//     60,
//     window.innerWidth / window.innerHeight,
//     1,
//     1000
//   );
//   camera.setLens(5);
//   camera.position.set(2, 1, 500);

//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xf0f0f0);

//   scene.add(new THREE.AmbientLight(0xffffff, 0.3));

//   const light = new THREE.DirectionalLight(0xffffff, 0.35);
//   light.position.set(1, 1, 1).normalize();
//   scene.add(light);

//   const geometry = new THREE.BoxGeometry(20, 20, 20);

//   for (let i = 0; i < 1500; i++) {
//     const object = new THREE.Mesh(
//       geometry,
//       new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
//     );

//     object.position.x = Math.random() * 800 - 400;
//     object.position.y = Math.random() * 800 - 400;
//     object.position.z = Math.random() * 800 - 400;

//     scene.add(object);
//   }
//   const canvas = document.querySelector("#webgl");
//   raycaster = new THREE.Raycaster();
//   renderer = new THREE.WebGLRenderer({
//     canvas: canvas,
//   });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth - 35, window.innerHeight - 58);

//   const createThree = () => {};
//   document.addEventListener("mousemove", onDocumentMouseMove);

//   window.addEventListener("resize", onWindowResize);

//   const effectController = {
//     focalLength: 15,
//     // jsDepthCalculation: true,
//     // shaderFocus: false,
//     //
//     fstop: 2.8,
//     // maxblur: 1.0,
//     //
//     showFocus: false,
//     focalDepth: 3,
//     // manualdof: false,
//     // vignetting: false,
//     // depthblur: false,
//     //
//     // threshold: 0.5,
//     // gain: 2.0,
//     // bias: 0.5,
//     // fringe: 0.7,
//     //
//     // focalLength: 35,
//     // noise: true,
//     // pentagon: false,
//     //
//     // dithering: 0.0001
//   };

//   const matChanger = function () {
//     for (const e in effectController) {
//       if (e in camera.postprocessing.bokeh_uniforms) {
//         camera.postprocessing.bokeh_uniforms[e].value = effectController[e];
//       }
//     }

//     camera.postprocessing.bokeh_uniforms["znear"].value = camera.near;
//     camera.postprocessing.bokeh_uniforms["zfar"].value = camera.far;
//     camera.setLens(
//       effectController.focalLength,
//       camera.frameHeight,
//       effectController.fstop,
//       camera.coc
//     );
//     effectController["focalDepth"] =
//       camera.postprocessing.bokeh_uniforms["focalDepth"].value;
//   };

//   //

//   // const gui = new GUI();

//   // gui.add(effectController, "focalLength", 1, 135, 0.01).onChange(matChanger);
//   // gui.add(effectController, "fstop", 1.8, 22, 0.01).onChange(matChanger);
//   // gui.add(effectController, "focalDepth", 0.1, 100, 0.001).onChange(matChanger);
//   // gui.add(effectController, "showFocus", true).onChange(matChanger);

//   matChanger();

//   window.addEventListener("resize", onWindowResize);
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function onDocumentMouseMove(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

// function animate() {
//   requestAnimationFrame(animate, renderer.domElement);

//   render();
//   //stats.update();
// }

// function render() {
//   theta += 0.1;

//   camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
//   camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
//   camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
//   camera.lookAt(scene.position);

//   camera.updateMatrixWorld();

//   // find intersections

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(scene.children, false);

//   if (intersects.length > 0) {
//     const targetDistance = intersects[0].distance;

//     camera.focusAt(targetDistance); // using Cinematic camera focusAt method

//     if (INTERSECTED != intersects[0].object) {
//       if (INTERSECTED)
//         INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

//       INTERSECTED = intersects[0].object;
//       INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
//       INTERSECTED.material.emissive.setHex(0xff0000);
//     }
//   } else {
//     if (INTERSECTED)
//       INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

//     INTERSECTED = null;
//   }

//   //

//   if (camera.postprocessing.enabled) {
//     camera.renderCinematic(scene, renderer);
//   } else {
//     scene.overrideMaterial = null;

//     renderer.clear();
//     renderer.render(scene, camera);
//   }
// }
import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted } from "vue";

function planesFromMesh(vertices, indices) {
  // creates a clipping volume from a convex triangular mesh
  // specified by the arrays 'vertices' and 'indices'

  const n = indices.length / 3,
    result = new Array(n);

  for (let i = 0, j = 0; i < n; ++i, j += 3) {
    const a = vertices[indices[j]],
      b = vertices[indices[j + 1]],
      c = vertices[indices[j + 2]];

    result[i] = new THREE.Plane().setFromCoplanarPoints(a, b, c);
  }

  return result;
}

function createPlanes(n) {
  // creates an array of n uninitialized plane objects

  const result = new Array(n);

  for (let i = 0; i !== n; ++i) result[i] = new THREE.Plane();

  return result;
}

function assignTransformedPlanes(planesOut, planesIn, matrix) {
  // sets an array of existing planes to transformed 'planesIn'

  for (let i = 0, n = planesIn.length; i !== n; ++i)
    planesOut[i].copy(planesIn[i]).applyMatrix4(matrix);
}

function cylindricalPlanes(n, innerRadius) {
  const result = createPlanes(n);

  for (let i = 0; i !== n; ++i) {
    const plane = result[i],
      angle = (i * Math.PI * 2) / n;

    plane.normal.set(Math.cos(angle), 0, Math.sin(angle));

    plane.constant = innerRadius;
  }

  return result;
}

const planeToMatrix = (function () {
  // creates a matrix that aligns X/Y to a given plane

  // temporaries:
  const xAxis = new THREE.Vector3(),
    yAxis = new THREE.Vector3(),
    trans = new THREE.Vector3();

  return function planeToMatrix(plane) {
    const zAxis = plane.normal,
      matrix = new THREE.Matrix4();

    // Hughes & Moeller '99
    // "Building an Orthonormal Basis from a Unit Vector."

    if (Math.abs(zAxis.x) > Math.abs(zAxis.z)) {
      yAxis.set(-zAxis.y, zAxis.x, 0);
    } else {
      yAxis.set(0, -zAxis.z, zAxis.y);
    }

    xAxis.crossVectors(yAxis.normalize(), zAxis);

    plane.coplanarPoint(trans);
    return matrix.set(
      xAxis.x,
      yAxis.x,
      zAxis.x,
      trans.x,
      xAxis.y,
      yAxis.y,
      zAxis.y,
      trans.y,
      xAxis.z,
      yAxis.z,
      zAxis.z,
      trans.z,
      0,
      0,
      0,
      1
    );
  };
})();

// A regular tetrahedron for the clipping volume:

const Vertices = [
    new THREE.Vector3(+1, 0, +Math.SQRT1_2),
    new THREE.Vector3(-1, 0, +Math.SQRT1_2),
    new THREE.Vector3(0, +1, -Math.SQRT1_2),
    new THREE.Vector3(0, -1, -Math.SQRT1_2),
  ],
  Indices = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2],
  Planes = planesFromMesh(Vertices, Indices),
  PlaneMatrices = Planes.map(planeToMatrix),
  GlobalClippingPlanes = cylindricalPlanes(5, 2.5),
  Empty = Object.freeze([]);

let camera,
  scene,
  renderer,
  startTime,
  stats,
  object,
  clipMaterial,
  volumeVisualization,
  globalClippingPlanes;

function init() {
  camera = new THREE.PerspectiveCamera(
    36,
    window.innerWidth / window.innerHeight,
    0.25,
    16
  );

  camera.position.set(0, 1.5, 3);

  scene = new THREE.Scene();

  // Lights

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.2;
  spotLight.position.set(2, 3, 3);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 3;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(0, 2, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;

  dirLight.shadow.camera.right = 1;
  dirLight.shadow.camera.left = -1;
  dirLight.shadow.camera.top = 1;
  dirLight.shadow.camera.bottom = -1;

  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  // Geometry

  clipMaterial = new THREE.MeshPhongMaterial({
    color: 0xee0a10,
    shininess: 100,
    side: THREE.DoubleSide,
    // Clipping setup:
    clippingPlanes: createPlanes(Planes.length),
    clipShadows: true,
  });

  object = new THREE.Group();

  const geometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);

  for (let z = -2; z <= 2; ++z)
    for (let y = -2; y <= 2; ++y)
      for (let x = -2; x <= 2; ++x) {
        const mesh = new THREE.Mesh(geometry, clipMaterial);
        mesh.position.set(x / 5, y / 5, z / 5);
        mesh.castShadow = true;
        object.add(mesh);
      }

  scene.add(object);

  const planeGeometry = new THREE.PlaneGeometry(3, 3, 1, 1),
    color = new THREE.Color();

  volumeVisualization = new THREE.Group();
  volumeVisualization.visible = false;

  for (let i = 0, n = Planes.length; i !== n; ++i) {
    const material = new THREE.MeshBasicMaterial({
      color: color.setHSL(i / n, 0.5, 0.5).getHex(),
      side: THREE.DoubleSide,

      opacity: 0.2,
      transparent: true,

      // clip to the others to show the volume (wildly
      // intersecting transparent planes look bad)
      clippingPlanes: clipMaterial.clippingPlanes.filter(function (_, j) {
        return j !== i;
      }),

      // no need to enable shadow clipping - the plane
      // visualization does not cast shadows
    });

    const mesh = new THREE.Mesh(planeGeometry, material);
    mesh.matrixAutoUpdate = false;

    volumeVisualization.add(mesh);
  }

  scene.add(volumeVisualization);

  const ground = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshPhongMaterial({
      color: 0xa0adaf,
      shininess: 10,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.scale.multiplyScalar(3);
  ground.receiveShadow = true;
  scene.add(ground);

  // Renderer
  const canvas = document.querySelector("#webgl");

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - 55);
  window.addEventListener("resize", onWindowResize);
  // Clipping setup:
  globalClippingPlanes = createPlanes(GlobalClippingPlanes.length);
  renderer.clippingPlanes = Empty;
  renderer.localClippingEnabled = true;

  // Controls

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 8;
  controls.target.set(0, 1, 0);
  controls.update();

  // Start

  startTime = Date.now();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setObjectWorldMatrix(object, matrix) {
  // set the orientation of an object based on a world matrix

  const parent = object.parent;
  scene.updateMatrixWorld();
  object.matrix.copy(parent.matrixWorld).invert();
  object.applyMatrix4(matrix);
}

const transform = new THREE.Matrix4(),
  tmpMatrix = new THREE.Matrix4();

function animate() {
  const currentTime = Date.now(),
    time = (currentTime - startTime) / 1000;

  requestAnimationFrame(animate);

  object.position.y = 1;
  object.rotation.x = time * 0.5;
  object.rotation.y = time * 0.2;

  object.updateMatrix();
  transform.copy(object.matrix);

  const bouncy = Math.cos(time * 0.5) * 0.5 + 0.7;
  transform.multiply(tmpMatrix.makeScale(bouncy, bouncy, bouncy));

  assignTransformedPlanes(clipMaterial.clippingPlanes, Planes, transform);

  const planeMeshes = volumeVisualization.children;

  for (let i = 0, n = planeMeshes.length; i !== n; ++i) {
    tmpMatrix.multiplyMatrices(transform, PlaneMatrices[i]);
    setObjectWorldMatrix(planeMeshes[i], tmpMatrix);
  }

  transform.makeRotationY(time * 0.1);

  assignTransformedPlanes(
    globalClippingPlanes,
    GlobalClippingPlanes,
    transform
  );
  renderer.render(scene, camera);
}

onMounted(() => {
  init();
  animate();
});
</script>
