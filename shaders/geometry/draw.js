/**
 * Prepare the buffers and setup the variables to send to the vertex and
 * fragment shaders to draw the object on the screen.
 */
function drawGeometry() {
    gl.clearColor(...IlliniBlue)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(window.program)

    gl.bindVertexArray(window.geom.vao)
    let lightdir = normalize([1, 1, 1])
    let halfway = normalize(add(lightdir, [1, 0, 1]))
    gl.uniform3fv(gl.getUniformLocation(window.program,'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightdir'), lightdir)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightcolor'), [1, 1, 0])

    lightdir = normalize([-2, 0, 1])
    halfway = normalize(add(lightdir, [0, 0, 1]))
    gl.uniform3fv(gl.getUniformLocation(window.program,'halfway2'), halfway)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightdir2'), lightdir)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightcolor2'), [0.5, 0, 1])
    gl.uniform4fv(gl.getUniformLocation(window.program, 'color'), illiOrange)
    gl.uniformMatrix4fv(gl.getUniformLocation(window.program, 'p'), false, p)
    gl.uniformMatrix4fv(gl.getUniformLocation(window.program, 'mv'), false, m4mult(v,m))
    gl.drawElements(window.geom.mode, window.geom.count, window.geom.type, 0)
}

function timeStep(milliseconds) {
    let seconds = milliseconds / 1000
    // let s2 = Math.cos(seconds/2)-1

    // let eye = [3*Math.cos(s2),3*Math.sin(s2),1]
    // window.v = m4view([3*Math.cos(s2),3*Math.sin(s2),1], [0,0,0], [0,0,1])
    window.m = m4mult(m4rotY(seconds), m4rotX(-Math.PI / 2))
    window.v = m4view(
        [0, 0, 3],
        [0, 0, 0],
        [0, 1, 0]
    )
    // gl.uniform3fv(gl.getUniformLocation(window.program, 'eyedir'), new Float32Array(m4normalized_(eye)))

    drawGeometry()
    if (window.currentAnimation === animationMap.geometry.currentAnimation) {
        requestAnimationFrame(timeStep)
    }
}

function addNormals(data) {
    let normals = new Array(data.attributes.position.length)
    for(let i=0; i<normals.length; i+=1) normals[i] = new Array(3).fill(0)
    for([i0,i1,i2] of data.triangles) {
        // find the vertex positions
        let p0 = data.attributes.position[i0]
        let p1 = data.attributes.position[i1]
        let p2 = data.attributes.position[i2]
        // find the edge vectors and normal
        let e0 = m4sub_(p0,p2)
        let e1 = m4sub_(p1,p2)
        let n = m4cross_(e0,e1)
        // loop over x, y and z
        for(let j=0; j<3; j+=1) {
            // add a coordinate of a normal to each of the three normals
            normals[i0][j] += n[j]
            normals[i1][j] += n[j]
            normals[i2][j] += n[j]
        }
    }
    for(let i=0; i<normals.length; i+=1) normals[i] = m4normalized_(normals[i])
    data.attributes.normal = normals;
}

/**
 * Compile, link, set up geometry
 */
async function setupGeometryView(options) {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch(window.vertexShader).then(res => res.text())
    let fs = await fetch(window.fragmentShader).then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    window.m = m4ident()
    window.v = m4ident()
    window.p = m4ident()

    let data = await fetch(window.dataSource).then(r=>r.json())
    console.log("what are normals??", data)
    addNormals(data)
    window.geom = setupGeometry(data)
    setupCanvas().then(() => {
        fillScreen()
        requestAnimationFrame(timeStep)
    })
}


