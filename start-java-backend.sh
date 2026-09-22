#!/bin/bash
echo "☕ Building and Launching CampusFlex Java Backend (Java 17)..."

# Create bin directory
mkdir -p backend-java/bin

# Compile all Java sources
javac -d backend-java/bin $(find backend-java/src -name "*.java")

if [ $? -eq 0 ]; then
  echo "✅ Java compilation successful!"
  echo "🚀 Starting CampusFlex Java HTTP REST Server on port 8080..."
  java -cp backend-java/bin com.campusflex.CampusFlexServer
else
  echo "❌ Java compilation failed!"
  exit 1
fi
