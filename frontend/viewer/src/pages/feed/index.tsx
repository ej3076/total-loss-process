import { Card, Tag, Text } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';

import { WS_URL } from '../../utils/constants';

import Container from '../../components/container';
import Main from '../../components/main';

import styles from './feed.module.scss';

interface Subscription {
  /**
   * The ID of the block that changed.
   */
  block_id: string;
  /**
   * The number of the block that changed.
   */
  block_num: string;
  /**
   * The ID of the previous block.
   */
  previous_block_id: string;
  /**
   * List of changes to state on the block that occurred in the batch.
   */
  state_changes: Array<{
    /**
     * Address of the state item.
     */
    address: string;
    /**
     * Type of change that occurred.
     */
    type: 'SET' | 'DELETE';
    /**
     * Base64 encoded protobuf bytes string of the value of the state item.
     */
    value: string;
  }>;
}

export default function Feed() {
  const [feed, setFeed] = useState<Subscription[]>([]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    let isCollecting = true;
    let initialFeed: Subscription[] = [];
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ action: 'subscribe' }));
    });
    ws.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      if (data.fork_detected) {
        return;
      }
      if (isCollecting && data.previous_block_id && data.block_num > 0) {
        initialFeed = [...initialFeed, data];
        ws.send(
          JSON.stringify({
            action: 'get_block_deltas',
            block_id: data.previous_block_id,
          }),
        );
      } else if (isCollecting) {
        isCollecting = false;
        setFeed([...initialFeed, data]);
      } else {
        setFeed(prevFeed => [data, ...prevFeed]);
      }
    });
    return () => {
      ws.send(JSON.stringify({ action: 'unsubscribe' }));
      ws.close(1000);
    };
  }, []);

  return (
    <Container>
      <Main className={styles.main}>
        {feed.map(
          ({ block_id, block_num, previous_block_id, state_changes }) => (
            <div key={block_id} className={styles.item}>
              <Tag minimal large>
                <code>{block_num}</code>
              </Tag>
              <Card className={styles.card}>
                <dl className={styles.dl}>
                  <dt>
                    <h3>Block ID</h3>
                  </dt>
                  <dd>
                    <Text ellipsize>{block_id}</Text>
                  </dd>
                  <dt>
                    <h3>Previous Block ID</h3>
                  </dt>
                  <dd>
                    <Text ellipsize>{previous_block_id}</Text>
                  </dd>
                  <dt>
                    <h3>State Changes</h3>
                  </dt>
                  <dd>
                    <Card className={styles.code}>
                      <pre>{JSON.stringify(state_changes, null, 4)}</pre>
                    </Card>
                  </dd>
                </dl>
              </Card>
            </div>
          ),
        )}
      </Main>
    </Container>
  );
}
