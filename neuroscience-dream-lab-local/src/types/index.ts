export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'researcher' | 'viewer'
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface SystemStatus {
  id: string
  module_name: string
  status: 'online' | 'offline' | 'warning' | 'error'
  last_heartbeat: string
  metrics?: Record<string, any>
  error_message?: string
  created_at: string
}

export interface Dream {
  id: string
  user_id: string
  title: string
  content: string
  analysis?: Record<string, any>
  neural_mapping?: Record<string, any>
  tags?: string[]
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Experiment {
  id: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  config?: Record<string, any>
  results?: Record<string, any>
  started_at?: string
  completed_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface DigitalTwinSession {
  id: string
  session_name: string
  mouse_id?: string
  neural_data?: Record<string, any>
  behavior_data?: Record<string, any>
  simulation_config?: Record<string, any>
  status: 'active' | 'paused' | 'completed'
  created_by: string
  created_at: string
  updated_at: string
}

export type ModuleName = 
  | 'dashboard' 
  | 'dreamlab' 
  | 'digital_twin' 
  | 'experiments' 
  | 'ai_salon' 
  | 'integration' 
  | 'admin'
