export const getNearestTownId = (
  towns: { id: string; longitude: number; latitude: number }[],
  x: number,
  y: number,
): string => {
  if (towns.length === 0) throw new Error('No towns to match against');
  let nearest = towns[0]!;
  let minDistance = Infinity;
  for (const town of towns) {
    const dist = Math.sqrt(
      (town.longitude - x) ** 2 + (town.latitude - y) ** 2,
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = town;
    }
  }
  return nearest.id;
};

export type WarLocation = {
  teamId: string;
  iconType: number;
  x: number;
  y: number;
  flags: number;
  viewDirection: number;
};
export type DynamicResponse = { mapItems: WarLocation[] };

