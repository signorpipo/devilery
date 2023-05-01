import { AudioSetup, Globals } from "../../pp";

export class AudioLoader {
    load() {
        let manager = Globals.getAudioManager();

        {
            let audioSetup = new AudioSetup("assets/audio/music/pp/playground_ambient.mp3");
            audioSetup.myLoop = true;
            audioSetup.mySpatial = false;
            audioSetup.myVolume = 2;
            manager.addAudioSetup("playground_ambient", audioSetup);
        }
    }
}