const directory = "shaders"

/**
 * Key value pairs for vertex, fragment, name of function that initializes the animation, and geometry data JSON files for each of the animations this program will
 * perform.
 * @type {{geometry: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(*): Promise<void>)|*), dataSource: string}, terrain: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(*): Promise<void>)|*), dataSource: string}}}
 */
const animationMap = {
    geometry: {
        currentAnimation: "g",
        vertexShader: `${directory}/geometry/vertex.glsl`,
        fragmentShader: `${directory}/geometry/fragment.glsl`,
        dataSource: `${directory}/geometry/geometry.json`,
        setup: setupGeometryView,
    },
    terrain: {
        currentAnimation: "t",
        vertexShader: `${directory}/faulting/vertex.glsl`,
        fragmentShader: `${directory}/faulting/fragment.glsl`,
        dataSource: `${directory}/faulting/geometry.json`,
        setup: setupTerrainView,
    }
}


/**
 * onChange handler for the radio buttons. Look up from the radio button's value in the map above to get the name
 * of the files for the draw program, the shader files (vertex and fragment) and the name of the initialize/setup function
 * needed to start the animation.
 * @param animationName
 */
function changeAnimation(animationName, options) {
    if (Object.keys(animationMap).indexOf(animationName) > -1) {
        const newAnimation = animationMap[animationName]
        window.currentAnimation = newAnimation.currentAnimation
        window.vertexShader = newAnimation.vertexShader
        window.fragmentShader = newAnimation.fragmentShader
        window.dataSource = newAnimation.dataSource
        newAnimation.setup(options)
    } else {
        console.error("Animation does not exist!")
    }
}

/**
 * Configure the HTML canvas to work with WebGL by running some setup steps
 * @returns {Promise<void>}
 */
async function setupCanvas() {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    // to do: more setup here
    fillScreen()
}


/**
 * Change the animation to the one passed in with the options specified.
 */
function setupScene(scene, options) {
    changeAnimation(scene, options)
}

/**
 * Initialize a blank HTML canvas with a background color and stretched to the screen's width and height.
 */
function initCanvas() {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    fillScreen()
    gl.clearColor(...IlliniBlue)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

/**
 * Event listener to resize canvas if the browser is resized.
 */
window.addEventListener('load', initCanvas)
window.addEventListener('resize', fillScreen)