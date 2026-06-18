import http from 'k6/http';
import { sleep, check } from 'k6';

// k6 Options defining scenarios for 100, 500, 1000 User Load, Stress, Spike, and Endurance tests
export const options = {
  scenarios: {
    load_100: {
      executor: 'constant-vus',
      vus: 100,
      duration: '10s',
      exec: 'defaultQuery',
    },
    load_500: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 500 },
        { duration: '10s', target: 500 },
        { duration: '5s', target: 0 },
      ],
      exec: 'defaultQuery',
    },
    load_1000: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 1000 },
        { duration: '10s', target: 1000 },
        { duration: '5s', target: 0 },
      ],
      exec: 'defaultQuery',
    },
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 200 },
        { duration: '15s', target: 1200 },
        { duration: '5s', target: 0 },
      ],
      exec: 'defaultQuery',
    },
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2s', target: 1500 },
        { duration: '5s', target: 1500 },
        { duration: '2s', target: 0 },
      ],
      exec: 'defaultQuery',
    },
    endurance_test: {
      executor: 'constant-vus',
      vus: 300,
      duration: '30s',
      exec: 'defaultQuery',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export function defaultQuery() {
  const res = http.get('http://localhost:3000/');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
