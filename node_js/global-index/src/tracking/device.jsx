/**
 *
 * Get user platform info
 *
 **/

// Get device size
let deviceSize = null;
const sizeQueries = [
    ["compact", window.matchMedia("(max-width: 600px)")],
    ["medium", window.matchMedia("(min-width: 601px) and (max-width: 839px)")],
    ["expanded", window.matchMedia("(min-width: 840px) and (max-width: 1199px)")],
    ["large", window.matchMedia("(min-width: 1200px) and (max-width: 1599px)")],
    ["extra-large", window.matchMedia("(min-width: 1600px)")]
];
export function detectDeviceSize(soft = false) {
    // Return value (if it's already defined)
    if(deviceSize != null && soft){
        return deviceSize;
    }

    // Check screen size
    let size = null;
    for(let i = 0; i < sizeQueries.length; i++){
        if(sizeQueries[i][1].matches){
            size = sizeQueries[i][0];
        }
    }
    if(size == null){
        size = "unknown";
    }

    // Return value
    deviceSize = size;
    return deviceSize;
}

// Get system
// Source: https://stackoverflow.com/a/18706818/14467698
// Returns {name, version, full}
let deviceSystem = null;
export async function detectDeviceSystem(){
    // Return value (if it's already defined)
    if(deviceSystem != null){
        return deviceSystem;
    }

    // Get OS name!
    var os = 'unknown';
    var clientStrings = [
        {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 3.11', r:/Win16/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Chrome OS', r:/CrOS/},
        {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(navigator.userAgent)) {
            os = cs.s;
            break;
        }
    }

    // Get OS version
    var osVersion = '';
    if (/Windows/.test(os)) {
        // Check Windows version
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
        // Fix Windows 11 detection bug
        if(osVersion == "10"){
            try{
                // This code is not supported on all browsers!
                // source: https://learn.microsoft.com/en-us/microsoft-edge/web-platform/how-to-detect-win11#sample-code-for-detecting-windows-11
                let ua = await navigator.userAgentData.getHighEntropyValues(["platformVersion"]);
                if (ua.platform === "Windows") {
                    const majorPlatformVersion = parseInt(ua.platformVersion.split('. ')[0]);
                    if (majorPlatformVersion >= 13) {
                        // Windows 11 or later
                        osVersion = "11";
                    }
                }
            }catch{
                osVersion = '';
            }
        }
    }else{
        // Check version for all other OSs
        switch (os) {
            case 'Mac OS':
            case 'Mac OS X':
            case 'Android':
                osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(navigator.userAgent)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }
    }

    // Return name and version!
    deviceSystem =  {
        name: os,
        version: (osVersion.replaceAll(/\s/g, "") != "") ? osVersion : null,
        full: null
    };
    deviceSystem.full = deviceSystem.name + ((deviceSystem.version != null) ? (" " + deviceSystem.version) : "");
    return deviceSystem;
}