#!/bin/bash

echo "Starting Transport Diagnostic Bounty Application..."

# Ensure we are in the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# 1. Start the Java Engine
echo "Starting Java Engine on port 8080..."
cd java-engine
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx128m -Xms64m" &
JAVA_PID=$!
cd ..

# 2. Seed Database & Start the Node.js Backend
echo "Clearing and Seeding Database..."
npm run seed

echo "Starting Node.js Backend on port 5000..."
npm run dev &
NODE_PID=$!

# 3. Start the React Frontend
echo "Starting React Frontend on port 5173..."
npm run dev:frontend &
REACT_PID=$!

# Trap Ctrl+C (SIGINT) to clean up background processes
trap "echo -e '\nStopping all services...'; kill $JAVA_PID $NODE_PID $REACT_PID; exit" SIGINT SIGTERM

echo ""
echo "======================================================="
echo "All services are starting!"
echo "- Java Engine: http://localhost:8080"
echo "- Node Backend: http://localhost:5000"
echo "- React Frontend: http://localhost:5173"
echo "======================================================="
echo "Press Ctrl+C to stop all services."
echo "======================================================="

# Wait for all background jobs to finish
wait
