module.exports = function ({
    initialState,
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

    let lastState = clone(initialState);
    let bestState = clone(lastState);

    let lastScore = getScore(lastState);
    let bestScore = lastScore;

    let iterations = 0;
    let currentState, currentScore, currentTemp;

    while (iterations++ <= maxIterations) {
        currentTemp = getTemp(currentTemp, iterations);

        if (occasionallyInvoke && invokeEvery && (iterations % invokeEvery)===0) {
            const now = new Date;
            occasionallyInvoke(lastState, lastScore, bestState, bestScore, currentTemp, iterations, (now-startTime)/1000);
        }

        if (!currentTemp) {
            lastState = currentState = clone(bestState);
            lastScore = currentScore = bestScore;
        } else {
            currentState = newState(lastState);
            currentScore = getScore(currentState);

            const deltaScore = currentScore.score - lastScore.score;
            if ((deltaScore<0) || (Math.random()<=Math.exp(-deltaScore/currentTemp))) {
                lastState = currentState;
                lastScore = currentScore;

                if (currentScore.score<=bestScore.score) {
                    bestState = clone(currentState);
                    bestScore = currentScore;
                }
            }
        }
    }

    const elapsed = (new Date - startTime)/1000;
    return {state:bestState, score:bestScore, elapsed:elapsed};

    function clone(state) {
        return cloneState ? cloneState.call(state, state) : state;
    }
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
