function initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    const vshader = gl.createShader(gl.VERTEXT_SHADER);
    const fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vshader, VSHADER_SOURCE);
    gl.shaderSource(fshader, FSHADER_SOURCE);
    gl.compileShader(vshader);
    gl.compileShader(fshader);
    const program = gl.createProgram();
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program); 
    gl.program = program
    return gl.program; 
}