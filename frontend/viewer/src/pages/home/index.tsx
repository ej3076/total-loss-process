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
            Dolor fugit quos omnis dicta vitae Dolor est cumque et iure
            possimus. Aliquid repudiandae voluptates voluptatibus totam debitis
            quod Consequatur corrupti vitae reiciendis deserunt rem vel fugiat,
            nisi facere. Dicta! Adipisicing optio nesciunt saepe accusamus ullam
            molestias blanditiis Vero nobis porro dolorum corporis dolor Hic
            illum suscipit vitae voluptatibus ducimus Eum distinctio vitae
            voluptate eaque aliquid? Accusamus odit molestias dolorem.
          </p>
          <p>
            Lorem vitae maiores consectetur laboriosam temporibus nemo?
            Inventore amet explicabo facere aspernatur accusamus odio. Sapiente
            dicta hic nulla enim accusantium Dolore quas porro possimus deleniti
            nesciunt? Numquam tempora libero iste?
          </p>
        </div>
      </Main>
    </Container>
  );
}
