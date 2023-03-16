const directory = "shaders"

/**
 * Key value pairs for vertex, fragment, name of function that initializes the animation, and geometry data JSON files for each of the animations this program will
 * perform.
 * @type {{cpuMovement: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(): Promise<void>)|*), dataSource: string}, dancingLogo: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(): Promise<void>)|*), dataSource: string}, gpuMovement: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(): Promise<void>)|*), dataSource: string}, mouseMove: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(): Promise<void>)|*), dataSource: string}, collidingLogos: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(): Promise<void>)|*), dataSource: string}, pointCluster: {vertexShader: string, currentAnimation: string, fragmentShader: string, setup: ((function(): Promise<void>)|*), dataSource: string}}}
 */
const animationMap = {
    geometry: {
        currentAnimation: "g",
        vertexShader: `${directory}/geometry/vertex.glsl`,
        fragmentShader: `${directory}/geometry/fragment.glsl`,
        dataSource: `${directory}/geometry/geometry.json`,
        setup: setupGeometryView,
    }
}

/**
 * onChange handler for the radio buttons. Look up from the radio button's value in the map above to get the name
 * of the files for the draw program, the shader files (vertex and fragment) and the name of the initialize/setup function
 * needed to start the animation.
 * @param animationName
 */
function changeAnimation(animationName) {
    if (Object.keys(animationMap).indexOf(animationName) > -1) {
        const newAnimation = animationMap[animationName]
        window.currentAnimation = newAnimation.currentAnimation
        window.vertexShader = newAnimation.vertexShader
        window.fragmentShader = newAnimation.fragmentShader
        window.dataSource = newAnimation.dataSource
        newAnimation.setup()
    } else {
        console.error("Animation does not exist!")
    }
}

async function setupCanvas() {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    // to do: more setup here
    fillScreen()
}


/**
 * Set up event handlers needed for events for user input like clicking on the different radio buttons and moving the
 * mouse. Add the callbacks to be called when these events happen.
 */
function setupEventHandlers() {
    changeAnimation("geometry")
    document.getElementById("radio-form").addEventListener('change', (event) => {
        event.preventDefault()
        // const value = document.getElementById("radio-form")
        console.log("what is value??: ", event.target.value)
        changeAnimation(event.target.value)
    })
}

/**
 * Event listener to initialize everything after the page is loaded.
 */
window.addEventListener('load', setupEventHandlers)
window.addEventListener('resize', fillScreen)