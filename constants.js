const IlliniBlue = new Float32Array([0.075, 0.16, 0.292, 1])
const illiOrange = new Float32Array([1, 0.373, 0.02, 1])
const groundColor = new Float32Array([0.513, 0.396, 0.224, 1])

const controlOptions = {
    "geometry": {
        "label": "Spinning Geometry",
        "options": {
            "lighting": {
                "type": "radio",
                "options": {
                    "specular": "Specular Lighting With Two Light Sources. Camera is moving, model and light sources are stationary.",
                    "lampart": "Lambert’s-law diffuse lighting with two light sources. Camera is moving, model and light sources are stationary.",
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
                    "specular": "Shiny: Specular Lighting. Camera is moving, model and light source are stationary.",
                    "lampart": "Lambert’s-law diffuse lighting. Camera is moving, model and light source are stationary.",
                    "ramp": "Height-based color ramp. Camera is moving, model and light source are stationary.",
                    "cliff": "Rocky cliffs. Camera is moving, model and light source are stationary.",
                },
            },
        }
    }
}