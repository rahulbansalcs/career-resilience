CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
email VARCHAR(255) NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
headline VARCHAR(255),
bio TEXT,
education TEXT,
experience_years NUMERIC(4,1) NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
location VARCHAR(150),
linkedin_url TEXT,
github_url TEXT,
portfolio_url TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE skills (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL UNIQUE,
category VARCHAR(100) NOT NULL,
description TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_skills (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
proficiency_level SMALLINT NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
years_experience NUMERIC(4,1) NOT NULL DEFAULT 0 CHECK (years_experience >= 0),
last_used_at TIMESTAMPTZ,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(user_id, skill_id)
);

CREATE TABLE career_roles (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(150) NOT NULL UNIQUE,
description TEXT,
industry VARCHAR(150),
growth_outlook VARCHAR(50),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE career_role_skills (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
career_role_id UUID NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
importance SMALLINT NOT NULL CHECK (importance BETWEEN 1 AND 5),
is_required BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(career_role_id, skill_id)
);

CREATE TABLE roadmaps (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
career_role_id UUID NOT NULL REFERENCES career_roles(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
description TEXT,
status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','paused')),
target_date DATE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roadmap_items (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
description TEXT,
item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('skill','project','course','certification','experience')),
priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
estimated_hours NUMERIC(6,1),
due_date DATE,
completed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE jobs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(255) NOT NULL,
company_name VARCHAR(255) NOT NULL,
description TEXT,
location VARCHAR(255),
employment_type VARCHAR(50),
experience_level VARCHAR(50),
salary_min NUMERIC(12,2),
salary_max NUMERIC(12,2),
currency VARCHAR(10) DEFAULT 'INR',
application_url TEXT,
source VARCHAR(100),
external_id VARCHAR(255),
posted_at TIMESTAMPTZ,
expires_at TIMESTAMPTZ,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(source, external_id)
);

CREATE TABLE job_skills (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
importance SMALLINT NOT NULL DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(job_id, skill_id)
);

CREATE TABLE job_matches (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
match_score NUMERIC(5,2) NOT NULL CHECK (match_score BETWEEN 0 AND 100),
matched_skills_count INTEGER NOT NULL DEFAULT 0 CHECK (matched_skills_count >= 0),
missing_skills_count INTEGER NOT NULL DEFAULT 0 CHECK (missing_skills_count >= 0),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE(user_id, job_id)
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_career_role_skills_role_id ON career_role_skills(career_role_id);
CREATE INDEX idx_career_role_skills_skill_id ON career_role_skills(skill_id);
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);
CREATE INDEX idx_jobs_title ON jobs(title);
CREATE INDEX idx_jobs_company ON jobs(company_name);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);
CREATE INDEX idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX idx_job_matches_job_id ON job_matches(job_id);
CREATE INDEX idx_job_matches_score ON job_matches(match_score);