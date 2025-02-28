export function getRandomPort(min = 40000, max = 50000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
