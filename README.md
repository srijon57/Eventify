
# HACKATHON PROJECT: Eventify - University Club Event Management Platform

  

<div align="center">

<h1>Eventify</h1>

</div>

  

### Table of Contents:

[Project Description](#project-description) - [Features](#features) - [Objectives](#objectives) - [Target Audience](#target-audience) - [API Endpoints](#api-endpoints) - [Milestones](#milestones) - [Technologies Used](#technologies-used) - [Installation](#installation) - [Team Members](#team-members) - [Live Project & Mock UI](#live-project--mock-ui)

  

---

  

## 📝 Project Description <a  id="project-description"></a>

Eventify is a community-driven platform designed for university club event management. It allows club admins to organize events and students to register and view them. The platform is built using the MERN stack (MongoDB, Express.js, React, Node.js) and will be deployed on Vercel.

  

## 💡 Project Features <a  id="features"></a>

  

i. **User Authentication and Authorization**

- Registration & Login system.

- Role-based access (Student, Club Admin).

  

ii. **Event Management**

- Club Admins can create, edit, or delete events.

- Students can view event details and manage registrations.

  

iii. **Student Features**

- View upcoming events.

- Register/Unregister from an event.

- Personal dashboard showing registered events.

  

iv. **Admin Features**

- Create new events.

- Edit/Delete existing events.

- View attendee list for each event.

- Admin dashboard for managing events.

  

v. **Search and Filter Functionality**

- Search for events by title, category, or date.

- Filter results based on upcoming events or location.

  

vi. **Automatic Certificate Generator**

- Generate and download certificates for participants post-event.

  

### 🎯 Objectives <a  id="objectives"></a>

  

-  **Streamline Event Management**: Provide a platform for club admins to efficiently organize university events.

-  **Enhance Student Engagement**: Allow students to easily register and participate in events.

-  **Improve Accessibility**: Offer a user-friendly interface for event browsing and management.

-  **Promote Community Interaction**: Foster a community where students and admins can collaborate.

  

### 👥 Target Audience <a  id="target-audience"></a>

  

- University students seeking to participate in club events.

- Club admins responsible for event organization and management.

- University staff supporting student activities.

  

## 📜 API Endpoints <a  id="api-endpoints"></a>

  

### Authentication

  

-  **POST /register**: User registration.

-  **POST /login**: User login.

  

### Events

  

-  **GET /events**: Fetch all events.

-  **GET /events/{id}**: Fetch a specific event.

-  **POST /events**: Create a new event (Admin only).

-  **PUT /events/{id}**: Update an event (Admin only).

-  **DELETE /events/{id}**: Delete an event (Admin only).

  

### Registrations

  

-  **GET /registrations/{eventId}**: Fetch registrations for a specific event.

-  **POST /registrations**: Register for an event.

-  **DELETE /registrations/{id}**: Unregister from an event.

  

### Certificates

  

-  **GET /certificates/{eventId}**: Generate certificate for an event (post-event).

  

### Miscellaneous

  

-  **GET /search**: Search and filter events.

-  **GET /dashboard**: Fetch dashboard data (Admin or Student).

  

## 📝 Milestones <a  id="milestones"></a>

  

### Milestone 1: Initial Setup and Basic Features

  

-  [x] Set up backend and frontend with MERN stack.

-  [x] Implement user authentication (registration and login).

-  [x] Create API endpoints for events and registrations.

-  [x] Basic UI for login, registration, and homepage.

  

### Milestone 2: Advanced Features and Interactions

  

-  [x] Implement event registration and unregister functionality.

-  [x] Add search and filter functionality.

-  [x] Develop student and admin dashboards.

-  [x] Implement automatic certificate generation.

  

### Milestone 3: Final Touches and Deployment

  

- [ ] Complete testing and bug fixes.

- [ ] Optimize for mobile responsiveness.

- [ ] Deploy to Vercel.

  

## 💻 Technologies Used <a  id="technologies-used"></a>

  

-  **Backend**: <img  alt="Node.js"  src="https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />

-  **Frontend**: <img  alt="React"  src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white" />

-  **Database**: <img  alt="MongoDB"  src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />

-  **Framework**: <img  alt="Express.js"  src="https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white" />

-  **Version Control**: <img  alt="Git"  src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" />

-  **Repository**: <img  alt="GitHub"  src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white" />

-  **Deployment**: <img  alt="Vercel"  src="https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />

  

## 🚀 Installation <a  id="installation"></a>

  

### Prerequisites

  

- Node.js >= 14.x

- npm or yarn

- MongoDB (local or MongoDB Atlas)

- Vercel CLI (optional for deployment)

  

<details>

<summary>Backend (Node.js + Express)</summary>

  

1. Clone the repository:

```bash

git clone https://github.com/yourusername/Eventify.git

```

2. Navigate to the backend directory:

```bash

cd Eventify/backend

```

3. Install dependencies:

```bash

npm install

```

4. Create a `.env` file with placeholder values:

```plaintext

PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

```

5. Start the backend server:

```bash

npm start

```

  

</details>

  

<details>

<summary>Frontend (React)</summary>

  

1. Navigate to the frontend directory:

```bash

cd Eventify/frontend

```

2. Install dependencies:

```bash

npm install

```

3. Start the React development server:

```bash

npm run dev

```

4. Update `VITE_API_URL` in `.env` to point to your backend (e.g., `http://localhost:5000`).

  

</details>

  

## 👥 Team Members <a  id="team-members"></a>

  


| **Name** | **Email** | **GitHub** | **Role** |
|---|---|---|---|
| **Sadik Rahman** | sadikrahman@gmail.com | [SadikRahman14](https://github.com/SadikRahman14) | Backend |
| **Eusha Ahmed** | eushaahmed08@gmail.com | [eushaahmed08](https://github.com/eushaahmed08) | Frontend |
| **Hasibur Rahman** | srijond57@gmail.com | [srijon57](https://github.com/srijon57) | UIUX |

  

## 🌐 Live Project & Mock UI <a  id="live-project--mock-ui"></a>

  

**Mock UI Link**: [Eraser.io](https://app.eraser.io/workspace/TvyWb0GuTJ52saTJdFLE)

  

**Live Project Link**: [Vercel](https://eventify.vercel.app/) (pending deployment)

  

`Thank you for supporting our project!`
