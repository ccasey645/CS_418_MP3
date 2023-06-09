/**
 * Prepare the buffers and setup the variables to send to the vertex and
 * fragment shaders to draw the terrain on the screen.
 */
function draw() {
    gl.clearColor(...IlliniBlue)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(window.program)

    gl.bindVertexArray(window.geom.vao)
    let lightdir = normalize([1, -10, 10])
    let halfway = normalize(add(lightdir, window.eyedir))
    gl.uniform3fv(gl.getUniformLocation(window.program,'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightdir'), lightdir)
    gl.uniform3fv(gl.getUniformLocation(window.program,'lightcolor'), [1, 1, 1])

    gl.uniform1f(gl.getUniformLocation(window.program,'maxHeight'), window.maxTerrainHeight)
    gl.uniform1f(gl.getUniformLocation(window.program,'minHeight'), window.minTerrainHeight)

    gl.uniform4fv(gl.getUniformLocation(window.program, 'color'), groundColor)
    gl.uniformMatrix4fv(gl.getUniformLocation(window.program, 'p'), false, p)
    gl.uniformMatrix4fv(gl.getUniformLocation(window.program, 'mv'), false, m4mult(v,m))
    gl.drawElements(window.geom.mode, window.geom.count, window.geom.type, 0)
}

/**
 * Set the view matrix to make the camera move back and forth around one side of the terrain.
 * @param milliseconds Number the current time in milliseconds
 */
function faultingTimeStep(milliseconds) {
    let seconds = milliseconds / 1000
    let s2 = Math.cos(seconds/2)-1

    let eye = [3*Math.cos(s2),3*Math.sin(s2),1.5]
    window.v = m4view([3*Math.cos(s2),3*Math.sin(s2),1.5], [0,0,0], [0,0,1])
    window.eyedir =  new Float32Array(m4normalized_(eye))
    gl.uniform3fv(gl.getUniformLocation(window.program, 'eyedir'), window.eyedir)

    draw()
    if (window.currentAnimation === animationMap.terrain.currentAnimation) {
        requestAnimationFrame(faultingTimeStep)
    }
}

/**
 * Create the grid used for the terrain. Split grid squares in to triangles to be used by the shader.
 * @param gridSize
 * @returns {{triangles: *[], attributes: {position: *[]}}}
 */
function createInitialGeometry(gridSize) {
    var geometry = {
        "triangles": [],
        "attributes": {
            "position": [],
        }
    }
    for (let i = Math.floor(gridSize / -2); i < Math.floor(gridSize / 2); i++) {
        for (let j = Math.floor(gridSize / -2); j < Math.floor(gridSize / 2); j++) {
            geometry.attributes.position.push([i, j, 0])
        }
    }
    // Make triangles
    for (let i = 0; i < geometry.attributes.position.length - gridSize - 1; i++) {
        if (i % gridSize === gridSize - 1) {
            continue
        }
        geometry.triangles.push([i + 1, i, i + gridSize])
        geometry.triangles.push([i + 1, i + gridSize, i + gridSize + 1])
     }
    return geometry
}

/**
 * Calculate the vertical separation of the terrain.
 * @param vertexes
 */
function doVerticalSeperation(vertexes) {
    let xMin, zMin, xMax, zMax, h
    let separationConstant = 0.3
    if (vertexes.length > 0) {
        xMin = vertexes[0][0]
        zMin = vertexes[0][2]
        xMax = vertexes[0][0]
        zMax = vertexes[0][2]
    }

    for (let i = 0; i < vertexes.length; i++) {
        if (vertexes[i][0] < xMin) {
            xMin = vertexes[i][0]
        }
        if (vertexes[i][0] > xMax) {
            xMax = vertexes[i][0]
        }
        if (vertexes[i][2] > zMax) {
            zMax = vertexes[i][2]
        }
        if (vertexes[i][2] < zMin) {
            zMin = vertexes[i][2]
        }
    }

    h = (xMax - xMin) * separationConstant
    if (h !== 0) {
        for (let i = 0; i < vertexes.length; i++) {
            vertexes[i][2] = ((vertexes[i][2] - zMin) / (zMax - zMin)) * h - (h / 2)
        }
    }

    if (vertexes.length > 0) {
        xMin = vertexes[0][0]
        zMin = vertexes[0][2]
        xMax = vertexes[0][0]
        zMax = vertexes[0][2]
    }

    for (let i = 0; i < vertexes.length; i++) {
        if (vertexes[i][0] < xMin) {
            xMin = vertexes[i][0]
        }
        if (vertexes[i][0] > xMax) {
            xMax = vertexes[i][0]
        }
        if (vertexes[i][2] > zMax) {
            zMax = vertexes[i][2]
        }
        if (vertexes[i][2] < zMin) {
            zMin = vertexes[i][2]
        }
    }
    window.maxTerrainHeight = zMax
    window.minTerrainHeight = zMin
}

/**
 * Create a random point in between the X and Y points passed in.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {{x: *, y: *}}
 */
function createRandomPoint(x1, y1, x2, y2) {
    const randomX = Math.random() * (x2 - x1) + x1
    const randomY = Math.random() * (y2 - y1) + y1
    return {x: randomX, y: randomY}
}

/**
 * Create a random normal vector with z = 0
 * @returns {(number|number)[]}
 */
function getRandomNormal() {
    const randomAngle = Math.random() * 2 * Math.PI
    return [
        Math.cos(randomAngle),
        Math.sin(randomAngle),
        0,
    ]
}

/**
 * Greater than or equal to zero and vectors in vertex b are on the left of the fault. Othwerwise
 * it's on the right.
 * @param b Vertex of triangle
 * @param p random point
 * @param n random normal vector
 * @returns {boolean}
 */
function determinePointIsLeftOfFault(b, p, n) {
    return dot(sub(b, p), n) >= 0
}


/**
 * Raise or lower the terrain's height based on what side of the created fault each vertex is on.
 * @param vertexes
 * @param displacement
 */
function createFault(vertexes, displacement) {
    const {x, y} = createRandomPoint(1, 1, window.gridSize - 1, window.gridSize - 1)
    const n = getRandomNormal()
    const p = [x, y, 0]
    for (let i = 0; i < vertexes.length; i++) {
        if(determinePointIsLeftOfFault(vertexes[i], p, n)) {
            vertexes[i][2] += displacement
        } else {
            vertexes[i][2] -= displacement
        }
    }
}

/**
 * Create faults in the terrain for the specified nuber of slices, or faults, passed in. The initial fault will have the
 * highest separation, and each subsequent fault will have a smaller separation (until a floor is reached).
 * @param slices
 * @param data
 */
function generateTerrain(slices, data) {
    let displacement = window.gridSize / 2
    const displacementNormalization = displacement / (slices * 2)
    for (let i = 0; i < slices; i++) {
        createFault(data.attributes.position, displacement)
        displacement = Math.max(displacement - displacementNormalization, 0.07)
    }
    doVerticalSeperation(data.attributes.position)
}

/**
 * Compile, link, set up geometry
 */
async function setupTerrainView(options) {
    window.slices = options?.slices ?? 5
    window.gridSize = options?.resolution ?? 100
    if (options.lighting === "specular") {
        window.fragmentShader = "shaders/faulting/fragment.glsl"
    } else if (options.lighting === "lampart") {
        window.fragmentShader = "shaders/faulting/fragment-lampart.glsl"
    } else if (options.lighting === "ramp") {
        window.fragmentShader = "shaders/faulting/fragment-color-ramp.glsl"
    } else if (options.lighting === "cliff") {
        window.fragmentShader = "shaders/faulting/fragment-cliff.glsl"
        window.vertexShader = "shaders/faulting/vertex-cliff.glsl"
    } else {
        window.fragmentShader = "shaders/faulting/fragment-lampart.glsl"
    }

    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch(window.vertexShader).then(res => res.text())
    let fs = await fetch(window.fragmentShader).then(res => res.text())
    compileAndLinkGLSL(vs, fs)
    gl.enable(gl.DEPTH_TEST)
    window.scale = 1 / (window.gridSize / 4)
    window.m = m4ident()
    window.v = m4ident()
    window.p = m4ident()
    window.maxGridSize = 250
    window.m = m4mult_(window.m, m4scale(window.scale, window.scale, window.scale))
    let data = createInitialGeometry(window.gridSize)
    generateTerrain(window.slices, data)
    addNormals(data)

    window.geom = setupGeometry(data)

    setupCanvas().then(() => {
        fillScreen()
        requestAnimationFrame(faultingTimeStep)
    })
}
