import dotenv from 'dotenv';
dotenv.config();

export const config = {
  dbUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/eloktantra',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-default-key-change-me',
  services: {
    auth: { port: process.env.AUTH_SERVICE_PORT || 4001, url: 'http://localhost:4001' },
    candidate: { port: process.env.CANDIDATE_SERVICE_PORT || 4002, url: 'http://localhost:4002' },
    manifesto: { port: process.env.MANIFESTO_SERVICE_PORT || 4003, url: 'http://localhost:4003' },
    issueReporting: { port: process.env.ISSUE_SERVICE_PORT || 4004, url: 'http://localhost:4004' },
    debate: { port: process.env.DEBATE_SERVICE_PORT || 4005, url: 'http://localhost:4005' },
    promiseTracker: { port: process.env.PROMISE_SERVICE_PORT || 4006, url: 'http://localhost:4006' },
    voting: { port: process.env.VOTING_SERVICE_PORT || 4007, url: 'http://localhost:4007' },
    identity: { port: process.env.IDENTITY_SERVICE_PORT || 4008, url: 'http://localhost:4008' },
    blockchain: { port: process.env.BLOCKCHAIN_SERVICE_PORT || 4009, url: 'http://localhost:4009' },
    audit: { port: process.env.AUDIT_SERVICE_PORT || 4010, url: 'http://localhost:4010' },
    misinformationAi: { port: process.env.AI_SERVICE_PORT || 4011, url: 'http://localhost:4011' },
  }
};
