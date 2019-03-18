module.exports = function ({
    initialState,
    tempMax,
    tempMin,
    newState,
    getTemp,
    getScore,
    cloneState,
    occasionallyInvoke,
    invokeEvery,
    maxIterations
} = {}) {
    const startTime = new Date;
    if (!isFunction(newState)) {
        throw new Error('newState is not function.');
    }
    if (!isFunction(getTemp)) {
        throw new Error('getTemp is not function.');
    }
    if (!isFunction(getScore)) {
        throw new Error('getScore is not function.');
    }

    let currentTemp = tempMax;

    let lastState = initialState;
    let lastScore = getScore(lastState);

    let bestState = lastState;
    let bestScore = lastScore;

    let iterations = 0;

    let currentState, currentScore;

    while (iterations <= maxIterations) {
        if (currentTemp<=0.001) {
            currentState = bestState;
            currentScore = bestScore;            
        } else {
            currentState = newState(lastState);
            currentScore = getScore(currentState);
        }

        const deltaScore = currentScore.score - lastScore.score;
        if ((deltaScore<0) || (Math.random()<=Math.exp(-deltaScore/currentTemp))) {
            lastState = currentState;
            lastScore = currentScore;

            if (currentScore.score<=bestScore.score) {
                bestState = cloneState ? cloneState.call(currentState, currentState) : currentState;
                bestScore = currentScore;
            }
        }

        ++iterations;

        if (occasionallyInvoke && invokeEvery && (iterations % invokeEvery)===0) {
            const now = new Date;
            occasionallyInvoke(lastState, lastScore, bestState, bestScore, currentTemp, iterations, (now-startTime)/1000);
        }

        currentTemp = getTemp(currentTemp, tempMin, tempMax, iterations);
    }
    return {state:bestState, score:bestScore};
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
