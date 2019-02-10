declare namespace Protos {
  interface Claim {
    vehicle: Vehicle;
    status: number;
    files: Array<{
      hash: string;
      name: string;
      filename: string;
      url: string;
    }>;
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
