module.exports = function ({
    initialState,
    tempMax,
    tempMin,
    newState,
    getTemp,
    getEnergy,
    clone,
    occasionallyInvoke,
    invokeEvery,
} = {}) {
    if (!isFunction(newState)) {
        throw new Error('newState is not function.');
    }
    if (!isFunction(getTemp)) {
        throw new Error('getTemp is not function.');
    }
    if (!isFunction(getEnergy)) {
        throw new Error('getEnergy is not function.');
    }

    let currentTemp = tempMax;

    let lastState = initialState;
    let lastEnergy = getEnergy(lastState);

    let bestState = lastState;
    let bestEnergy = lastEnergy;

    let iterations;

    if (isFunction(occasionallyInvoke) && typeof invokeEvery==='number') {
        iterations = 0;
        // Ensure this is an integer for mod calculations
        invokeEvery = Math.round(invokeEvery);
    }

    while (currentTemp > tempMin) {
        let currentState = newState(lastState);
        let currentEnergy = getEnergy(currentState);

        if ((currentEnergy<lastEnergy) ||
            (Math.random() <= Math.exp(-(currentEnergy - lastEnergy)/currentTemp))) {
            lastState = currentState;
            lastEnergy = currentEnergy;
        }

        if (lastEnergy < bestEnergy) {
            bestState = clone ? clone.call(lastState, lastState) : lastState;
            bestEnergy = lastEnergy;
        }

        if (iterations && ((++iterations % invokeEvery)===0)) {
            occasionallyInvoke(lastState, lastEnergy, bestState, bestEnergy, currentTemp, iterations);
        }

        currentTemp = getTemp(currentTemp);
    }
    return bestState;
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
