'use strict';

const { loadType } = require('./proto');

/**
 * @typedef {import('./state').Vehicle} Vehicle
 * @typedef {Partial<import('./state').Vehicle> & { vin: string }} PartialVehicle
 */

class VehiclePayload {
  /**
   * Constructor.
   *
   * @param {Record<string, number>} actions - Known actions.
   * @param {number} action                  - An action to perform.
   * @param {PartialVehicle} data            - Data associated with the action.
   */
  constructor(actions, action, data) {
    this.Actions = actions;
    this.action = action;
    this.data = data;
  }

  /**
   * VehiclePayload builder.
   *
   * @param {Buffer} payload - Raw payload buffer.
   * @return {Promise<VehiclePayload>}
   */
  static async fromBytes(payload) {
    const Payload = await loadType('vehicle.proto', 'vehicle.Payload');
    const { action, data } = Payload.toObject(Payload.decode(payload));
    return new VehiclePayload(Payload.Action, action, data);
  }

  /**
   * Type guard for checking if a `Partial<Vehicle>` is complete, thereby being a `Vehicle`.
   *
   * @param {Partial<Vehicle>} vehicle
   * @return {vehicle is Vehicle}
   */
  static isComplete(vehicle) {
    return (vehicle.color && vehicle.model && vehicle.vin && true) || false;
  }
}

module.exports = VehiclePayload;
