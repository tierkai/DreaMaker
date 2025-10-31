-- 创建数据库表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'viewer',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  last_heartbeat TIMESTAMP DEFAULT NOW(),
  metrics JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  analysis JSONB,
  neural_mapping JSONB,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  config JSONB,
  results JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS digital_twin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name VARCHAR NOT NULL,
  mouse_id VARCHAR,
  neural_data JSONB,
  behavior_data JSONB,
  simulation_config JSONB,
  status VARCHAR DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 配置Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_twin_sessions ENABLE ROW LEVEL SECURITY;

-- profiles表策略：所有认证用户可以读取，只能修改自己的记录
CREATE POLICY "Allow authenticated users to read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- system_status表策略：所有用户可读，管理员可写
CREATE POLICY "Allow all users to read system status"
  ON system_status FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow admins to manage system status"
  ON system_status FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- dreams表策略：用户可以管理自己的梦境，公开的梦境所有人可读
CREATE POLICY "Allow users to read own dreams"
  ON dreams FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Allow users to create own dreams"
  ON dreams FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow users to update own dreams"
  ON dreams FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow users to delete own dreams"
  ON dreams FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- experiments表策略：创建者可以管理，所有认证用户可读
CREATE POLICY "Allow authenticated users to read experiments"
  ON experiments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to create experiments"
  ON experiments FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow creators to update experiments"
  ON experiments FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- digital_twin_sessions表策略：创建者可以管理，所有认证用户可读
CREATE POLICY "Allow authenticated users to read digital twin sessions"
  ON digital_twin_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to create digital twin sessions"
  ON digital_twin_sessions FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow creators to update digital twin sessions"
  ON digital_twin_sessions FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- 插入初始系统状态数据
INSERT INTO system_status (module_name, status, metrics) VALUES
  ('dashboard', 'online', '{"active_users": 45, "experiments": 12}'::jsonb),
  ('dreamlab', 'online', '{"dreams_analyzed": 156, "neural_maps": 89}'::jsonb),
  ('digital_twin', 'online', '{"active_sessions": 8, "neurons": 71234}'::jsonb),
  ('experiments', 'online', '{"running": 8, "completed": 156, "failed": 3}'::jsonb),
  ('ai_salon', 'online', '{"active_sessions": 5, "dialogues": 1234, "reports": 89}'::jsonb),
  ('integration', 'online', '{"data_sources": 12, "api_connections": 8, "pipelines": 15}'::jsonb),
  ('admin', 'online', '{"total_users": 234, "online_users": 45}'::jsonb)
ON CONFLICT DO NOTHING;
