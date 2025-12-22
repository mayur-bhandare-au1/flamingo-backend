# Flamingo App - Folder Structure

This document describes the industry-level folder structure of the Flamingo social media application.

## 📁 Directory Structure

```
lib/
├── api/                    # API layer for network requests
│   ├── api_client.dart     # Base HTTP client
│   ├── api_endpoints.dart  # API endpoint constants
│   ├── api_interceptor.dart # Request/response interceptors
│   └── api_service.dart    # Main API service
│
├── config/                 # App configuration
│   └── app_config.dart     # Environment and feature flags
│
├── middlewares/            # Middleware for cross-cutting concerns
│   ├── auth_middleware.dart    # Authentication middleware
│   ├── error_middleware.dart    # Error handling middleware
│   └── logging_middleware.dart # Logging middleware
│
├── models/                 # Data models
│   └── user_model.dart     # User data model
│
├── screens/                # UI screens
│   ├── splash_screen.dart  # Splash screen
│   └── welcome_screen.dart # Welcome screen
│
├── services/               # Business logic services
│   ├── auth_service.dart       # Authentication service
│   └── notification_service.dart # Notification service
│
├── utilities/              # Utility functions
│   ├── constants.dart          # App-wide constants
│   ├── date_formatter.dart     # Date formatting utilities
│   ├── permission_handler.dart # Permission handling utilities
│   ├── storage_helper.dart     # Local storage utilities
│   └── validators.dart         # Validation utilities
│
├── widgets/                # Reusable widgets
│   └── common/            # Common widgets
│       ├── error_widget.dart   # Error display widget
│       └── loading_widget.dart  # Loading indicator widget
│
└── main.dart              # App entry point
```

## 🔑 Key Components

### API Layer (`api/`)
- **api_client.dart**: Handles all HTTP requests (GET, POST, PUT, DELETE)
- **api_endpoints.dart**: Centralized API endpoint definitions
- **api_interceptor.dart**: Intercepts requests/responses for logging, auth tokens, etc.
- **api_service.dart**: High-level API service with business logic

### Middlewares (`middlewares/`)
- **auth_middleware.dart**: Protects routes and manages authentication state
- **error_middleware.dart**: Centralized error handling and user feedback
- **logging_middleware.dart**: Debugging and monitoring logs

### Services (`services/`)
- **auth_service.dart**: Authentication and user session management
- **notification_service.dart**: Local and push notification handling

### Utilities (`utilities/`)
- **constants.dart**: App-wide constants (API URLs, keys, etc.)
- **permission_handler.dart**: Request and check app permissions
- **storage_helper.dart**: Local storage operations (SharedPreferences)
- **validators.dart**: Input validation functions
- **date_formatter.dart**: Date/time formatting utilities

### Models (`models/`)
- Data models representing entities (User, Post, etc.)

### Widgets (`widgets/`)
- Reusable UI components

## 🔐 Permissions

### Android Permissions (AndroidManifest.xml)
- `INTERNET` - Network access
- `POST_NOTIFICATIONS` - Push notifications
- `CAMERA` - Camera access
- `READ_EXTERNAL_STORAGE` - Read media files (Android < 13)
- `READ_MEDIA_IMAGES` - Read images (Android 13+)
- `READ_MEDIA_VIDEO` - Read videos (Android 13+)
- `READ_MEDIA_AUDIO` - Read audio (Android 13+)

### iOS Permissions (Info.plist)
- `NSPhotoLibraryUsageDescription` - Photo library access
- `NSPhotoLibraryAddUsageDescription` - Save photos
- `NSCameraUsageDescription` - Camera access
- `NSMicrophoneUsageDescription` - Microphone access
- `NSUserNotificationsUsageDescription` - Notifications

## 📦 Dependencies

- `http`: HTTP client for API calls
- `permission_handler`: Handle app permissions
- `shared_preferences`: Local storage
- `flutter_local_notifications`: Local notifications
- `intl`: Date/time formatting

## 🚀 Usage Examples

### Request Permissions
```dart
import 'package:flutter_application_1/utilities/permission_handler.dart';

// Request notification permission
bool granted = await PermissionHandlerUtil.requestNotificationPermission();

// Request media permissions
Map<String, bool> results = await PermissionHandlerUtil.requestMediaPermissions();
```

### API Calls
```dart
import 'package:flutter_application_1/api/api_service.dart';

final apiService = ApiService();
final result = await apiService.login('email@example.com', 'password');
```

### Local Storage
```dart
import 'package:flutter_application_1/utilities/storage_helper.dart';

await StorageHelper.saveString('key', 'value');
String? value = StorageHelper.getString('key');
```

## 📝 Notes

- All API endpoints are centralized in `api_endpoints.dart`
- Error handling is done through `error_middleware.dart`
- Authentication state is managed in `auth_middleware.dart`
- Permissions should be requested before accessing features

