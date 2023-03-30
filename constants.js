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
                    "specular": "Specular Lighting",
                    "lampart": "Lambert’s-law diffuse lighting;",
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
                "label":"Grid size"
            },
            "slices": {
                "type":"number",
                "default":100,
                "label":"Fractures"
            },
            "lighting": {
                "type": "radio",
                "options": {
                    "specular": "Shiny: Specular Lighting",
                    "lampart": "Lambert’s-law diffuse lighting;",
                    "ramp": "Height-based color ramp",
                    "cliff": "Rocky cliffs",
                },
            },
        }
    }
}