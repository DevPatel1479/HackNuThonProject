import requests
import speech_recognition as sr
from autocorrect import Speller

# URL of the Node.js endpoint
url = 'http://localhost:3030/api/send_data'

r = sr.Recognizer()
spell = Speller()

# Adjust these parameters as needed
r.energy_threshold = 4000  # Adjust the energy threshold for noise detection
ambient_duration = 0.5  # Adjust the duration for ambient noise adjustment

response_no = 1
try:
    i = 1
    while True:
        print("Detecting your voice... ")
        with sr.Microphone() as source2:
            r.adjust_for_ambient_noise(source2, duration=ambient_duration)
            while True:  # Continuously listen for input
                try:
                    # Use the default system microphone
                    audio2 = r.listen(source2, timeout=None)
                    MyText = r.recognize_google(audio2, language='en-US')
                    corrected_text = spell(MyText)
                    if corrected_text:
                        data = {f"Response {i}": corrected_text}
                        i += 1
                        response = requests.post(url, json=data)
                        print("Received Response.... ")
                        response_no += 1
                except sr.UnknownValueError:
                    print("Could not understand audio, please speak again.")

except KeyboardInterrupt:
    data = {"stop": True}
    response = requests.post(url, json=data)
    print("\nDone ")
