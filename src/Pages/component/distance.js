export function isUserNearby(userLat, userLng, spotLat, spotLng, maxDistanceMeters = 200000) {
  if (!userLat || !userLng || !spotLat || !spotLng) return false;

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters

  const dLat = toRad(spotLat - userLat);
  const dLng = toRad(spotLng - userLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLat)) * Math.cos(toRad(spotLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= maxDistanceMeters;
}
