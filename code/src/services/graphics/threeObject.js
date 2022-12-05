import * as THREE from "three";

const planesFromMesh = (vertices, indices) => {
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
};

const getPlanesFromMesh = (vertices, indices) => {
  return planesFromMesh(vertices, indices);
};

const createPlanes = (n) => {
  // creates an array of n uninitialized plane objects

  const result = new Array(n);

  for (let i = 0; i !== n; ++i) result[i] = new THREE.Plane();

  return result;
};

const getCreatePlanes = (n) => {
  return createPlanes(n);
};

const assignTransformedPlanes = (planesOut, planesIn, matrix) => {
  // sets an array of existing planes to transformed 'planesIn'

  for (let i = 0, n = planesIn.length; i !== n; ++i)
    planesOut[i].copy(planesIn[i]).applyMatrix4(matrix);
};

const getAssignTransformedPlanes = (planesOut, planesIn, matrix) => {
  return assignTransformedPlanes(planesOut, planesIn, matrix);
};

export default {
  getPlanesFromMesh,
  getCreatePlanes,
  getAssignTransformedPlanes,
};
