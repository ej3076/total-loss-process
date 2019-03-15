interface VINResponse {
  Results: VINData[];
}

export interface VINData {
  Value: string | null;
  Variable: string;
}

/**
 * Fetch and cache vehicle data for a given VIN.
 */
export async function fetchVINData(vin: string): Promise<VINData[]> {
  const existingVins: Record<string, VINData[]> = JSON.parse(
    window.localStorage.getItem('vin-data') || '{}',
  );
  if (existingVins[vin]) {
    return existingVins[vin];
  }
  const vinData: VINResponse = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/${vin}?format=json`,
  ).then(res => res.json());
  // prettier-ignore
  const data = vinData.Results
    .filter(({ Value, Variable }) => Value && Variable !== 'Error Code')
    .sort((a, b) => (a.Variable < b.Variable ? -1 : 1));
  window.localStorage.setItem(
    'vin-data',
    JSON.stringify({ ...existingVins, [vin]: data }),
  );
  return data;
}
