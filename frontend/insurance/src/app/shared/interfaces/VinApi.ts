export interface VinApi {
  Results: Array<Results>;
}

interface Results {
  Model: string;
  ModelYear: string;
  BasePrice: string;
}
