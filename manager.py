#!/usr/bin/env python3
"""
Scannon.AI Project Manager
This script helps manage the development and deployment of the Scannon.AI application.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

class ScannonManager:
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
    
    def print_header(self, message):
        print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
        print(f"{Colors.HEADER}{Colors.BOLD}{message.center(60)}{Colors.ENDC}")
        print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")
    
    def print_success(self, message):
        print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")
    
    def print_error(self, message):
        print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")
    
    def print_info(self, message):
        print(f"{Colors.OKCYAN}ℹ {message}{Colors.ENDC}")
    
    def run_command(self, command, cwd=None, shell=True):
        """Run a shell command and return the result"""
        try:
            result = subprocess.run(
                command,
                cwd=cwd,
                shell=shell,
                check=True,
                capture_output=True,
                text=True
            )
            return True, result.stdout
        except subprocess.CalledProcessError as e:
            return False, e.stderr
    
    def setup_backend(self):
        """Set up the Python backend"""
        self.print_header("Setting Up Backend")
        
        if not self.backend_dir.exists():
            self.print_error("Backend directory not found!")
            return False
        
        self.print_info("Creating virtual environment...")
        success, _ = self.run_command("python -m venv venv", cwd=self.backend_dir)
        
        if not success:
            self.print_error("Failed to create virtual environment")
            return False
        
        self.print_success("Virtual environment created")
        
        # Determine activation script based on OS
        if sys.platform == "win32":
            activate_script = self.backend_dir / "venv" / "Scripts" / "activate.bat"
            pip_command = str(self.backend_dir / "venv" / "Scripts" / "pip.exe")
        else:
            activate_script = self.backend_dir / "venv" / "bin" / "activate"
            pip_command = str(self.backend_dir / "venv" / "bin" / "pip")
        
        self.print_info("Installing dependencies...")
        success, _ = self.run_command(
            f"{pip_command} install -r requirements.txt",
            cwd=self.backend_dir
        )
        
        if not success:
            self.print_error("Failed to install dependencies")
            return False
        
        self.print_success("Backend setup completed!")
        return True
    
    def setup_frontend(self):
        """Set up the React frontend"""
        self.print_header("Setting Up Frontend")
        
        if not self.frontend_dir.exists():
            self.print_error("Frontend directory not found!")
            return False
        
        self.print_info("Installing npm dependencies...")
        success, _ = self.run_command("npm install", cwd=self.frontend_dir)
        
        if not success:
            self.print_error("Failed to install npm dependencies")
            return False
        
        self.print_success("Frontend setup completed!")
        return True
    
    def start_backend(self):
        """Start the backend server"""
        self.print_header("Starting Backend Server")
        
        if sys.platform == "win32":
            python_exe = self.backend_dir / "venv" / "Scripts" / "python.exe"
        else:
            python_exe = self.backend_dir / "venv" / "bin" / "python"
        
        self.print_info("Starting FastAPI server on http://localhost:8000")
        os.chdir(self.backend_dir)
        subprocess.run([str(python_exe), "main.py"])
    
    def start_frontend(self):
        """Start the frontend development server"""
        self.print_header("Starting Frontend Server")
        
        self.print_info("Starting Vite dev server on http://localhost:5173")
        os.chdir(self.frontend_dir)
        subprocess.run(["npm", "run", "dev"])
    
    def build_frontend(self):
        """Build the frontend for production"""
        self.print_header("Building Frontend")
        
        self.print_info("Running production build...")
        success, output = self.run_command("npm run build", cwd=self.frontend_dir)
        
        if success:
            self.print_success("Frontend build completed!")
            self.print_info(f"Build output: {self.frontend_dir / 'dist'}")
        else:
            self.print_error("Frontend build failed!")
        
        return success
    
    def run_tests(self):
        """Run tests for the application"""
        self.print_header("Running Tests")
        self.print_info("No tests configured yet")
    
    def show_status(self):
        """Show the current status of the project"""
        self.print_header("Project Status")
        
        # Check backend
        if self.backend_dir.exists():
            self.print_success(f"Backend directory: {self.backend_dir}")
            if (self.backend_dir / "venv").exists():
                self.print_success("Virtual environment: Found")
            else:
                self.print_info("Virtual environment: Not found (run setup)")
        else:
            self.print_error("Backend directory not found!")
        
        # Check frontend
        if self.frontend_dir.exists():
            self.print_success(f"Frontend directory: {self.frontend_dir}")
            if (self.frontend_dir / "node_modules").exists():
                self.print_success("Node modules: Installed")
            else:
                self.print_info("Node modules: Not installed (run setup)")
        else:
            self.print_error("Frontend directory not found!")

def main():
    parser = argparse.ArgumentParser(description="Scannon.AI Project Manager")
    parser.add_argument(
        'command',
        choices=['setup', 'setup-backend', 'setup-frontend', 'start-backend', 
                 'start-frontend', 'build', 'test', 'status'],
        help='Command to execute'
    )
    
    args = parser.parse_args()
    manager = ScannonManager()
    
    try:
        if args.command == 'setup':
            manager.setup_backend()
            manager.setup_frontend()
        elif args.command == 'setup-backend':
            manager.setup_backend()
        elif args.command == 'setup-frontend':
            manager.setup_frontend()
        elif args.command == 'start-backend':
            manager.start_backend()
        elif args.command == 'start-frontend':
            manager.start_frontend()
        elif args.command == 'build':
            manager.build_frontend()
        elif args.command == 'test':
            manager.run_tests()
        elif args.command == 'status':
            manager.show_status()
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Operation cancelled by user{Colors.ENDC}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.FAIL}Error: {str(e)}{Colors.ENDC}")
        sys.exit(1)

if __name__ == "__main__":
    main()
