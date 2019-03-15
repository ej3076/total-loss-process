declare namespace Protos {
  namespace Claim {
    enum Status {
      /**
       * Initial data entry and settlement agreement being orchestrated by the
       * insurance company.
       */
      SETTLEMENT,
      /**
       * Settlement has been reached. Information and files are being
       * collected/requested by agencies exterior to insurance company (DMV,
       * Ford Credit, etc).
       */
      DATA_COLLECTION,
      /**
       * All required files have been obtained. Vehicle is ready for auction.
       */
      AUCTION,
      /**
       * Vehicle has passed auction phase. Case has now been fully resolved.
       */
      RESOLVED,
    }
  }
  interface Claim {
    /**
     * The status of the vehicle in the system.
     */
    status: Claim.Status;
    /**
     * JSON serialized UTC date representing claim creation time.
     */
    created: string;
    /**
     * JSON serialized UTC date representing last modification time.
     */
    modified: string;
    /**
     * JSON serialized UTC date representing the date of vehicle loss.
     */
    date_of_loss: string;
    /**
     * The vehicle info.
     */
    vehicle: Vehicle;
    /**
     * The insurer info.
     */
    insurer: Insurer;
    /**
     * An array of file protos.
     */
    files: File[];
  }

  namespace ClaimPayload {
    enum Action {
      /**
       * Ensures that payload actions are always specified explicitly. Should not be used on purpose.
       */
      ERROR,
      /**
       * Create a new claim.
       */
      CREATE_CLAIM,
      /**
       * Delete an existing claim.
       */
      DELETE_CLAIM,
      /**
       * Edit an existing claim.
       */
      EDIT_CLAIM,
    }
  }
  interface ClaimPayload {
    /**
     * JSON serialized UTC timestamp.
     */
    timestamp: string;
    /**
     * Action to be taken.
     */
    action: ClaimPayload.Action;
    /**
     * Claim data associated with the action.
     */
    data: Claim;
  }

  namespace File {
    enum Status {
      /**
       * File is active and visible.
       */
      ACTIVE,
      /**
       * File has been archived by the user.
       */
      ARCHIVED,
    }
    enum Type {
      /**
       * Misc documents/images.
       */
      NONE,
      /**
       * Power of Attorney.
       */
      POA,
      /**
       * Vehicle title.
       */
      TITLE,
      /**
       * Odometer disclosure statement.
       */
      ODS,
      /**
       * Police report.
       */
      POLICE,
      /**
       * Settlement offer.
       */
      SETTLEMENT,
      /**
       * Letter of guarantee.
       */
      LOG,
    }
  }
  interface File {
    hash: string;
    name: string;
    status: File.Status;
    type: File.Type;
  }

  interface Insurer {
    /**
     * Name of insurance company.
     */
    name: string;
    /**
     * Deductible amount.
     */
    deductible: number;
    /**
     * Whether or not owner has gap coverage.
     */
    has_gap: boolean;
  }

  interface Vehicle {
    /**
     * The vehicle VIN.
     */
    vin: string;
    /**
     * The vehicle's miles.
     */
    miles: number;
    /**
     * Current location of the vehicle.
     */
    location: string;
  }
}

// vim: set fdn=2 fdl=1:
