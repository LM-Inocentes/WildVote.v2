import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import time
import board
from digitalio import DigitalInOut, Direction
import adafruit_fingerprint

led = DigitalInOut(board.D13)
led.direction = Direction.OUTPUT

#uart = busio.UART(board.TX, board.RX, baudrate=57600)

# If using with a computer such as Linux/RaspberryPi, Mac, Windows with USB/serial converter:
import serial
uart = serial.Serial("/dev/ttyUSB0", baudrate=57600, timeout=1)

# If using with Linux/Raspberry Pi and hardware UART:
#import serial
#uart = serial.Serial("/dev/ttyS0", baudrate=57600, timeout=1)

finger = adafruit_fingerprint.Adafruit_Fingerprint(uart)

##################################################

# Initialize Firebase Admin SDK
cred = credentials.Certificate("/home/wildvote/Downloads/wildvote-cit-firebase-adminsdk-e6fpe-5bd55f56e5.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://wildvote-cit-default-rtdb.asia-southeast1.firebasedatabase.app"
})

ref_status = db.reference('/Kiosk1/Status')
ref_enroll_index = db.reference('/users/FingerprintIndex')
ref_msg_prompt = db.reference('/Kiosk1')
ref_login_index = db.reference('/Kiosk1/')

def update_l_prompt(prompt_message):
    """Update the 'MessagePrompt' field in Firebase with the specified prompt message."""
    ref_msg_prompt.update({ "LMessagePrompt": prompt_message})

def update_prompt(prompt_message):
    """Update the 'MessagePrompt' field in Firebase with the specified prompt message."""
    ref_msg_prompt.update({ "MessagePrompt": prompt_message})

# Function to enroll finger based on index
def enroll_finger(location):
    """Take a 2 finger images and template it, then store in 'location'"""
    for fingerimg in range(1, 3):
        if fingerimg == 1:
            update_prompt("Place finger on sensor")
            print("Place finger on sensor...", end="")
        else:
            update_prompt("Place same finger again")
            print("Place same finger again...", end="")
        while True:
            i = finger.get_image()
            if i == adafruit_fingerprint.OK:
                update_prompt("Fingerprint taken")
                print("Image taken")
                break
            if i == adafruit_fingerprint.NOFINGER:
                
                print(".", end="")
            elif i == adafruit_fingerprint.IMAGEFAIL:
                update_prompt("Fingerprint fail")
                print("Imaging error")
                return False
            else:
                update_prompt("error")
                print("Other error")
                return False

        print("Templating...", end="")
        i = finger.image_2_tz(fingerimg)
        if i == adafruit_fingerprint.OK:
            print("Templated")
        else:
            if i == adafruit_fingerprint.IMAGEMESS:
                update_prompt("Fingerprint too messy")
                print("Image too messy")
            elif i == adafruit_fingerprint.FEATUREFAIL:
                update_prompt("Could not identify features")
                print("Could not identify features")
            elif i == adafruit_fingerprint.INVALIDIMAGE:
                update_prompt("Template Invalid")
                print("Image invalid")
            else:
                update_prompt("Other error")
                print("Other error")
            return False

        if fingerimg == 1:
            print("Remove finger")
            update_prompt("Remove Finger")
            time.sleep(1)
            while i != adafruit_fingerprint.NOFINGER:
                i = finger.get_image()

    print("Creating model...", end="")
    i = finger.create_model()
    if i == adafruit_fingerprint.OK:
        update_prompt("Model Created")
        print("Created")
    else:
        if i == adafruit_fingerprint.ENROLLMISMATCH:
            update_prompt("Fingerprints did not match")
            print("Prints did not match")
            time.sleep(1)
            enroll_finger(ref_enroll_index.get()) 
        else:
            update_prompt("Error")
            print("Other error")
            time.sleep(1)
            enroll_finger(ref_enroll_index.get())
        return False
    print("Storing model #%d..." % location, end="")
    i = finger.store_model(location)
    if i == adafruit_fingerprint.OK:
        update_prompt("Fingerprint Saved")
        print("Stored")
    else:
        if i == adafruit_fingerprint.BADLOCATION:
            update_prompt("Bad storage location")
            print("Bad storage location")
        elif i == adafruit_fingerprint.FLASHERR:
            update_prompt("Flash storage error")
            print("Flash storage error")
        else:
            update_prompt("Error")
            print("Other error")
        return False

    return True


# Function to perform login action
def login_finger():
    """Get a finger print image, template it, and see if it matches!"""
    print("Waiting for image...")
    update_l_prompt("Place finger on sensor")
    while finger.get_image() != adafruit_fingerprint.OK:
        pass
    print("Templating...")
    update_l_prompt("Templating...")
    if finger.image_2_tz(1) != adafruit_fingerprint.OK:
        return False
    print("Searching...")
    update_l_prompt("Searching...")
    if finger.finger_search() != adafruit_fingerprint.OK:
        return False
    return True


# Define a callback function to handle value changes for 'Status' field
def handle_status_change(event):
    # Get the updated value of the 'Status' field
    new_status = event.data
    print("Status changed to:", new_status)

    # Perform actions based on the updated status
    if new_status == "register":
        # Retrieve the enroll finger index from Firebase

        enroll_index = ref_enroll_index.get()
        if enroll_index is not None:
            enroll_finger(enroll_index)  # Enroll finger at the retrieved index
        else:
            print("Enroll index not found in '/user/index'")
    elif new_status == "login":
        if login_finger():
            print("Detected #", finger.finger_id, "with confidence", finger.confidence)
            update_l_prompt("Match Found")
            ref_login_index.update({ "LoggedIndex": finger.finger_id})
        else:
            ref_login_index.update({ "LoggedIndex": 0})
            update_l_prompt("No Fingerprint Match Found")
            print("Finger not found")
    else:
        print("Idle")
# Listen for changes to the 'Status' field
ref_status.listen(handle_status_change)


while True:
   time.sleep(1)