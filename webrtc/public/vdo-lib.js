async function enumerateDevices() {

    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(function(){
			if (!session.cleanOutput) {
				warnUser("The browser has not responded to our request to list available media devices.\n\nPossible solutions:\n\n- Restart the computer and try again\n- Try another browser\n- Remove or uninstall devices that are not needed\n- Uninstall and reinstall your browser");
			}
			new Error("Device enumeration timed out.\n\nThe browser has not responded to our request to list available media devices.\n\nPossible solutions:\n\n- Restart the computer and try again\n- Try another browser\n- Remove or uninstall devices that are not needed\n- Uninstall and reinstall your browser");
		}), 15000)
    );

    const enumeratePromise = new Promise(async (resolve, reject) => {
        try {

            if (typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.enumerateDevices === "function") {
                resolve(await navigator.mediaDevices.enumerateDevices());
            } else if (typeof navigator.enumerateDevices === "function") {
                resolve(await navigator.enumerateDevices());
            } else {
                window.MediaStreamTrack.getSources(devices => {
                    resolve(
                        devices
                            .filter(device => {
                                return device.kind.toLowerCase() === "video" || device.kind.toLowerCase() === "videoinput";
                            })
                            .map(device => {
                                return {
                                    deviceId: device.deviceId != null ? device.deviceId : "",
                                    groupId: device.groupId,
                                    kind: "videoinput",
                                    label: device.label,
                                    toJSON: /* istanbul ignore next */ function () {
                                        return this;
                                    }
                                };
                            })
                    );
                });
            }
        } catch (e) {
            console.log(e);
            if (!session.cleanOutput) {
                if (location.protocol !== "https:") {
                    warnUser("Error listing the media devices.\n\nYour browser will not allow access to media devices without SSL enabled.\n\nPossible solutions include switching to https, accessing the site from http://localhost, or enabling the `unsafely-treat-insecure-origin-as-secure` browser switch.");
                } else if ("isSecureContext" in window && window.isSecureContext === false) {
                    warnUser("Error listing the media devices.\n\nThe website may have assets loaded in an insecure context.");
                } else {
                    warnUser("An unknown error occured while trying to list the media devices.");
                }
            }
            reject(e);
        }
    });

    return Promise.race([enumeratePromise, timeout]);
}

async function requestBasicPermissions(constraint = { video: true, audio: true }, callback = setupWebcamSelection, miconly = false) {
	if (session.taintedSession === null) {
		log("STILL WAITING ON HASH TO VALIDATE");
		setTimeout(
			function (constraint, callback, miconly) {
				requestBasicPermissions(constraint, callback, miconly);
			},
			1000,
			constraint,
			callback,
			miconly
		);
		return null;
	} else if (session.taintedSession === true) {
		warnlog("HASH FAILED; PASSWORD NOT VALID");
		return false;
	} else {
		log("NOT TAINTED 1");
	}
	setTimeout(function () {
		getById("getPermissions").style.display = "none";
		getById("gowebcam").style.display = "";
	}, 0);
	log("REQUESTING BASIC PERMISSIONS");

	try {
		
		if (!navigator.mediaDevices){
			throw new Error("navigator.mediaDevices not found - check your security / browser settings.");
		}
		
		var timerBasicCheck = null;
		if (!session.cleanOutput) {
			log("Setting Timer for getUserMedia");
			timerBasicCheck = setTimeout(function () {
				if (!session.cleanOutput) {
					if (session.mobile) {
						warnUser("Notice: Camera timed out\n\nDid you accept the camera permissions?\n\nThis error may also appear if you are in a phone call or another app is already using the camera or microphone.");
					} else {
						warnUser("Camera Access Request Timed Out\n\nDid you accept camera permissions? Please do so first.\n\nIf you have NDI Tools installed, try uninstalling that.\n\nPlease also ensure that your camera and audio devices are correctly connected and not already in use. Bypassing USB hubs or using different USB cables can sometimes help.\n\nYou may also just need to restart the computer");
					}
				}
			}, 10000);
		}

		if (session.audioInputChannels) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.channelCount = session.audioInputChannels;
			} else if (constraint.audio) {
				constraint.audio.channelCount = session.audioInputChannels;
			}
		}

		if (session.micSampleRate) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.sampleRate = parseInt(session.micSampleRate);
			} else if (constraint.audio) {
				constraint.audio.sampleRate = parseInt(session.micSampleRate);
			}
		}
		if (session.micSampleSize) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.sampleSize = parseInt(session.micSampleSize);
			} else if (constraint.audio) {
				constraint.audio.sampleSize = parseInt(session.micSampleSize);
			}
		}

		if (session.safemode) {
			if (constraint.video) {
				constraint.video = true;
			}
			if (constraint.audio) {
				constraint.audio = true;
			}
		}
		getUserMediaRequestID += 1;
		var gumID = getUserMediaRequestID;
		log("CONSTRAINT");
		log(constraint);
		var timeoutStart = 0;
		if (Firefox) {
			timeoutStart = 500;
		}
		log("timeoutStart :" + timeoutStart);
		setTimeout(
			async function (gumID, constraint, timerBasicCheck, callback, miconly) {
				log("gumID: " + gumID);
				log(constraint);
				var removeAudio = false;
				if (!constraint.audio && !constraint.video) {
					constraint.audio = true;
					removeAudio = true;
				}

				// Permissions API is not supported in all browsers, so we use a try-catch block
				let videoPermission = "prompt";
				let audioPermission = "prompt";

				if (Firefox && Firefox>=132){
					console.warn("😱 see: https://bugzilla.mozilla.org/show_bug.cgi?id=1924572#c1");
				} else {
					try {
						const videoStatus = await navigator.permissions.query({ name: "camera" });
						videoPermission = videoStatus.state;
						const audioStatus = await navigator.permissions.query({ name: "microphone" });
						audioPermission = audioStatus.state;
						log("audioPermission: "+audioPermission);
					} catch (e) {
						warnlog("Permissions API is not fully supported in this browser.");
					}

					if (videoPermission === "granted") {
						constraint.video = false;
					}
					if (audioPermission === "granted") {
						constraint.audio = false;
					}
				}

				if (!constraint.audio && !constraint.video) {
					warnlog("bypassing navigator.mediaDevices.getUserMedia; permissions granted already?");
					clearTimeout(timerBasicCheck);
					if (getUserMediaRequestID !== gumID) {
						warnlog("GET USER MEDIA CALL HAS EXPIRED 3a");
						return;
					}
					// closeModal();
					if (callback) {
						callback(miconly);
					}
					return;
				}
				
				if (Firefox){
					constraint = toFirefoxConstraint(constraint);
				}

				warnlog("navigator.mediaDevices.getUserMedia starting...");
				navigator.mediaDevices
					.getUserMedia(constraint)
					.then(function (stream) {
						// Apple needs thi to happen before I can access EnumerateDevices.

						if (removeAudio) {
							constraint.audio = false; // this seeems pointless?
							stream.getTracks().forEach(function (track) {
								stream.removeTrack(track);
								track.stop();
								log("stopping old track");
							});
						}

						log("got first stream");
						clearTimeout(timerBasicCheck);
						if (getUserMediaRequestID !== gumID) {
							warnlog("GET USER MEDIA CALL HAS EXPIRED 3");
							stream.getTracks().forEach(function (track) {
								stream.removeTrack(track);
								track.stop();
								log("stopping old track");
							});
							return;
						}
						// closeModal();

						log(stream.getTracks());

						session.streamSrc = stream;
						checkBasicStreamsExist();
						updateRenderOutpipe();

						if (callback) {
							callback(miconly);
						}
					})
					.catch(function (err) {
						clearTimeout(timerBasicCheck);
						warnlog("some error with GetUSERMEDIA");
						console.warn(err); /* handle the error */
						if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
							//required track is missing
						} else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
							//webcam or mic are already in use
						} else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
							//constraints can not be satisfied by avb. devices
						} else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
							//permission denied in browser
							if (isIFrame) {
								console.error('Make sure that this IFRAME has the correct permissions allowed, ie:\n\niframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;midi;geolocation;screen-wake-lock;";');
							}
							if (!session.cleanOutput) {
								setTimeout(function () {
									if (window.obsstudio) {
										warnUser("Permissions denied.\n\nTo access the camera or microphone from within OBS, please refer to:\n<a href='https://docs.vdo.ninja/guides/share-webcam-from-inside-obs'>docs.vdo.ninja/guides/share-webcam-from-inside-obs</a>.", false, false);
									} else if (ChromiumVersion && !session.mobile) {
										warnUser("<h1>Camera/mic permissions denied</h1>\nPlease ensure you have allowed the mic/camera permissions in your browser, such as like:\n\n<img src='./media/permissions_chrome.jpg' style='max-height:50vh;' />\n\nFor further help on how to resolve this issue, please refer to:\n\n<a target='_blank' href='https://docs.vdo.ninja/common-errors-and-known-issues/enable-camera-microphone-permissions'>https://docs.vdo.ninja/common-errors-and-known-issues/enable-camera-microphone-permissions</a>.", false, false);
									} else if (Firefox && session.mobile) {
										warnUser(
											"<h3>Camera/mic permission denied</h3>\nPlease allow mic/camera access.\n\n\
								If not prompted, go to Settings -> Site permissions -> exceptions (at bottom) -> vdo.ninja, and then manually enable the permissions.\n\n\
								If Firefox still gives you issues, try in incognito mode or a different browser.\
								For further help, please refer to:\n\n<a target='_blank' href='https://docs.vdo.ninja/common-errors-and-known-issues/enable-camera-microphone-permissions'>https://docs.vdo.ninja/common-errors-and-known-issues/enable-camera-microphone-permissions</a>.",
											false,
											false
										);
									} else {
										warnUser("Permission access to the camera or microphone was denied.\n\nPlease ensure you have allowed the mic/camera permissions in your browser.\n\nFor guides on how to resolve this issue, please refer to:\n\n<a target='_blank' href='https://docs.vdo.ninja/common-errors-and-known-issues/enable-camera-microphone-permissions'>https://docs.vdo.ninja/common-errors-and-known-issues/enable-camera-microphone-permissions</a>.", false, false);
									}
								}, 1);
							}
							return;
						} else if (err.name == "TypeError" || err.name == "TypeError") {
							//empty constraints object
						} else {
							//permission denied in browser
							if (!session.cleanOutput) {
								setTimeout(
									function (err) {
										warnUser(err);
									},
									1,
									err
								);
							}
						}
						warnlog("trying to list webcam again");

						if (callback) {
							callback(miconly);
						}
					});
			},
			timeoutStart,
			gumID,
			constraint,
			timerBasicCheck,
			callback,
			miconly
		);
	} catch (e) {
		console.warn(e);
		if (!session.cleanOutput) {
			if (window.isSecureContext) {
				warnUser("An error has occured when trying to access the webcam or microphone. The reason is not known.");
			} else if (iOS || iPad) {
				warnUser("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
			} else {
				warnUser("Error acessing camera or microphone.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
			}
		}
	}
	return null;
}

function setupWebcamSelection(miconly = false) {
	log("setupWebcamSelection();");

	checkBasicStreamsExist();

	try {
		return enumerateDevices()
			.then(function (dInfo) {
				return gotDevices(dInfo, miconly);
			})
			.then(function () {
				if (getById("webcamquality").elements && parseInt(getById("webcamquality").elements.namedItem("resolution").value) == 3) {
					// this is junk??
					if (session.maxframeRate === false) {
						session.maxframeRate = 30;
						session.maxframeRate_q2 = true;
					}
				} else if (session.maxframeRate_q2) {
					session.maxframeRate = false;
					session.maxframeRate_q2 = false;
				}

				var audioSelect = getById("audioSource");
				var videoSelect = getById("videoSourceSelect");
				var outputSelect = getById("outputSource");

				if (audioSelect.tagName == "UL") {
					audioSelect.onchange = function () {
						if (document.getElementById("gowebcam")) {
							document.getElementById("gowebcam").disabled = true;
							document.getElementById("gowebcam").dataset.audioready = "false";
							//document.getElementById("gowebcam").style.backgroundColor = "#DDDDDD";
							document.getElementById("gowebcam").style.fontWeight = "normal";
							document.getElementById("gowebcam").innerHTML = "Waiting for mic to load";
							miniTranslate(document.getElementById("gowebcam"), "waiting-for-mic-to-load");
						}
						activatedPreview = false;
						grabAudio();
					};
				}
				videoSelect.onchange = function () {
					if (document.getElementById("gowebcam")) {
						document.getElementById("gowebcam").disabled = true;
						document.getElementById("gowebcam").dataset.ready = "false";
						//document.getElementById("gowebcam").style.backgroundColor = "#DDDDDD";
						document.getElementById("gowebcam").style.fontWeight = "normal";
						document.getElementById("gowebcam").innerHTML = "Waiting for Camera to load";
						miniTranslate(document.getElementById("gowebcam"), "waiting-for-camera-to-load");
					}
					warnlog("video source changed");

					activatedPreview = false;
					if (session.quality !== false) {
						grabVideo(session.quality);
					} else if (document.getElementById("webcamquality")) {
						session.quality_wb = parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value);
						grabVideo(session.quality_wb);
					}
				};

				if (Firefox && !session.mobile) {
					outputSelect.onclick = function () {
						log("on click");
						if (outputSelect.options[outputSelect.selectedIndex].value === "others") {
							navigator.mediaDevices.selectAudioOutput().then(device => {
								if (device.kind == "audiooutput") {
									session.sink = device.deviceId;

									try {
										var matched = false;
										outputSelect.childNodes.forEach(ele => {
											if (ele.value === device.deviceId) {
												matched = true;
												ele.selected = true;
											}
										});
										if (!matched) {
											var option = document.createElement("option");
											option.value = device.deviceId;
											option.text = device.label;
											outputSelect.appendChild(option);
											option.selected = true;
										}

										saveSettings(); // we're saving because there was an explicit action to change devices
									} catch (e) {
										errorlog(e);
									}

									if (!session.sink) {
										return;
									} // Not sure this would ever happen, but whatever.

									resetupAudioOut(); // we'll probalby use session.sink, since outputSelect3 doesn't exist.
								}
							});
						}
					};
				}

				outputSelect.onchange = function () {
					if (iOS || iPad) {
						return;
					}
					if (Firefox && !session.mobile) {
						if (outputSelect.options[outputSelect.selectedIndex].value === "others") {
							return;
						}
					}

					try {
						session.sink = outputSelect.options[outputSelect.selectedIndex].value;
						saveSettings(); // we're saving because there was an explicit action to change devices
					} catch (e) {
						errorlog(e);
					}

					if (!session.sink) {
						return;
					} // Not sure this would ever happen, but whatever.

					resetupAudioOut(); // we'll probalby use session.sink, since outputSelect3 doesn't exist.
				};

				getById("webcamquality").onchange = function () {
					if (document.getElementById("gowebcam")) {
						document.getElementById("gowebcam").disabled = true;
						document.getElementById("gowebcam").dataset.ready = "false";
						//	document.getElementById("gowebcam").style.backgroundColor = "#DDDDDD";
						document.getElementById("gowebcam").style.fontWeight = "normal";
						document.getElementById("gowebcam").innerHTML = "Waiting for Camera to load";
						miniTranslate(document.getElementById("gowebcam"), "waiting-for-camera-to-load");
					}

					if (parseInt(getById("webcamquality").elements.namedItem("resolution").value) == 2) {
						if (session.maxframeRate === false) {
							session.maxframeRate = 30;
							session.maxframeRate_q2 = true;
						}
					} else if (session.maxframeRate_q2) {
						session.maxframeRate = false;
						session.maxframeRate_q2 = false;
					}

					activatedPreview = false;
					session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
					grabVideo(session.quality_wb);
				};

				if (session.safemode) {
					if (document.getElementById("gowebcam")) {
						document.getElementById("gowebcam").disabled = false;
						//document.getElementById("gowebcam").innerHTML = getTranslation("start");
						miniTranslate(document.getElementById("gowebcam"), "start");
						document.getElementById("gowebcam").dataset.audioready = "true";
						document.getElementById("gowebcam").dataset.ready = "true";
						document.getElementById("gowebcam").focus();
						setTimeout(function () {
							updateForceRotate();
						}, 1000);

						if (session.autostart) {
							publishWebcam(); // no need to mirror as there is no video...
						}
						return;
					}
				}

				if (session.audioDevice !== 0) {
					// change from Auto to Selected Audio Device
					log("SETTING AUDIO DEVICE!!");
					activatedPreview = false;
					grabAudio();
				} else if (document.getElementById("gowebcam")) {
					document.getElementById("gowebcam").dataset.audioready = "true";
				}

				if (session.videoDevice === 0 || miconly) {
					if (session.autostart) {
						publishWebcam(); // no need to mirror as there is no video...
						return;
					} else if (document.getElementById("gowebcam")) {
						document.getElementById("gowebcam").dataset.ready = "true";
						if (document.getElementById("gowebcam").dataset.audioready == "true") {
							document.getElementById("gowebcam").disabled = false;
							miniTranslate(document.getElementById("gowebcam"), "start");
							document.getElementById("gowebcam").focus();
							//document.getElementById("gowebcam").innerHTML = getTranslation("start");
						}
					}
				} else {
					log("GRabbing video: " + session.quality);
					activatedPreview = false;
					if (session.quality !== false) {
						grabVideo(session.quality);
					} else if (document.getElementById("webcamquality")) {
						session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
						grabVideo(session.quality_wb);
					}
				}

				if (!(iOS || iPad || session.mobile)) {
					try {
						if (outputSelect.selectedIndex >= 0) {
							session.sink = outputSelect.options[outputSelect.selectedIndex].value;
							saveSettings();
							if (session.videoElement && !session.videoElement.paused) {
								resetupAudioOut();
							}
						}
					} catch (e) {
						errorlog(e);
					}
				}
			})
			.catch(e => {
				errorlog(e);
			});
	} catch (e) {
		errorlog(e);
	}
}

function checkBasicStreamsExist() {
	log("checkBasicStreamsExist()");
	if (!session.streamSrc) {
		session.streamSrc = createMediaStream();
	}
	if (!session.videoElement) {
		if (document.getElementById("videosource")) {
			session.videoElement = document.getElementById("videosource");
		} else if (document.getElementById("previewWebcam")) {
			session.videoElement = document.getElementById("previewWebcam");
		} else {
			session.videoElement = createVideoElement();
		}

		session.videoElement.addEventListener(
			"playing",
			e => {
				resetupAudioOut(session.videoElement, true);
			},
			{ once: true }
		);

		session.videoElement.onpause = event => {
			// prevent things from pausing; human or other
			if (!(event.ctrlKey || event.metaKey)) {
				log("Video paused; auto playing");
				event.currentTarget
					.play()
					.then(_ => {
						log("playing 10");
					})
					.catch(warnlog);
			}
		};

		session.videoElement.addEventListener("error", function (event) {
			errorlog("video error");
			errorlog(event);
			setTimeout(function () {
				if (session.videoElement) {
					log("Trying to re-load local preview, as it may have crashed");
					session.videoElement.load();
				}
			}, 1200);
		});

		//session.videoElement.addEventListener('loadedmetadata', function(event) {
		//	log("loadedmetadata");
		//	log(event);
		//});
	}
	session.videoElement.srcObject = outboundAudioPipeline();
	toggleMute(true);
	return session.videoElement;
}

function createMediaStream() {
	mediaStreamCounter += 1;
	return new MediaStream();
}


function outboundAudioPipeline(sourceStream = false) {
	// this function isn't letting me change the audio source
	
	if (session.disableWebAudio) {
		return disabledWebAudioPathway(); // safemode
	}

	if (!session.streamSrc && !sourceStream) {
		errorlog("STREAM DOES NOT EXIST. This is a problem");
		checkBasicStreamsExist();
		return session.streamSrc;
	}

	var streamSrc = sourceStream || session.streamSrc;

	if (iOS || iPad) {
		if (session.streamSrcClone) {
			var tracks = session.streamSrcClone.getAudioTracks();
			if (tracks.length) {
				for (var waid in session.webAudios) {
					// TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (track.id === wa.id){..
					session.webAudios[waid].stop();
					delete session.webAudios[waid];
				}
			}
			session.streamSrcClone.getTracks().forEach(function (track) {
				session.streamSrcClone.removeTrack(track);
				track.stop();
			});
		}

		if (session.streamSrc && session.streamSrc.clone) {
			// modern
			streamSrc = session.streamSrc.clone();
			session.streamSrcClone = streamSrc;
		} else {
			// backup.
			streamSrc = createMediaStream();

			if (session.streamSrc) {
				session.streamSrc.getAudioTracks().forEach(function (track) {
					// this seems to fix a bug with macbooks.
					streamSrc.addTrack(track, session.streamSrc);
				});
			}
			if (session.videoElement && session.videoElement.srcObject) {
				session.videoElement.srcObject.getVideoTracks().forEach(function (track) {
					// this seems to fix a bug with macbooks.
					streamSrc.addTrack(track, session.videoElement.srcObject);
				});
			} else if (session.streamSrc) {
				session.streamSrc.getVideoTracks().forEach(function (track) {
					// this seems to fix a bug with macbooks.
					streamSrc.addTrack(track, session.streamSrc);
				});
			}
			session.streamSrcClone = streamSrc;
		}
	}

	for (var waid in session.webAudios) {
		// TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (track.id === wa.id){..
		session.webAudios[waid].stop();
		delete session.webAudios[waid];
	}

	try {
		log("Web Audio");
		var tracks = streamSrc.getAudioTracks();
		if (tracks.length) {
			var webAudio = {};
			webAudio.micDelay = false;
			webAudio.compressor = false;
			webAudio.analyser = false;
			webAudio.gainNode = false;
			webAudio.splitter = false;
			webAudio.subGainNodes = false;

			webAudio.lowEQ = false;
			webAudio.midEQ = false;
			webAudio.highEQ = false;
			webAudio.lowcut1 = false;
			webAudio.lowcut2 = false;
			webAudio.lowcut3 = false;

			webAudio.id = tracks[0].id; // first track is used.

			if (session.audioCtxOutbound) {
				// outbound implies 48000, since webrtc opus is 48000.  (pcm may be excepted)
				// already Created
			} else if (session.outboundSampleRate) {
				try {
					session.audioCtxOutbound = new AudioContext({ sampleRate: session.outboundSampleRate });
				} catch (e) {
					session.audioCtxOutbound = new AudioContext(); // legacy support
					errorlog(e);
				}
			} else if (session.outboundSampleRate === false || Firefox || SafariVersion || session.mobile) {
				// does not support resampling or likely doesn't need to worry, so will error
				session.audioCtxOutbound = new AudioContext();
			} else if (session.audioLatency !== false) {
				// session.audioLatency could be useful for fixing clicking issues?
				session.audioCtxOutbound = new AudioContext({
					latencyHint: session.audioLatency / 1000.0, // needs to be in seconds, but VDON user input is via milliseconds
					sampleRate: 48000 // not sure this is a great idea, but might as well add this here, versus later on since it is needed anyways.
				});
			} else {
				try {
					session.audioCtxOutbound = new AudioContext({ sampleRate: 48000 });
				} catch (e) {
					session.audioCtxOutbound = new AudioContext(); // legacy support
					errorlog(e);
				}
			}

			if (session.audioCtxOutbound && session.audioCtxOutbound.sampleRate && session.audioCtxOutbound.sampleRate > 192000) {
				console.error("Warning: Your audio playback device has a very high sample rate set; lower it to 48000-Hz to avoid audio issues");
			}

			webAudio.audioContext = session.audioCtxOutbound;

			webAudio.destination = session.audioCtxOutbound.createMediaStreamDestination();

			if (tracks.length > 1) {
				// tries to
				try {
					webAudio.mediaStreamSource = createMediaStream();
					var maxChannelCount = 2;
					if (session.stereo === false) {
						maxChannelCount = 1;
					}

					webAudio.subGainNodes = {}; //

					var merger = session.audioCtxOutbound.createChannelMerger(maxChannelCount);
					for (var i = 0; i < tracks.length; i++) {
						try {
							var tempStream = createMediaStream();
							tempStream.addTrack(tracks[i]);
							trackStream = session.audioCtxOutbound.createMediaStreamSource(tempStream);

							webAudio.subGainNodes[tracks[i].id] = session.audioCtxOutbound.createGain();
							trackStream.connect(webAudio.subGainNodes[tracks[i].id]);

							if (maxChannelCount == 2) {
								var splitter = session.audioCtxOutbound.createChannelSplitter(2);
								webAudio.subGainNodes[tracks[i].id].connect(splitter);
								splitter.connect(merger, 0, 0);
								try {
									splitter.connect(merger, 1, 1);
								} catch (e) {
									errorlog(e);
									try {
										splitter.connect(merger, 0, 1); // hack.
									} catch (e) {
										errorlog(e);
									}
								}
							} else {
								webAudio.subGainNodes[tracks[i].id].connect(merger, 0, 0);
							}
						} catch (e) {
							errorlog(e);
							errorlog("Disabling web audio output node processing. Possibly an audio sample rate mismatch issue.");
							return disabledWebAudioPathway(); // safemode
						}
					}

					webAudio.gainNode = audioGainNode(merger, session.audioCtxOutbound);
				} catch (e) {
					errorlog(e);
					try {
						webAudio.mediaStreamSource = session.audioCtxOutbound.createMediaStreamSource(streamSrc);
						webAudio.gainNode = audioGainNode(webAudio.mediaStreamSource, session.audioCtxOutbound);
					} catch (e) {
						errorlog(e);
						errorlog("Disabling web audio output node processing. Possibly an audio sample rate mismatch issue.");
						return disabledWebAudioPathway(); // safemode
					}
				}
			} else {
				try {
					webAudio.mediaStreamSource = session.audioCtxOutbound.createMediaStreamSource(streamSrc); // clone to fix iOS issue
					webAudio.gainNode = audioGainNode(webAudio.mediaStreamSource, session.audioCtxOutbound);
				} catch (e) {
					errorlog(e);
					errorlog("Disabling web audio output node processing. Possibly an audio sample rate mismatch issue.");
					return disabledWebAudioPathway(); // safemode
				}
			}

			var anonNode = webAudio.gainNode;

			if (session.audioInputChannels == 1) {
				let totalChannels = 0;
				let activeChannels = 0;

				tracks.forEach(track => {
					if (track.getSettings && track.getSettings().channelCount) {
						let trackChannels = track.getSettings().channelCount;
						totalChannels += trackChannels;
						if (track.enabled) {
							activeChannels += trackChannels;
						}
					} else {
						// Fallback if getSettings is not available
						totalChannels += 2; // Assume stereo
						if (track.enabled) {
							activeChannels += 2;
						}
					}
				});

				totalChannels = Math.max(totalChannels, 1);
				activeChannels = Math.max(activeChannels, 1);

				webAudio.splitter = session.audioCtxOutbound.createChannelSplitter(totalChannels);
				anonNode.connect(webAudio.splitter);
				webAudio.merger = session.audioCtxOutbound.createChannelMerger(1);

				// Create a gain node for volume adjustment
				webAudio.downmixGain = session.audioCtxOutbound.createGain();

				// Connect splitter outputs to merger through the gain node
				for (let i = 0; i < totalChannels; i++) {
					webAudio.splitter.connect(webAudio.downmixGain, i, 0);
				}

				webAudio.downmixGain.connect(webAudio.merger, 0, 0);

				// Set gain to 1 / sqrt(activeChannels) to maintain perceived loudness
				let gainValue = 1 / Math.sqrt(activeChannels);
				webAudio.downmixGain.gain.setValueAtTime(gainValue, session.audioCtxOutbound.currentTime);

				console.log(`Downmixing ${totalChannels} total channels (${activeChannels} active) to mono. Gain set to ${gainValue.toFixed(3)}`); // TODO: this is a temp log I guess.

				anonNode = webAudio.merger;
			}

			if (session.lowcut) {
				// https://webaudioapi.com/samples/frequency-response/ for a tool to help set values
				webAudio.lowcut1 = session.audioCtxOutbound.createBiquadFilter();
				webAudio.lowcut1.type = "highpass";
				webAudio.lowcut1.frequency.value = session.lowcut;

				webAudio.lowcut2 = session.audioCtxOutbound.createBiquadFilter();
				webAudio.lowcut2.type = "highpass";
				webAudio.lowcut2.frequency.value = session.lowcut;

				webAudio.lowcut3 = session.audioCtxOutbound.createBiquadFilter();
				webAudio.lowcut3.type = "highpass";
				webAudio.lowcut3.frequency.value = session.lowcut;

				anonNode.connect(webAudio.lowcut1);
				webAudio.lowcut1.connect(webAudio.lowcut2);
				webAudio.lowcut2.connect(webAudio.lowcut3);
				anonNode = webAudio.lowcut3;
			}

			if (session.voicechanger) {
				function makeDistortionCurve(amount = 10) {
					var sampleRate = session.audioCtxOutbound.sampleRate || 48000;
					var curve = new Float32Array(sampleRate);
					var x;
					for (let i = 0; i < sampleRate; ++i) {
						x = (i * 2) / sampleRate - 1;
						curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
					}
					return curve;
				}

				let waveShaper = session.audioCtxOutbound.createWaveShaper();
				waveShaper.curve = makeDistortionCurve(5);

				var realCoeffs = new Float32Array([1, 0]);
				var imagCoeffs = new Float32Array([0, 1]);

				var numCoeffs = 20; // The more coefficients you use, the better the approximation
				var realCoeffs = new Float32Array(numCoeffs);
				var imagCoeffs = new Float32Array(numCoeffs);

				realCoeffs[0] = 0.5;
				for (var i = 1; i < numCoeffs; i++) {
					// note i starts at 1
					imagCoeffs[i] = (1 / (i * Math.PI)) * (1 - Math.random() / 2);
				}

				let oscillator = session.audioCtxOutbound.createOscillator();
				oscillator.frequency.value = 10;

				const wave = session.audioCtxOutbound.createPeriodicWave(realCoeffs, imagCoeffs);
				oscillator.setPeriodicWave(wave);

				let oscillatorGain = session.audioCtxOutbound.createGain();
				oscillatorGain.gain.value = 0.005;
				oscillator.connect(oscillatorGain);
				oscillator.start(0);

				let delay = session.audioCtxOutbound.createDelay();
				delay.delayTime.value = 0.01;
				oscillatorGain.connect(delay.delayTime);

				let lowEQ = session.audioCtxOutbound.createBiquadFilter();
				lowEQ.type = "peaking";
				lowEQ.frequency.value = 200;
				lowEQ.Q.value = 0.5;
				lowEQ.gain.value = 6;

				let mid = session.audioCtxOutbound.createBiquadFilter();
				mid.type = "peaking";
				mid.frequency.value = 500;
				mid.Q.value = 0.5;
				mid.gain.value = -10;
				anonNode.connect(delay);
				delay.connect(waveShaper);
				waveShaper.connect(mid);
				mid.connect(lowEQ);
				anonNode = lowEQ;
			}

			if (session.equalizer) {
				// https://webaudioapi.com/samples/frequency-response/ for a tool to help set values
				webAudio.lowEQ = session.audioCtxOutbound.createBiquadFilter();
				webAudio.lowEQ.type = "lowshelf";
				webAudio.lowEQ.frequency.value = 100;
				webAudio.lowEQ.gain.value = 0;

				webAudio.midEQ = session.audioCtxOutbound.createBiquadFilter();
				webAudio.midEQ.type = "peaking";
				webAudio.midEQ.frequency.value = 1000;
				webAudio.midEQ.Q.value = 0.5;
				webAudio.midEQ.gain.value = 0;

				webAudio.highEQ = session.audioCtxOutbound.createBiquadFilter();
				webAudio.highEQ.type = "highshelf";
				webAudio.highEQ.frequency.value = 10000;
				webAudio.highEQ.gain.value = 0;

				anonNode.connect(webAudio.lowEQ);
				webAudio.lowEQ.connect(webAudio.midEQ);
				webAudio.midEQ.connect(webAudio.highEQ);
				anonNode = webAudio.highEQ;
			}

			if (session.compressor === 1) {
				webAudio.compressor = audioCompressor(anonNode, session.audioCtxOutbound);
				anonNode = webAudio.compressor;
			} else if (session.compressor === 2) {
				webAudio.compressor = audioLimiter(anonNode, session.audioCtxOutbound);
				anonNode = webAudio.compressor;
			}

			if (session.micDelay !== false) {
				webAudio.micDelay = micDelayNode(anonNode, session.audioCtxOutbound);
				anonNode = webAudio.micDelay;
			}

			if (session.twilio && session.twilio.element && session.twilio.element.srcObject && session.twilio.element.srcObject.getAudioTracks().length) {
				const source = session.audioCtxOutbound.createMediaStreamSource(session.twilio.element.srcObject);
				source.connect(anonNode); // mix it in
			}

			if (session.noisegate !== false) {
				webAudio.analyser = audioMeter(anonNode, session.audioCtxOutbound);
				anonNode = webAudio.analyser;
				webAudio.gatingNode = audioGatingNode(anonNode, session.audioCtxOutbound);
				webAudio.gatingNode.connect(webAudio.destination);
			} else {
				webAudio.analyser = audioMeter(anonNode, session.audioCtxOutbound);
				webAudio.analyser.connect(webAudio.destination);
			}

			webAudio.stop = function () {
				webAudio.stop = function () {
					errorlog("Trying to stop webaudio more than once");
				}; // don't stop more than once.

				try {
					clearInterval(webAudio.analyser.interval);
				} catch (e) {
					errorlog(e);
				}

				for (var node in webAudio) {
					if (!webAudio[node]) {
						continue;
					} else if (node == "stop") {
						continue;
					} else if (node == "id") {
						continue;
					} else if (node == "audioContext") {
						continue;
					} // skip. we want to reuse this
					else if (node == "mediaStreamSource") {
						continue;
					} else if (node == "subGainNodes") {
						for (var nn in webAudio[node]) {
							if (webAudio[node][nn]) {
								try {
									webAudio[node][nn].disconnect();
									webAudio[node][nn] = null;
									log("disconnected node: " + node);
								} catch (e) {
									warnlog("node: " + node);
									warnlog("nn: " + nn);
									errorlog(e);
								}
							}
						}
						webAudio[node] = null;
						continue;
					}
					try {
						webAudio[node].disconnect();
						webAudio[node] = null;
						log("disconnected node: " + node);
					} catch (e) {
						warnlog("node: " + node);
						warnlog(webAudio[node]);
						errorlog(e);
					}
				}
				webAudio = null;
			};

			webAudio.mediaStreamSource.onended = function () {
				webAudio.stop();
			};

			session.webAudios[webAudio.id] = webAudio;
			if (session.videoElement && session.videoElement.srcObject) {
				session.videoElement.srcObject.getVideoTracks().forEach(function (track) {
					//if (webAudio.id != track.id) { // presumed to be video, but OBS screws this up with its matching track ids for audio/video. doesn't matter tho
					webAudio.destination.stream.addTrack(track, session.videoElement.srcObject);
					//}
				});
			} else if (streamSrc) {
				streamSrc.getVideoTracks().forEach(function (track) {
					//if (webAudio.id != track.id) {
					webAudio.destination.stream.addTrack(track, streamSrc);
					//}
				});
			}

			try {
				if (session.audioCtxOutbound.state == "suspended") {
					session.audioCtxOutbound.resume();
				}
			} catch (e) {
				warnlog("session.audioCtx.resume(); failed");
			}
			return webAudio.destination.stream;
		} else {
			//if (session.mobile){return streamSrc;} // this avoids issues on mobile? <- caused problems
			// there are no audio tracks, given this case. so, skip /* streamSrc.getAudioTracks().forEach(function(track) { // this seems to fix a bug with macbooks.
			//	newStream.addTrack(track, streamSrc);
			//}); */

			if (session.videoElement && session.videoElement.srcObject) {
				return session.videoElement.srcObject;
			}

			var newStream = createMediaStream();
			if (streamSrc) {
				streamSrc.getVideoTracks().forEach(function (track) {
					// this seems to fix a bug with macbooks.
					newStream.addTrack(track, streamSrc);
				});
			}
			
			return newStream;
		}
	} catch (e) {
		errorlog(e);
		return streamSrc;
	}
}

function changeLowCut(freq, deviceid = null) {
	log("LOW EQ");

	for (var webAudio in session.webAudios) {
		if (!session.webAudios[webAudio].lowcut1) {
			errorlog("EQ not setup");
			return;
		}
		if (!session.webAudios[webAudio].lowcut2) {
			errorlog("EQ not setup");
			return;
		}
		if (!session.webAudios[webAudio].lowcut3) {
			errorlog("EQ not setup");
			return;
		}
		session.webAudios[webAudio].lowcut1.frequency.setValueAtTime(freq, session.webAudios[webAudio].audioContext.currentTime);
		session.webAudios[webAudio].lowcut2.frequency.setValueAtTime(freq, session.webAudios[webAudio].audioContext.currentTime);
		session.webAudios[webAudio].lowcut3.frequency.setValueAtTime(freq, session.webAudios[webAudio].audioContext.currentTime);
	}
}

function toggleMute(apply = false, event = false) {
	// TODO: I need to have this be MUTE, toggle, with volume not touched.

	var mouseUp = null;
	var touchEnd = null;
	var timeStart = Date.now();
	if (event) {
		mouseUp = document.onmouseup;
		touchEnd = document.ontouchend;
		document.onmouseup = function () {
			document.onmouseup = mouseUp;
			document.ontouchend = touchEnd;
			if (Date.now() - timeStart < 500) {
				return;
			} else {
				toggleMute();
			}
		};
		document.ontouchend = function () {
			document.onmouseup = mouseUp;
			document.ontouchend = touchEnd;
			if (Date.now() - timeStart < 300) {
				return;
			} else {
				toggleMute();
			}
		};
	}

	if (session.director) {
		if (!session.directorEnabledPPT) {
			log("Director doesn't have PPT enabled yet");
			// director has not enabled PTT yet.
			return;
		}
	}

	if (apply) {
		session.muted = !session.muted; // we flip here as we are going to flip again in a second.
	}
	//try{var ptt = getById("press2talk");} catch(e){var ptt=false;}

	if (session.muted == false) {
		session.muted = true;
		getById("mutetoggle").className = "las la-microphone-slash toggleSize";
		if (!session.cleanOutput) {
			getById("mutebutton").classList.add("red", "pulsate");
			getById("mutebutton").ariaPressed = "true";
			getById("header").classList.add("red");

			if (session.localMuteElement) {
				session.localMuteElement.style.display = "block";
			}
		}
		if (session.streamSrc) {
			session.streamSrc.getAudioTracks().forEach(track => {
				track.enabled = false;
			});
		}
		if (session.mobile && session.videoElement && session.videoElement.srcObject) {
			session.videoElement.srcObject.getAudioTracks().forEach(track => {
				track.enabled = false;
			});
		}
	} else {
		session.muted = false;
		getById("mutetoggle").className = "las la-microphone toggleSize";
		if (!session.cleanOutput) {
			getById("mutebutton").classList.remove("red", "pulsate");
			getById("mutebutton").ariaPressed = "false";
			getById("header").classList.remove("red");

			if (session.localMuteElement) {
				session.localMuteElement.style.display = "none";
			}
		}
		if (session.streamSrc) {
			session.streamSrc.getAudioTracks().forEach(track => {
				track.enabled = true;
			});
		}
		//if (session.mobile) {
			if (session.videoElement && session.videoElement.srcObject) {
				session.videoElement.srcObject.getAudioTracks().forEach(track => {
					track.enabled = true;
				});
			}
			
			if (!apply && event && (iOS || iPad || SafariVersion)){ // manually refreshing the mic
				refreshMicrophoneDevice(); // to address an issue with iOS/iPad devices losing audio when an inbound audio souce hits.
			}
		//}

		// toggleMute(false, event)

		//if (ptt){
		//	ptt.innerHTML = "<span data-translate='Push-to-Mute'>🔴 Push to Mute</span>";
		//}
	}

	try {
		postMessageIframe(document.getElementById("screensharesource"), { mic: !session.muted });
	} catch (e) {}

	if (!apply) {
		// only if they are changing states do we bother to spam.
		var data = {};
		data.muteState = session.muted;
		session.sendMessage(data);
		log("SEND MUTE STATE TO PEERS");
		pokeIframeAPI("mic-mute-state", session.muted);
		pokeAPI("muted", session.muted);
	}
}

function gotDevices(deviceInfos, miconly = false) {
	console.log("got devices!1");
	console.log(deviceInfos);
	
	deviceInfos.sort((a, b) => {
		// Put "default" devices first
		if (a.deviceId.toLowerCase() === "default") return -1;
		if (b.deviceId.toLowerCase() === "default") return 1;
		
		// Then sort by label if both exist
		if (a.label && b.label) {
			return a.label.localeCompare(b.label, undefined, {sensitivity: 'base'});
		}
		
		return 0;
	});
	
	try {
		if (Firefox && !FirefoxEnumerated) {
			if (session.streamSrc && session.streamSrc.getTracks().length) {
				FirefoxEnumerated = true;
			}
		}

		var option = document.createElement("input");
		option.type = "checkbox";
		option.value = "ZZZ";
		option.name = "multiselect1";
		option.id = "multiselect1";
		option.style.display = "none";
		option.checked = true;

		var label = document.createElement("label");
		label.for = option.name;
		label.innerHTML = '<span data-translate="no-audio"> No Audio</span>';

		var listele = document.createElement("li");
		listele.appendChild(option);
		listele.appendChild(label);

		const audioInputSelect = document.getElementById("audioSource") || document.getElementById("audioSource3");
		audioInputSelect.innerHTML = "";
		audioInputSelect.appendChild(listele);

		const audioOutputSelect = document.getElementById("outputSource") || document.getElementById("outputSource3");
		audioOutputSelect.innerHTML = "";

		option.onchange = function (event) {
			// make sure to clear 'no audio option' if anything else is selected
			if (!getById("multiselect1").checked) {
				getById("multiselect1").checked = true;
			} else {
				var list = audioInputSelect.querySelectorAll("li>input");
				for (var i = 0; i < list.length; i++) {
					if (list[i].id !== "multiselect1") {
						list[i].checked = false;
					}
				}
			}
			SelectedAudioInputDevices = [event.currentTarget.value];
			saveSettings();
		};

		const multiselectTrigger = document.getElementById("multiselect-trigger") || document.getElementById("multiselect-trigger3");
		multiselectTrigger.dataset.state = "0";
		multiselectTrigger.classList.add("closed");
		multiselectTrigger.classList.remove("open");
		getById("chevarrow1").classList.add("bottom");

		const videoSelect = document.getElementById("videoSourceSelect") || document.getElementById("videoSource3");
		const selectors = [videoSelect];

		const values = selectors.map(select => select.value);
		selectors.forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		function comp(a, b) {
			if (a.kind === "audioinput") {
				return 0;
			} else if (a.kind === "audiooutput") {
				return 0;
			}
			const labelA = a.label.toUpperCase();
			const labelB = b.label.toUpperCase();
			if (labelA > labelB) {
				return 1;
			} else if (labelA < labelB) {
				return -1;
			}
			return 0;
		}
		//deviceInfos.sort(comp); // I like this idea, but it messes with the defaults.  I just don't know what it will do.
		var deviceInfo;

		// This is to hide NDI from default device. NDI Tools fucks up.
		var tmp = [];
		for (let i = 0; i !== deviceInfos.length; ++i) {
			deviceInfo = deviceInfos[i];
			if (!(deviceInfo.kind === "videoinput" && (deviceInfo.label.toLowerCase().startsWith("ndi") || deviceInfo.label.toLowerCase().startsWith("newtek")))) {
				tmp.push(deviceInfo);
			}
		}

		for (let i = 0; i !== deviceInfos.length; ++i) {
			deviceInfo = deviceInfos[i];
			if (deviceInfo.kind === "videoinput" && (deviceInfo.label.toLowerCase().startsWith("ndi") || deviceInfo.label.toLowerCase().startsWith("newtek"))) {
				tmp.push(deviceInfo);
				log("V DEVICE FOUND = " + normalizeDeviceLabel(deviceInfo.label));
			}
		}
		deviceInfos = tmp;

		if (typeof session.audioDevice == "object") {
			// this sorts according to users's manual selection
			var matched1 = [];
			var matched2 = [];
			var notmatched = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				if (deviceInfos[i].kind === "audioinput") {
					if (session.audioDevice.includes(deviceInfos[i].deviceId)) {
						matched1.push(deviceInfos[i]);
					} else if (session.audioDevice.includes(normalizeDeviceLabel(deviceInfos[i].label))) {
						matched1.push(deviceInfos[i]);
					} else {
						for (var j = 0; j < session.audioDevice.length; j++) {
							if (normalizeDeviceLabel(deviceInfos[i].label).includes(session.audioDevice[j])) {
								matched2.push(deviceInfos[i]);
								log("A DEVICE FOUND = " + deviceInfos[i].label);
								break;
							}
						}
					}
				} else {
					notmatched.push(deviceInfos[i]);
				}
			}
			
			matched2.sort((a, b) => {
				if (a.label && b.label) {
					if (a.label.length < b.label.length){
						return -1
					}
					return a.label.localeCompare(b.label, undefined, {sensitivity: 'base'});
				}
				return 0;
			});
			
			var matched = matched1.concat(matched2);
			deviceInfos = matched.concat(notmatched);
		} else if (session.store && session.store.SelectedAudioInputDevices) {
			var matched = [];
			var notmatch = [];
			for (let i = 0; i < deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (session.store.SelectedAudioInputDevices.includes(deviceInfo.deviceId)) {
					matched.push(deviceInfo);
					log("EXACT A DEVICE FOUND -- from saved session");
				} else {
					notmatch.push(deviceInfo);
				}
			}
			deviceInfos = matched.concat(notmatch);
		}

		if (session.sink || SelectedAudioOutputDevices) {
			// this sorts according to users's manual selection
			var matched = [];
			var notmatch = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (deviceInfo.kind === "audiooutput" && deviceInfo.deviceId === session.sink) {
					matched.push(deviceInfo);
				} else if (!session.sink && deviceInfo.kind === "audiooutput" && deviceInfo.deviceId === SelectedAudioOutputDevices) {
					matched.push(deviceInfo);
				} else {
					notmatch.push(deviceInfo);
				}
			}
			deviceInfos = matched.concat(notmatch);
		}

		if (session.videoDevice && session.videoDevice !== 1) {
			// this sorts according to users's manual selection
			var tmp = [];
			var tmp2 = [];
			var tmp3 = [];

			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (deviceInfo.kind === "videoinput" && normalizeDeviceLabel(deviceInfo.label).startsWith(session.videoDevice)) {
					tmp.push(deviceInfo);
					log("Starts With V DEVICE FOUND");
				} else if (deviceInfo.deviceId === session.videoDevice) {
					tmp.push(deviceInfo);
					log("EXACT V DEVICE FOUND");
				} else if (deviceInfo.kind === "videoinput" && normalizeDeviceLabel(deviceInfo.label).includes(session.videoDevice)) {
					tmp2.push(deviceInfo);
					log("Includes With V DEVICE FOUND");
				} else {
					tmp3.push(deviceInfo);
				}
			}

			if (tmp2.length) {
				tmp = tmp.concat(tmp2);
			}
			if (tmp3.length) {
				tmp = tmp.concat(tmp3);
			}

			deviceInfos = tmp;
			log("VDECICE:" + session.videoDevice);
			log(deviceInfos);
		} else if (session.videoDevice === false && session.facingMode) {
			var tmp = [];
			if (session.facingMode == "environment") {
				for (let i = 0; i !== deviceInfos.length; ++i) {
					deviceInfo = deviceInfos[i];
					if (deviceInfo.kind === "videoinput" && normalizeDeviceLabel(deviceInfo.label).includes("back")) {
						tmp.push(deviceInfo);
						log("V DEVICE FOUND = " + normalizeDeviceLabel(deviceInfo.label));
					} else if (deviceInfo.kind === "videoinput" && normalizeDeviceLabel(deviceInfo.label).includes("rear")) {
						tmp.push(deviceInfo);
						log("V DEVICE FOUND = " + normalizeDeviceLabel(deviceInfo.label));
					}
				}
			} else if (session.facingMode == "user") {
				for (let i = 0; i !== deviceInfos.length; ++i) {
					deviceInfo = deviceInfos[i];
					if (deviceInfo.kind === "videoinput" && normalizeDeviceLabel(deviceInfo.label).includes("front")) {
						tmp.push(deviceInfo);
						log("V DEVICE FOUND = " + normalizeDeviceLabel(deviceInfo.label));
					}
				}
			}
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (!(deviceInfo.kind === "videoinput" && normalizeDeviceLabel(deviceInfo.label).includes(session.videoDevice))) {
					if (deviceInfo.deviceId !== session.videoDevice) {
						tmp.push(deviceInfo);
					}
				}
			}
			deviceInfos = tmp;
			log("VDECICE:" + session.videoDevice);
			log(deviceInfos);
		} else if (session.store && session.store.SelectedVideoInputDevices && session.videoDevice === false) {
			var matched = [];
			var notmatch = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (session.store.SelectedVideoInputDevices.includes(deviceInfo.deviceId)) {
					matched.push(deviceInfo);
					log("EXACT V DEVICE FOUND -- from saved session");
				} else {
					notmatch.push(deviceInfo);
				}
			}
			deviceInfos = matched.concat(notmatch);
			delete session.store.SelectedVideoInputDevices;
		}

		if (session.audioDevice && typeof session.audioDevice == "object") {
			var adMatch = [...session.audioDevice];
		} else if (session.store && session.store.SelectedAudioInputDevices && session.store.SelectedAudioInputDevices.length) {
			var adMatch = [...session.store.SelectedAudioInputDevices];
		} else {
			var adMatch = false;
		}

		if (session.store && session.store.SelectedAudioInputDevices) {
			delete session.store.SelectedAudioInputDevices;
		}

		var counter = 1;
		for (let i = 0; i !== deviceInfos.length; ++i) {
			var deviceInfo = deviceInfos[i];
			if (deviceInfo == null) {
				continue;
			}

			if (deviceInfo.kind === "audioinput") {
				option = document.createElement("input");
				option.type = "checkbox";
				counter++;
				listele = document.createElement("li");
				listele.style.display = "none";

				if (typeof adMatch == "object") {
					for (var j = 0; j < adMatch.length; j++) {
						if (!adMatch[j]) {
							// skip, already matched
						} else if (adMatch[j] == deviceInfo.deviceId) {
							option.checked = true;
							listele.style.display = "block";
							option.style.display = "none";
							getById("multiselect1").checked = false;
							try {
								getById("multiselect1").parentNode.style.display = "none";
							} catch (e) {}
							adMatch[j] = null;
							break;
						} else if (normalizeDeviceLabel(deviceInfo.label).includes(adMatch[j])) {
							option.checked = true;
							listele.style.display = "block";
							option.style.display = "none";
							getById("multiselect1").checked = false;
							try {
								getById("multiselect1").parentNode.style.display = "none";
							} catch (e) {}
							adMatch[j] = null;
							break;
						}
					}
				}

				if (typeof adMatch !== "object" && counter == 2) {
					option.checked = true;
					listele.style.display = "block";
					option.style.display = "none";
					getById("multiselect1").checked = false;
					try {
						getById("multiselect1").parentNode.style.display = "none";
					} catch (e) {}
				}

				option.value = deviceInfo.deviceId || "default";
				option.name = "multiselect" + counter;
				option.id = "multiselect" + counter;
				option.label = deviceInfo.label;

				label = document.createElement("label");
				label.for = option.name;

				label.innerHTML = " " + (deviceInfo.label || "microphone " + ((audioInputSelect.length || 0) + 1));

				listele.appendChild(option);
				listele.appendChild(label);
				audioInputSelect.appendChild(listele);

				option.onchange = function (event) {
					// make sure to clear 'no audio option' if anything else is selected
					getById("multiselect1").checked = false;
					log("UNCHECKED");
					if (!CtrlPressed) {
						SelectedAudioInputDevices = [];
						audioInputSelect.querySelectorAll("input[type='checkbox']").forEach(function (item) {
							if (event.currentTarget.id !== item.id) {
								item.checked = false;
							} else {
								item.checked = true;
								SelectedAudioInputDevices = [event.currentTarget.value];
							}
						});
					} else {
						if (event.currentTarget.checked) {
							if (!SelectedAudioInputDevices) {
								SelectedAudioInputDevices = [event.currentTarget.value];
							} else if (!SelectedAudioInputDevices.includes(event.currentTarget.value)) {
								SelectedAudioInputDevices.push(event.currentTarget.value);
							}
						} else if (event.currentTarget.value) {
							while (SelectedAudioInputDevices.includes(event.currentTarget.value)) {
								SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(event.currentTarget.value), 1);
							}
						}
					}
					if (session.mobile && !(iOS || iPad) && event.currentTarget.label === "USB audio" && !session.cleanOutput) {
						warnUser("Notice: USB audio devices may not work on all mobile devices.\n\nConsider using FireFox mobile instead, as it tends to work with USB audio devices more often.");
					}
					saveSettings();
				};

				if (deviceInfo.label.includes("Yeti ")) {
					if (!session.cleanOutput) {
						//getById("audioTipContext1").innerHTML = getTranslation("blue-yeti-tip");
						miniTranslate(getById("audioTipContext1"), "blue-yeti-tip");
						getById("audioTip1").classList.remove("hidden");
					}
				}
			} else if (deviceInfo.kind === "videoinput") {
				option = document.createElement("option");
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				videoSelect.appendChild(option);
			} else if (deviceInfo.kind === "audiooutput") {
				option = document.createElement("option");
				if (audioOutputSelect.length === 0) {
					option.dataset.default = true;
				} else {
					option.dataset.default = false;
				}
				option.value = deviceInfo.deviceId || "default";
				if (option.value == session.sink) {
					option.selected = "true";
				} else if (!session.sink && SelectedAudioOutputDevices && SelectedAudioOutputDevices == option.value) {
					option.selected = "true";
				}
				option.text = deviceInfo.label || `Speaker ${audioOutputSelect.length + 1}`;
				audioOutputSelect.appendChild(option);
			} else {
				log("Some other kind of source/device: ", deviceInfo);
			}
		}

		if (Firefox && !session.mobile) {
			var option = document.createElement("option");
			option.value = "others";
			option.text = getTranslation("show-more-options");
			audioOutputSelect.appendChild(option);
		}

		if (audioOutputSelect.childNodes.length == 0) {
			option = document.createElement("option");
			option.value = "default";
			option.text = getTranslation("system-default");
			audioOutputSelect.appendChild(option);
		}

		option = document.createElement("option");
		option.text = getTranslation("disable-video");
		option.value = "ZZZ";
		videoSelect.appendChild(option); // NO AUDIO OPTION

		if (miconly) {
			option.selected = "true";
		}

		selectors.forEach((select, selectorIndex) => {
			if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
				select.value = values[selectorIndex];
			}
		});
	} catch (e) {
		errorlog(e);
	}
}

function gotDevices2(deviceInfos) {
	gotDevices2AlreadyRan = true;
	log("got devices!2");
	log(deviceInfos);
	getById("multiselect-trigger3").dataset.state = "0";
	getById("multiselect-trigger3").classList.add("closed");
	getById("multiselect-trigger3").classList.remove("open");
	getById("chevarrow2").classList.add("bottom");

	if (!session.streamSrc) {
		checkBasicStreamsExist();
	}

	var knownTrack = false;

	try {
		const audioInputSelect = getById("audioSource3");
		const videoSelect = getById("videoSource3");
		const audioOutputSelect = getById("outputSource3");
		const selectors = [videoSelect];

		[audioInputSelect].forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		const values = selectors.map(select => select.value);
		selectors.forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		[audioOutputSelect].forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});

		var counter = 0;
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			if (deviceInfo == null) {
				continue;
			}

			if (deviceInfo.kind === "audioinput") {
				var option = document.createElement("input");
				option.type = "checkbox";
				counter++;
				var listele = document.createElement("li");
				listele.style.display = "none";

				session.streamSrc.getAudioTracks().forEach(function (track) {
					if (deviceInfo.label == track.label) {
						option.checked = true;
						listele.style.display = "inherit";
					}
				});

				option.style.display = "none";
				option.value = deviceInfo.deviceId || "default";
				option.name = "multiselecta" + counter;
				option.id = "multiselecta" + counter;
				option.dataset.label = deviceInfo.label || "microphone " + ((audioInputSelect.length || 0) + 1);

				var label = document.createElement("label");
				label.for = option.name;

				label.innerHTML = " " + (deviceInfo.label || "microphone " + ((audioInputSelect.length || 0) + 1));

				listele.appendChild(option);
				listele.appendChild(label);
				audioInputSelect.appendChild(listele);

				option.onchange = function (event) {
					// make sure to clear 'no audio option' if anything else is selected
					log("change 4768");
					if (!CtrlPressed) {
						document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function (item) {
							if (event.currentTarget.value !== item.value) {
								item.checked = false;
								if (item.dataset.type == "screen") {
									item.parentElement.parentElement.removeChild(item.parentElement);
								}
								while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
									SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
								}
							} else {
								item.checked = true;
								if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) == -1) {
									if (SelectedAudioInputDevices.length && SelectedAudioInputDevices.includes("ZZZ")) {
										SelectedAudioInputDevices = [];
									}
									SelectedAudioInputDevices.push(event.currentTarget.value);
								}
							}
						});
					} else {
						if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) == -1) {
							if (SelectedAudioInputDevices.length && SelectedAudioInputDevices.includes("ZZZ")) {
								SelectedAudioInputDevices = [];
							}
							SelectedAudioInputDevices.push(event.currentTarget.value);
						}

						getById("audioSourceNoAudio2").checked = false;
					}
					saveSettings();
				};
			} else if (deviceInfo.kind === "videoinput") {
				var option = document.createElement("option");
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				try {
					if (!knownTrack && session.canvasSource) {
						session.canvasSource.srcObject.getVideoTracks().forEach(function (track) {
							if (option.text == track.label) {
								option.selected = "true";
								knownTrack = true;
							}
						});
					}
					if (!knownTrack && session.streamSrc) {
						session.streamSrc.getVideoTracks().forEach(function (track) {
							if (option.text == track.label) {
								option.selected = "true";
								knownTrack = true;
							}
						});
					}
				} catch (e) {
					errorlog(e);
				}
				videoSelect.appendChild(option);
			} else if (deviceInfo.kind === "audiooutput") {
				var option = document.createElement("option");
				if (audioOutputSelect.length === 0) {
					option.dataset.default = true;
				} else {
					option.dataset.default = false;
				}
				option.value = deviceInfo.deviceId || "default";
				if (option.value == session.sink) {
					option.selected = "true";
				} else if (!session.sink && SelectedAudioOutputDevices && SelectedAudioOutputDevices == option.value) {
					option.selected = "true";
					session.sink = option.value; // added 8-dec-22, as the director's saved mic wasn't applying otherwise.
				}
				option.text = deviceInfo.label || `Speaker ${audioOutputSelect.length + 1}`;
				audioOutputSelect.appendChild(option);
			} else {
				log("Some other kind of source/device: ", deviceInfo);
			}
		}

		if (Firefox && !session.mobile) {
			var option = document.createElement("option");
			option.value = "others";
			option.text = getTranslation("show-more-options");
			audioOutputSelect.appendChild(option);
		}

		if (audioOutputSelect.childNodes.length == 0) {
			var option = document.createElement("option");
			option.value = "default";
			option.text = getTranslation("system-default");
			audioOutputSelect.appendChild(option);
		}

		if (videoSelect.childNodes.length <= 1) {
			getById("flipcamerabutton").style.display = "none"; // don't show the camera cycle button
			getById("flipcamerabutton").dataset.maxndex = videoSelect.childNodes.length;
		} else {
			getById("flipcamerabutton").style.display = "unset";
			getById("flipcamerabutton").dataset.maxIndex = videoSelect.childNodes.length;
		}

		////////////
		session.streamSrc.getAudioTracks().forEach(function (track) {
			// add active ScreenShare audio tracks to the list
			log("Checking for screenshare audio");
			var matched = false;
			for (var i = 0; i !== deviceInfos.length; ++i) {
				var deviceInfo = deviceInfos[i];
				if (deviceInfo == null) {
					continue;
				}
				log("---");
				if (track.label == deviceInfo.label) {
					matched = true;
					continue;
				}
			}
			if (matched == false) {
				// Not a gUM device
				var listele = document.createElement("li");
				listele.style.display = "block";
				var option = document.createElement("input");
				option.type = "checkbox";
				option.value = track.id;
				option.checked = true;
				option.style.display = "none";
				option.name = track.label;
				option.label = track.label;
				option.dataset.type = "screen";
				var label = document.createElement("label");
				label.for = option.name;
				label.innerHTML = " " + track.label;
				listele.appendChild(option);
				listele.appendChild(label);
				option.onchange = function (event) {
					// make sure to clear 'no audio option' if anything else is selected
					log("change 4873");
					var trackid = null;
					if (!CtrlPressed) {
						document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function (item) {
							if (event.currentTarget.value !== item.value) {
								// this shoulnd't happen, but if it does.
								item.checked = false;
								if (item.dataset.type == "screen") {
									item.parentElement.parentElement.removeChild(item.parentElement);
								}
							} else {
								event.currentTarget.checked = true;
								trackid = item.value;
							}
						});
					} else {
						//getById("audioSourceNoAudio2").checked=false;
						if (event.currentTarget.dataset.type == "screen") {
							event.currentTarget.parentElement.parentElement.removeChild(event.currentTarget.parentElement);
						}
					}
					activatedPreview = false;
					grabAudio("#audioSource3", trackid); // exclude item.id.
					event.stopPropagation();
					return false;
				};
				audioInputSelect.appendChild(listele);
			}
		});

		/////////// no video option
		var optionss = false;
		if (screensharesupport) {
			optionss = document.createElement("option");
			optionss.text = "Screen Share (replace camera)";
			optionss.value = "XXX";
			videoSelect.appendChild(optionss); // NO AUDIO OPTION
		}

		var option = document.createElement("option"); // no video
		option.text = getTranslation("disable-video");
		option.value = "ZZZ";
		videoSelect.appendChild(option);

		if (session.streamSrc.getVideoTracks().length == 0) {
			option.selected = "true";
		} else if (knownTrack == false) {
			var option = document.createElement("option"); // no video
			option.text = session.streamSrc.getVideoTracks()[0].label;
			option.value = "YYY";
			videoSelect.appendChild(option);
			option.selected = "true";
		}

		if (optionss) {
			optionss.lastSelected = videoSelect.selectedIndex;
		}

		videoSelect.onchange = function (event) {
			try {
				if (event.target.options[event.target.options.selectedIndex].value === "XXX") {
					videoSelect.selectedIndex = event.target.options[event.target.options.selectedIndex].lastSelected;
					if (session.screenShareState == false) {
						toggleScreenShare();
					} else {
						toggleScreenShare(true);
					}
					return;
				}
			} catch (e) {}
			activatedPreview = false;
			grabVideo(session.quality, "videosource", "select#videoSource3");

			if (!getById("audioSource3").querySelectorAll("input[data-type='screen']").length) {
				if (session.screenShareState) {
					session.screenShareState = false;
					pokeIframeAPI("screen-share-state", session.screenShareState, null, session.streamID);
					notifyOfScreenShare();
					//session.refreshScale();
				}
				getById("screensharebutton").classList.remove("green");
				getById("screensharebutton").ariaPressed = "false";
			}
		};

		/////////////  /// NO AUDIO appended option

		var option = document.createElement("input");
		option.type = "checkbox";
		option.value = "ZZZ";
		option.style.display = "none";
		option.id = "audioSourceNoAudio2";

		var label = document.createElement("label");
		label.for = option.name;
		label.innerHTML = " No Audio";
		var listele = document.createElement("li");

		if (session.streamSrc.getAudioTracks().length == 0) {
			option.checked = true;
		} else {
			listele.style.display = "none";
			option.checked = false;
		}
		option.onchange = function (event) {
			// make sure to clear 'no audio option' if anything else is selected
			log("change 4938");
			if (!CtrlPressed) {
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function (item) {
					if (event.currentTarget.value !== item.value) {
						item.checked = false;
						if (item.dataset.type == "screen") {
							item.parentElement.parentElement.removeChild(item.parentElement);
						}

						while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
							SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
						}
					} else {
						item.checked = true;
						if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) == -1) {
							if (SelectedAudioInputDevices.length && SelectedAudioInputDevices.includes("ZZZ")) {
								SelectedAudioInputDevices = [];
							}
							SelectedAudioInputDevices.push(event.currentTarget.value);
						}
					}
				});
			} else {
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function (item) {
					if (event.currentTarget.value === item.value) {
						event.currentTarget.checked = true;
						if (SelectedAudioInputDevices.indexOf(event.currentTarget.value) == -1) {
							if (SelectedAudioInputDevices.length && SelectedAudioInputDevices.includes("ZZZ")) {
								SelectedAudioInputDevices = [];
							}
							SelectedAudioInputDevices.push(event.currentTarget.value);
						}
					} else {
						item.checked = false;
						if (item.dataset.type == "screen") {
							item.parentElement.parentElement.removeChild(item.parentElement);
						}
						while (SelectedAudioInputDevices.indexOf(item.value) > -1) {
							SelectedAudioInputDevices.splice(SelectedAudioInputDevices.indexOf(item.value), 1);
						}
					}
				});
			}
			saveSettings();
		};
		listele.appendChild(option);
		listele.appendChild(label);
		audioInputSelect.appendChild(listele);

		////////////

		//selectors.forEach((select, selectorIndex) => {
		//	if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
		//		select.value = values[selectorIndex];
		//	}
		//});

		audioInputSelect.onchange = function () {
			log("Audio OPTION HAS CHANGED? 2");
			activatedPreview = false;
			setTimeout(function () {
				grabAudio("#audioSource3");
			}, 10);
		};

		getById("refreshVideoButton").onclick = function () {
			refreshVideoDevice();
		};

		if (Firefox && !session.mobile && navigator.mediaDevices) {
			audioOutputSelect.onclick = function () {
				log("audioOutputSelect.onclick = function() {");
				if (audioOutputSelect.options[audioOutputSelect.selectedIndex].value === "others") {
					log("Trying to increase the output device list");
					navigator.mediaDevices.selectAudioOutput().then(device => {
						if (device.kind == "audiooutput") {
							session.sink = device.deviceId;

							try {
								var matched = false;
								audioOutputSelect.childNodes.forEach(ele => {
									if (ele.value === device.deviceId) {
										matched = true;
										ele.selected = true;
									}
								});
								if (!matched) {
									var option = document.createElement("option");
									option.value = device.deviceId;
									option.text = device.label;
									audioOutputSelect.appendChild(option);
									option.selected = true;
								}

								saveSettings(); // we're saving because there was an explicit action to change devices
							} catch (e) {
								errorlog(e);
							}

							if (!session.sink) {
								return;
							} // Not sure this would ever happen, but whatever.

							resetupAudioOut(); // we'll probalby use session.sink, since outputSelect3 doesn't exist.
						}
					});
				}
			};
		} else if (!navigator.mediaDevices){
			console.warn("No navigator.mediaDevices found - try a different browser or check your settings.");
		}

		audioOutputSelect.onchange = function () {
			log("audioOutputSelect.onchange = function() {");

			if (iOS || iPad) {
				return;
			}

			if (Firefox && !session.mobile) {
				if (audioOutputSelect.options[audioOutputSelect.selectedIndex].value === "others") {
					// we handle this elsewhere
					return;
				}
			}

			try {
				session.sink = audioOutputSelect.options[audioOutputSelect.selectedIndex].value;
				saveSettings();
			} catch (e) {
				errorlog(e);
			}
			if (!session.sink) {
				return;
			}

			resetupAudioOut();

			log("done audioOutputSelect.onchange = function() {");
		};
	} catch (e) {
		errorlog(e);
	}
}

async function grabAudio(selector = "#audioSource", trackid = null, override = false, callbackUUID = false, callback = false) {
	// trackid is the excluded track , callback is UUID

	if (activatedPreview == true) {
		log("activated preview return 2");
		return;
	}
	activatedPreview = true;
	log("TRACK EXCLUDED:" + trackid);

	try {
		var baseTest = document.querySelector(selector);
		if (!baseTest) {
			errorlog("No audio source menu");
			return;
		}
		if (baseTest && baseTest.tagName == "UL") {
			var audioSelect = baseTest.querySelectorAll("input");
			var audioExcludeList = [];
			for (var i = 0; i < audioSelect.length; i++) {
				try {
					if ("screen" == audioSelect[i].dataset.type) {
						// skip already excluded ---------- !!!!!!  DOES THIS MAKE SENSE? TODO: CHECK
						if (audioSelect[i].checked) {
							audioExcludeList.push(audioSelect[i]);
						}
					}
				} catch (e) {
					errorlog(e);
				}
			}
		} else if (baseTest && baseTest.tagName == "SELECT") {
			var audioExcludeList = [];
			var audioSelect = baseTest.options;
			for (var i = 0; i < audioSelect.length; i++) {
				try {
					if ("screen" == audioSelect[i].dataset.type) {
						// skip already excluded ---------- !!!!!!  DOES THIS MAKE SENSE? TODO: CHECK
						if (audioSelect[i].selected) {
							audioExcludeList.push(audioSelect[i]);
						}
					}
				} catch (e) {
					errorlog(e);
				}
			}
		}
	} catch (e) {
		errorlog(e);
	}

	try {
		if (session.videoElement && session.videoElement.srcObject) {
			session.videoElement.srcObject.getAudioTracks().forEach(function (track) {
				// TODO: Confirm that I even need this?
				for (var i = 0; i < audioExcludeList.length; i++) {
					try {
						if (audioExcludeList[i].label == track.label) {
							warnlog("DONE");
							return;
						}
					} catch (e) {
						errorlog(e);
					}
				}
				if (trackid && track.id == trackid) {
					warnlog("SKIPPED EXCLUDED TRACK?");
					return;
				}
				session.videoElement.srcObject.removeTrack(track);
				track.stop(); // remove then stop.
			});
		} else {
			// if no stream exists
			checkBasicStreamsExist();
		}
	} catch (e) {
		errorlog(e);
	}

	try {
		if (session.streamSrc) {
			session.streamSrc.getAudioTracks().forEach(function (track) {
				for (var i = 0; i < audioExcludeList.length; i++) {
					try {
						if (audioExcludeList[i].label == track.label) {
							warnlog("EXCLUDING TRACK; PROBABLY SCREEN SHARE");
							return;
						}
					} catch (e) {
						errorlog(e);
					}
				}
				if (trackid && track.id == trackid) {
					warnlog("SKIPPED EXCLUDED TRACK?");
					return;
				}
				session.streamSrc.removeTrack(track);
				track.stop();
			});
		} else {
			// if no stream exists
			checkBasicStreamsExist();
		}
	} catch (e) {
		errorlog(e);
	}

	try {
		if (session.streamSrcClone) {
			session.streamSrcClone.getAudioTracks().forEach(function (track) {
				for (var i = 0; i < audioExcludeList.length; i++) {
					try {
						if (audioExcludeList[i].label == track.label) {
							warnlog("EXCLUDING TRACK; PROBABLY SCREEN SHARE");
							return;
						}
					} catch (e) {
						errorlog(e);
					}
				}
				if (trackid && track.id == trackid) {
					warnlog("SKIPPED EXCLUDED TRACK?");
					return;
				}
				session.streamSrcClone.removeTrack(track);
				track.stop();
			});
		}
	} catch (e) {
		errorlog(e);
	}

	var streams = await getAudioOnly(selector, trackid, override); // Get audio streams

	try {
		log("STREAMS: " + streams.length);

		for (var i = 0; i < streams.length; i++) {
			streams[i].getAudioTracks().forEach(function (track) {
				try {
					session.streamSrc.addTrack(track); // add video track to the preview video

					track.onended = function () {
						errorlog("Track ended unexpectedly");
						if (!session.cleanOutput) {
							toggleSettings(true); // forceshow
						}
					};
					log("ok?");
					// applySavedAudioSettings(track); ## this doesn't work as echo-cancellation(+) needs to be applied via getuserMedia only.
				} catch (e) {
					errorlog(e);
				}
			});
		}
	} catch (e) {
		errorlog(e);
	}

	if (Firefox && !FirefoxEnumerated) {
		if (session.streamSrc && session.streamSrc.getTracks().length) {
			FirefoxEnumerated = true;
			enumerateDevices().then(gotDevices);
		}
	}

	if (callback) {
		callback();
	}

	senderAudioUpdate(callbackUUID); 
}


function getTranslation(key) {
	// when using this, instead of miniTranslate, if the user changes the language, it might not update. Used mainly when you don't want any HTML (<span data-translate>) being including in the translation
	if (translation.innerHTML && key in translation.innerHTML) {
		// these are the proper translations
		return translation.innerHTML[key];
	} else if (key in miscTranslations) {
		// i guess these can be transitioned to innerHTML
		return miscTranslations[key];
	} else {
		warnlog("misc translation not found");
		return key.replaceAll("-", " "); //
	}
}

function saveSettings() {
	if (session.store) {
		try {
			var tmp = {};
			if (SelectedAudioInputDevices) {
				tmp.SelectedAudioInputDevices = SelectedAudioInputDevices.filter(n => n);
			}
			if (session.sink && session.sink != "default") {
				tmp.SelectedAudioOutputDevices = session.sink;
			} else if (!session.sink && SelectedAudioOutputDevices && SelectedAudioOutputDevices != "default") {
				tmp.SelectedAudioOutputDevices = SelectedAudioOutputDevices;
			}
			tmp.SelectedVideoInputDevices = SelectedVideoInputDevices;
			setStorage("session_store", JSON.stringify(tmp));
			log("Saving settings");
		} catch (e) {
			errorlog(e);
		}
	}
}


async function getAudioOnly(selector, trackid = null, override = false) {
	var audioSelect = document.querySelector(selector).querySelectorAll("input,option");
	var audioList = [];
	var streams = [];
	log("getAudioOnly()");
	for (var i = 0; i < audioSelect.length; i++) {
		if (audioSelect[i].value == "ZZZ") {
			continue;
		} else if (trackid == audioSelect[i].value) {
			// skip already excluded
			continue;
		} else if ("screen" == audioSelect[i].dataset.type) {
			// skip already excluded ---------- !!!!!!  DOES THIS MAKE SENSE? TODO: CHECK
			continue;
		} else if (audioSelect[i].checked) {
			log(audioSelect[i]);
			audioList.push(audioSelect[i]);
		} else if (audioSelect[i].selected) {
			log(audioSelect[i]);
			audioList.push(audioSelect[i]);
		}
	}

	for (var i = 0; i < audioList.length; i++) {
		if (session.echoCancellation !== false && session.autoGainControl !== false && session.noiseSuppression !== false && (session.voiceIsolation !== true)) {
			var constraint = {
				audio: {
					deviceId: {
						exact: audioList[i].value
					}
				}
			};
		} else {
			// Just trying to avoid problems with some systems that don't support these features
			var constraint = {
				audio: {
					deviceId: {
						exact: audioList[i].value
					}
				}
			};
			if (session.echoCancellation === false) {
				constraint.audio.echoCancellation = false;
			} else {
				constraint.audio.echoCancellation = true;
			}
			if (session.autoGainControl === false) {
				constraint.audio.autoGainControl = false;
			} else {
				constraint.audio.autoGainControl = true;
			}
			if (session.noiseSuppression === false) {
				constraint.audio.noiseSuppression = false;
			} else {
				constraint.audio.noiseSuppression = true;
			}
			if (session.voiceIsolation === true){
				constraint.audio.voiceIsolation = true;
			}
		}
		constraint.video = false;
		if (override !== false) {
			log("Override true");
			if (override.audio && override.audio.deviceId) {
				if (audioList[i].value == override.audio.deviceId) {
					constraint = override;
				} else {
					// not the device we want to hack.
				}
			} else {
				constraint = override;
			}
		}

		if (audioList[i].value && SelectedAudioInputDevices) {
			if (SelectedAudioInputDevices.indexOf(audioList[i].value) === -1) {
				if (SelectedAudioInputDevices.length && SelectedAudioInputDevices.includes("ZZZ")) {
					SelectedAudioInputDevices = [];
				}
				SelectedAudioInputDevices.push(audioList[i].value);
			}
		}

		if (session.audioInputChannels) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.channelCount = session.audioInputChannels;
			} else if (constraint.audio) {
				constraint.audio.channelCount = session.audioInputChannels;
			}
		}

		if (session.micSampleRate) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.sampleRate = parseInt(session.micSampleRate);
			} else if (constraint.audio) {
				constraint.audio.sampleRate = parseInt(session.micSampleRate);
			}
		}

		if (session.micSampleSize) {
			if (constraint.audio === true) {
				constraint.audio = {};
				constraint.audio.sampleSize = parseInt(session.micSampleSize);
			} else if (constraint.audio) {
				constraint.audio.sampleSize = parseInt(session.micSampleSize);
			}
		}

		log("CONSTRAINT");
		log(constraint);
		
		if (Firefox){
			constraint = toFirefoxConstraint(constraint);
		}
		
		warnlog("navigator.mediaDevices.getUserMedia starting...");
		if (navigator.mediaDevices){
			var stream = await navigator.mediaDevices
				.getUserMedia(constraint)
				.then(function (stream2) {
					log("get audio sucecss");
					pokeIframeAPI("local-microphone-event");
					return stream2;
				})
				.catch(function (err) {
					warnlog(err);
					if (!session.cleanOutput) {
						if (override !== false) {
							if (err.name) {
								if (err.constraint) {
									warnUser(err["name"] + ": " + err["constraint"]);
								}
							}
						}
					}
					return false;
				}); // More error reporting maybe?
			if (stream) {
				streams.push(stream);
			}
		} else {
			console.warn("navigator.mediaDevices was not found; try a different browser or check your settings");
		}
	}

	return streams;
}