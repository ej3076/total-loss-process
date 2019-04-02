import { HTMLTable } from '@blueprintjs/core';
import { match } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { fetchVINData, VINData } from '../../utils/api';
import { API_URL, BLANK_CLAIM } from '../../utils/constants';

import Container from '../../components/container';
import Main from '../../components/main';
import StatusTag from '../../components/status-tag';

import styles from './single-claim.module.scss';

interface Props {
  match: match<{ vin: string }>;
}

export default function SingleClaim({ match }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [claim, setClaim] = useState<Protos.Claim>(BLANK_CLAIM);
  const [vehicleData, setVehicleData] = useState<VINData[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/claims/${match.params.vin}`).then(res => res.json()),
      fetchVINData(match.params.vin),
    ]).then(([claimData, vinData]) => {
      setClaim(claimData);
      setVehicleData(vinData);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return null;
  }
  return (
    <Container>
      <Main className={styles.main}>
        <h1 className={styles.title}>{match.params.vin}</h1>
        <HTMLTable striped>
          <thead>
            <tr>
              <th>Created</th>
              <th>Modified</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{new Date(claim.created).toLocaleTimeString()}</td>
              <td>{new Date(claim.modified).toLocaleTimeString()}</td>
              <td>
                <StatusTag status={claim.status} />
              </td>
            </tr>
          </tbody>
        </HTMLTable>
        <h2>Vehicle Information</h2>
        <HTMLTable striped>
          <tbody>
            <tr>
              <td>
                <strong>VIN</strong>
              </td>
              <td>{claim.vehicle.vin}</td>
            </tr>
            <tr>
              <td>
                <strong>Date of Loss</strong>
              </td>
              <td>{new Date(claim.date_of_loss).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Miles</strong>
              </td>
              <td>{Intl.NumberFormat().format(claim.vehicle.miles)}</td>
            </tr>
            <tr>
              <td>
                <strong>Current Location</strong>
              </td>
              <td>{claim.vehicle.location}</td>
            </tr>
          </tbody>
        </HTMLTable>
        <h2>Vehicle Options</h2>
        <HTMLTable striped>
          <tbody>
            {vehicleData.map(({ Value, Variable }) => (
              <tr key={Variable}>
                <td>
                  <strong>{Variable}</strong>
                </td>
                <td>{Value}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </Main>
    </Container>
  );
}
