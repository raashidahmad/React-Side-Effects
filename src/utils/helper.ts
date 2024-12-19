export const extractPlaceIds = (storedPlaces: string): string[] => {
    if (!storedPlaces) return new Array<string>;
    return JSON.parse(storedPlaces);
}