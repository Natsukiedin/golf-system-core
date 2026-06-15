-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_info TEXT,
    golf_history TEXT,
    fitting_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table (Receptions/Jobs)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50) CHECK (status IN ('received', 'working', 'adjusted', 'finished')) DEFAULT 'received',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Club Specs Table
CREATE TABLE club_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    club_type VARCHAR(100),
    maker VARCHAR(100),
    head_model VARCHAR(100),
    shaft_model VARCHAR(100),
    loft NUMERIC(5,2),
    lie NUMERIC(5,2),
    length NUMERIC(5,2),
    total_weight NUMERIC(6,2),
    swing_weight VARCHAR(20), -- e.g., D2, C9
    cpm INTEGER,
    grip VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_type VARCHAR(50) CHECK (part_type IN ('head', 'shaft', 'grip', 'socket', 'weight', 'other')),
    maker VARCHAR(100),
    model VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Table
CREATE TABLE pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type VARCHAR(50) CHECK (item_type IN ('part', 'labor')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to read customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update customers" ON customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete customers" ON customers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update tasks" ON tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete tasks" ON tasks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read club_specs" ON club_specs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert club_specs" ON club_specs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update club_specs" ON club_specs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete club_specs" ON club_specs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read inventory" ON inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert inventory" ON inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update inventory" ON inventory FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete inventory" ON inventory FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read pricing" ON pricing FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert pricing" ON pricing FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update pricing" ON pricing FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete pricing" ON pricing FOR DELETE TO authenticated USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_club_specs_modtime BEFORE UPDATE ON club_specs FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_pricing_modtime BEFORE UPDATE ON pricing FOR EACH ROW EXECUTE FUNCTION update_modified_column();
