-- Run this in your Supabase SQL Editor to initialize the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  party TEXT NOT NULL,
  constituency TEXT NOT NULL,
  education TEXT,
  "criminalCases" INTEGER DEFAULT 0,
  assets FLOAT DEFAULT 0,
  liabilities FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: The column names here are in double quotes for camelCase, 
-- but it's often better to just use snake_case in Supabase. 
-- However, we match the prompt's Prisma schema fields exactly:
-- 'criminalCases', 'assets', 'liabilities'

-- Seed candidates
INSERT INTO candidates (name, party, constituency, education, "criminalCases", assets, liabilities)
VALUES 
  ('Narendra Modi', 'BJP', 'Varanasi', 'Post Graduate (MA)', 0, 30000000, 0),
  ('Rahul Gandhi', 'INC', 'Wayanad', 'M.Phil', 5, 200000000, 2000000),
  ('Arvind Kejriwal', 'AAP', 'New Delhi', 'B.Tech', 15, 34000000, 0),
  ('Mamata Banerjee', 'AITC', 'Bhabanipur', 'MA, LLB', 0, 16000000, 0);


-- E-Voting Tables

CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  constituency TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'UPCOMING' -- UPCOMING, ACTIVE, COMPLETED
);

CREATE TABLE ballots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id),
  candidate_id UUID REFERENCES candidates(id),
  candidate_name TEXT NOT NULL
);

CREATE TABLE voting_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voter_id UUID NOT NULL, -- references Users table not directly connected here
  election_id UUID REFERENCES elections(id),
  token_hash TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT false
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id),
  encrypted_vote TEXT NOT NULL,
  blockchain_tx_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed an Election
INSERT INTO elections (id, title, constituency, start_time, end_time, status)
VALUES ('e1111111-1111-1111-1111-111111111111', 'Varanasi General Election 2026', 'Varanasi', NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day', 'ACTIVE');

-- Manifesto Intelligence System
CREATE TABLE manifestos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party TEXT NOT NULL,
  policy_category TEXT NOT NULL, -- economy, education, healthcare, infrastructure, environment
  policy_text TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Civic Issue Reporting Platform
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, RESOLVED
  reported_by UUID, -- references Users.id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promise Tracker
CREATE TABLE promises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'NOT_STARTED', -- NOT_STARTED, IN_PROGRESS, COMPLETED, ABANDONED
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
