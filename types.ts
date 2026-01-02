
export interface SensorReading {
  id?: string;
  timestamp: string;
  motor_current_1: number;
  motor_current_2: number;
  joint_angle_1: number;
  joint_angle_2: number;
  velocity_1: number;
  velocity_2: number;
  vibration: number;
  temperature: number;
  health_score: number;
}

export type PredictionType = 'anomaly' | 'rul' | 'fault' | 'maintenance';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Prediction {
  id: string;
  prediction_type: PredictionType;
  component: string;
  severity: Severity;
  confidence: number;
  description: string;
  recommended_action: string;
  rul_days?: number;
  is_active: boolean;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export interface MaintenanceTask {
  id: string;
  title: string;
  component: string;
  priority: Priority;
  status: TaskStatus;
  scheduled_date: string;
  estimated_duration: number;
  notes?: string;
  triggered_by_ai: boolean;
}

export type AIModelType = 'LSTM' | 'Random Forest' | 'Autoencoder' | 'Gradient Boosting';

export interface SystemConfig {
  id: string;
  system_name: string;
  link1_mass: number;
  link2_mass: number;
  link1_length: number;
  link2_length: number;
  rom_states: number;
  full_model_states: number;
  ai_model_type: AIModelType;
  prediction_threshold: number;
}
