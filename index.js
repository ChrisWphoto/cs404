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

// Globals
var eMatrix = [] // Edge weights
var fMatrix = [] // Source to destination flow
const ADJ_IDX = 1
var time1 = Date.now()
var V = 0   // Number of vertices
var source = 0
var dest = 0


// Start program
readData('./input.txt', printMatrices)
function printMatrices () {
  console.log('Flow Matrix:')
  console.table(fMatrix)
  console.log('Edge Matrix:')
  console.table(eMatrix)
  floydWarshall(eMatrix)
}



// utility function for initializing 2d array
function allocate2DArray (paths) {
  let arr = []
  for (let i = 0; i < V; i++) {
    arr.push([])
    for (let j = 0; j < V; j++) {
      paths ? arr[i].push([]) : arr[i].push[0]
    }
  }
  return arr
}

function initDistAndPath (graph, dist, path) {
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      dist[i][j] = graph[i][j]
      if (graph[i][j] !== Infinity) {
        path[i][j].push([i + ADJ_IDX])
        if (i !== j) {
          path[i][j].push([j + ADJ_IDX])
        }
      }
    }
  }
}


function floydWarshall (graph) {
  let k, i, j
  let dist = allocate2DArray()
  let paths = allocate2DArray('push sub arrays')
  initDistAndPath(graph, dist, paths)
  console.log('paths:')
  console.table(paths)
  
  for (k = 0; k < V; k++) {
    for (i = 0; i < V; i++) {
      for (j = 0; j < V; j++) {
        if (i !== j) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j]
            paths[i][j] = paths[i][k].slice(0, paths[i][k].length - 1).concat(paths[k][j])
          }
        }
      }
    }
  }
  console.log('All pairs shortest path: Min Weights:')
  console.table(dist)
  console.table(paths)
}


function readData (inputFilePath, printMatrices) {
  var data = fs.readFileSync(inputFilePath, {encoding: 'utf8'})
  // break input file into lines
  data = data.split('\n')

  // store dimmesions from first line.
  let dimensions = data[0].split(',')
  V = parseInt(dimensions[0])
  source = parseInt(dimensions[1]) - ADJ_IDX
  dest = parseInt(dimensions[2]) - ADJ_IDX
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
      let i = parseInt(line[1]) - ADJ_IDX
      let j = parseInt(line[2]) - ADJ_IDX
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
  printMatrices()
}


// report cpu mem usage
var pid = process.pid
usage.lookup(pid, (err, result) => {
  err ? console.log(err) : null
  console.log(result)
})
var time2 = Date.now()

console.log('Total run time:', time2 - time1, 'ms')

