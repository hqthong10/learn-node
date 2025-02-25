function isAudioInput(value) {
    return value.kind === "audioinput";
}

function isAudioOutput(value) {
    return value.kind === "audiooutput";
}

function isVideoInput(value) {
    return value.kind === "videoinput";
}

function sanitizeDeviceName(deviceName) {
    return String(deviceName).toLowerCase().replace(/[\W]+/g, "_");
}

async function enumerateDevices() {
    const list = [];
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        /*
            [{
                deviceId: "default",
                kind: "audioinput",
                label: "Default - MacBook Air Microphone (Built-in)",
                groupId: "d7820557040377050101eec52e69832d3802b76774b4ea7ae623956074e00fb6"
            }]
         */
        
        // If we don't have labels, request permissions and try again
        if (devices.some(device => !device.label)) {
            await requestPermissions();
            const devicesWithLabels = await navigator.mediaDevices.enumerateDevices();
            devices.forEach((device) => {
                console.log(
                    `${device.kind}: ${device.label} id = ${device.deviceId}`
                );
                list.push(device);
            });
            prettyPrint(devicesWithLabels.filter(isAudioInput), "audioInputs");
            prettyPrint(devicesWithLabels.filter(isAudioOutput), "audioOutputs");
            prettyPrint(devicesWithLabels.filter(isVideoInput), "videoInputs");
        } else {
            // We already have labels, proceed normally
            devices.forEach((device) => {
                console.log(
                    `${device.kind}: ${device.label} id = ${device.deviceId}`
                );
                list.push(device);
            });
            prettyPrint(devices.filter(isAudioInput), "audioInputs");
            prettyPrint(devices.filter(isAudioOutput), "audioOutputs");
            prettyPrint(devices.filter(isVideoInput), "videoInputs");
        }
    } catch (err) {
        console.error(`${err.name}: ${err.message}`);
    }
}

async function requestPermissions() {
    try {
        // Request temporary audio/video access to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then(stream => {
                // Stop all tracks immediately after getting permission
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(err => {
                console.warn("Partial permission denied:", err.name);
                // Still try to enumerate even with partial permission
            });
    } catch (e) {
        console.warn("Permission request failed:", e);
    }
}

async function checkMicPermissions() {
    try {
      const permissions = await navigator.permissions.query({
        name: 'microphone'
      });

      if (permissions.state === 'granted') {
        // console.log('Mic is enabled');
      } else {
        // console.log('Mic is disabled');
      }
    }catch(e){}
  }

function prettyPrint(json, element) {
    let output = "<div class='prettyJson two-col'>";
    let nestedObjs;

    Object.entries(json)
        .sort()
        .forEach(([key, value]) => {
            output += `
            <div class='device' onclick='addDevice(this)' data-device-type='${value.kind}'>
                <span class='device-name'>${value.label}</span>
                <span class='device-id'>
                    ${value.deviceId}
                </span>
            </div>`;
        });
    output += "</div>";
    document.getElementById(element).innerHTML = output;
}

function addDevice(element) {
    const type = element.dataset.deviceType;
    const device = sanitizeDeviceName(element.querySelector('span').innerText);

    if (type === "audioinput") {
        setAudioSearchParams(element);
    }
    if (type === "videoinput") {
        setVideoSearchParams(element);
    }
    if (type === "audiooutput") {
        setAudioOutputSearchParams(element);
    }

    /*
        Allows for multiple audio devices to be selected
        Will be output as a comma separated string to &ad
    */

    function setAudioSearchParams(info) {
        // Device was already selected
        if (info.className === "device selected") {
            // Remove device from list of selected devices
            const index = audioInputDevices.indexOf(device);
            if (index !== -1) {
                audioInputDevices.splice(index, 1);
            }

            // Set the url param to the devices that are left
            // url.searchParams.set("ad", audioInputDevices.join(","));
            element.className = "device";

            // If no audio devices remained, just remove the param completely
            if (audioInputDevices.length === 0) {
                // url.searchParams.delete("ad");
            }
        } else {
            // Device is unselected
            
            audioInputDevices.push(device);
            // url.searchParams.set("ad", audioInputDevices.join(","));
            element.className = "device selected";
        }
    }

    /*
    Only allows for a single video device to be selected
    */
    function setVideoSearchParams(info) {
        // Device was already selected
        if (info.className === "device selected") {
            element.className = "device";


            // Set the url param to the devices that are left
            // url.searchParams.set("vd", device);
            element.className = "device";

            // If no devices remained, just remove the param completely
            if (audioInputDevices.length === 0) {
                // url.searchParams.delete("vd");
            }
        } else {
            // Device is unselected
            try {
                element.parentElement.querySelector('.device.selected').className = "device";
            } catch (error) {
                console.log("There was no video device already selected.");
            }
            
            // url.searchParams.set("vd", device);
            element.className = "device selected";
        }
    }
    
    /*
    Only allows for a single audio output device to be selected
    */
    function setAudioOutputSearchParams(info) {
        // Device was already selected
        if (info.className === "device selected") {
            element.className = "device";

            // Set the url param to the devices that are left
            // url.searchParams.set("od", device);
            element.className = "device";

            // If no devices remained, just remove the param completely
            if (audioInputDevices.length === 0) {
                // url.searchParams.delete("od");
            }
        } else {
            // Device is unselected
            try {
                element.parentElement.querySelector('.device.selected').className = "device";
            } catch (error) {
                console.log("There was no video device already selected.");
            }
            
            // url.searchParams.set("od", device);
            element.className = "device selected";
        }
    }

    // Update UI
    // showDeviceIdsPopup();
    console.log(audioInputDevices)
}