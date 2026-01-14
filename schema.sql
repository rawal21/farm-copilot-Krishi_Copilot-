-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Farmers (Users)
create table if not exists farmers (
  id uuid primary key default uuid_generate_v4(),
  phone_number text unique not null,
  full_name text,
  language text default 'mr', -- Default to Marathi
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Farms (Digital Twin)
create table if not exists farms (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmers(id) on delete cascade not null,
  name text, -- e.g., "Home Field"
  total_acres numeric,
  location_pincode text,
  location_lat numeric,
  location_long numeric,
  soil_type text, -- e.g., "Black Cotton", "Loamy"
  irrigation_type text, -- "Rainfed", "Tube-well", "Canal"
  budget_level text, -- "Low", "Medium", "High"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Crop Plans (Seasonal Plan)
create table if not exists crop_plans (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid references farms(id) on delete cascade not null,
  season text, -- "Kharif 2026"
  crop_name text not null, -- "Cotton", "Soybean"
  acres_allocated numeric,
  seed_variety text,
  sowing_date date,
  status text default 'planned', -- "planned", "active", "harvested"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: Interactions (Chat Logs)
create table if not exists interactions (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmers(id) on delete cascade not null,
  message_type text, -- "sent", "received"
  content text,
  media_url text,
  intent text, -- AI detected intent e.g., "onboarding", "pest_advice"
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists farmers_phone_idx on farmers(phone_number);
create index if not exists interactions_farmer_idx on interactions(farmer_id);
create index if not exists farms_farmer_idx on farms(farmer_id);
