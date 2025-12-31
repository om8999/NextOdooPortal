# NextOdooPortal

## Overview

**NextOdooPortal** is a modern, secure web portal built with **Next.js** and **FastAPI**, designed to act as an **authentication layer, admin panel, analytics dashboard, and AI risk engine for Odoo ERP**.

It combines a **glassmorphic, neon-glow UI** with a robust middleware layer that securely communicates with Odoo while also providing **business KPIs and machine-learning–based predictions**.

---

## Key Features

### 🔐 Authentication & Authorization
- Secure signup & login using JWT tokens  
- Middleware-enforced protected routes  
- Role-based access control (Admin / User)  
- Token-based session handling in the frontend  

---

### 👨‍💼 Admin Dashboard
- User management (list, create, delete, change password)  
- Admin-only protected routes  
- Password confirmation for sensitive actions  

---

### 📊 Accounting KPIs (Odoo-powered)
- **Average Reconcile Time** KPI  
- Secure FastAPI → Odoo XML-RPC communication  
- KPI cards displayed on the dashboard  
- Modular KPI architecture for easy extension  

---

### 🤖 AI Invoice Risk Prediction
- **Machine-learning–based late payment prediction**
- Predicts:
  - Late payment probability (%)
  - Risk level: **LOW / MEDIUM / HIGH**
- Powered by a trained **XGBoost model**
- Uses historical invoice payment behavior
- Real-time inference via `/risk/invoice` API
- Interactive UI to test invoice scenarios  

---

### 🧩 Middleware Layer (FastAPI)
- Acts as a secure gateway between frontend and Odoo  
- Centralized JWT authentication middleware  
- Input validation & error handling  
- CORS-enabled API layer  
- ML inference endpoints  

---

### 🎨 Modern UI / UX
- Glassmorphic cards with backdrop blur  
- Gradient & neon-glow effects  
- Responsive, mobile-friendly layout  
- Consistent design across Dashboard, KPIs & Risk pages  

---

## Architecture Overview

Next.js (Frontend)
|
| JWT Auth + Fetch
v
FastAPI (Middleware)
| |
| |--> ML Model (XGBoost)
|
v
Odoo ERP (XML-RPC)


---

## Tech Stack

### Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Middleware / API
- **FastAPI (Python)**
- **JWT Authentication**
- **Odoo XML-RPC**
- **XGBoost (Machine Learning)**

### Backend
- **Odoo ERP**

---

## Current Capabilities

- ✅ Secure authentication & admin panel  
- ✅ Middleware-protected Odoo access  
- ✅ Accounting KPIs from Odoo  
- ✅ AI-powered invoice late payment risk prediction  
- ✅ Modern SaaS-grade UI  

---

## Future Enhancements
- KPI charts & historical trends  
- Invoice aging analytics  
- ML model retraining pipeline  
- Audit logs & activity tracking  
- Multi-company Odoo support  

---

## License
This project is intended for internal and enterprise use.
