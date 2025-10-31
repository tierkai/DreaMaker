-- 插入测试用户数据
INSERT INTO profiles (email, name, role, bio) VALUES
  ('admin@neurodream.lab', '系统管理员', 'admin', '神经梦境实验室首席管理员'),
  ('researcher@neurodream.lab', '张研究员', 'researcher', '专注于梦境神经映射研究'),
  ('viewer@neurodream.lab', '李观察员', 'viewer', '实验室数据观察员')
ON CONFLICT (email) DO NOTHING;

-- 插入测试梦境数据
INSERT INTO dreams (user_id, title, content, analysis, tags, is_public) 
SELECT 
  (SELECT id FROM profiles WHERE email = 'researcher@neurodream.lab' LIMIT 1),
  '星际旅行梦境',
  '在浩瀚的宇宙中航行，穿越星云和黑洞，体验时空的扭曲与变幻。梦境中充满了奇特的色彩和未知的景象。',
  '{"emotion": "愉悦", "clarity": 85, "vividness": 92, "neural_pattern": "high_theta_activity"}'::jsonb,
  ARRAY['太空', '探索', '科幻'],
  true
WHERE NOT EXISTS (SELECT 1 FROM dreams WHERE title = '星际旅行梦境');

INSERT INTO dreams (user_id, title, content, analysis, tags, is_public)
SELECT 
  (SELECT id FROM profiles WHERE email = 'researcher@neurodream.lab' LIMIT 1),
  '深海探索',
  '潜入深海，与发光的生物共舞，探索未知的海底世界。水压和黑暗带来的神秘感让人着迷。',
  '{"emotion": "好奇", "clarity": 78, "vividness": 88, "neural_pattern": "mixed_alpha_theta"}'::jsonb,
  ARRAY['海洋', '探索', '神秘'],
  true
WHERE NOT EXISTS (SELECT 1 FROM dreams WHERE title = '深海探索');

-- 插入测试实验数据
INSERT INTO experiments (name, type, status, config, results, created_by, started_at, completed_at)
SELECT 
  '梦境神经关联研究',
  '神经映射',
  'completed',
  '{"duration_hours": 8, "subjects": 12, "monitoring_type": "EEG"}'::jsonb,
  '{"correlation_score": 0.87, "significant_regions": ["hippocampus", "prefrontal_cortex"]}'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  NOW() - INTERVAL '2 hours',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM experiments WHERE name = '梦境神经关联研究');

INSERT INTO experiments (name, type, status, config, created_by, started_at)
SELECT 
  '小鼠行为分析',
  '数字孪生',
  'running',
  '{"simulation_time": "24h", "mice_count": 5, "behavior_tracking": true}'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  NOW() - INTERVAL '5 hours'
WHERE NOT EXISTS (SELECT 1 FROM experiments WHERE name = '小鼠行为分析');

-- 插入测试数字孪生会话数据
INSERT INTO digital_twin_sessions (session_name, mouse_id, neural_data, behavior_data, simulation_config, status, created_by)
SELECT 
  'Mouse-A42 神经活动记录',
  'A42',
  '{"neurons_count": 71234, "firing_rate": 45.2, "synchronization": 0.78}'::jsonb,
  '{"activity_level": 78, "exploration": 65, "social_interaction": 82}'::jsonb,
  '{"duration": "12h", "environment": "enriched", "stimuli": ["visual", "auditory"]}'::jsonb,
  'active',
  (SELECT id FROM profiles WHERE role = 'researcher' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM digital_twin_sessions WHERE session_name = 'Mouse-A42 神经活动记录');
