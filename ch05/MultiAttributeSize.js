// Vertex shader program
const VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }`;

// Fragment shader program
const FSHADER_SOURCE =`
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }`;

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  const gl = canvas.getContext('webgl');

  // Initialize shaders
  const vshader = gl.createShader(gl.VERTEX_SHADER);
  const fshader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vshader, VSHADER_SOURCE);
  gl.shaderSource(fshader, FSHADER_SOURCE);
  gl.compileShader(vshader);
  gl.compileShader(fshader);
  gl.program = gl.createProgram();
  gl.attachShader(gl.program, vshader);
  gl.attachShader(gl.program, fshader);
  gl.linkProgram(gl.program);
  gl.useProgram(gl.program);  

  // Set the vertex information
  const n = initVertexBuffers(gl);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw three points
  gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
  const verticesSizes = new Float32Array([
    0.0, 0.5, 10, 
    - 0.5, - 0.5, 20,
    0.5, -0.5, 30,
  ]);
  const n = 3;
  
  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;
  // Create a buffer object
  const verticesSizesBuffer = gl.createBuffer();  
  // Write vertex coordinates to the buffer object and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesSizesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position);
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
  gl.enableVertexAttribArray(a_PointSize);

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
