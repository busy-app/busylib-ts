import Long = require("long");
/** Namespace BSB_State. */
export namespace BSB_State {

    /** Properties of a StateUpdate. */
    interface StateUpdate {

        /** StateUpdate deviceName */
        deviceName?: (BSB_State.DeviceName|null);

        /** StateUpdate power */
        power?: (BSB_State.Power|null);

        /** StateUpdate brightness */
        brightness?: (BSB_State.Brightness|null);

        /** StateUpdate audioVolume */
        audioVolume?: (BSB_State.AudioVolume|null);

        /** StateUpdate wifi */
        wifi?: (BSB_State.Wifi|null);

        /** StateUpdate updateState */
        updateState?: (BSB_Update.UpdateState|null);

        /** StateUpdate updateCheck */
        updateCheck?: (BSB_Update.CheckState|null);

        /** StateUpdate timezone */
        timezone?: (BSB_State.Timezone|null);

        /** StateUpdate matter */
        matter?: (BSB_State.Matter|null);

        /** StateUpdate frame */
        frame?: (BSB_Frame.Frame|null);

        /** StateUpdate input */
        input?: (BSB_Input.InputEvent|null);

        /** StateUpdate timer */
        timer?: (BSB_Timer.Timer|null);

        /** StateUpdate ble */
        ble?: (BSB_State.Ble.Ble|null);

        /** StateUpdate autoUpdateState */
        autoUpdateState?: (BSB_Update.AutoUpdateState|null);
    }


    /** Properties of a State. */
    interface State {

        /** State timestamp */
        timestamp?: (number|Long|null);

        /** State updates */
        updates?: (BSB_State.StateUpdate[]|null);

        /** State error */
        error?: (BSB_Error.Error|null);
    }


    /** Properties of a DeviceName. */
    interface DeviceName {

        /** DeviceName name */
        name?: (string|null);
    }


    /** Properties of a BrightnessAutomatic. */
    interface BrightnessAutomatic {
    }


    /** Properties of a BrightnessManual. */
    interface BrightnessManual {

        /** BrightnessManual brightness */
        brightness?: (number|null);
    }


    /** Properties of a Brightness. */
    interface Brightness {

        /** Brightness automatic */
        automatic?: (BSB_State.BrightnessAutomatic|null);

        /** Brightness manual */
        manual?: (BSB_State.BrightnessManual|null);

        /** Brightness actualBrightness */
        actualBrightness?: (number|null);
    }


    /** BatteryStatus enum. */
    enum BatteryStatus {
        DISCHARGING = 0,
        CHARGING = 1,
        CHARGED = 2
    }

    /** Properties of an UnknownPowerState. */
    interface UnknownPowerState {
    }


    /** Properties of a PowerState. */
    interface PowerState {

        /** PowerState batteryStatus */
        batteryStatus?: (BSB_State.BatteryStatus|null);

        /** PowerState batteryChargePercent */
        batteryChargePercent?: (number|null);

        /** PowerState batteryVoltageMv */
        batteryVoltageMv?: (number|null);

        /** PowerState batteryCurrentMa */
        batteryCurrentMa?: (number|null);

        /** PowerState usbVoltageMv */
        usbVoltageMv?: (number|null);
    }


    /** Properties of a Power. */
    interface Power {

        /** Power unknown */
        unknown?: (BSB_State.UnknownPowerState|null);

        /** Power known */
        known?: (BSB_State.PowerState|null);
    }


    /** Properties of an AudioVolume. */
    interface AudioVolume {

        /** AudioVolume volume */
        volume?: (number|null);
    }


    /** WifiConnectionStatus enum. */
    enum WifiConnectionStatus {
        CONNECTED = 0,
        CONNECTING = 1,
        DISCONNECTING = 2,
        RECONNECTING = 3
    }

    /** WifiSecurity enum. */
    enum WifiSecurity {
        UNKNOWN = 0,
        OPEN = 1,
        WPA = 2,
        WPA2 = 3,
        WEP = 4,
        WPA_WPA2 = 5,
        WPA3 = 6,
        WPA2_WPA3 = 7
    }

    /** IpConfigurationMethod enum. */
    enum IpConfigurationMethod {
        DHCP = 0,
        STATIC = 1
    }

    /** IpProtocol enum. */
    enum IpProtocol {
        IPV4 = 0,
        IPV6 = 1
    }

    /** Properties of a WifiStateUnknown. */
    interface WifiStateUnknown {
    }


    /** Properties of a WifiStateDisconnected. */
    interface WifiStateDisconnected {
    }


    /** Properties of a WifiStateConnected. */
    interface WifiStateConnected {

        /** WifiStateConnected status */
        status?: (BSB_State.WifiConnectionStatus|null);

        /** WifiStateConnected ssid */
        ssid?: (string|null);

        /** WifiStateConnected bssid */
        bssid?: (string|null);

        /** WifiStateConnected channel */
        channel?: (number|null);

        /** WifiStateConnected rssi */
        rssi?: (number|null);

        /** WifiStateConnected security */
        security?: (BSB_State.WifiSecurity|null);
    }


    /** Properties of an IpAddress. */
    interface IpAddress {

        /** IpAddress protocol */
        protocol?: (BSB_State.IpProtocol|null);

        /** IpAddress method */
        method?: (BSB_State.IpConfigurationMethod|null);

        /** IpAddress address */
        address?: (string|null);

        /** IpAddress gateway */
        gateway?: (string|null);

        /** IpAddress netmask */
        netmask?: (string|null);
    }


    /** Properties of a Wifi. */
    interface Wifi {

        /** Wifi unknown */
        unknown?: (BSB_State.WifiStateUnknown|null);

        /** Wifi disconnected */
        disconnected?: (BSB_State.WifiStateDisconnected|null);

        /** Wifi connected */
        connected?: (BSB_State.WifiStateConnected|null);

        /** Wifi ipAddresses */
        ipAddresses?: (BSB_State.IpAddress[]|null);
    }


    /** Properties of a Timezone. */
    interface Timezone {

        /** Timezone name */
        name?: (string|null);

        /** Timezone offset */
        offset?: (number|null);

        /** Timezone abbr */
        abbr?: (string|null);
    }


    /** MatterCommissioningStatus enum. */
    enum MatterCommissioningStatus {
        NEVER_STARTED = 0,
        STARTED = 1,
        COMPLETED_SUCCESSFULLY = 2,
        FAILED = 3
    }

    /** Properties of a MatterCommissioningState. */
    interface MatterCommissioningState {

        /** MatterCommissioningState status */
        status?: (BSB_State.MatterCommissioningStatus|null);

        /** MatterCommissioningState timestamp */
        timestamp?: (number|Long|null);
    }


    /** Properties of a Matter. */
    interface Matter {

        /** Matter fabricCount */
        fabricCount?: (number|null);

        /** Matter state */
        state?: (BSB_State.MatterCommissioningState|null);
    }


    /** Namespace Ble. */
    namespace Ble {

        /** ServiceStatus enum. */
        enum ServiceStatus {
            RESET = 0,
            INITIALIZATION = 1,
            READY = 2,
            ADVERTISING = 3,
            CONNECTABLE = 4,
            CONNECTED = 5,
            ERROR = 6
        }

        /** Properties of a Ble. */
        interface Ble {

            /** Ble status */
            status?: (BSB_State.Ble.ServiceStatus|null);

            /** Ble remoteAddress */
            remoteAddress?: (string|null);
        }

    }
}

/** Namespace BSB_Update. */
export namespace BSB_Update {

    /** UpdateEvent enum. */
    enum UpdateEvent {
        SESSION_START = 0,
        SESSION_STOP = 1,
        ACTION_BEGIN = 2,
        ACTION_DONE = 3,
        DETAIL_CHANGE = 4,
        ACTION_PROGRESS = 5,
        EVENT_NONE = 6
    }

    /** UpdateAction enum. */
    enum UpdateAction {
        DOWNLOAD = 0,
        SHA_VERIFICATION = 1,
        UNPACK = 2,
        INSTALLATION_PREPARE = 3,
        INSTALLATION_APPLY = 4,
        ACTION_NONE = 5
    }

    /** UpdateStatus enum. */
    enum UpdateStatus {
        OK = 0,
        BATTERY_LOW = 1,
        BUSY = 2,
        DOWNLOAD_FAILURE = 3,
        DOWNLOAD_ABORT = 4,
        SHA_MISMATCH = 5,
        UNPACK_CREATE_STAGING_DIRECTORY_FAILURE = 6,
        UNPACK_ARCHIVE_OPEN_FAILURE = 7,
        UNPACK_ARCHIVE_UNPACK_FAILURE = 8,
        INSTALLATION_PREPARE_MANIFEST_NOT_FOUND = 9,
        INSTALLATION_PREPARE_MANIFEST_INVALID = 10,
        INSTALLATION_PREPARE_SESSION_CONFIG_SETUP_FAILURE = 11,
        INSTALLATION_PREPARE_POINTER_SETUP_FAILURE = 12,
        UNKNOWN_FAILURE = 13
    }

    /** CheckError enum. */
    enum CheckError {
        NOT_AVAILABLE = 0,
        FAILURE = 1,
        IDLE = 2
    }

    /** Properties of an UpdateAvailable. */
    interface UpdateAvailable {

        /** UpdateAvailable version */
        version?: (string|null);
    }


    /** Properties of an UpdateUnavailable. */
    interface UpdateUnavailable {

        /** UpdateUnavailable reason */
        reason?: (BSB_Update.CheckError|null);
    }


    /** Properties of an UpdateState. */
    interface UpdateState {

        /** UpdateState event */
        event?: (BSB_Update.UpdateEvent|null);

        /** UpdateState action */
        action?: (BSB_Update.UpdateAction|null);

        /** UpdateState status */
        status?: (BSB_Update.UpdateStatus|null);
    }


    /** Properties of a CheckState. */
    interface CheckState {

        /** CheckState available */
        available?: (BSB_Update.UpdateAvailable|null);

        /** CheckState unavailable */
        unavailable?: (BSB_Update.UpdateUnavailable|null);
    }


    /** Properties of an AutoUpdateInterval. */
    interface AutoUpdateInterval {

        /** AutoUpdateInterval start */
        start?: (number|null);

        /** AutoUpdateInterval end */
        end?: (number|null);
    }


    /** Properties of an AutoUpdateState. */
    interface AutoUpdateState {

        /** AutoUpdateState enabled */
        enabled?: (boolean|null);

        /** AutoUpdateState interval */
        interval?: (BSB_Update.AutoUpdateInterval|null);
    }

}

/** Namespace BSB_Frame. */
export namespace BSB_Frame {

    /** Encoding enum. */
    enum Encoding {
        PLAIN = 0,
        RUN_LENGTH = 1,
        DEFLATE = 2,
        DEFLATE_RUN_LENGTH = 3
    }

    /** PixelFormat enum. */
    enum PixelFormat {
        RGB888 = 0,
        L8 = 1,
        L4 = 2
    }

    /** Screen enum. */
    enum Screen {
        FRONT = 0,
        BACK = 1
    }

    /** Properties of a Frame. */
    interface Frame {

        /** Frame screen */
        screen?: (BSB_Frame.Screen|null);

        /** Frame width */
        width?: (number|null);

        /** Frame height */
        height?: (number|null);

        /** Frame encoding */
        encoding?: (BSB_Frame.Encoding|null);

        /** Frame pixelFormat */
        pixelFormat?: (BSB_Frame.PixelFormat|null);

        /** Frame data */
        data?: (Uint8Array|null);
    }

}

/** Namespace BSB_Timer. */
export namespace BSB_Timer {

    /** Properties of a Timer. */
    interface Timer {

        /** Timer json */
        json?: (BSB_Util.Json|null);
    }

}

/** Namespace BSB_Util. */
export namespace BSB_Util {

    /** Compression enum. */
    enum Compression {
        PLAIN = 0,
        GZIP = 1
    }

    /** Properties of a Json. */
    interface Json {

        /** Json compression */
        compression?: (BSB_Util.Compression|null);

        /** Json data */
        data?: (Uint8Array|null);
    }

}

/** Namespace BSB_Input. */
export namespace BSB_Input {

    /** Button enum. */
    enum Button {
        OK = 0,
        BACK = 1,
        START = 2
    }

    /** ButtonAction enum. */
    enum ButtonAction {
        PRESS = 0,
        RELEASE = 1
    }

    /** SwitchPosition enum. */
    enum SwitchPosition {
        BUSY = 0,
        CUSTOM = 1,
        OFF = 2,
        APPS = 3,
        SETTINGS = 4
    }

    /** Properties of a ButtonEvent. */
    interface ButtonEvent {

        /** ButtonEvent button */
        button?: (BSB_Input.Button|null);

        /** ButtonEvent action */
        action?: (BSB_Input.ButtonAction|null);
    }


    /** Properties of a SwitchEvent. */
    interface SwitchEvent {

        /** SwitchEvent position */
        position?: (BSB_Input.SwitchPosition|null);
    }


    /** Properties of an EncoderEvent. */
    interface EncoderEvent {

        /** EncoderEvent delta */
        delta?: (number|null);
    }


    /** Properties of an InputEvent. */
    interface InputEvent {

        /** InputEvent buttonEvent */
        buttonEvent?: (BSB_Input.ButtonEvent|null);

        /** InputEvent switchEvent */
        switchEvent?: (BSB_Input.SwitchEvent|null);

        /** InputEvent encoderEvent */
        encoderEvent?: (BSB_Input.EncoderEvent|null);
    }

}

/** Namespace BSB_Error. */
export namespace BSB_Error {

    /** Cause enum. */
    enum Cause {
        RESOURCE_LIMIT = 0
    }

    /** Severity enum. */
    enum Severity {
        FATAL = 0,
        ERROR = 1,
        WARNING = 2
    }

    /** Properties of an Error. */
    interface Error {

        /** Error cause */
        cause?: (BSB_Error.Cause|null);

        /** Error severity */
        severity?: (BSB_Error.Severity|null);
    }

}
