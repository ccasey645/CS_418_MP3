/**
 * Prepare the buffers and setup the variables to send to the vertex and
 * fragment shaders to draw the object on the screen.
 */
function draw() {
    gl.clearColor(...IlliniBlue)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(window.program)

    gl.bindVertexArray(window.geom.vao)
    let lightdir = normalize([1, 50, 2])
    let halfway = normalize(add(lightdir, [1, 0, 1]))
    gl.uniform3fv(gl.getUniformLocation(window.program,'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightdir'), lightdir)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightcolor'), [1, 1, 0])

    lightdir = normalize([-2, -50, 1])
    halfway = normalize(add(lightdir, [0, 0, 1]))
    gl.uniform3fv(gl.getUniformLocation(window.program,'halfway2'), halfway)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightdir2'), lightdir)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightcolor2'), [0.5, -6, 1])

    gl.uniform4fv(gl.getUniformLocation(window.program, 'color'), illiOrange)
    gl.uniformMatrix4fv(gl.getUniformLocation(window.program, 'p'), false, p)
    gl.uniformMatrix4fv(gl.getUniformLocation(window.program, 'mv'), false, m4mult(v,m))
    gl.drawElements(window.geom.mode, window.geom.count, window.geom.type, 0)
}

function faultingTimeStep(milliseconds) {
    let seconds = milliseconds / 1000
    let s2 = Math.cos(seconds/2)-1

    let eye = [3*Math.cos(s2),3*Math.sin(s2),1]
    // window.v = m4view([3*Math.cos(s2),3*Math.sin(s2),1], [0,0,0], [0,0,1])
    window.m = m4mult(m4rotY(seconds), m4rotX(-Math.PI / 2))
    window.v = m4view(
        [5, 0, 30],
        [0, 0, 0],
        [0, 1, 0]
    )
    gl.uniform3fv(gl.getUniformLocation(window.program, 'eyedir'), new Float32Array(m4normalized_(eye)))


    draw()
    if (window.currentAnimation === animationMap.terrain.currentAnimation) {
        requestAnimationFrame(faultingTimeStep)
    }
}

function createInitialGeometry(gridSize) {
    var geometry = {
        "triangles": [],
        "attributes": {
            "position": [],
        }
    }
    for (let i = gridSize / -2; i < gridSize / 2; i++) {
        for (let j = gridSize / -2; j < gridSize / 2; j++) {
            geometry.attributes.position.push([i, j, -4])
        }
    }
    // Make triangles
    for (let i = 0; i < (Math.pow(gridSize, 2) / 2) - gridSize - 1; i++) {
        geometry.triangles.push([i, i + 1, i + gridSize])
        geometry.triangles.push([i + 1, i + gridSize, i + gridSize + 1])
     }
    // console.log("333", geometry)
    return geometry
}

function swap(a, b) {
    const tmp = b
    b = a
    a = tmp
    return {a: a, b: b}
}

function createRandomPoint(x1, y1, x2, y2) {
    const randomX = Math.random() * (x2 - x1) + x1
    const randomY = Math.random() * (y2 - y1) + y1
    return {x: randomX, y: randomY}
}

function getRandomNormal() {
    const randomAngle = Math.random() * 2 * Math.PI
    return [
        Math.cos(randomAngle),
        Math.sin(randomAngle),
        0,
    ]
}

/**
 * Greater than or equal to zero and vectors in vertex b are on the left of the fault. Othwerwize
 * it's on the right.
 * @param b Vertex of triangle
 * @param p random point
 * @param n random normal vector
 * @returns {boolean}
 */
function determinePointIsLeftOfFault(b, p, n) {
    return dot(sub(b, p), n) >= 0
}


function createFault(vertexes) {
    const {x, y} = createRandomPoint(5, 5, window.gridSize - 5, window.gridSize - 5)
    const n = getRandomNormal()
    const p = [x, y, -4]
    let displacement = 2
    // const displacementNormalization = displacement / vertexes.length
    for (let i = 0; i < vertexes.length; i++) {
        if(determinePointIsLeftOfFault(vertexes[i], p, n)) {
            console.log("creatin fault!!")
            vertexes[i][2] += displacement
            // displacement -= displacementNormalization
        } else {
            vertexes[i][2] -= displacement
        }
    }
}

function generateTerrain(slices, data) {
    for (let i = 0; i < slices; i++) {
        console.log("creating!!!", slices)
        console.log("i: ", i)
        createFault(data.attributes.position)
    }
}

/**
 * Compile, link, set up geometry
 */
async function setupFaultingView(event) {
    console.log("in here!!")
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch(window.vertexShader).then(res => res.text())
    let fs = await fetch(window.fragmentShader).then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    window.scale = 0.05
    window.m = m4ident()
    window.v = m4ident()
    window.p = m4ident()

    window.m = m4scale(1 / window.gridSize, 1 / window.gridSize, 1 / window.gridSize)

    // let data = await fetch(window.dataSource).then(r=>r.json())
    // addNormals(data)
    let data = createInitialGeometry(window.gridSize)
    console.log("what is data??", data)
    addNormals(data)
    // document.getElementById("fractures-input").addEventListener("change", (event) => {
    //     window.slices = event.target.value
    //     generateTerrain(window.slices)
    // })
    //
    // window.slices = document.getElementById('slices').defaultValue
    window.slices = 1
    generateTerrain(window.slices, data)
    window.geom = setupGeometry(data)

    setupCanvas().then(() => {
        fillScreen()
        requestAnimationFrame(faultingTimeStep)
    })
}
