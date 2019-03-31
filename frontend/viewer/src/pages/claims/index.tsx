import { HTMLTable } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { API_URL } from '../../utils/constants';

import Container from '../../components/container';
import Main from '../../components/main';
import StatusTag from '../../components/status-tag';

import styles from './claims.module.scss';

export default function Claims() {
  const [isLoading, setLoading] = useState(true);
  const [claims, setClaims] = useState<Protos.Claim[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/claims`)
      .then(resp => resp.json())
      .then(data => {
        setClaims(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Container>
      <Main>
        <HTMLTable striped className={styles.table}>
          <thead>
            <tr>
              <th>VIN</th>
              <th>Insurer</th>
              <th>Created</th>
              <th>Modified</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(
              ({ created, insurer, modified, status, vehicle: { vin } }) => (
                <tr key={vin}>
                  <td>
                    <Link to={`/claims/${vin}`}>{vin}</Link>
                  </td>
                  <td>{insurer.name}</td>
                  <td>{new Date(created).toLocaleString()}</td>
                  <td>{new Date(modified).toLocaleString()}</td>
                  <td>
                    <StatusTag status={status} />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </HTMLTable>
      </Main>
    </Container>
  );
}
