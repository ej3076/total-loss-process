import React from 'react';

import Container from '../../components/container';
import Main from '../../components/main';

import styles from './home.module.scss';

export default function Home() {
  return (
    <Container>
      <Main className={styles.main}>
        <div className={styles.hero}>
          <h1>Welcome to ClaimTrack</h1>
          <div>
            Powered by <strong>Hyperledger Sawtooth</strong>
          </div>
        </div>
        {/* FIXME: Put something useful here  */}
        <div className={styles.text}>
          <p>
            ClaimTrack is a generic "viewer" application designed to showcase
            how multiple independent nodes can hook into and use data from a
            single blockchain network. This application enforces simple
            read-only access control to non-private information related to
            "claims" that are being tracked on the Sawtooth blockchain network.
          </p>
          <p>
            Along with the general "viewer" application, this application also
            provides a demo of how peers on the network may use "subscriptions"
            to get realtime feedback and notifications for transactions on the
            blockchain. This could potentially be used for sending alerts to
            parties involved with specific claims, or for automatically
            forwarding the claims' "status" when certain criteria are met.
          </p>
        </div>
      </Main>
    </Container>
  );
}
