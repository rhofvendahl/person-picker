import json
import subprocess
import time
import webbrowser

process = subprocess.Popen(
    ["ssh", "-R", "80:localhost:5173", "localhost.run", "--", "--output", "json"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
)

while True:
    output = process.stdout.readline()
    if output == "":
        continue
    try:
        output_data = json.loads(output.strip())
    except:
        continue

    if "address" in output_data:
        url = f'https://{output_data["address"]}'
        print(f"App exposed at: {url}")
        webbrowser.open(url)

    time.sleep(1)
