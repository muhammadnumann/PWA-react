const TOTAL_COUNT = 200;

export const susolvkaCoords = { lat: 31.56896489999999, lng: 74.35861489999999 };

export const markersData = [...Array(TOTAL_COUNT)]
    .fill(0)
    .map((__, index) => ({
        id: index,
        lat:
            susolvkaCoords.lat +
            0.01 *
            index *
            Math.sin(30 * Math.PI * index / 180) *
            Math.cos(50 * Math.PI * index / 180) +
            Math.sin(5 * index / 180),
        lng:
            susolvkaCoords.lng +
            0.01 *
            index *
            Math.cos(70 + 23 * Math.PI * index / 180) *
            Math.cos(50 * Math.PI * index / 180) +
            Math.sin(5 * index / 180),
    }));
