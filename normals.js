/**
 * Calculate the normals of the vertexes and add them to the data object so we can use them in the shaders for lighting
 * calculations.
 * @param data
 */
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