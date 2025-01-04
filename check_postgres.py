import subprocess
import sys

def check_postgres():
    try:
        # Try to run psql --version
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("PostgreSQL is already installed!")
            print(result.stdout)
            return True
    except FileNotFoundError:
        print("PostgreSQL is not installed or not in PATH")
        print("\nPlease install PostgreSQL:")
        print("1. Download PostgreSQL from: https://www.postgresql.org/download/windows/")
        print("2. Run the installer")
        print("3. During installation:")
        print("   - Remember the password you set for the postgres user")
        print("   - Keep the default port (5432)")
        print("   - Install all offered components")
        return False
    
    return False

if __name__ == "__main__":
    check_postgres()
