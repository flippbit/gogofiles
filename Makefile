.PHONY: dev build-windows clean

# Run the application in development mode
dev:
	wails dev

# Build the application for Windows
build-windows:
	wails build -platform windows/amd64

# Clean build artifacts
clean:
	rm -rf build/bin
	cd frontend && rm -rf dist

# Help command to show available targets
help:
	@echo "Available commands:"
	@echo "  make run           - Run the application in development mode"
	@echo "  make build-windows - Build the application for Windows (64-bit)"
	@echo "  make clean         - Clean build artifacts"
