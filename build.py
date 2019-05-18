import os
import time

with open('src/Utils/Config.jsx', 'r') as file:
    filedata = file.read()

filedata = filedata.replace('build: false', 'build: true')

with open('src/Utils/Config.jsx', 'w') as file:
    file.write(filedata)

time.sleep(1)
os.system("npm run build")

filedata = filedata.replace('build: true', 'build: false')

with open('src/Utils/Config.jsx', 'w') as file:
    file.write(filedata)
