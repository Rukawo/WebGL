// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  uniform mat4 u_MvpMatrix;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_TexCoord = a_TexCoord;
  }`;

// Fragment shader program
var FSHADER_SOURCE =`
  #ifdef GL_ES
  precision mediump float;
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }`;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);

  // Initialize shaders
  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

  // Set the vertex coordinates, the color and the normal
  var n = initVertexBuffers(gl);

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables and so on
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

  var vpMatrix = new Matrix4();   // View projection matrix
  vpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
  vpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);

  var currentAngle = 0.0;  // Current rotation angle
  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix

  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 0, 1, 0); // Rotate around the y-axis
    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_MvpMatrix
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    initTextures(gl);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates
  var vertices = new Float32Array([
     2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
     2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
     2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
    -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
    -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
     2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
  ]);

  // var texCoords = new Float32Array([
  //   // Texture coordinate
  //   1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // front
  //   0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, // right
  //   1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, // up
  //   1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // left
  //   0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // down
  //   0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 // back
  // ]);

  var texCoords = new Float32Array([
    // Texture coordinate
    0.25, 0.5, 0.0, 0.5, 0.0, 0.0, 0.25, 0.0, // front
    0.25, 0.5, 0.25, 0.0, 0.5, 0.0, 0.5, 0.5, // right
    0.75, 0.0, 0.75, 0.5, 0.5, 0.5, 0.5, 0.0, // up
    0.25, 1.0, 0.0, 1.0, 0.0, 0.5, 0.25, 0.5, // left
    0.25, 0.5, 0.5, 0.5, 0.5, 1.0, 0.25, 1.0, // down
    0.5, 0.5, 0.75, 0.5, 0.75, 1.0, 0.5, 1.0 // back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
  if (!initArrayBuffer(gl, 'a_TexCoord', texCoords, 2, gl.FLOAT)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function initTextures(gl) {
  var texture = gl.createTexture();   // Create a texture object

  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

  var image = new Image();  // Create the image object

  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(gl, texture, u_Sampler, image); };
  // Tell the browser to load an image
  image.src = '../resources/sky.jpg';

  return true;
}

function loadTexture(gl, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
}

// Rotation angle (degrees/second)
var ANGLE_STEP = 30.0;
// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}
