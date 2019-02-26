declare namespace Protos {
  namespace File {
    enum Status {
      ACTIVE,
      ARCHIVED,
    }
  }
  interface File {
    status: File.Status;
    hash: string;
    name: string;
  }

  interface Claim {
    files: File[];
    status: number;
    vehicle: Vehicle;
  }

  interface Vehicle {
    vin: string;
    model: string;
    year: number;
    miles: number;
    color: string;
  }

  namespace ClaimPayload {
    enum Action {
      ERROR,
      CREATE_CLAIM,
      EDIT_CLAIM,
    }
  }
  interface ClaimPayload {
    action: ClaimPayload.Action;
    data: Claim;
  }
}
