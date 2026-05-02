function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function doSomeHeavyTask() {
    const ms = getRandomValue([100, 200, 500, 600, 700, 1000, 2000, 3000, 4000, 5000]);
    const shouldTrowError = getRandomValue([1, 2, 3, 4, 5]) === 2; // 20% chance to throw an error
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