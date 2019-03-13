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

  namespace Claim {
    enum Status {
      SETTLEMENT,
      DATA_COLLECTION,
      AUCTION,
      RESOLVED,
    }
  }
  interface Claim {
    files: File[];
    status: Claim.Status;
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
      DELETE_CLAIM,
      EDIT_CLAIM,
    }
  }
  interface ClaimPayload {
    action: ClaimPayload.Action;
    data: Claim;
  }
}
