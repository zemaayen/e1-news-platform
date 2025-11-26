# 🛠️ E1 News Mobile App - Build Commands Quick Reference

## 📱 Essential Commands

### Development

```bash
# Install dependencies
npm install

# Start web server
npm start

# Sync web code to native apps
npx cap sync

# Sync specific platform
npx cap sync ios
npx cap sync android
```

### Open Native IDEs

```bash
# Open iOS in Xcode (Mac only)
npx cap open ios

# Open Android in Android Studio
npx cap open android
```

### Run on Device/Emulator

```bash
# iOS
npx cap run ios

# iOS - specific device
npx cap run ios --target="iPhone 14"

# Android
npx cap run android

# Android - specific device
npx cap run android --target="device-id"
```

### Build for Production

```bash
# iOS (in Xcode)
# Product > Archive > Distribute App

# Android Debug APK
cd android
./gradlew assembleDebug

# Android Release APK
cd android
./gradlew assembleRelease

# Android App Bundle (for Play Store)
cd android
./gradlew bundleRelease
```

### Update & Maintenance

```bash
# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest

# Update iOS platform
npm install @capacitor/ios@latest
npx cap sync ios

# Update Android platform
npm install @capacitor/android@latest
npx cap sync android

# Update plugins
npm install @capacitor/push-notifications@latest
npm install @capacitor/share@latest
# ... update others as needed
```

### Debugging

```bash
# iOS logs (when connected to device)
npx cap run ios -l

# Android logs
npx cap run android -l

# Or use adb for Android
adb logcat
```

### Clean & Rebuild

```bash
# Clean iOS
cd ios/App
xcodebuild clean

# Clean Android
cd android
./gradlew clean

# Full reset
rm -rf android ios
npx cap add ios
npx cap add android
npx cap sync
```

---

## 🎯 Common Workflows

### Workflow 1: After Code Changes

```bash
# 1. Make changes to /public files
# 2. Sync changes
npx cap sync

# 3. Test in browser
npm start

# 4. Test on device
npx cap run ios
npx cap run android
```

### Workflow 2: Adding New Features

```bash
# 1. Install new Capacitor plugin
npm install @capacitor/[plugin-name]

# 2. Sync to native projects
npx cap sync

# 3. Update native code if needed
npx cap open ios
npx cap open android

# 4. Test
npx cap run ios
npx cap run android
```

### Workflow 3: Preparing for App Store

```bash
# 1. Update version in package.json
# 2. Sync everything
npx cap sync

# 3. Open native IDEs
npx cap open ios      # Set version in Xcode
npx cap open android  # Set version in build.gradle

# 4. Build release
# iOS: Product > Archive in Xcode
# Android: ./gradlew bundleRelease

# 5. Upload to stores
# iOS: Xcode Organizer > Distribute
# Android: Play Console > Upload AAB
```

---

## 🔧 Troubleshooting Commands

```bash
# Check Capacitor status
npx cap doctor

# List available devices/simulators
npx cap run ios --list
npx cap run android --list

# Verify configuration
npx cap ls

# Update web assets only (no native sync)
npx cap copy

# Update native dependencies only
npx cap update
```

---

## 📦 First-Time Setup (New Developer)

```bash
# 1. Clone/Download project
cd E1/news-platform

# 2. Install all dependencies
npm install

# 3. Verify Capacitor installation
npx cap doctor

# 4. Open and configure iOS (Mac only)
npx cap open ios
# - Set Team in Xcode
# - Add capabilities (Push Notifications)

# 5. Open and configure Android
npx cap open android
# - Sync Gradle
# - Create signing key if needed

# 6. Test on device
npx cap run ios
npx cap run android
```

---

## 🚀 Quick Deploy

### Deploy Web Version (PWA)
```bash
# 1. Build production
npm run build  # if you have build script

# 2. Deploy to server
# Upload /public folder to web server

# 3. PWA will auto-update on next visit
```

### Deploy Native Updates
```bash
# 1. Make changes
# 2. Sync
npx cap sync

# 3. Rebuild in IDEs
# iOS: Xcode > Product > Archive
# Android: ./gradlew bundleRelease

# 4. Upload to stores
# iOS: App Store Connect
# Android: Play Console
```

---

## 💡 Pro Tips

```bash
# Run without USB cable (iOS)
# 1. Connect device to same WiFi
# 2. Xcode > Window > Devices and Simulators
# 3. Check "Connect via network"

# Live reload (web only)
npm run dev
# Native apps need manual sync

# Check app size
# iOS: Archive > Organizer > check size
# Android: 
cd android
./gradlew bundleRelease
ls -lh app/build/outputs/bundle/release/

# Generate signed APK for testing
cd android
./gradlew assembleRelease
# APK in: app/build/outputs/apk/release/
```

---

## 📱 Device Connection

### iOS
```bash
# List connected devices
xcrun xctrace list devices

# Install app to specific device
xcodebuild -scheme App \
  -destination 'platform=iOS,id=DEVICE_ID' \
  install
```

### Android
```bash
# List connected devices
adb devices

# Install APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Clear app data (for testing)
adb shell pm clear com.e1news.app

# Open app
adb shell am start -n com.e1news.app/.MainActivity
```

---

## 🎨 Icon & Asset Generation

```bash
# 1. Open icon generator
# Browser: http://localhost:3000/icons/icon-generator.html

# 2. Download all icons

# 3. Sync to native projects
npx cap sync

# 4. Manually add to Xcode (iOS)
# Open: ios/App/App/Assets.xcassets/AppIcon.appiconset

# 5. Android auto-generates from icons folder
```

---

## 📊 Performance Testing

```bash
# Profile iOS app
# Xcode > Product > Profile
# Choose "Time Profiler" or "Leaks"

# Profile Android app
# Android Studio > View > Tool Windows > Profiler

# Measure app size
# iOS: Archive > Organizer > App Thinning Size Report
# Android: Play Console shows download size
```

---

## 🔐 Signing (Release Builds)

### Android Keystore
```bash
# Create keystore
keytool -genkey -v \
  -keystore e1news-release.keystore \
  -alias e1news \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Sign APK manually
jarsigner -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore e1news-release.keystore \
  app-release-unsigned.apk \
  e1news
```

### iOS Certificates
```bash
# List certificates
security find-identity -v -p codesigning

# Create certificate signing request (CSR)
# Xcode > Preferences > Accounts > Manage Certificates
```

---

**Save this file for quick reference!** 📌

