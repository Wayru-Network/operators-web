
// Check if the current version meets the minimum version requirement
export function isMinimumVersionMet(current: string): boolean {
    const minimum = "2.4.0";
    const currentParts = current.split(".").map(Number);
    const minimumParts = minimum.split(".").map(Number);

    for (let i = 0; i < minimumParts.length; i++) {
        if (currentParts[i] > minimumParts[i]) {
            return true;
        } else if (currentParts[i] < minimumParts[i]) {
            return false;
        }
    }

    return true;
}
