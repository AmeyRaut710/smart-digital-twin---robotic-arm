
import { SensorReading, Prediction, MaintenanceTask, SystemConfig } from '../types';

const STORAGE_KEY = 'robotic_arm_twin_db';

interface DB {
  readings: SensorReading[];
  predictions: Prediction[];
  tasks: MaintenanceTask[];
  config: SystemConfig;
}

const getDB = (): DB => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  
  const initialDB: DB = {
    readings: [],
    predictions: [
      {id: '1', prediction_type: "rul", component: "Motor 1 Bearing", severity: "high", confidence: 87, description: "Bearing wear detected based on vibration pattern analysis.", recommended_action: "Schedule bearing replacement within 2 weeks", rul_days: 18, is_active: true},
      {id: '2', prediction_type: "anomaly", component: "Joint 2 Motor", severity: "medium", confidence: 72, description: "Unusual current draw patterns detected.", recommended_action: "Monitor closely and perform diagnostic test", rul_days: 45, is_active: true},
      {id: '3', prediction_type: "maintenance", component: "End Effector", severity: "low", confidence: 95, description: "Scheduled lubrication interval approaching.", recommended_action: "Perform routine lubrication", rul_days: 7, is_active: true}
    ],
    tasks: [
      {id: '1', title: "Replace Motor 1 Bearings", component: "Motor 1", priority: "high", status: "scheduled", scheduled_date: "2025-02-01", estimated_duration: 4, notes: "AI predicted bearing failure", triggered_by_ai: true},
      {id: '2', title: "Quarterly System Calibration", component: "Control System", priority: "medium", status: "scheduled", scheduled_date: "2025-01-25", estimated_duration: 2, triggered_by_ai: false},
      {id: '3', title: "Lubricate Joint Bearings", component: "Joint 1 Bearing", priority: "low", status: "in_progress", scheduled_date: "2025-01-15", estimated_duration: 1, triggered_by_ai: false},
      {id: '4', title: "Motor Drive Firmware Update", component: "Motor 2", priority: "medium", status: "completed", scheduled_date: "2025-01-10", estimated_duration: 1.5, triggered_by_ai: false}
    ],
    config: {
      id: 'default',
      system_name: "2-DOF Robotic Arm",
      link1_mass: 2.5,
      link2_mass: 1.5,
      link1_length: 0.5,
      link2_length: 0.4,
      rom_states: 4,
      full_model_states: 12,
      ai_model_type: "LSTM",
      prediction_threshold: 0.75
    }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDB));
  return initialDB;
};

const saveDB = (db: DB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const base44 = {
  entities: {
    SensorReading: {
      list: async () => getDB().readings,
      create: async (reading: SensorReading) => {
        const db = getDB();
        const newReading = { ...reading, id: Math.random().toString(36).substr(2, 9) };
        db.readings = [...db.readings.slice(-49), newReading];
        saveDB(db);
        return newReading;
      }
    },
    Prediction: {
      list: async () => getDB().predictions,
      create: async (prediction: Omit<Prediction, 'id'>) => {
        const db = getDB();
        const newPrediction = { ...prediction, id: Math.random().toString(36).substr(2, 9) };
        db.predictions.push(newPrediction);
        saveDB(db);
        return newPrediction;
      },
      update: async (id: string, updates: Partial<Prediction>) => {
        const db = getDB();
        db.predictions = db.predictions.map(p => p.id === id ? { ...p, ...updates } : p);
        saveDB(db);
      }
    },
    MaintenanceTask: {
      list: async () => getDB().tasks,
      create: async (task: Omit<MaintenanceTask, 'id'>) => {
        const db = getDB();
        const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
        db.tasks.push(newTask);
        saveDB(db);
        return newTask;
      },
      update: async (id: string, updates: Partial<MaintenanceTask>) => {
        const db = getDB();
        db.tasks = db.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
        saveDB(db);
      }
    },
    SystemConfig: {
      get: async () => getDB().config,
      update: async (updates: Partial<SystemConfig>) => {
        const db = getDB();
        db.config = { ...db.config, ...updates };
        saveDB(db);
        return db.config;
      }
    }
  }
};
