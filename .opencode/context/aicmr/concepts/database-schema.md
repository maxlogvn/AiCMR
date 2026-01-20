# Concept: Database Schema

**Core Idea**: AiCMR uses MySQL database with three core models: User for authentication and permissions, Attachment for file uploads, and RefreshToken for JWT security, all connected via foreign key relationships.

**Key Points**:
- User model stores authentication data (email, password hash, rank levels 0-5)
- Attachment model tracks uploaded files (filename, path, MIME type, size, user ownership)
- RefreshToken model enables secure JWT rotation to prevent replay attacks
- Foreign keys ensure data integrity between users and their uploads/tokens

**Quick Example**:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  rank INT DEFAULT 0
);
```

**Reference**: docs/02-architecture.md

**Related**: concepts/jwt-authentication.md, concepts/upload-module.md