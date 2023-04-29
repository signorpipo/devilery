import { Howler } from "howler";

export function isAudioPlaybackBlocked() {
    let blocked = false;

    if (Howler != null && Howler.state != "running") {
        blocked = true;
    }

    return blocked;
}

export let AudioUtils = {
    isAudioPlaybackBlocked
};