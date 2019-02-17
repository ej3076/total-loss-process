declare namespace Protos {
  interface File {
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

  namespace Payload {
    namespace Actions {
      enum ClaimActions {
        CREATE_CLAIM,
        EDIT_CLAIM,
      }
    }
    interface ClaimPayload {
      action: Actions.ClaimActions;
      data: Claim;
    }
  }
}
