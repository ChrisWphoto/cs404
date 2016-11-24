/**
 * find shortest path using E matrix
 * Use F matrix to add add weights to a new matrix
 *  The SneakyPath from a to b, such that the total number of other cars on the road encountered is as small as possible,
 *  the edge on this SneakyPath with the lowest number of other cars,
 *  the edge on this SneakyPath with the highest number of other cars,
 *  the average number of other cars on the SneakyPath, averaged over the number of links on the path
 */

const fs = require('fs')
require('console.table')
var usage = require('usage')
const MAKE_IDX_START_AT_ZERO = 1
var time1 = Date.now()

var V = 0   // Number of vertices
var source = 0
var dest = 0

function floydWarshall (dist) {
  console.log('this is Graph')
  console.table(dist)
  let k, i, j

  for (k = 0; k < V; k++) {
    for (i = 0; i < V; i++) {
      for (j = 0; j < V; j++) {
        if (i !== j) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j]
            console.table(dist)
          }
        }
      }
    }
  }
  console.log('All pairs shortest path: Min Weights:')
  console.table(dist)
  // printResult(short, pathMatrix)
  // console.log('Sneaky Matrix:')
  // console.table(efMatrix)
  // dijkstra(efMatrix, source)
}

var eMatrix = []
var fMatrix = []

function readData (inputFilePath, cb) {
  var data = fs.readFileSync(inputFilePath, {encoding: 'utf8'})
  // break input file into lines
  data = data.split('\n')

  // store dimmesions from first line.
  let dimensions = data[0].split(',')
  V = parseInt(dimensions[0])
  source = parseInt(dimensions[1]) - MAKE_IDX_START_AT_ZERO
  dest = parseInt(dimensions[2]) - MAKE_IDX_START_AT_ZERO
  console.log(V, source, dest)

  // prep flow and edge matrices for reading
  for (let i = 0; i < V; i++) {
    eMatrix.push([])
    fMatrix.push([])
    for (let j = 0; j < V; j++) {
      eMatrix[i].push(Infinity)
      fMatrix[i].push(Infinity)
    }
  }
  // slice off first entry
  data = data.slice(1)
  data.map((line) => {
    if (line !== '') {
      line = line.split(',')
      let type = line[0]
      let i = parseInt(line[1]) - MAKE_IDX_START_AT_ZERO
      let j = parseInt(line[2]) - MAKE_IDX_START_AT_ZERO
      let weight = parseInt(line[3])

      switch (type) {
        case 'F':
          fMatrix[i][j] = weight
          break
        case 'E':
          eMatrix[i][j] = weight
          break
      }
    }
  })
  cb()
}

let printMatrices = () => {
  console.log('Flow Matrix:')
  console.table(fMatrix)

  console.log('Edge Matrix:')
  console.table(eMatrix)
  floydWarshall(eMatrix)
}

function printResult (distance, pathMatrix) {
  for (let i = 0; i < pathMatrix.length; i++) {
    for (let j = 0; j < pathMatrix.length; j++) {
      if (i !== j) {
        let u = i + 1
        let v = j + 1
        let path = []
        while (u !== v) {
          u = pathMatrix[u - 1][v - 1]
          path.push(u)
        }
        console.log(u)
      }
    }
  }
}

function dijkstra (graph, start) {
  // Path will hold vertices + edge weights in shortest path
  let path = []
  // vertex idx will be true if vertex is included in shortest path
  let vIncluded = []
  // hold weights of shortest paths
  let shortWeights = []
  for (let i = 0; i < V; i++) {
    path.push(-1)
    shortWeights.push(Infinity)
    vIncluded.push(false)
  }
  shortWeights[start] = 0
  for (let count = 0; count < V - 1; count++) {
    // find next v with smallest number of cars
    let i = minDistance(shortWeights, vIncluded)
    // mark vertex as picked
    vIncluded[i] = true
    for (let j = 0; j < V; j++) {
      if (!vIncluded[j] && graph[i][j] &&
          shortWeights[i] + graph[i][j] < shortWeights[j]) {
        path[j] = i
        shortWeights[j] = shortWeights[i] + graph[i][j]
      }
    }
  }
  console.table(shortWeights)
  console.log('Sneaky Paths delivered by dijkstra')
  console.table(path)
  printPath(path, source)
  console.log(`Path from ${source + MAKE_IDX_START_AT_ZERO} to ${dest + MAKE_IDX_START_AT_ZERO}`, tempPath)
}

function minDistance (shortWeights, vIncluded) {
  let min = Infinity
  let minIdx
  for (let i = 0; i < V; i++) {
    if (vIncluded[i] === false && shortWeights[i] <= min) {
      min = shortWeights[i]
      minIdx = i
    }
  }
  return minIdx
}
var tempPath = []
function printPath (path, idx) {
  if (path[idx] === -1) {
    tempPath = []
    return
  }
  printPath(path, path[idx])
  tempPath.push(idx + MAKE_IDX_START_AT_ZERO)
}

readData('./input.txt', printMatrices)

// report cpu mem usage
var pid = process.pid
usage.lookup(pid, (err, result) => {
  err ? console.log(err) : null
  console.log(result)
})
var time2 = Date.now()

console.log('Total run time:', time2 - time1, 'ms')

