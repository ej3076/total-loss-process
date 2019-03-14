import { HTMLTable, Intent, Tag } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { API_URL } from '../../utils/constants';

import Container from '../../components/container';
import Main from '../../components/main';

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
              <th>Miles</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(({ status, vehicle: { location, miles, vin } }) => (
              <tr key={vin}>
                <td>
                  <Link to={`/claims/${vin}`}>{vin}</Link>
                </td>
                <td>{miles}</td>
                <td>{location}</td>
                <td>
                  <Tag large minimal intent={intentFromStatus(status)}>
                    {status}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </Main>
    </Container>
  );
}

const intentFromStatus = (status: Protos.Claim['status']) => {
  switch (status) {
    case 1:
      return Intent.PRIMARY;
    case 2:
      return Intent.WARNING;
    case 3:
      return Intent.SUCCESS;
    default:
      return Intent.NONE;
  }
};
