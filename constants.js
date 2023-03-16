const IlliniBlue = new Float32Array([0.075, 0.16, 0.292, 1])
const illiOrange = new Float32Array([1, 0.373, 0.02, 1])

const controlOptions = {
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
        }
    }
}