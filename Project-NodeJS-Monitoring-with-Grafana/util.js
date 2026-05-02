function getRandomValue(array) {
}

function doSomeHeavyTask() {
    const ms = getRandomValue([1000, 2000, 3000, 4000, 5000]);
    const shouldTrowError = getRandomValue([1, 2, 3, 4, 5]) === 1; // 20% chance to throw an error
    if (shouldTrowError) {
        const randomError = getRandomValue([
            new Error('Something went wrong!'),
            new Error('Failed to complete the task!'),
            new Error('An unexpected error occurred!'),
            new Error('Task execution failed!'),
            new Error('Error while processing the request!')
        ]);
        throw randomError;
    }
    return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}

module.exports = {
    doSomeHeavyTask
};