const IlliniBlue = new Float32Array([0.075, 0.16, 0.292, 1])
const illiOrange = new Float32Array([1, 0.373, 0.02, 1])
const groundColor = new Float32Array([0.513, 0.396, 0.224, 1])

/**
 * Constant object for setting up the radio buttons and text inputs in the menu on the left side of the screen.
 * @type {{geometry: {options: {lighting: {options: {lampart: string, specular: string}, type: string}}, label: string}, terrain: {options: {slices: {default: number, min: number, label: string, type: string}, lighting: {options: {lampart: string, cliff: string, specular: string, ramp: string}, type: string}, resolution: {default: number, min: number, max: number, label: string, type: string}}, label: string}}}
 */
const controlOptions = {
    "geometry": {
        "label": "Required: Geometry view: Blender monkey mascot with two light sources and a moving camera",
        "options": {
            "lighting": {
                "type": "radio",
                "options": {
                    "specular": "Specular Lighting With Two Light Sources and moving camera.",
                    "lampart": "Lambert’s-law diffuse lighting with two light sources and moving camera.",
                },
            },
        }
    },
    "terrain": {
        "label": "Required: Faulting-method terrain",
        "options": {
            "resolution": {
                "type":"number",
                "default":100,
                "label":"Grid size",
                "max": 250,
                "min": 2
            },
            "slices": {
                "type":"number",
                "default":100,
                "label":"Fractures",
                "min": 0
            },
            "lighting": {
                "type": "radio",
                "options": {
                    "specular": "Shiny: Specular lighting with moving camera.",
                    "lampart": "Lambert’s-law diffuse lighting with moving camera.",
                    "ramp": "Height-based color ramp with moving camera.",
                    "cliff": "Rocky cliffs with moving camera.",
                },
            },
        }
    }
}