<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🤖 Smart Digital Twin: 2-DOF Robotic Arm
### Predictive Maintenance & Kinematic Simulation Platform

[![Live Demo](https://img.shields.io/badge/Status-Live_on_Vercel-brightgreen?style=for-the-badge&logo=vercel)](https://smart-digital-twin-robotic-arm-git-2e477d-ameyraut710s-projects.vercel.app/#/dashboard)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google_Gemini_Studio-blue?style=for-the-badge&logo=googlegemini)](https://aistudio.google.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

An advanced Industry 4.0 web application designed for the real-time monitoring, simulation, and predictive maintenance of a 2-Degree-of-Freedom (2-DOF) robotic arm. Built with **Google AI Studio** and **Gemini**, this platform integrates physics-based Reduced Order Modeling (ROM) with high-fidelity AI diagnostics.

---

## 🌟 Key Features

### 1. Real-Time Digital Twin Telemetry
* **Synchronized Visualization:** High-performance HTML5 Canvas rendering of the robotic arm, reacting to live telemetry.
* **Health Overview:** Live tracking of **System Health**, **Voltage (V)**, **Temperature (°C)**, and **Vibration (g-rms)**.
* **Spectral Analysis:** Real-time FFT charts for ISO 10816 compliance monitoring.

### 2. High-Fidelity Physics Simulation
* **ROM vs. Full Physics:** Compare complex physics solvers against optimized 4-state Reduced Order Modeling agents.
* **Chaos Engineering:** Inject faults such as Vibration Spikes, Sensor Drift, and Stiction to test system resilience.

### 3. AI Predictive Diagnostics
* **Gemini AI Integration:** Advanced reasoning for anomaly detection and RUL (Remaining Useful Life) prediction.
* **Model Selection:** Choose between LSTM, Random Forest, and Autoencoders (LSTM recommended for 93.2% precision).

---

## 🚀 Run Locally

**Prerequisites:** Node.js

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/smart-digital-twin-robotic-arm.git](https://github.com/your-username/smart-digital-twin-robotic-arm.git)
   cd smart-digital-twin-robotic-arm
