declare namespace Protos {
  interface File {
    status: number;
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
        ERROR,
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
