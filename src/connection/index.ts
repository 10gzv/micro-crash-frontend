/* eslint-disable import/no-cycle */
import { connectionsStore } from '@10gzv/crash-core';

import { GameLiveConnection } from './gameConnection';
import { GameChatConnection } from './chatConnection';

// const searchParams = new URLSearchParams(window.location.search);
// const token = searchParams.get('token') || '';
// const mode = searchParams.get('mode') || '';

// /** Local dev: point game + chat at base-crash backend (token from ?token= in the page URL). */
// const TEST_WS_HOST = 'wss://abra-base-crash.abracadabra.services';

// const testGameUrl = `${TEST_WS_HOST}/socket?token=${token}&mode=${mode}`;

export const gameLiveConnection = new GameLiveConnection();

connectionsStore.setGameConnection(gameLiveConnection);

export const chatConnection = new GameChatConnection();

connectionsStore.setChatConnection(chatConnection);
