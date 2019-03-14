import { Card, Callout, Intent } from '@blueprintjs/core';
import { match } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { API_URL, BLANK_CLAIM } from '../../utils/constants';

import Container from '../../components/container';
import Main from '../../components/main';

import styles from './single-claim.module.scss';

interface Props {
  match: match<{ vin: string }>;
}

export default function SingleClaim({ match }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [claim, setClaim] = useState<Protos.Claim>(BLANK_CLAIM);

  useEffect(() => {
    fetch(`${API_URL}/claims/${match.params.vin}`)
      .then(resp => resp.json())
      .then(data => {
        setClaim(data);
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
        <Callout intent={Intent.WARNING} title="Work in Progress">
          This page will be updated once the claim fields get figured out.
        </Callout>
        <Card className={styles.card}>
          <pre>{JSON.stringify(claim, null, 4)}</pre>
        </Card>
      </Main>
    </Container>
  );
}
