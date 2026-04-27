import os
import subprocess

possible_versions = [
    "python", "python2", "python3",
    "python3.7", "python3.8", "python3.9",
    "python3.10.9", "python3.11", "python3.12"
]
found_versions = []
for version in possible_versions:
    try:
        output = subprocess.check_output([version, "--version"], stderr=subprocess.STDOUT)
        found_versions.append((version, output.decode().strip()))
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
for name, version in found_versions:
    print(f"{name}: {version}")