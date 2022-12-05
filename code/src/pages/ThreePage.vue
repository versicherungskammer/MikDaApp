<template>
  <div class="q-pa-md">
    <q-badge color="secondary"> Speed: {{ speed }}</q-badge>

    <q-slider v-model="speed" :min="1" :max="100" />
  </div>

  <canvas id="webgl"></canvas>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { onMounted, ref } from "vue";
import ThreeObj from "/src/services/graphics/threeObject.js";

const speed = ref(20);

function cylindricalPlanes(n, innerRadius) {
  const result = ThreeObj.getCreatePlanes(n);

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
  Planes = ThreeObj.getPlanesFromMesh(Vertices, Indices),
  PlaneMatrices = Planes.map(planeToMatrix),
  GlobalClippingPlanes = cylindricalPlanes(5, 2.5),
  Empty = Object.freeze([]);

let camera,
  scene,
  renderer,
  startTime,
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
    clippingPlanes: ThreeObj.getCreatePlanes(Planes.length),
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
  globalClippingPlanes = ThreeObj.getCreatePlanes(GlobalClippingPlanes.length);
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
    time = ((currentTime - startTime) / 10000) * speed.value;

  requestAnimationFrame(animate);

  object.position.y = 1;
  object.rotation.x = time * 0.5;
  object.rotation.y = time * 0.2;

  object.updateMatrix();
  transform.copy(object.matrix);

  const bouncy = Math.cos(time * 0.5) * 0.5 + 0.7;
  transform.multiply(tmpMatrix.makeScale(bouncy, bouncy, bouncy));

  ThreeObj.getAssignTransformedPlanes(
    clipMaterial.clippingPlanes,
    Planes,
    transform
  );

  const planeMeshes = volumeVisualization.children;

  for (let i = 0, n = planeMeshes.length; i !== n; ++i) {
    tmpMatrix.multiplyMatrices(transform, PlaneMatrices[i]);
    setObjectWorldMatrix(planeMeshes[i], tmpMatrix);
  }

  transform.makeRotationY(time * 0.1);

  ThreeObj.getAssignTransformedPlanes(
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
