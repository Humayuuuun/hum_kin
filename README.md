# Backend Project

This backend project is built with **Node.js** and **Express**, providing RESTful APIs for managing meter data, area information, region data, reliability indices, and more. The backend connects to two PostgreSQL databases: `goalpara` and `meter_info`.

---

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [License](#license)

---

## Installation

1. **Clone the repository:**
git clone <your-repo-url>
cd backend
2. **Install dependencies:**
npm install

---

## Configuration

### Environment Variables

Database credentials are currently hardcoded in `db.js` and `meterInfoDb.js`. For production, use environment variables for sensitive information. Create a `.env` file in your root directory:

PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=goalpara
PG_PASSWORD=your_password
PG_PORT=5432

METER_INFO_DB=meter_info
METER_INFO_USER=postgres
METER_INFO_PASSWORD=your_password

Update your database connection files to use these variables for better security.

---

## Database Setup

This project uses **PostgreSQL** as its primary database. Two separate connections are established:

- **goalpara**: Main database for most application data (`db.js`)
- **meter_info**: Dedicated database for meter information (`meterInfoDb.js`)

**Sample connection (`db.js`):**
const { Pool } = require('pg');
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'goalpara',
password: 'Kinshuk2214',
port: 5432,
});
module.exports = pool;


**Sample connection (`meterInfoDb.js`):**
const { Pool } = require('pg');
const meterInfoPool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'meter_info',
password: 'Kinshuk2214',
port: 5432,
});
module.exports = meterInfoPool;

---

## API Endpoints

### Area Routes
| Method | Endpoint      | Description                    |
|--------|--------------|--------------------------------|
| GET    | `/areas`     | Retrieve all areas             |
| GET    | `/meter_ids` | Retrieve meter IDs by area     |

### Loading Data Routes
| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| GET    | `/loading-data` | Retrieve loading data    |

### Meter Info Routes
| Method | Endpoint        | Description              |
|--------|----------------|--------------------------|
| GET    | `/meter-info`  | Retrieve meter information |

### Meter Mapping CRUD Routes
| Method | Endpoint                                | Description                                 |
|--------|-----------------------------------------|---------------------------------------------|
| GET    | `/`                                     | Retrieve all meter mappings                 |
| GET    | `/:meter_id/:time_interval`             | Retrieve a meter mapping by meter ID and interval |
| POST   | `/`                                     | Create a new meter mapping                  |
| PUT    | `/:meter_id/:time_interval`             | Update a meter mapping                      |
| DELETE | `/:meter_id/:time_interval`             | Delete a meter mapping                      |

### Meter Mapping Routes
| Method | Endpoint     | Description                |
|--------|--------------|----------------------------|
| GET    | `/`          | Retrieve meters            |
| POST   | `/`          | Retrieve meters (supports POST) |

### Meter Mapping Utility Routes
| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | `/meter-data/meters-by-area`    | Retrieve meters by area      |
| GET    | `/meter-data/meter-by-id`       | Retrieve meter by meter ID   |

### Meters Routes
| Method | Endpoint      | Description                          |
|--------|--------------|--------------------------------------|
| GET    | `/tables`    | Retrieve available table names        |
| GET    | `/data`      | Retrieve meter data with query filters|

### Region Data Routes
| Method | Endpoint | Description              |
|--------|----------|--------------------------|
| GET    | `/`      | Retrieve region data     |

### Reliability Indices Routes
| Method | Endpoint | Description                    |
|--------|----------|--------------------------------|
| GET    | `/`      | Retrieve reliability indices   |

---

## Dependencies

| Package   | Version   | Purpose                                  |
|-----------|-----------|------------------------------------------|
| express   | ^5.1.0    | Web framework for Node.js                |
| cors      | ^2.8.5    | Middleware to enable CORS                |
| pg        | ^8.16.3   | PostgreSQL client for Node.js            |
| redis     | ^5.5.5    | Redis client for Node.js                 |

---

## Usage

- Start the backend server (update the start script as needed):
node app.js
- The API will be available at `http://localhost:<port>/api/`

---

## License

This project is licensed under the ISC License. Update this section if you use a different license.

---

**Note:**  
- For production deployments, always use environment variables for credentials.
- You may expand this README with sample requests/responses, error handling, and contribution guidelines as needed.
