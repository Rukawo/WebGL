// HelloPint2.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 position;// attribute variable
  attribute float pointsize;
  void main() {
    gl_Position = position;
    gl_PointSize = pointsize;
  }`; 

// Fragment shader program
var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }`;

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  var position = gl.getAttribLocation(gl.program, 'position');
  const pointsize = gl.getAttribLocation(gl.program, 'pointsize');
  if (position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Pass vertex position to attribute variable
  gl.vertexAttrib3f(position, 0.0, 0.0, 0.0);
  gl.vertexAttrib1f(pointsize, 50.0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
    
  // Draw
  gl.drawArrays(gl.POINTS, 0, 1);
}
