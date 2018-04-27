# Simulated Annealing for node.js

[![NPM version](https://img.shields.io/npm/v/simulated-annealing.svg)](https://www.npmjs.com/package/simulated-annealing)

Simulated Annealing optimization algorithm for node.js.

## Install

```commandline
npm install --save simulated-annealing
```

## Usage

```javascript
var simulatedAnnealing = require('simulated-annealing');
var result = simulatedAnnealing(params);
```

### Params

* initialState - first state value
* tempMax - initial temperature
* tempMin - min temperature when algorithm will stop
* newState - function for generating new state from current state **newState(state)**
* getTemp - function for generating new temperature based on previous temperature **getTemp(temperature)**
* getEnergy - function for calculating energy for state **getEnergy(state)** (less is better)

### Example

Find solution for x^2=16

```javascript
var simulatedAnnealing = require('simulated-annealing');

function getEnergy(v) {
    return Math.abs(v * v - 16);
}

// copy array and invert subsequence
function newState(x) {
    return x + (Math.random() - 0.5);
}

// linear temperature decreasing
function getTemp(prevTemperature) {
    return prevTemperature - 0.001;
}

var result = simulatedAnnealing({
    initialState: Math.random() * 16,
    tempMax: 15,
    tempMin: 0.001,
    newState: newState,
    getTemp: getTemp,
    getEnergy: getEnergy,
});

```

## Testing

```commandline
npm test
```