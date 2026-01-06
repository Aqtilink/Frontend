# Aqtilink Frontend

A modern React 19 application built with Vite for the Aqtilink social sports platform. The frontend provides a user-friendly interface for discovering activities, managing friendships, and sharing sports events.

## Overview

The Aqtilink frontend is responsible for:
- User authentication via Clerk
- Activity discovery and browsing
- Activity creation and management
- Friend management and discovery
- User profile settings
- Real-time integration with backend microservices

## Technology Stack

### Core Technologies
- **React**: 19.2.0 - Modern UI library with hooks and concurrent features
- **Vite**: 7.2.4 - Lightning-fast build tool and dev server
- **React Router**: 7.11.0 - Client-side routing
- **Axios**: 1.13.2 - HTTP client for API requests
- **Clerk**: 5.59.2 - Authentication and user management

### Development Tools
- **ESLint**: 9.39.1 - Code quality and style enforcement
- **React Fast Refresh**: Hot module reloading for development
- **Babel/SWC**: For JSX transformation

## Project Structure

```
frontend/
├── public/                          # Static assets
├── src/
│   ├── App.jsx                      # Main app component with routing
│   ├── Index.css                    # Global styles
│   ├── main.jsx                     # Entry point with Clerk provider
│   ├── api/
│   │   ├── ActivityApi.js           # Activity API client
│   │   ├── UserApi.js               # User & friend API client
│   │   ├── http.js                  # Axios instance setup
│   │   └── index.js                 # API exports
│   ├── components/
│   │   ├── ActivityCard.jsx         # Activity display component
│   │   ├── ActivityCard.css         # Activity card styles
│   │   └── Navbar.jsx               # Navigation component
│   └── pages/
│       ├── Feed.jsx                 # Activity feed page
│       ├── CreateActivity.jsx       # Activity creation page
│       ├── Friends.jsx              # Friend management page
│       ├── Settings.jsx             # User settings page
│       └── Login.jsx                # Authentication page
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite configuration
├── eslint.config.js                 # ESLint configuration
├── nginx.conf                       # Nginx configuration for production
├── Dockerfile                       # Docker image definition
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Pages & Features

### Login Page (`pages/Login.jsx`)
- Clerk authentication integration
- Sign-up and sign-in flows
- Redirects authenticated users to feed

### Feed Page (`pages/Feed.jsx`)
- **Activity Feed**: Browse all available activities
- **Filters**:
  - All Activities - Show all activities
  - Friends - Show only friends' activities
  - Joined - Show activities user has joined
  - My Activities - Show user's own activities
- **Actions**: Join activities, delete own activities
- Real-time activity list updates

### Create Activity Page (`pages/CreateActivity.jsx`)
- Form to create new activities
- Input fields:
  - Title
  - Sport Type (select from available types)
  - Start time and date
  - Location
  - Participants (optional)
- Automatic owner assignment
- Notification to friends upon creation

### Friends Page (`pages/Friends.jsx`)
- View all friends
- Search for new users
- Send friend requests
- Manage pending friend requests
- Accept/reject friend requests
- View request status

### Settings Page (`pages/Settings.jsx`)
- Edit user profile information
- Update personal details:
  - Name (first/last)
  - Age
  - City
- Account management

## API Integration

### ActivityApi (`api/ActivityApi.js`)

```javascript
// Hook usage
const { 
  getFeed,
  getFriendsFeed,
  getUserActivities,
  getJoinedActivities,
  joinActivity,
  deleteActivity,
  createActivity
} = useActivityApi();
```

**Available Methods**:
- `getFeed()` - Get all activities
- `getFriendsFeed()` - Get activities from friends
- `getUserActivities()` - Get user's own activities
- `getJoinedActivities()` - Get activities user joined
- `joinActivity(activityId)` - Join an activity
- `deleteActivity(activityId)` - Delete activity (owner only)
- `createActivity(data)` - Create new activity

**Base URL**: `http://localhost:8081/api/v1/activities` (configurable via `VITE_ACTIVITY_API_URL`)

### UserApi (`api/UserApi.js`)

```javascript
// Hook usage
const {
  getUser,
  updateUser,
  getFriends,
  searchUsers,
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest
} = useUserApi();
```

**Available Methods**:
- `getUser(id)` - Get user profile
- `updateUser(id, data)` - Update user profile
- `getFriends()` - Get user's friends list
- `searchUsers(query)` - Search for users
- `sendFriendRequest(receiverId)` - Send friend request
- `getPendingRequests()` - Get pending friend requests
- `acceptFriendRequest(requestId)` - Accept friend request
- `rejectFriendRequest(requestId)` - Reject friend request

**Base URL**: `http://localhost:8080/api/v1/users` (configurable via `VITE_USER_API_URL`)

### HTTP Client (`api/http.js`)

Axios instance with:
- Automatic JWT token attachment via Clerk
- Error handling
- Request/response interceptors

## Components

### Navbar Component
- Navigation links to all pages
- User profile display
- Clerk logout button
- Responsive design

### ActivityCard Component
- Display activity details:
  - Title and owner name
  - Sport type with icon
  - Start time
  - Location
  - Participant count
- Action buttons:
  - Join (if not joined)
  - Delete (if owner)
- Visual feedback for user's own activities

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key

# API Endpoints
VITE_ACTIVITY_API_URL=http://localhost:8081/api/v1/activities
VITE_USER_API_URL=http://localhost:8080/api/v1/users

# Optional: Clerk token template
VITE_CLERK_TOKEN_TEMPLATE=your_token_template
```

### Default Configuration

If environment variables are not set, the app will use defaults:
- Activity Service: `http://localhost:8081`
- User Service: `http://localhost:8080`

## Running the Frontend

### Prerequisites
- Node.js 16.0+
- npm or yarn

### Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173` with HMR enabled

### Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

   Output is in the `dist/` directory

2. **Preview the build**:
   ```bash
   npm run preview
   ```

### Code Quality

1. **Run ESLint**:
   ```bash
   npm run lint
   ```

2. **Fix linting errors**:
   ```bash
   npm run lint -- --fix
   ```

## Docker Deployment

### Build Docker Image

```bash
docker build -t aqtilink-frontend:latest .
```

### Run in Docker

```bash
docker run -d \
  --name aqtilink-frontend \
  -p 80:80 \
  -e VITE_CLERK_PUBLISHABLE_KEY=your_key \
  -e VITE_ACTIVITY_API_URL=http://api:8081/api/v1/activities \
  -e VITE_USER_API_URL=http://api:8080/api/v1/users \
  aqtilink-frontend:latest
```

### Docker Compose

```yaml
services:
  frontend:
    build: ./frontend
    container_name: aqtilink-frontend
    ports:
      - "3000:80"
    environment:
      VITE_CLERK_PUBLISHABLE_KEY: ${CLERK_KEY}
      VITE_ACTIVITY_API_URL: http://activity-service:8081/api/v1/activities
      VITE_USER_API_URL: http://user-service:8080/api/v1/users
    depends_on:
      - activity-service
      - user-service
```

## Authentication Flow

1. **User Visits App**
   - Not authenticated → Redirected to Login page
   - Authenticated → Shown main app with navigation

2. **Clerk Authentication**
   - User signs up or logs in via Clerk
   - JWT token stored in Clerk session
   - Token automatically attached to API requests

3. **API Requests**
   - All API calls include JWT token in Authorization header
   - Token automatically refreshed by Clerk
   - Expired tokens trigger re-authentication

## Routing

```javascript
// Authenticated Routes
- /                  → Feed page (default)
- /create            → Create activity page
- /friends           → Friend management page
- /settings          → User settings page

// Unauthenticated Routes
- *                  → Login page
```

## Features & Workflow

### Activity Discovery
1. Login with Clerk account
2. View all activities on Feed page
3. Filter activities (All/Friends/Joined/Mine)
4. Click "Join" to join an activity
5. View joined activities in "Joined" filter

### Creating Activities
1. Navigate to "Create Activity"
2. Fill in activity details
3. Submit form
4. Friends receive notifications
5. Activity appears in feed

### Friend Management
1. Navigate to "Friends" page
2. Search for users by name
3. Send friend request
4. View pending requests
5. Accept or reject requests
6. View friends list

### Profile Management
1. Navigate to "Settings"
2. Update profile information
3. Changes saved immediately
4. Reflected in activity ownership display

## Dependencies

### Production Dependencies
- **@clerk/clerk-react**: Authentication and user management
- **react**: Core UI library
- **react-dom**: DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client

### Development Dependencies
- **@vitejs/plugin-react**: Vite React plugin
- **eslint**: Code linting
- **eslint-plugin-react-hooks**: ESLint rules for hooks
- **eslint-plugin-react-refresh**: ESLint rules for React Refresh

## Performance Optimizations

- **Vite**: Instant module reloading (HMR)
- **Code Splitting**: Automatic chunk splitting for routes
- **Lazy Loading**: Routes loaded on demand
- **Tree Shaking**: Unused code removed in production builds
- **Minification**: Production builds are minified

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues

### API Not Reachable

If getting CORS errors:
1. Ensure backend services are running
2. Check API URLs in environment variables
3. Verify backend CORS configuration
4. Check network connectivity

### Authentication Issues

If Clerk not authenticating:
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` is correct
2. Check Clerk dashboard for application settings
3. Ensure Clerk is properly configured in `main.jsx`
4. Check browser console for specific errors

### Blank Page After Login

1. Check browser console for errors
2. Verify API endpoints are correct
3. Ensure services are running
4. Check network requests in DevTools

## Development Workflow

1. Make changes in `src/`
2. Vite automatically reloads page (HMR)
3. Changes reflect immediately in browser
4. Run `npm run lint` before committing
5. Build with `npm run build` to test production build

## Scripts Reference

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint --fix   # Fix linting errors
```

## References

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com) (if using for styling)

## Support

For issues or questions about the frontend, refer to the project's issue tracker or contact the development team.


